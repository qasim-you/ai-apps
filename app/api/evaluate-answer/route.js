import {  NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req) {
  const { question, answer, difficulty } = await req.json()

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const prompt = `
      Question: "${question}"
      Student's Answer: "${answer}"
      Difficulty Level: ${difficulty}/10

      Please evaluate the student's answer based on the following criteria:
      1. Relevance to the question
      2. Depth of understanding
      3. Critical thinking
      4. Clarity of expression

      Provide a brief feedback comment (2-3 sentences) and a score between 0 and 1, where 0 is completely incorrect and 1 is a perfect answer.

      Format your response as a JSON object with 'comment' and 'score' fields.
    `

    const result = await model.generateContent(prompt)
    const evaluation = JSON.parse(result.response.text())

    return NextResponse.json({
      feedback: {
        comment: evaluation.comment,
        score: evaluation.score,
      },
    })
  } catch (error) {
    console.error("Error evaluating answer:", error)
    return NextResponse.json({ error: "Failed to evaluate answer" }, { status: 500 })
  }
}

