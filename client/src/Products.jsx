import React, { useState } from "react";

const PRODUCTS = [
  {
    id: 1,
    name: "Budget Phone X1",
    category: "Phone",
    price: 299,
    image: "/images/Budget Phone X1.jpg",
    description: "Entry-level smartphone with decent camera and battery life.",
  },
  {
    id: 2,
    name: "Pro Phone Z5",
    category: "Phone",
    price: 799,
    image: "/images/Pro Phone Z5.jpg",
    description: "Flagship smartphone with OLED display and excellent performance.",
  },
  {
    id: 3,
    name: "Smartwatch Lite",
    category: "Watch",
    price: 149,
    image: "/images/Smartwatch Lite.jpg",
    description: "Lightweight smartwatch with fitness tracking features.",
  },
  {
    id: 4,
    name: "Gaming Laptop G15",
    category: "Laptop",
    price: 1200,
    image: "/images/Gaming Laptop G15.jpg",
    description: "High-performance laptop suitable for gaming and heavy workloads.",
  },
  {
    id: 5,
    name: "Everyday Laptop E3",
    category: "Laptop",
    price: 550,
    image: "/images/Everyday Laptop E3.jpg",
    description: "Affordable laptop for students and office work.",
  },
  {
    id: 6,
    name: "Wireless Earbuds",
    category: "Audio",
    price: 89,
    image: "/images/Wireless Earbuds.jpg",
    description: "Noise-cancelling wireless earbuds with long battery life.",
  },
];

const Products = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [preference, setPreference] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState(null);

  const categories = ["All", ...new Set(PRODUCTS.map((p) => p.category))];

  const displayedProducts = recommendedProducts
    ? recommendedProducts
    : activeCategory === "All"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  const handleAskAI = async () => {
    if (!preference.trim()) return;

    setLoading(true);
    setRecommendedProducts(null);

    try {
      const response = await fetch("https://spearminttask.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferences: preference,
          products: PRODUCTS,
        }),
      });

      const data = await response.json();

      if (data.recommendations) {
        setRecommendedProducts(data.recommendations);
        setActiveCategory("All");
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      alert(
        "Failed to get recommendations. Make sure the server is running and your API key is set."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setRecommendedProducts(null);
    setPreference("");
    setActiveCategory("All");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Our Latest Products
        </h2>
        <p className="mt-4 text-xl text-gray-500">
          Check out our newest gadgets and accessories.
        </p>
      </div>

      {/* AI Assistant */}
      <div className="max-w-2xl mx-auto mb-16 bg-indigo-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
          AI Product Assistant
        </h3>

        <div className="flex gap-3">
          <input
            type="text"
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            placeholder="e.g., I want a phone under $500 for gaming"
            className="flex-1 rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3 px-4"
            onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
          />
          <button
            onClick={handleAskAI}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Thinking...
              </>
            ) : (
              "Ask AI"
            )}
          </button>
        </div>

        {recommendedProducts && (
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-green-700 font-medium">
                Found {recommendedProducts.length} recommended products based on
                your request.
              </span>
              <button
                onClick={handleClear}
                className="text-gray-500 hover:text-gray-700 underline"
              >
                Clear &amp; Show All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Category filters – hide when AI results are shown */}
      {!recommendedProducts && (
        <div className="flex justify-center space-x-4 mb-10 overflow-x-auto py-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeCategory === category
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col"
            >
              <div className="h-48 overflow-hidden bg-gray-200 relative group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-700">
                  {product.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {product.name}
                  </h3>
                  <span className="text-indigo-600 font-bold">
                    ${product.price}
                  </span>
                </div>

                <p className="text-gray-500 text-sm mb-4 flex-1">
                  {product.description}
                </p>

                <button className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-600 transition-colors duration-200 flex items-center justify-center gap-2">
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No products found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
