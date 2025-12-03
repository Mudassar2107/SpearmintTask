require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// New Gemini client (new SDK)
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// System prompt sent to Gemini
function buildSystemPrompt() {
  return `
    You are a product recommendation engine.

    You will receive:
    • A list of products
    • A user preference text

    Your task:
    • Pick 1 - 5 products that match the user's needs
    • Consider factors like category, price, and product description

    Important:
    • Only return valid JSON
    • Format must be exactly:
      { "recommendedIds": [1, 2, 3] }
  `;
}

// Main AI recommendation endpoint
app.post("/api/recommend", async (req, res) => {
  const { preferences, products } = req.body;

  if (!preferences || !products) {
    return res.status(400).json({
      error: "Both 'preferences' and 'products' are required.",
    });
  }

  try {
    const prompt = `
${buildSystemPrompt()}

User preferences:
${preferences}

Products:
${JSON.stringify(products, null, 2)}
`;

    // Ask Gemini for recommendations using the new SDK + model
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = (result && result.text) ? result.text.trim() : "";

    let recommendedIds = [];

    // Clean up markdown code blocks if present
    if (text.startsWith("```")) {
      text = text.replace(/^```(json)?\s*/, "").replace(/\s*```$/, "");
    }

    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed.recommendedIds)) {
        recommendedIds = parsed.recommendedIds;
      }
    } catch (err) {
      console.error("Gemini returned non-JSON output:", err);
    }

    const recommendations = products.filter((p) =>
      recommendedIds.map(String).includes(String(p.id))
    );

    return res.json({ recommendations });
  } catch (error) {
    console.error("Gemini API error:", error.message);
    console.log("Using fallback keyword matching...");

    // Backup logic if Gemini fails
    const preferenceWords = preferences
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2);

    const fallback = products
      .filter((product) => {
        const combinedText = (
          product.name +
          " " +
          product.description +
          " " +
          product.category
        ).toLowerCase();

        return preferenceWords.some((word) => combinedText.includes(word));
      })
      .slice(0, 3);

    return res.json({ recommendations: fallback });
  }
});

// Simple route to confirm server status
app.get("/", (req, res) => {
  res.send("AI Recommendation API (Gemini) is running");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
