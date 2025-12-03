# Spearmint Technologies - AI Product Recommendation Engine

A full-stack web application that uses **Google Gemini AI** to provide intelligent product recommendations based on user preferences.

## 🚀 Features

- **AI-Powered Recommendations**: Uses Google's `gemini-2.5-flash` model to analyze user preferences and select the best matching products.
- **Smart Fallback**: Includes a keyword-based matching system that works even if the AI service is unavailable.
- **Modern Frontend**: Built with **React**, **Vite**, and **TailwindCSS** for a fast and responsive UI.
- **Robust Backend**: **Express.js** server handling API requests and AI integration.

## 🛠️ Tech Stack

### Client
- **React** (v19)
- **Vite** (Fast build tool)
- **TailwindCSS** (v4 - Styling)

### Server
- **Node.js** & **Express.js**
- **Google Gemini API** (`@google/genai`)
- **Cors** & **Dotenv**

## 📂 Project Structure

```bash
Spearmint Technologies/
├── client/     # React frontend
└── server/     # Express backend
