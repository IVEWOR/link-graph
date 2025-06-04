"use client";

import AuthButton from "./AuthButton";

export default function MockProfile({ mockStacks, sessionId }) {
  return (
    <div className="max-w-2xl mx-auto my-12">
      <h2 className="text-xl font-semibold mb-4">This Could Be Your Profile</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {mockStacks.map((s, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center p-4 border rounded"
          >
            {s.imageUrl ? (
              <img src={s.imageUrl} alt={s.title} className="w-8 h-8 mb-2" />
            ) : (
              <div className="w-8 h-8 mb-2 bg-gray-200" />
            )}
            <span className="text-sm font-medium">{s.title}</span>
            <span className="text-xs text-gray-500">{s.category}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <AuthButton sessionId={sessionId} />
      </div>
    </div>
  );
}
