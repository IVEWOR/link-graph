/*
================================================================================
  FILE: app/page.js
  PURPOSE: Main homepage layout. Now simpler as the provider is in layout.js.
================================================================================
*/
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import QuizApp from "@/components/QuizApp";
import React from "react";

const Index = () => {
  return (
    <div className="bg-white dark:bg-[#0B0B0F] text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <ThemeToggle />
      <main>
        <Hero />
        <Features />
        <React.Suspense
          fallback={
            <div className="text-center py-20 text-gray-500">
              Loading Interactive Quiz...
            </div>
          }
        >
          <QuizApp />
        </React.Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
