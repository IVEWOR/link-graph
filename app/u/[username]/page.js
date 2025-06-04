import prisma from "@/lib/prisma";
import Link from "next/link";
import { createServerSupabase } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function UserProfilePage({ params }) {
  const { username } = await params;

  // 1. Fetch the user by username, including their socialLinks and stacks
  const profileUser = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      socialLinks: true,
      stacks: {
        include: {
          item: true, // bring in title, imageUrl, category, linkUrl
        },
        orderBy: { position: "asc" },
      },
    },
  });

  // 2. If no such user, render a 404
  if (!profileUser) {
    notFound();
  }

  // 3. Group the user’s stacks by category
  const groupedStacks = profileUser.stacks.reduce((acc, us) => {
    const cat = us.item.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(us.item);
    return acc;
  }, {});

  // 4. Check if the currently logged-in user is the same as profileUser
  let isOwner = false;
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user: sessionUser },
      error: getUserError,
    } = await supabase.auth.getUser();

    if (!getUserError && sessionUser?.id === profileUser.id) {
      isOwner = true;
    }
  } catch {
    // If Supabase lookup fails (e.g. no session), just consider isOwner = false
    isOwner = false;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* User Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">
          {profileUser.name || profileUser.username}
        </h1>
        <p className="text-gray-500">@{profileUser.username}</p>
      </div>

      {/* “Edit Profile” Button (only if owner) */}
      {isOwner && (
        <div className="text-center mb-8">
          <Link
            href={`/u/${profileUser.username}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Profile
          </Link>
        </div>
      )}

      {/* Social / Custom Links */}
      {Array.isArray(profileUser.socialLinks) &&
        profileUser.socialLinks.length > 0 && (
          <div className="flex flex-wrap justify-center space-x-4 mb-8">
            {profileUser.socialLinks.map((linkObj, idx) => (
              <a
                key={idx}
                href={linkObj.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-sm font-medium text-blue-600 hover:underline"
              >
                {linkObj.platform || linkObj.url}
              </a>
            ))}
          </div>
        )}

      {/* Stacks Section */}
      {Object.entries(groupedStacks).length > 0 ? (
        Object.entries(groupedStacks).map(([category, items]) => (
          <section key={category} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">{category}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center p-4 border rounded hover:shadow-md transition"
                >
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-12 h-12 mb-2"
                      width={70}
                      height={70}
                    />
                  ) : (
                    <div className="w-12 h-12 mb-2 bg-gray-200 rounded" />
                  )}
                  {item.linkUrl ? (
                    <a
                      href={item.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <span className="text-sm font-medium">{item.title}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))
      ) : (
        <p className="text-center text-gray-500">
          This user hasn’t added any stacks yet.
        </p>
      )}
    </div>
  );
}
