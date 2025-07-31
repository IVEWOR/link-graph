"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Quiz from "./Quiz";

const Hero = () => {
  const [showQuiz, setShowQuiz] = useState(false);

  const handleQuizComplete = (answers) => {
    console.log("Quiz completed with answers:", answers);
    // You can add logic here to process the answers
    alert("Quiz completed! Check console for answers.");
    setShowQuiz(false);
  };

  if (showQuiz) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-rgb(var(--background)) to-rgb(var(--secondary))/20 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Quiz onComplete={handleQuizComplete} />
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-rgb(var(--background)) to-rgb(var(--secondary))/20 flex items-center pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-rgb(var(--foreground)) mb-6 leading-tight">
            Build Your Perfect
            <span className="bg-gradient-to-r from-rgb(var(--primary)) to-rgb(var(--accent)) bg-clip-text text-transparent">
              {" "}
              Developer Stack
            </span>
          </h1>
          <p className="text-xl text-rgb(var(--muted-foreground)) mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover the perfect combination of tools and technologies through
            our interactive quiz. Join thousands of developers sharing their
            curated stacks.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowQuiz(true)}
              className="min-w-48 transform hover:scale-105 transition-transform"
            >
              🚀 Start Quiz
            </Button>
            <Button variant="outline" size="lg" className="min-w-48">
              Browse Stacks
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-rgb(var(--primary)) to-rgb(var(--accent)) rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl">
                🎯
              </div>
              <h3 className="text-xl font-semibold text-rgb(var(--foreground)) mb-2">
                Personalized
              </h3>
              <p className="text-rgb(var(--muted-foreground))">
                AI-powered quiz creates a stack tailored to your preferences and
                experience
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-rgb(var(--primary)) to-rgb(var(--accent)) rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl">
                👥
              </div>
              <h3 className="text-xl font-semibold text-rgb(var(--foreground)) mb-2">
                Community
              </h3>
              <p className="text-rgb(var(--muted-foreground))">
                Discover what tools top developers are using and share your own
                expertise
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-rgb(var(--primary)) to-rgb(var(--accent)) rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl">
                📊
              </div>
              <h3 className="text-xl font-semibold text-rgb(var(--foreground)) mb-2">
                Insights
              </h3>
              <p className="text-rgb(var(--muted-foreground))">
                Get detailed analytics on tool popularity and trends in the
                developer community
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
