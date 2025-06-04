"use client";

import { useState } from "react";

export default function Quiz({ questions, onFinish }) {
  // answers[i] will hold either questions[i].left or questions[i].right
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  const selectAnswer = (idx, choice) => {
    const newAnswers = [...answers];
    newAnswers[idx] = choice;
    setAnswers(newAnswers);
  };

  const allAnswered = answers.every((ans) => ans !== null);

  return (
    <div className="max-w-xl mx-auto my-12">
      <h1 className="text-2xl font-semibold mb-6">Which one do you prefer?</h1>
      {questions.map((q, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center mb-4 p-4 border rounded"
        >
          <button
            className={`px-4 py-2 rounded transition ${
              answers[idx] === q.left
                ? "bg-blue-200"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => selectAnswer(idx, q.left)}
          >
            {q.left}
          </button>

          <span className="text-sm text-gray-500">vs.</span>

          <button
            className={`px-4 py-2 rounded transition ${
              answers[idx] === q.right
                ? "bg-blue-200"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => selectAnswer(idx, q.right)}
          >
            {q.right}
          </button>
        </div>
      ))}

      {allAnswered && (
        <div className="text-center mt-6">
          <button
            onClick={() => onFinish({ chosen: answers })}
            className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            See My Mock Profile
          </button>
        </div>
      )}
    </div>
  );
}
