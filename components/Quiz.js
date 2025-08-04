// components/Quiz.js
"use client";
import React, { useState, useEffect } from "react";
import { Code, Terminal, Database, ArrowRight } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

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

const Quiz = ({ setIsAuthModalOpen, setPendingQuizAnswers }) => {
  const [questions, setQuestions] = useState(initialQuestions);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loadingNext, setLoadingNext] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleExploreStack = () => {
    // Instead of saving, set the answers and open the auth modal
    setPendingQuizAnswers(answers);
    setIsAuthModalOpen(true);
  };

  const handleFinalAnswer = (option) => {
    const finalAnswers = [
      ...answers,
      { question: questions[currentQuestionIndex].text, answer: option.text },
    ];
    setPendingQuizAnswers(finalAnswers);
    setIsAuthModalOpen(true);
    setQuizFinished(true);
  };

  const handleAnswer = (option) => {
    const newAnswers = [
      ...answers,
      { question: questions[currentQuestionIndex].text, answer: option.text },
    ];
    setAnswers(newAnswers);

    if (currentQuestionIndex >= 5) {
      handleFinalAnswer(option);
      return;
    }

    setLoadingNext(true);
    setTimeout(() => {
      const nextQuestions = [
        {
          id: 2,
          text: "Preferred Frontend Framework?",
          options: [
            { id: "react", text: "React" },
            { id: "vue", text: "Vue" },
          ],
        },
        {
          id: 3,
          text: "Your go-to Database?",
          options: [
            { id: "postgres", text: "PostgreSQL" },
            { id: "mongo", text: "MongoDB" },
          ],
        },
        {
          id: 4,
          text: "Cloud Platform?",
          options: [
            { id: "aws", text: "AWS" },
            { id: "gcp", text: "Google Cloud" },
          ],
        },
        {
          id: 5,
          text: "Primary Language?",
          options: [
            { id: "js", text: "JavaScript" },
            { id: "python", text: "Python" },
          ],
        },
        {
          id: 6,
          text: "State Management?",
          options: [
            { id: "redux", text: "Redux" },
            { id: "zustand", text: "Zustand" },
          ],
        },
      ];
      const nextQ = {
        ...nextQuestions[currentQuestionIndex],
        options: nextQuestions[currentQuestionIndex].options.map((o) => ({
          ...o,
          icon: <Code className="h-8 w-8 mx-auto mb-2" />,
        })),
      };
      setQuestions([...questions, nextQ]);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setLoadingNext(false);
    }, 1000);
  };

  if (quizFinished) {
    return (
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-2xl shadow-green-500/10 text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Processing your results...
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Please sign in or sign up to create your profile.
        </p>
      </div>
    );
  }

  // ... rest of the component rendering is the same
  const currentQuestion = questions[currentQuestionIndex];
  const showExploreButton = answers.length >= 4;

  return (
    <div className="relative bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border-green-400/20 dark:border-green-400/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-green-500/10 transition-all duration-500">
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

        {showExploreButton && !quizFinished && (
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

export default Quiz;
