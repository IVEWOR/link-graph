/*
================================================================================
  FILE: components/QuizApp.jsx
  PURPOSE: Container for the redesigned quiz.
================================================================================
*/
// components/QuizApp.jsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Quiz from "./Quiz";
import { createBrowserSupabase } from "@/utils/supabase/client";

export default function QuizApp() {
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    fetch("/api/quiz/generate")
      .then((res) => res.json())
      .then((data) => setQuestions(data.questions));
  }, []);

  const router = useRouter();
  const handleFinish = async ({ chosen }) => {
    const newSessionId = crypto.randomUUID();
    const res = await fetch("/api/quiz/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: newSessionId,
        questionPairs: questions,
        chosen,
      }),
    });
    const json = await res.json();
    sessionStorage.setItem(
      `mock_${newSessionId}`,
      JSON.stringify(json.mockStacks)
    );
    router.push(`/mock-profile?sessionId=${newSessionId}`);
  };

  return (
    <section id="quiz" className="py-24 px-4 bg-gray-50 dark:bg-[#0B0B0F]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Find Your Perfect Stack
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
            Answer a few quick questions to generate a personalized profile with
            technologies and tools that match your style.
          </p>
        </div>

        {!questions ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        ) : (
          <Quiz questions={questions} onFinish={handleFinish} />
        )}
      </div>
    </section>
  );
}
