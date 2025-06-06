// components/Quiz.jsx
"use client";

import { useState, useEffect } from "react";

export default function Quiz({ questions, onFinish }) {
  // Track the index of the question currently shown (0-based).
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Track all selected answers in order.
  // answers[i] will hold the user’s choice (string) for question i.
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  // When the user picks a choice for the current question:
  const selectAnswer = (choice) => {
    // Record answer for the current question
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = choice;
    setAnswers(newAnswers);

    // If there are more questions, move to the next; otherwise trigger onFinish
    if (currentQuestion < questions.length - 1) {
      // Move to next question after a short delay (so the user sees the click effect)
      setTimeout(() => {
        setCurrentQuestion((idx) => idx + 1);
      }, 200);
    } else {
      // Last question answered: wait a moment, then call onFinish
      setTimeout(() => {
        onFinish({ chosen: newAnswers });
      }, 200);
    }
  };

  // Pull out the question object we need to display right now:
  const q = questions[currentQuestion];

  // Decide right‐choice neon color: if q.right === "LIGHT_MODE", use white; otherwise cyan
  const rightIsLightMode = q.right === "LIGHT_MODE";

  return (
    <section className="py-20 px-4 bg-black min-h-[80vh]">
      <div className="max-w-4xl mx-auto">
        {/* Heading + Progress Dots */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-green-400 mb-4 pixel-text retro-flicker">
            &gt; DETECT_DEV_STYLE.EXE
          </h2>
          <p className="text-lg text-cyan-400 mb-8 pixel-text">
            // Quick quiz to personalize your profile
          </p>
          <div className="flex justify-center space-x-2">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`w-4 h-4 border-2 transition-all duration-300 ${
                  idx < currentQuestion
                    ? "bg-green-400 border-green-400" // already answered
                    : idx === currentQuestion
                    ? "bg-green-400 border-green-400" // current question
                    : "bg-black border-green-400" // future question
                }`}
              />
            ))}
          </div>
        </div>

        {/* Single question box */}
        <div className="border-4 border-green-400 bg-black p-8 pixel-text">
          <p className="text-center text-cyan-400 mb-6 text-lg overflow-hidden">
            QUESTION_{currentQuestion + 1}_OF_{questions.length}
          </p>

          <div className="grid grid-cols-2 gap-6">
            {/* LEFT CHOICE */}
            <button
              onClick={() => selectAnswer(q.left)}
              className={`p-6 border-4 border-green-400 text-green-400 font-bold text-xl retro-pulse transition-transform duration-200 hover:scale-105 ${
                answers[currentQuestion] === q.left
                  ? "bg-gray-900"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {q.left}
            </button>

            {/* RIGHT CHOICE */}
            <button
              onClick={() => selectAnswer(q.right)}
              className={`p-6 border-4 ${
                rightIsLightMode
                  ? "border-white text-white"
                  : "border-cyan-400 text-cyan-400"
              } font-bold text-xl retro-pulse transition-transform duration-200 hover:scale-105 ${
                answers[currentQuestion] === q.right
                  ? "bg-gray-900"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
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
