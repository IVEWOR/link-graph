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
import AuthModal from "@/components/AuthModal";
import Quiz from "@/components/Quiz";

// --- Main Page Component ---
export default function HomePage() {
  // State is lifted up to manage the AuthModal and pending quiz data
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingQuizAnswers, setPendingQuizAnswers] = useState(null);

  return (
    <div className="min-h-screen transition-colors duration-500 relative z-10">
      <Header
        isAuthModalOpen={isAuthModalOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
        pendingQuizAnswers={pendingQuizAnswers}
        setPendingQuizAnswers={setPendingQuizAnswers}
      />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSection
          setIsAuthModalOpen={setIsAuthModalOpen}
          setPendingQuizAnswers={setPendingQuizAnswers}
        />
        <StackCarousel />
        <Leaderboard />
      </main>
      <Footer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

// --- Hero Section ---
const HeroSection = ({ setIsAuthModalOpen, setPendingQuizAnswers }) => {
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
        <Quiz
          setIsAuthModalOpen={setIsAuthModalOpen}
          setPendingQuizAnswers={setPendingQuizAnswers}
        />
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


