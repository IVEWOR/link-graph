// components/QuizApp.jsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Quiz from "./Quiz";
import { createBrowserSupabase } from "@/utils/supabase/client";

export default function QuizApp() {
  const [questions, setQuestions] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createBrowserSupabase();

  // (1) Fetch the quiz questions when this mounts
  useEffect(() => {
    fetch("/api/quiz/generate")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions);
      })
      .catch((err) => console.error("Failed to load quiz:", err));
  }, []);

  // (2) When user finishes the quiz, POST to /api/quiz/save, stash result in sessionStorage, then redirect
  const handleFinish = async ({ chosen }) => {
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);

    try {
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
      // json.mockStacks is an array of { id, title, imageUrl, category }
      // Save it to sessionStorage so our new /mock-profile page can read it:
      sessionStorage.setItem(
        `mock_${newSessionId}`,
        JSON.stringify(json.mockStacks)
      );

      // Now push the user to /mock-profile?sessionId=…
      router.push(`/mock-profile?sessionId=${newSessionId}`);
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };

  // (3) If we arrive here with ?sessionId=… (after Google OAuth), attempt to attach.
  // Exactly the same logic as before.
  useEffect(() => {
    const paramSid = searchParams.get("sessionId");
    if (!paramSid) return;

    async function attachQuiz() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        console.warn("⚠️ attachQuiz: no logged-in session found");
        return;
      }

      const res = await fetch("/api/quiz/attach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: paramSid }),
      });
      const data = await res.json();

      if (res.ok) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const username =
          user.user_metadata.username || user.email.split("@")[0];
        router.replace(`/u/${username}/edit`);
      } else {
        console.error("❌ attachQuiz failed:", data);
      }
    }

    attachQuiz();
  }, [searchParams, supabase, router]);

  // (4) Render: if we have questions but no sessionId redirect yet, show the Quiz.
  // We don’t render a “MockProfile” inline anymore—because that now lives on /mock-profile.
  if (!questions) {
    return (
      <div className="text-center mt-12 pixel-text text-cyan-400">
        Loading quiz…
      </div>
    );
  }
  return <Quiz questions={questions} onFinish={handleFinish} />;
}
