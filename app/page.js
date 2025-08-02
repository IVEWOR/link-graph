// app/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Code,
  Terminal,
  Database,
  ArrowRight,
  Star,
  Users,
} from "lucide-react";
import StackCarousel from "@/components/StackCarousel";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";

// --- Main Page Component ---
export default function HomePage() {
  return (
    <div className="min-h-screen transition-colors duration-500">
      <Header />
      <main className="px-4 sm:px-6 lg:px-8">
        <HeroSection />
        <StackCarousel />
        <Leaderboard />
      </main>
      <Footer />
    </div>
  );
}

// --- Hero Section ---
const HeroSection = () => {
  return (
    <section className="text-center py-20 sm:py-28 lg:py-32">
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        Build Your Ultimate Dev Stack
      </h2>
      <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
        Take our quick quiz to generate your personalized tool stack, or explore
        what top developers are using.
      </p>
      <div className="mt-10 max-w-3xl mx-auto">
        <Quiz />
      </div>
    </section>
  );
};

// --- Quiz Component ---
const initialQuestions = [
  {
    id: 1,
    text: "Choose your primary editor:",
    options: [
      {
        id: "vscode",
        text: "VS Code",
        icon: <Code className="h-8 w-8 mx-auto mb-2" />,
      },
      {
        id: "vim",
        text: "Vim/Neovim",
        icon: <Terminal className="h-8 w-8 mx-auto mb-2" />,
      },
    ],
  },
];

const Quiz = () => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loadingNext, setLoadingNext] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleAnswer = async (option) => {
    const newAnswers = [
      ...answers,
      { question: questions[currentQuestionIndex].text, answer: option.text },
    ];
    setAnswers(newAnswers);

    if (currentQuestionIndex >= 5) {
      setQuizFinished(true);
      localStorage.setItem("devStackQuiz", JSON.stringify(newAnswers));
      return;
    }

    setLoadingNext(true);

    // Mock API call to get next question
    setTimeout(() => {
      const nextQuestions = [
        {
          id: 2,
          text: "Preferred Frontend Framework?",
          options: [
            { id: "react", text: "React", icon: <Code /> },
            { id: "vue", text: "Vue", icon: <Code /> },
          ],
        },
        {
          id: 3,
          text: "Your go-to Database?",
          options: [
            { id: "postgres", text: "PostgreSQL", icon: <Database /> },
            { id: "mongo", text: "MongoDB", icon: <Database /> },
          ],
        },
        {
          id: 4,
          text: "Cloud Platform?",
          options: [
            { id: "aws", text: "AWS", icon: <Code /> },
            { id: "gcp", text: "Google Cloud", icon: <Code /> },
          ],
        },
        {
          id: 5,
          text: "Primary Language?",
          options: [
            { id: "js", text: "JavaScript", icon: <Code /> },
            { id: "python", text: "Python", icon: <Code /> },
          ],
        },
        {
          id: 6,
          text: "State Management?",
          options: [
            { id: "redux", text: "Redux", icon: <Code /> },
            { id: "zustand", text: "Zustand", icon: <Code /> },
          ],
        },
      ];
      setQuestions([...questions, nextQuestions[currentQuestionIndex]]);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setLoadingNext(false);
    }, 1000); // Simulate network delay
  };

  const handleExploreStack = () => {
    localStorage.setItem("devStackQuiz", JSON.stringify(answers));
    setQuizFinished(true);
    // Here you would typically redirect to a results page
    alert("Your stack has been saved! You can now explore.");
  };

  if (quizFinished) {
    return (
      <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-2xl shadow-green-500/10">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quiz Complete!
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Your initial stack is ready. Explore and customize it on your
          dashboard.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Start Over
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const showExploreButton = answers.length >= 4;

  return (
    <div className="relative bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border border-green-400/20 dark:border-green-400/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-green-500/10 transition-all duration-500">
      <div className="absolute -top-3 -left-3 w-16 h-16 bg-green-300/50 dark:bg-green-400/50 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-green-300/50 dark:bg-green-500/50 rounded-full blur-2xl animate-pulse delay-500"></div>

      <div className="relative z-10">
        {loadingNext ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">
              Question {currentQuestionIndex + 1}/{6}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {currentQuestion.text}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option)}
                  className="group text-center p-6 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <div className="text-green-600 group-hover:scale-110 transition-transform duration-300">
                    {option.icon}
                  </div>
                  <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                    {option.text}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {showExploreButton && (
          <div className="mt-8 text-center">
            <button
              onClick={handleExploreStack}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
            >
              Explore Stack <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Leaderboard ---
const Leaderboard = () => {
  const topUsers = [
    { name: "leerob", followers: "150.3k", avatar: "leerob" },
    { name: "rauchg", followers: "120.1k", avatar: "rauchg" },
    { name: "swyx", followers: "98.7k", avatar: "sw-yx" },
    { name: "cassidoo", followers: "85.2k", avatar: "cassidoo" },
    { name: "jaredpalmer", followers: "72.5k", avatar: "jaredpalmer" },
  ];

  return (
    <section className="py-20 sm:py-24">
      <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
        <Star className="inline-block w-8 h-8 mr-2 text-yellow-400" />
        Public Leaderboard
      </h3>
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800/50 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-gray-700"
        >
          {topUsers.map((user, index) => (
            <li
              key={user.name}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-lg font-bold text-gray-500 dark:text-gray-400 w-8">
                  {index + 1}
                </span>
                <Image
                  className="h-12 w-12 rounded-full ml-4"
                  src={`https://github.com/${user.avatar}.png`}
                  alt={user.name}
                  width={30}
                  height={30}
                />
                <p className="ml-4 text-lg font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {user.followers}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
