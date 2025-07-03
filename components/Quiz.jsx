/*
================================================================================
  FILE: components/Quiz.jsx
  PURPOSE: The actual quiz UI, redesigned for a modern look.
================================================================================
*/
// components/Quiz.jsx
"use client";

import { useState } from "react";
import {
  SiVim,
  SiVsco,
  SiJavascript,
  SiTypescript,
  SiC,
  SiRust,
  SiReact,
  SiAngular,
  SiNodedotjs,
  SiDeno,
} from "react-icons/si";
import { AnimatePresence, motion } from "framer-motion";

export default function Quiz({ questions, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  const ICON_MAP = {
    VIM: <SiVim size={40} className="text-green-500" />,
    VSCODE: <SiVsco size={40} className="text-blue-500" />,
    JAVASCRIPT: <SiJavascript size={40} className="text-yellow-400" />,
    TYPESCRIPT: <SiTypescript size={40} className="text-blue-500" />,
    C: <SiC size={40} className="text-blue-600" />,
    RUST: <SiRust size={40} className="text-orange-500" />,
    REACT: <SiReact size={40} className="text-cyan-400" />,
    ANGULAR: <SiAngular size={40} className="text-red-500" />,
    "NODE.JS": <SiNodedotjs size={40} className="text-green-600" />,
    DENO: <SiDeno size={40} className="text-gray-800 dark:text-gray-200" />,
  };

  const selectAnswer = (choice) => {
    const newAnswers = [...answers];
    newAnswers[current] = choice;
    setAnswers(newAnswers);

    const isLastQuestion = current === questions.length - 1;
    setTimeout(() => {
      if (isLastQuestion) {
        onFinish({ chosen: newAnswers });
      } else {
        setCurrent((i) => i + 1);
      }
    }, 300);
  };

  const progress = (current / questions.length) * 100;

  return (
    <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl shadow-indigo-500/10 p-8 md:p-12 overflow-hidden">
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
        <motion.div
          className="bg-indigo-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.button
              onClick={() => selectAnswer(questions[current].left)}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`group flex flex-col items-center justify-center text-center p-8 border-2 rounded-xl transition-all duration-300 ${
                answers[current] === questions[current].left
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                  : "border-gray-200 dark:border-gray-700 hover:border-indigo-400"
              }`}
            >
              <div className="mb-4">
                {ICON_MAP[questions[current].left.toUpperCase()]}
              </div>
              <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {questions[current].left}
              </span>
            </motion.button>
            <motion.button
              onClick={() => selectAnswer(questions[current].right)}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`group flex flex-col items-center justify-center text-center p-8 border-2 rounded-xl transition-all duration-300 ${
                answers[current] === questions[current].right
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                  : "border-gray-200 dark:border-gray-700 hover:border-indigo-400"
              }`}
            >
              <div className="mb-4">
                {ICON_MAP[questions[current].right.toUpperCase()]}
              </div>
              <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {questions[current].right}
              </span>
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
