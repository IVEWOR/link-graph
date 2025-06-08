// components/Quiz.jsx
"use client";

import { useState } from "react";
// import the simple-icons you need:
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

export default function Quiz({ questions, onFinish }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  // mapping from uppercase choice to a React icon
  const ICON_MAP = {
    VIM: <SiVim className="w-12 h-12 text-green-400 mb-2" />,
    VSCODE: <SiVsco className="w-12 h-12 text-cyan-400 mb-2" />,
    JAVASCRIPT: <SiJavascript className="w-12 h-12 text-green-400 mb-2" />,
    TYPESCRIPT: <SiTypescript className="w-12 h-12 text-cyan-400 mb-2" />,
    C: <SiC className="w-12 h-12 text-green-400 mb-2" />,
    RUST: <SiRust className="w-12 h-12 text-cyan-400 mb-2" />,
    REACT: <SiReact className="w-12 h-12 text-green-400 mb-2" />,
    ANGULAR: <SiAngular className="w-12 h-12 text-red-500 mb-2" />,
    "NODE.JS": <SiNodedotjs className="w-12 h-12 text-green-400 mb-2" />,
    DENO: <SiDeno className="w-12 h-12 text-cyan-400 mb-2" />,
  };

  const selectAnswer = (choice) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = choice;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion((i) => i + 1), 200);
    } else {
      setTimeout(() => onFinish({ chosen: newAnswers }), 200);
    }
  };

  const q = questions[currentQuestion];
  const leftKey = q.left.toUpperCase();
  const rightKey = q.right.toUpperCase();
  const rightIsLightMode = rightKey === "LIGHT_MODE";

  return (
    <section className="py-20 px-4 bg-black min-h-[80vh]">
      <div className="max-w-4xl mx-auto">
        {/* Heading + progress */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-green-400 mb-4 pixel-text retro-flicker">
            &gt; DETECT_DEV_STYLE.EXE
          </h2>
          <p className="text-lg text-cyan-400 mb-8 pixel-text">
            // Quick quiz to personalize your profile
          </p>
          <div className="flex justify-center space-x-2">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 border-2 transition-all duration-300 ${
                  i <= currentQuestion
                    ? "bg-green-400 border-green-400"
                    : "bg-black border-green-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Single question at a time */}
        <div className="border-4 border-green-400 bg-black p-8 pixel-text">
          <p className="text-center text-cyan-400 mb-6 text-lg">
            QUESTION_{currentQuestion + 1}_OF_{questions.length}
          </p>

          <div className="grid grid-cols-2 gap-6">
            {/* LEFT */}
            <button
              onClick={() => selectAnswer(q.left)}
              className={`flex flex-col items-center p-6 border-4 border-green-400 text-green-400 font-bold text-xl retro-pulse transition-transform duration-200 hover:scale-105 ${
                answers[currentQuestion] === q.left
                  ? "bg-gray-900"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {ICON_MAP[leftKey] ?? null}
              {q.left}
            </button>

            {/* RIGHT */}
            <button
              onClick={() => selectAnswer(q.right)}
              className={`flex flex-col items-center p-6 border-4 ${
                rightIsLightMode
                  ? "border-white text-white"
                  : "border-cyan-400 text-cyan-400"
              } font-bold text-xl retro-pulse transition-transform duration-200 hover:scale-105 ${
                answers[currentQuestion] === q.right
                  ? "bg-gray-900"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {ICON_MAP[rightKey] ?? null}
              {q.right}
            </button>
          </div>

          <p className="mt-6 text-center text-gray-400 text-sm pixel-text">
            // Click to choose
          </p>
        </div>
      </div>
    </section>
  );
}
