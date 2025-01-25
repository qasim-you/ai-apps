import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY);

export async function getPrediction(metrics) {
  if (!API_KEY || API_KEY === "your_gemini_api_key_here") {
    return "Please set your Gemini API key in the .env file to enable AI predictions.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const recentMetrics = metrics.slice(-5);
    const prompt = `Analyze this network performance data and predict the next 5 minutes:
      Current metrics:
      ${JSON.stringify(recentMetrics, null, 2)}
      
      Based on this data:
      1. Predict bandwidth, latency, and packet loss for the next 5 minutes
      2. Identify any concerning trends
      3. Suggest actions if performance is degrading
      
      Format your response as:
      Predictions:
      - Bandwidth: X Mbps
      - Latency: X ms
      - Packet Loss: X%
      
      Analysis:
      [Your analysis here]
      
      Recommendations:
      [Your recommendations here]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Prediction error:", error);
    return "Unable to generate prediction. Please check your API key and try again.";
  }
}
