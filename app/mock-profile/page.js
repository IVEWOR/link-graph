// app/mock-profile/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/utils/supabase/client";
import Image from "next/image";

export default function MockProfilePage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const [mockStacks, setMockStacks] = useState([]);
  const router = useRouter();
  const supabase = createBrowserSupabase();

  // On mount, read from sessionStorage:
  useEffect(() => {
    if (!sessionId) return;
    const stored = sessionStorage.getItem(`mock_${sessionId}`);
    if (stored) {
      try {
        setMockStacks(JSON.parse(stored));
      } catch {
        console.error("Failed to parse mockStacks from sessionStorage");
      }
    }
  }, [sessionId]);

  // If no sessionId or no data, show a loading/placeholder:
  if (!sessionId || mockStacks.length === 0) {
    return (
      <div className="py-20 px-4 bg-black min-h-[80vh] flex items-center justify-center">
        <p className="text-cyan-400 pixel-text">Loading your mock profile…</p>
      </div>
    );
  }

  // When the user clicks “Create Profile,” we trigger Supabase Google OAuth,
  // preserving sessionId so our QuizApp’s attach code can run.
  const handleCreateProfile = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/?sessionId=${sessionId}`,
      },
    });
  };

  return (
    <section className="py-20 px-4 bg-black">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-black text-green-400 mb-6 pixel-text retro-flicker">
          &gt; THIS_IS_YOUR_MOCK_PROFILE
        </h2>
        <p className="text-lg text-cyan-400 mb-12 pixel-text">
          {"// Below is how your LinkGraph might look after you sign up."}
        </p>

        {/* Grid of mock stack items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-12">
          {mockStacks.map((item, idx) => (
            <div
              key={idx}
              className="border-4 border-green-400 bg-black p-4 pixel-text hover:scale-105 transition-transform duration-300 retro-pulse"
            >
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-12 h-12 mx-auto mb-2"
                  width={70}
                  height={70}
                />
              ) : (
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-800" />
              )}
              <h3 className="text-xl font-bold text-white mb-1 pixel-text">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm pixel-text">
                [{item.category}]
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={handleCreateProfile}
          className="inline-flex items-center space-x-2 bg-green-400 hover:bg-green-300 text-black font-bold px-6 py-3 text-xl border-4 border-green-400 hover:border-green-300 transition-transform duration-300 hover:scale-105 pixel-text"
          style={{ borderRadius: 0 }}
        >
          <span>[</span>
          <span>CREATE_PROFILE.EXE</span>
          <span>]</span>
        </button>

        <p className="mt-8 text-gray-500 text-sm pixel-text">
          {"// After signing in, you’ll be taken to your own editable profile"}
        </p>
      </div>
    </section>
  );
}
