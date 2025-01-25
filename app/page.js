// import Dashboard from "./components/Dashboard";
// import Hero from "./components/Hero";
// export default function Home() {
//   return (
//     <main className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-indigo-100">
//       <Hero />
//       <Dashboard />

//     </main>
//   )
// }
"use client";

import React, { useState, useEffect } from "react";
import { MetricsChart } from "./components/MetricsChart";
import { PacketLossChart } from "./components/PacketLossChart";
import { AlertsList } from "./components/AlertsList";
import { PredictionPanel } from "./components/PredictionPanel";
import { Settings } from "./components/Settings";
import { mockAlerts } from "./lib/mockData";
import { measureNetworkSpeed } from "./lib/networkSpeed";
import { sendNotification } from "./lib/notifications";
import {
  Activity,
  Wifi,
  Clock,
  AlertTriangle,
  Settings as SettingsIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { auth, db, googleProvider, signInWithPopup } from "./lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const PERFORMANCE_THRESHOLDS = {
  bandwidth: 5,
  latency: 100,
  packetLoss: 2,
};

export default function Home() {
  const [metrics, setMetrics] = useState([]);
  const [prediction, setPrediction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [updateInterval, setUpdateInterval] = useState(5000);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [downtime, setDowntime] = useState(0);
  const [user] = useAuthState(auth);

  // Track downtime
  useEffect(() => {
    let downtimeInterval;
    if (metrics.length > 0) {
      const latestMetric = metrics[metrics.length - 1];
      if (
        latestMetric.bandwidth < PERFORMANCE_THRESHOLDS.bandwidth ||
        latestMetric.latency > PERFORMANCE_THRESHOLDS.latency ||
        latestMetric.packetLoss > PERFORMANCE_THRESHOLDS.packetLoss
      ) {
        downtimeInterval = setInterval(() => {
          setDowntime((prev) => prev + 1);
        }, 1000);
      } else {
        setDowntime(0);
      }
    }
    return () => clearInterval(downtimeInterval);
  }, [metrics]);

  // Save metrics to Firebase
  const saveMetricsToFirebase = async (metrics) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { metrics }, { merge: true });
    }
  };

  // Fetch metrics from Firebase
  const fetchMetricsFromFirebase = async () => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setMetrics(docSnap.data().metrics || []);
      }
    }
  };

  useEffect(() => {
    fetchMetricsFromFirebase();
  }, [user]);

  const checkPerformanceIssues = async (metric) => {
    let message = null;

    if (metric.bandwidth < PERFORMANCE_THRESHOLDS.bandwidth) {
      message = `Low bandwidth detected: ${metric.bandwidth.toFixed(2)} Mbps`;
    } else if (metric.latency > PERFORMANCE_THRESHOLDS.latency) {
      message = `High latency detected: ${metric.latency.toFixed(2)} ms`;
    } else if (metric.packetLoss > PERFORMANCE_THRESHOLDS.packetLoss) {
      message = `High packet loss detected: ${metric.packetLoss.toFixed(2)}%`;
    }

    if (message && user) {
      await sendNotification(user.email, message, metric);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const newMetrics = await measureNetworkSpeed();

        const updatedMetrics = [...metrics, newMetrics];
        if (updatedMetrics.length > 24) {
          updatedMetrics.shift();
        }
        setMetrics(updatedMetrics);
        saveMetricsToFirebase(updatedMetrics);

        checkPerformanceIssues(newMetrics);

        if (user) {
          setIsLoading(true);
          try {
            const newPrediction = await getPrediction(updatedMetrics);
            setPrediction(newPrediction);
          } catch (error) {
            console.error("Failed to get prediction:", error);
            setPrediction("Unable to generate prediction at this time.");
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching network metrics:", error);
        setError("Failed to measure network metrics. Retrying...");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval, metrics, user]);

  const handleUpdateIntervalChange = (newInterval) => {
    setUpdateInterval(newInterval);
  };

  const latestMetric = metrics[metrics.length - 1] || {
    bandwidth: 0,
    latency: 0,
    packetLoss: 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-800">
                Network Monitor
              </span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <button
                  onClick={() => auth.signOut()}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => signInWithPopup(auth, googleProvider)}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-all"
                >
                  Continue with Google
                </button>
              )}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100 transition-all"
              >
                <SettingsIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md"
          >
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Downtime Alert */}
        {downtime > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md"
          >
            <p className="text-yellow-700">
              Network Downtime: {downtime} seconds
            </p>
          </motion.div>
        )}

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: <Wifi className="h-6 w-6 text-indigo-600" />,
              title: "Bandwidth",
              value: `${latestMetric.bandwidth.toFixed(2)} Mbps`,
            },
            {
              icon: <Clock className="h-6 w-6 text-indigo-600" />,
              title: "Latency",
              value: `${latestMetric.latency.toFixed(2)} ms`,
            },
            {
              icon: <AlertTriangle className="h-6 w-6 text-indigo-600" />,
              title: "Packet Loss",
              value: `${latestMetric.packetLoss.toFixed(2)}%`,
            },
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center">
                {metric.icon}
                <h3 className="ml-2 text-lg font-medium text-gray-800">
                  {metric.title}
                </h3>
              </div>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {metric.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-lg font-medium mb-4 text-gray-800">
              Bandwidth Trends
            </h3>
            <MetricsChart data={metrics} metric="bandwidth" color="#4f46e5" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-lg font-medium mb-4 text-gray-800">
              Latency Trends
            </h3>
            <MetricsChart data={metrics} metric="latency" color="#059669" />
          </motion.div>
        </div>

        {/* Packet Loss and AI Prediction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-lg font-medium mb-4 text-gray-800">
              Packet Loss Trends
            </h3>
            <PacketLossChart data={metrics} />
          </motion.div>

          {user && (
            <PredictionPanel prediction={prediction} loading={isLoading} />
          )}
        </div>

        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <h3 className="text-lg font-medium mb-4 text-gray-800">
            Recent Alerts
          </h3>
          <AlertsList alerts={mockAlerts} />
        </motion.div>
      </main>

      {/* Settings Modal */}
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        updateInterval={updateInterval}
        onUpdateIntervalChange={handleUpdateIntervalChange}
      />
    </div>
  );
}
