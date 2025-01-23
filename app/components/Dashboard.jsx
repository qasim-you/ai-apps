'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import NetworkStatusChart from './NetworkStatusChart'
import LearningProgressChart from './LearningProgressChart'
import AIAssistant from './AIAssistant'

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="container mx-auto px-4 py-12"
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800">Education Network Dashboard</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <NetworkStatusChart />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <LearningProgressChart />
          </motion.div>
        </div>
      )}
      <AIAssistant />
    </motion.section>
  )
}
