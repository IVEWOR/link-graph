"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabase } from "@/utils/supabase/client";

export default function Navbar() {
  const [supabase] = useState(() => createBrowserSupabase());
  const [user, setUser] = useState(null);

  // On mount, check if there’s an active session
  useEffect(() => {
    async function fetchSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        // Upsert into our DB
        const { id, email, user_metadata } = session.user;
        await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            email,
            name: user_metadata.name || null,
          }),
        });
      }
    }

    fetchSession();

    // Listen for future auth state changes (e.g. sign-in or sign-out)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          setUser(session.user);
          const { id, email, user_metadata } = session.user;
          await fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id,
              email,
              name: user_metadata.name || null,
            }),
          });
        } else {
          setUser(null);
        }
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignIn = () => {
    supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100">
      <div className="text-xl font-bold">LinkGraph</div>
      <div>
        {user ? (
          <>
            <span className="mr-4">
              {user.user_metadata.name || user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={handleSignIn}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Sign In with Google
          </button>
        )}
      </div>
    </nav>
  );
}
