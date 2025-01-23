"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

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
      text: "School Network Status",
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

export default function NetworkStatusChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Network Uptime (%)",
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 2,
      },
    ],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard-data")
        const data = await response.json()
        setChartData({
          labels: data.networkStatus.map((item) => item.school),
          datasets: [
            {
              ...chartData.datasets[0],
              data: data.networkStatus.map((item) => item.uptime),
            },
          ],
        })
      } catch (error) {
        console.error("Error fetching network status data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg shadow-lg"
    >
      <Bar options={options} data={chartData} />
    </motion.div>
  )
}

