"use client"

import { useState, useEffect } from "react"
import { Line, Pie, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { WifiIcon, ClockIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import { motion } from "framer-motion"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

const createChartOptions = (title) => ({
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: title,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
})

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right" ,
      labels: {
        boxWidth: 10,
        font: {
          size: 10,
        },
      },
    },
    title: {
      display: true,
      text: "Current Network Metrics",
      font: {
        size: 14,
      },
    },
  },
}

export default function NetworkDashboard() {
  const [networkData, setNetworkData] = useState({
    labels: [],
    bandwidth: [],
    latency: [],
    packetLoss: [],
  })

  const [analysis, setAnalysis] = useState("")
  const [interval, setInterval] = useState(5000)
  const [loading, setLoading] = useState(true) // Add loading state

  useEffect(() => {
    const fetchNetworkData = async () => {
      setLoading(true) // Show loading when fetching data
      try {
        const response = await fetch("/api/network-performance")
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = await response.json()
        setNetworkData((prevData) => ({
          labels: [...prevData.labels, new Date().toLocaleTimeString()],
          bandwidth: [...prevData.bandwidth, data.performanceData[0]],
          latency: [...prevData.latency, data.performanceData[1]],
          packetLoss: [...prevData.packetLoss, data.performanceData[2]],
        }))
        setAnalysis(data.analysis)
      } catch (error) {
        console.error("Error fetching network data:", error)
      } finally {
        setLoading(false) // Hide loading after fetching data
      }
    }

    // Call the function immediately on mount or interval change
    fetchNetworkData()

    // Set up the interval
    const intervalId = setInterval(fetchNetworkData, interval)

    // Cleanup function to clear the interval
    return () => clearInterval(intervalId)
  }, []) // Add interval as a dependency

  const getLatestMetrics = () => ({
    bandwidth: networkData.bandwidth[networkData.bandwidth.length - 1] || 0,
    latency: networkData.latency[networkData.latency.length - 1] || 0,
    packetLoss: networkData.packetLoss[networkData.packetLoss.length - 1] || 0,
  })

  const { bandwidth, latency, packetLoss } = getLatestMetrics()

  const bandwidthChartData = {
    labels: networkData.labels,
    datasets: [
      {
        label: "Bandwidth (Mbps)",
        data: networkData.bandwidth,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  }

  const latencyChartData = {
    labels: networkData.labels,
    datasets: [
      {
        label: "Latency (ms)",
        data: networkData.latency,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  }

  const packetLossChartData = {
    labels: networkData.labels,
    datasets: [
      {
        label: "Packet Loss (%)",
        data: networkData.packetLoss,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  }

  const pieChartData = {
    labels: ["Bandwidth", "Latency", "Packet Loss"],
    datasets: [
      {
        data: [bandwidth, latency, packetLoss],
        backgroundColor: ["rgba(255, 99, 132, 0.7)", "rgba(53, 162, 235, 0.7)", "rgba(75, 192, 192, 0.7)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(53, 162, 235, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  }

  const barChartData = {
    labels: networkData.labels,
    datasets: [
      {
        label: "Bandwidth (Mbps)",
        data: networkData.bandwidth,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Latency (ms)",
        data: networkData.latency,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderColor: "rgba(53, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Packet Loss (%)",
        data: networkData.packetLoss,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  }

  const packetLossBarChartData = {
    labels: networkData.labels.slice(-10), // Show only the last 10 data points
    datasets: [
      {
        label: "Packet Loss (%)",
        data: networkData.packetLoss.slice(-10),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-indigo-800">Network Performance Dashboard</h2>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="bg-indigo-100 p-4 rounded-lg flex items-center justify-between"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div>
                <p className="text-sm text-indigo-600">Bandwidth</p>
                <p className="text-2xl font-bold text-indigo-800">{bandwidth.toFixed(2)} Mbps</p>
              </div>
              <WifiIcon className="h-8 w-8 text-indigo-500" />
            </motion.div>
            <motion.div
              className="bg-blue-100 p-4 rounded-lg flex items-center justify-between"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div>
                <p className="text-sm text-blue-600">Latency</p>
                <p className="text-2xl font-bold text-blue-800">{latency.toFixed(2)} ms</p>
              </div>
              <ClockIcon className="h-8 w-8 text-blue-500" />
            </motion.div>
            <motion.div
              className="bg-green-100 p-4 rounded-lg flex items-center justify-between"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div>
                <p className="text-sm text-green-600">Packet Loss</p>
                <p className="text-2xl font-bold text-green-800">{packetLoss.toFixed(2)}%</p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-green-500" />
            </motion.div>
            <motion.div
              className="bg-purple-100 p-4 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <p className="text-sm text-indigo-900">Update Interval</p>
              <select
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-indigo-900 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value={1000}>1 second</option>
                <option value={5000}>5 seconds</option>
                <option value={10000}>10 seconds</option>
              </select>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Line options={createChartOptions("Bandwidth Over Time")} data={bandwidthChartData} />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Line options={createChartOptions("Latency Over Time")} data={latencyChartData} />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Line options={createChartOptions("Packet Loss Over Time")} data={packetLossChartData} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="w-full max-w-[200px] h-[200px] mx-auto">
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Bar data={barChartData} options={createChartOptions("Network Metrics Comparison")} />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Bar data={packetLossBarChartData} options={createChartOptions("Packet Loss Distribution")} />
            </div>
          </div>

          <motion.div
            className="bg-gray-50 p-4 rounded-lg mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
            <p className="text-gray-700">{analysis}</p>
          </motion.div>
        </>
      )}
    </div>
  )
}

