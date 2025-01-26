"use client"; // Ensures this component is only rendered on the client side

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center py-20"
    >
      <h1 className="text-4xl font-bold mb-4 text-gray-800">
        AI-Powered EduNet Optmizer
      </h1>
      <p className="text-xl mb-8 text-gray-800">
        Connecting underserved schools to the power of AI and the internet
      </p>
      <Link href="/chatbot">
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md">
          AI Tutor
        </button>
      </Link>
      <Link href="/network">
        <button className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-md mx-5 hover:bg-indigo-600 hover:text-white transition-colors duration-300">
          {" "}
          Network Dashboard
        </button>
      </Link>
    </motion.div>
  );
}
