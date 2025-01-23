"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function AiAssistant() {
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      setResponse(data.response)
    } catch (error) {
      console.error("Error:", error)
      setResponse("An error occurred while processing your request.")
    }
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-12 bg-indigo-100 p-6 rounded-lg shadow-lg"
    >
      <h3 className="text-2xl font-bold mb-4 text-indigo-800">AI Learning Assistant</h3>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about your studies..."
          className="w-full p-3 border border-indigo-300 rounded-md text-indigo-900 placeholder-indigo-400 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition duration-300 font-semibold"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask Learning Assistant"}
        </motion.button>
      </form>
      {response && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-4 rounded-md border border-indigo-200"
        >
          <h4 className="font-bold mb-2 text-indigo-800">AI Response:</h4>
          <p className="text-indigo-900">{response}</p>
        </motion.div>
      )}
    </motion.div>
  )
}

