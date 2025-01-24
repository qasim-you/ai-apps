"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { FaUser, FaRobot, FaComment } from "react-icons/fa"

export default function AITutor() {
  const [question, setQuestion] = useState("")
  const [conversation, setConversation] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const chatContainerRef = useRef(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [conversation, isTyping])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    setConversation((prev) => [...prev, { role: "user", content: question }])
    setQuestion("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      })
      const data = await response.json()
      setConversation((prev) => [...prev, { role: "ai", content: data.response }])
    } catch (error) {
      console.error("Error:", error)
      setConversation((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, I encountered an error. Please try again." },
      ])
    }

    setIsTyping(false)
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <FaComment className="text-2xl mr-2" />
          <h1 className="text-xl font-bold">AI Tutor Chatbot</h1>
        </div>
      </header>

      <main className="flex-grow overflow-hidden">
        <div
          ref={chatContainerRef}
          className="h-full overflow-y-auto p-4 space-y-4"
        >
          {conversation.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <FaRobot className="text-8xl text-indigo-500 mb-4" />
              <h2 className="text-2xl font-bold text-indigo-700">Chat with Bot</h2>
            </div>
          ) : (
            conversation.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      msg.role === "user" ? "bg-indigo-500" : "bg-green-500"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <FaUser className="text-white" />
                    ) : (
                      <FaRobot className="text-white" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))
          )}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-start"
            >
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500">
                  <FaRobot className="text-white" />
                </div>
                <div className="p-3 rounded-lg bg-gray-200 text-gray-500">AI is typing...</div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="container mx-auto flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your AI tutor a question..."
            className="flex-grow p-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-950"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  )
}
