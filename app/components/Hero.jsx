"use client"; // Ensures this component is only rendered on the client side

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }} 
      className="text-center py-20"
    >
      <h1 className="text-4xl font-bold mb-4 text-gray-800">AI-Powered Education Network</h1>
      <p className="text-xl mb-8 text-gray-800">
        Connecting underserved schools to the power of AI and the internet
      </p>
    </motion.div>
  );
}