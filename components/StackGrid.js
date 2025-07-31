"use client";
import { useState } from "react";

const mockStacks = [
  {
    id: 1,
    title: "Full Stack Web Dev",
    tools: ["React", "Node.js", "PostgreSQL", "Tailwind"],
    author: "johndoe",
    likes: 234,
    height: "h-64",
  },
  {
    id: 2,
    title: "Mobile Development",
    tools: ["React Native", "Expo", "Firebase"],
    author: "janesmith",
    likes: 189,
    height: "h-48",
  },
  {
    id: 3,
    title: "Data Science Stack",
    tools: ["Python", "Jupyter", "Pandas", "TensorFlow", "Docker"],
    author: "datamaster",
    likes: 456,
    height: "h-72",
  },
  {
    id: 4,
    title: "DevOps Essentials",
    tools: ["Docker", "Kubernetes", "AWS", "Terraform"],
    author: "devopsguru",
    likes: 321,
    height: "h-56",
  },
  {
    id: 5,
    title: "Frontend Specialist",
    tools: ["Vue.js", "Nuxt", "SCSS", "Webpack"],
    author: "frontendpro",
    likes: 167,
    height: "h-60",
  },
  {
    id: 6,
    title: "Game Development",
    tools: ["Unity", "C#", "Blender", "Photoshop"],
    author: "gamedev123",
    likes: 298,
    height: "h-68",
  },
];

export default function StackGrid() {
  const [hoveredStack, setHoveredStack] = useState(null);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Popular Developer Stacks
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover tool combinations that developers love and get inspired for
            your next project
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {mockStacks.map((stack) => (
            <div
              key={stack.id}
              className={`break-inside-avoid ${stack.height} bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 cursor-pointer transform hover:scale-105`}
              onMouseEnter={() => setHoveredStack(stack.id)}
              onMouseLeave={() => setHoveredStack(null)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stack.title}
                </h3>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{stack.likes}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {stack.tools.map((tool, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
                  >
                    {tool}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                    {stack.author[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    @{stack.author}
                  </span>
                </div>

                {hoveredStack === stack.id && (
                  <button className="text-green-600 dark:text-green-400 text-sm font-medium hover:underline">
                    View Stack
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
