// components/Header.js
"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Sun, Moon, User } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { supabase } from "@/lib/supabaseClient";

export default function Header({
  setIsAuthModalOpen,
  pendingQuizAnswers,
  setPendingQuizAnswers,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [session, setSession] = useState(null);
  const router = useRouter();

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const processQuizAndRedirect = async (user) => {
      if (pendingQuizAnswers && user) {
        try {
          const response = await fetch("/api/stack/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              answers: pendingQuizAnswers,
              userId: user.id,
            }),
          });
          const data = await response.json();
          if (data.success) {
            setPendingQuizAnswers(null); // Clear pending answers
            router.push(`/${data.username}`); // Redirect to profile
          }
        } catch (error) {
          console.error("Failed to create stack:", error);
        }
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      processQuizAndRedirect(session?.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsAuthModalOpen(false); // Close modal on auth change
      processQuizAndRedirect(session?.user);
    });

    return () => subscription.unsubscribe();
  }, [pendingQuizAnswers, setPendingQuizAnswers, router, setIsAuthModalOpen]);

  // ... other useEffects remain the same ...

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/"); // Redirect to home on sign out
  };

  // ... rest of the component is the same ...
  return (
    <div className="sticky top-0 z-50">
      <ScrollReveal>
        <header className="max-w-full">
          <nav
            className={`border-b border-green-500/20 shadow-lg transition-all duration-500 ${
              isScrolled ? "glass-effect-green" : "glass-effect"
            }`}
          >
            <div className="container mx-auto flex items-center justify-between h-18 px-8 py-2">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-900 dark:text-white group"
              >
                <div className="transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <h1 className="text-2xl font-bold">DevStacks</h1>
                </div>
              </Link>

              <div className="hidden md:flex items-center space-x-2">
                {session ? (
                  <div className="flex items-center space-x-4">
                    <Link
                      href={`/${
                        session.user.user_metadata.user_name ||
                        session.user.email.split("@")[0]
                      }`}
                      className="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold px-4 py-1.5 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/20"
                  >
                    Sign In
                  </button>
                )}
                <button
                  aria-label="Toggle Dark Mode"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {mounted &&
                    (theme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    ))}
                </button>
              </div>
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden text-gray-800 dark:text-gray-200 p-2 transition-all duration-300 hover:bg-green-500/10 rounded-lg"
              >
                <span className="sr-only">Open menu</span>
                <Menu className="h-6 w-6 transition-transform duration-300 hover:rotate-90" />
              </button>
            </div>
          </nav>
        </header>
      </ScrollReveal>
    </div>
  );
}
