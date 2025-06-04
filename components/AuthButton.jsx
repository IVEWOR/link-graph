"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/utils/supabase/client";

export default function AuthButton({ sessionId }) {
  const [supabase] = useState(() => createBrowserSupabase());

  const handleSignIn = () => {
    // If sessionId exists, include it in the redirect URL as a query param
    const baseUrl = window.location.origin;
    const redirectTo = sessionId
      ? `${baseUrl}?sessionId=${sessionId}`
      : baseUrl;

    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
  };

  return (
    <button
      onClick={handleSignIn}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      Sign in with Google
    </button>
  );
}
