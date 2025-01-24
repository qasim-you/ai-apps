import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)

export async function POST(req) {
  const { question } = await req.json()

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(`As an AI tutor, please answer the following question: ${question}`)
    const response = await result.response
    let text = response.text();
    text = text.replace(/\*\*/g, "").replace(/\*/g, "");


    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 })
  }
}

