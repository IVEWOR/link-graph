// app/mock-profile/page.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { createBrowserSupabase } from "@/utils/supabase/client";
import Image from "next/image";

export default function MockProfilePage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const [mockStacks, setMockStacks] = useState([]);
  const supabase = createBrowserSupabase();

  // Load mockStacks from sessionStorage on mount
  useEffect(() => {
    if (!sessionId) return;
    const data = sessionStorage.getItem(`mock_${sessionId}`);
    if (data) {
      try {
        setMockStacks(JSON.parse(data));
      } catch (err) {
        console.error("Could not parse mockStacks", err);
      }
    }
  }, [sessionId]);

  // Group by category
  const grouped = useMemo(() => {
    return mockStacks.reduce((acc, item) => {
      const cat = item.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});
  }, [mockStacks]);

  // OAuth handler
  const handleCreateProfile = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/?sessionId=${sessionId}`,
      },
    });
  };

  // Loading state
  if (!sessionId || mockStacks.length === 0) {
    return (
      <div className="py-20 px-4 bg-black min-h-[80vh] flex items-center justify-center">
        <p className="text-cyan-400 pixel-text">Loading your mock profile…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-black pixel-grid scanlines text-green-400 overflow-hidden">
      {/* Floating neon pixels */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-10 left-10 w-3 h-3 bg-green-400 retro-bounce"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-20 right-16 w-2 h-2 bg-cyan-400 retro-bounce"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute bottom-24 left-1/4 w-2 h-2 bg-green-400 retro-bounce"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-16 right-20 w-3 h-3 bg-cyan-400 retro-bounce"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
        {/* Left column: placeholder avatar + name */}
        <div className="md:w-1/3 flex flex-col items-center md:items-start space-y-6">
          <div className="w-32 h-32 rounded-full border-4 border-green-400 bg-gray-900" />
          <h1 className="text-4xl font-black pixel-text retro-flicker text-center md:text-left">
            Your Name
          </h1>
          <p className="text-cyan-400 text-lg pixel-text">@yourusername</p>
          <button
            onClick={handleCreateProfile}
            className="inline-flex items-center space-x-2 bg-green-400 hover:bg-green-300 text-black font-bold px-6 py-3 text-xl border-4 border-green-400 hover:border-green-300 transition-transform duration-300 hover:scale-105 pixel-text"
            style={{ borderRadius: 0 }}
          >
            <span>[</span>
            <span>CREATE_PROFILE.EXE</span>
            <span>]</span>
          </button>
          <p className="mt-4 text-gray-500 text-sm pixel-text">
            {"// After signing in, you’ll be taken to your editable profile."}
          </p>
        </div>

        {/* Right column: grouped mock stacks */}
        <div className="md:w-2/3 space-y-12">
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category}>
              <h2 className="text-2xl font-bold mb-4 pixel-text text-green-400">
                {category.toUpperCase()}
              </h2>
              <div className="bg-gray-900 border-4 border-green-400 p-4 rounded-lg retro-pulse">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col items-center p-4 border-2 border-black bg-black pixel-text transition hover:scale-105"
                    >
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          width={56}
                          height={56}
                          className="mb-2"
                        />
                      ) : (
                        <div className="w-14 h-14 mb-2 bg-gray-700" />
                      )}
                      {item.linkUrl ? (
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-cyan-400 underline"
                        >
                          {item.title}
                        </a>
                      ) : (
                        <span className="text-sm text-white">{item.title}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
