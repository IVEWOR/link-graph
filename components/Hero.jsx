/*
================================================================================
  FILE: components/Hero.jsx
  PURPOSE: The fully redesigned, premium hero section.
  NOTE: This component uses `framer-motion`. Install with `npm install framer-motion`
================================================================================
*/
// components/Hero.jsx
"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

const Hero = () => {
  const scrollToQuiz = () => {
    document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center py-24 px-4 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 h-full w-full bg-white dark:bg-[#0B0B0F] bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:36px_36px]"></div>

      {/* Gradient Glow Effect */}
      <div
        className="absolute top-1/2 left-1/2 w-[80vw] h-[80vh] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,_rgba(124,58,237,0.15)_0%,_rgba(124,58,237,0)_50%)]"
        aria-hidden="true"
      ></div>

      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="inline-block bg-indigo-100 dark:bg-gray-800 text-indigo-700 dark:text-gray-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 ring-1 ring-inset ring-indigo-200 dark:ring-gray-700"
        >
          For Developers, Designers & Creators
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 dark:text-white"
        >
          Your Digital Identity, Reimagined.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-6 mb-12"
        >
          LinkGraph is the ultimate creator hub. Beautifully showcase your tech
          stack, creative tools, gaming setup, and social presence—all in one
          place.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <motion.button
            onClick={scrollToQuiz}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 30px -5px rgba(0, 0, 0, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-black px-7 py-3 text-lg font-semibold rounded-full shadow-lg transition-colors duration-300"
          >
            Create Your Hub
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-7 py-3 text-lg font-semibold transition-colors duration-300 rounded-full"
          >
            View Examples
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 opacity-50 group-hover:opacity-100" />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
