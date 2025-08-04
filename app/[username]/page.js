// app/[username]/page.js
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

async function getUserData(username) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      stacks: {
        include: {
          item: true, // Include the actual Item details
        },
        orderBy: {
          position: "asc", // Order the stack by position
        },
      },
    },
  });
  return user;
}

export default async function UserProfilePage({ params }) {
  const user = await getUserData(params.username);

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen relative z-10 pt-24">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <img
            src={`https://github.com/${user.username}.png`}
            alt={user.name || user.username}
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-green-500 shadow-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "[https://placehold.co/128x128/1f2937/a7f3d0?text=A](https://placehold.co/128x128/1f2937/a7f3d0?text=A)";
            }}
          />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {user.name || user.username}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            {user.email}
          </p>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            My Stack
          </h2>
          <div className="space-y-4">
            {user.stacks.map(({ item }) => (
              <div
                key={item.id}
                className="p-4 bg-white/60 dark:bg-gray-800/50 backdrop-blur-md rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex items-center space-x-4"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-10 h-10 rounded-md"
                  width="20"
                  height="20"
                />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
