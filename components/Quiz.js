"use client";
import { useState, useEffect } from "react";

const initialQuestions = [
  {
    id: 1,
    question: "Which code editor do you prefer?",
    options: [
      { id: "vim", name: "Vim", icon: "⚡" },
      { id: "vscode", name: "VS Code", icon: "💙" },
    ],
  },
];

// Mock function to simulate OpenAI API call
const generateNextQuestion = async (previousAnswers) => {
  // This would be replaced with actual OpenAI API call
  const mockQuestions = [
    {
      question: "What's your preferred programming language?",
      options: [
        { id: "javascript", name: "JavaScript", icon: "🟨" },
        { id: "python", name: "Python", icon: "🐍" },
      ],
    },
    {
      question: "Which framework do you use most?",
      options: [
        { id: "react", name: "React", icon: "⚛️" },
        { id: "vue", name: "Vue.js", icon: "💚" },
      ],
    },
    {
      question: "Preferred database solution?",
      options: [
        { id: "postgresql", name: "PostgreSQL", icon: "🐘" },
        { id: "mongodb", name: "MongoDB", icon: "🍃" },
      ],
    },
    {
      question: "Which deployment platform?",
      options: [
        { id: "vercel", name: "Vercel", icon: "▲" },
        { id: "netlify", name: "Netlify", icon: "🌐" },
      ],
    },
    {
      question: "Preferred package manager?",
      options: [
        { id: "npm", name: "npm", icon: "📦" },
        { id: "yarn", name: "Yarn", icon: "🧶" },
      ],
    },
  ];

  return mockQuestions[previousAnswers.length - 1] || null;
};

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState(initialQuestions);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showExploreButton, setShowExploreButton] = useState(false);
  const [isExploreButtonMandatory, setIsExploreButtonMandatory] =
    useState(false);

  const handleAnswer = async (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setIsLoading(true);

    // Show explore button after 4 questions
    if (newAnswers.length >= 4) {
      setShowExploreButton(true);
    }

    // Make explore button mandatory after 6 questions
    if (newAnswers.length >= 6) {
      setIsExploreButtonMandatory(true);
      setIsLoading(false);
      return;
    }

    try {
      const nextQuestion = await generateNextQuestion(newAnswers);
      if (nextQuestion) {
        setQuestions([
          ...questions,
          { id: questions.length + 1, ...nextQuestion },
        ]);
        setCurrentQuestion(currentQuestion + 1);
      }
    } catch (error) {
      console.error("Error generating next question:", error);
    }

    setIsLoading(false);
  };

  const handleExploreStack = () => {
    // Save answers to localStorage
    localStorage.setItem("quizAnswers", JSON.stringify(answers));

    // Show success message or redirect
    alert("Your stack preferences have been saved! 🎉");

    // Reset quiz
    setCurrentQuestion(0);
    setQuestions(initialQuestions);
    setAnswers([]);
    setShowExploreButton(false);
    setIsExploreButtonMandatory(false);
  };

  if (isExploreButtonMandatory) {
    return (
      <div className="text-center">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quiz Complete! 🎉
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {
              "We've gathered enough information to create your personalized stack."
            }
          </p>
        </div>
        <button
          onClick={handleExploreStack}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold text-lg transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Explore Your Stack
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Question {currentQuestion + 1}</span>
          <span>{answers.length} answers</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((answers.length / 6) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {question?.question}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose the option that best fits your preference
        </p>
      </div>

      {/* Options */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {question?.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option)}
              className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 group"
            >
              <div className="text-3xl mb-3">{option.icon}</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">
                {option.name}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Explore Stack Button */}
      {showExploreButton && !isExploreButtonMandatory && (
        <div className="text-center">
          <button
            onClick={handleExploreStack}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Explore Stack
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Or continue for more personalized results
          </p>
        </div>
      )}
    </div>
  );
}
