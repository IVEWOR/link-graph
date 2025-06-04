"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Quiz from "./Quiz";
import MockProfile from "./MockProfile";
import { createBrowserSupabase } from "@/utils/supabase/client";

export default function QuizApp() {
  const [questions, setQuestions] = useState(null);
  const [mockStacks, setMockStacks] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createBrowserSupabase();

  // (1) Fetch the quiz questions on mount
  useEffect(() => {
    fetch("/api/quiz/generate")
      .then((res) => res.json())
      .then((data) => setQuestions(data.questions))
      .catch((err) => console.error("Failed to load quiz:", err));
  }, []);

  // (2) Called when the user finishes the quiz
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
      setMockStacks(json.mockStacks);
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };

  // (3) After OAuth redirect: if URL has "?sessionId=..." AND the user is logged in, run attach
  useEffect(() => {
    const paramSid = searchParams.get("sessionId");
    if (!paramSid) return;

    async function attachQuiz() {
      console.log("🚀 attachQuiz triggered with sessionId:", paramSid);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        console.warn("⚠️ attachQuiz: no logged-in session found");
        return;
      }

      // Call our backend endpoint
      const res = await fetch("/api/quiz/attach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: paramSid }),
      });

      const data = await res.json();
      console.log("📤 /api/quiz/attach response:", data);

      if (res.ok) {
        // Fetch user info (so we know username)
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // Derive username—adapt if your User table stores it somewhere else
        const username =
          user.user_metadata.username || user.email.split("@")[0];
        console.log("ℹ️ Redirecting to edit:", username);
        router.replace(`/u/${username}/edit`);
      } else {
        console.error("❌ attachQuiz failed:", data);
      }
    }

    attachQuiz();
  }, [searchParams, supabase, router]);

  // (4) Render logic
  if (!questions) {
    return <div className="text-center mt-12">Loading quiz…</div>;
  }
  if (mockStacks) {
    return <MockProfile mockStacks={mockStacks} sessionId={sessionId} />;
  }
  return <Quiz questions={questions} onFinish={handleFinish} />;
}
