import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import { ThemeProvider } from "@/contexts/ThemeContext";
import QuizApp from "@/components/QuizApp";
import React from "react";

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-black text-green-400 transition-colors duration-300">
        <ThemeToggle />
        <Hero />
        <Features />
        <React.Suspense
          fallback={<div className="text-center py-12">Loading quiz…</div>}
        >
          <QuizApp />
        </React.Suspense>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
