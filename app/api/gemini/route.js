// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// export async function POST(req) {
//   const { query } = await req.json();

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//     const result = await model.generateContent(query);
//     const response = await result.response;
//     let text = response.text();

//     // Remove Markdown symbols like ** and *
//     text = text.replace(/\*\*/g, "").replace(/\*/g, "");

//     return new Response(JSON.stringify({ response: text }), {
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return new Response(JSON.stringify({ error: "An error occurred while processing your request." }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Custom response formatter for network insights
function formatNetworkResponse(text) {
  // Extract critical information using regex
  const severityMatch = text.match(/\[SEVERITY: (\w+)\]/i);
  const predictionsMatch = text.match(/Predictions: (.*?)(?=\n|$)/);
  const recommendationsMatch = text.match(/Recommendations: (.*?)(?=\n|$)/);

  return {
    summary: text.split("\n")[0].replace(/\*\*/g, "🌟 "),
    severity: severityMatch ? severityMatch[1] : "medium",
    predictions: predictionsMatch
      ? predictionsMatch[1].split(", ").map((p) => `📉 ${p}`)
      : ["No predictions available"],
    recommendations: recommendationsMatch
      ? recommendationsMatch[1].split(", ").map((r) => `✅ ${r}`)
      : ["No recommendations available"],
    visualData: {
      riskScore: Math.floor(Math.random() * 100), // Mock metric for demo
      priorityLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
      timeline: generateMockTimeline(),
    },
    rawText: text.replace(/\*\*/g, "").replace(/\*/g, ""),
    timestamp: new Date().toISOString(),
  };
}

function generateMockTimeline() {
  return Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    risk: Math.floor(Math.random() * 100),
    bandwidth: 80 + Math.floor(Math.random() * 20),
  }));
}

export async function POST(req) {
  const { query, historicalData } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Act as a Network Health AI Analyst. Analyze this network query: "${query}"
      Historical data: ${JSON.stringify(historicalData || {})}
      Respond in this format:
      [SEVERITY: LOW/MEDIUM/HIGH]
      **Summary**: One-line emoji-rich summary
      **Predictions**: 3 comma-separated future predictions
      **Recommendations**: 3 comma-separated action items
      **Technical Analysis**: 2-3 sentence expert analysis`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    const structuredResponse = formatNetworkResponse(text);

    // Add UI-friendly properties
    structuredResponse.colorCodes = {
      low: "#2ecc71",
      medium: "#f1c40f",
      high: "#e74c3c",
    };

    structuredResponse.emoji = {
      low: "🟢",
      medium: "🟡",
      high: "🔴",
    }[structuredResponse.severity.toLowerCase()];

    return new Response(JSON.stringify(structuredResponse), {
      headers: {
        "Content-Type": "application/json",
        "X-AI-Engine": "NetworkPulsePro v2.0",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "🚨 Critical System Error",
        message: "Our AI engines are overheating! Try again later.",
        debug:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
