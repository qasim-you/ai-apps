"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      labels: {
        font: {
          size: 14,
          weight: "bold",
        },
      },
    },
    title: {
      display: true,
      text: "Learning Progress Over Time",
      font: {
        size: 20,
        weight: "bold",
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        font: {
          size: 12,
        },
        callback: (value) => value + "%",
      },
    },
    x: {
      ticks: {
        font: {
          size: 12,
        },
      },
    },
  },
}

export default function LearningProgressChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Average Student Progress",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
        fill: true,
        tension: 0.4,
      },
    ],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard-data")
        const data = await response.json()
        setChartData({
          labels: data.learningProgress.map((item) => item.week),
          datasets: [
            {
              ...chartData.datasets[0],
              data: data.learningProgress.map((item) => item.progress),
            },
          ],
        })
      } catch (error) {
        console.error("Error fetching learning progress data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gradient-to-br from-green-50 to-teal-100 p-6 rounded-lg shadow-lg"
    >
      <Line options={options} data={chartData} />
    </motion.div>
  )
}

