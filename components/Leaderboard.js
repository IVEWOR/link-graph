"use client";

const mockUsers = [
  { id: 1, username: "techguru", followers: 15420, stacks: 23, avatar: "TG" },
  { id: 2, username: "codemaster", followers: 12890, stacks: 18, avatar: "CM" },
  { id: 3, username: "devwizard", followers: 11240, stacks: 31, avatar: "DW" },
  {
    id: 4,
    username: "stackbuilder",
    followers: 9870,
    stacks: 15,
    avatar: "SB",
  },
  { id: 5, username: "toolsexpert", followers: 8965, stacks: 27, avatar: "TE" },
  {
    id: 6,
    username: "fullstackpro",
    followers: 7821,
    stacks: 12,
    avatar: "FP",
  },
  { id: 7, username: "opensource", followers: 6743, stacks: 19, avatar: "OS" },
  { id: 8, username: "clouddev", followers: 5901, stacks: 14, avatar: "CD" },
];

export default function Leaderboard() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Top Creators
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Follow the most influential developers and discover their favorite
            tool stacks
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Leaderboard
            </h3>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockUsers.map((user, index) => (
              <div
                key={user.id}
                className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 mr-4">
                      {index < 3 ? (
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                              ? "bg-gray-400"
                              : "bg-orange-600"
                          }`}
                        >
                          {index + 1}
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {user.avatar}
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        @{user.username}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.stacks} stacks published
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center text-gray-900 dark:text-white font-semibold">
                      <svg
                        className="w-4 h-4 mr-1 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {user.followers.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      followers
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 text-center">
            <button className="text-green-600 dark:text-green-400 font-medium hover:underline">
              View Full Leaderboard
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
