// components/AuthButton.jsx
"use client";

import { createBrowserSupabase } from "@/utils/supabase/client";

export default function AuthButton({ sessionId }) {
  const supabase = createBrowserSupabase();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/?sessionId=${sessionId}`,
      },
    });
  };

  return (
    <button
      onClick={handleSignIn}
      className="inline-flex items-center space-x-2 bg-green-400 hover:bg-green-300 text-black font-bold px-6 py-3 text-xl border-4 border-green-400 hover:border-green-300 transition-transform duration-300 hover:scale-105 pixel-text"
      style={{ borderRadius: 0 }}
    >
      <span>[</span>
      <span>CREATE_PROFILE.EXE</span>
      <span>]</span>
    </button>
  );
}
