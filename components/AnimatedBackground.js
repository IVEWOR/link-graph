// components/AnimatedBackground.jsx
"use client";
import React from "react";

export default function AnimatedBackground() {
  return (
    <>
      {/* Theme-aware gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900 -z-50" />

      {/* Theme-aware subtle green accent gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-900/5 via-transparent to-green-800/5 dark:from-green-900/5 dark:via-transparent dark:to-green-800/5 pointer-events-none -z-40" />
      <div className="fixed inset-0 bg-gradient-to-tr from-transparent via-green-500/3 to-transparent dark:via-green-500/3 pointer-events-none -z-40" />

      {/* Theme-aware single floating orb for subtle movement */}
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-green-500/5 to-green-400/5 dark:from-green-500/5 dark:to-green-400/5 rounded-full blur-3xl animate-float pointer-events-none -z-30" />
    </>
  );
}
