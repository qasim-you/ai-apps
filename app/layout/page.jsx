'use client'; // Mark this as a Client Component

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Home() {
  const [networkData, setNetworkData] = useState(null);
  const [insights, setInsights] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch network data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/network-data');
        setNetworkData(response.data);
      } catch (error) {
        console.error('Error fetching network data:', error);
      }
    };
    fetchData();
  }, []);

  // Fetch AI insights using Gemini API
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.post('/api/insights', {
          bandwidth: networkData?.bandwidth,
          latency: networkData?.latency,
          downtime: networkData?.downtime,
        });
        setInsights(response.data.insights);
      } catch (error) {
        console.error('Error fetching insights:', error);
        setInsights('Failed to load insights.');
      }
    };
    if (networkData) fetchInsights();
  }, [networkData]);

  // Simulate alerts
  useEffect(() => {
    if (networkData?.downtime > 5) {
      setAlerts([`High downtime detected: ${networkData.downtime}%`]);
    }
  }, [networkData]);

  // Chart data
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Bandwidth Usage (%)',
        data: Array(7).fill(networkData?.bandwidth || 0),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
      {
        label: 'Latency (ms)',
        data: Array(7).fill(networkData?.latency || 0),
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false,
      },
      {
        label: 'Downtime (%)',
        data: Array(7).fill(networkData?.downtime || 0),
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: false,
      },
    ],
  };

  // Framer Motion animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Toggle dark/light theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
  };

  // Set theme on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            School Network Dashboard
          </motion.h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            variants={fadeInUp}
          >
            <h2 className="text-xl font-semibold mb-4">Network Performance</h2>
            <Line data={chartData} />
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            variants={fadeInUp}
          >
            <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
            <motion.div
              className="text-gray-700 dark:text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {insights || 'Loading insights...'}
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
          variants={fadeInUp}
        >
          <h2 className="text-xl font-semibold mb-4">Alerts</h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <motion.div
                  key={index}
                  className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 p-2 rounded-md mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.2 }}
                >
                  {alert}
                </motion.div>
              ))
            ) : (
              <div className="text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 p-2 rounded-md">
                No issues detected.
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}