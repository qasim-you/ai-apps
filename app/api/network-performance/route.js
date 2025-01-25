import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env. NEXT_PUBLIC_GEMINI_API_KEY|| "")

function simulateNetworkPerformance() {
  return [
    Math.random() * 100, // Bandwidth (Mbps)
    Math.random() * 200, // Latency (ms)
    Math.random() * 5, // Packet Loss (%)
  ]
}

export async function GET() {
  const performanceData = simulateNetworkPerformance()

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const prompt = `
      Analyze the following network performance data:
      Bandwidth: ${performanceData[0].toFixed(2)} Mbps
      Latency: ${performanceData[1].toFixed(2)} ms
      Packet Loss: ${performanceData[2].toFixed(2)}%

      Provide a brief assessment of the network quality and any potential issues or recommendations.
      Consider the following in your analysis:
      - Is the bandwidth sufficient for most online activities?
      - Is the latency acceptable for real-time applications?
      - Is the packet loss within an acceptable range?
      
      Keep the response concise, within 2-3 sentences.
    `

    const result = await model.generateContent(prompt)
    const analysis = result.response.text()

    return NextResponse.json({
      performanceData,
      analysis,
    })
  } catch (error) {
    console.error("Error generating network analysis:", error)
    return NextResponse.json({ error: "Failed to analyze network performance" }, { status: 500 })
  }
}
