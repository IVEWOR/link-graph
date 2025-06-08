// app/u/[username]/page.js
import prisma from "@/lib/prisma";
import Link from "next/link";
import { createServerSupabase } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function UserProfilePage({ params }) {
  const { username } = await params;

  // 1) Fetch the user + their stacks
  const profileUser = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      socialLinks: true,
      stacks: {
        include: { item: true },
        orderBy: { position: "asc" },
      },
    },
  });
  if (!profileUser) notFound();

  // 2) Group their stacks by category
  const groupedStacks = profileUser.stacks.reduce((acc, us) => {
    const cat = us.item.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(us.item);
    return acc;
  }, {});

  // 3) Figure out if the viewer “owns” this profile
  let isOwner = false;
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user: sessionUser },
      error,
    } = await supabase.auth.getUser();
    if (!error && sessionUser?.id === profileUser.id) {
      isOwner = true;
    }
  } catch {
    isOwner = false;
  }

  return (
    // ── Full-screen neon grid + scanlines background ──
    <div className="min-h-screen relative bg-black pixel-grid scanlines text-green-400 overflow-hidden">
      {/* Floating neon pixels */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-10 left-10 w-3 h-3 bg-green-400 retro-bounce"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute top-20 right-16 w-2 h-2 bg-cyan-400 retro-bounce"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute bottom-24 left-1/4 w-2 h-2 bg-green-400 retro-bounce"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-16 right-20 w-3 h-3 bg-cyan-400 retro-bounce"
          style={{ animationDelay: "1.5s" }}
        />
        {/* scanlines overlay comes from the .scanlines class */}
      </div>

      {/* ── Main content, above the background layers ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12 ">
        {/* ── LEFT COLUMN: Avatar, Name, Edit, Social ── */}
        <div className="md:w-1/3 flex flex-col items-center md:items-start space-y-6">
          <div className="w-32 h-32 rounded-full border-4 border-green-400 bg-gray-900" />
          <h1 className="text-4xl font-black pixel-text retro-flicker text-center md:text-left">
            {profileUser.name || profileUser.username}
          </h1>
          <p className="text-cyan-400 text-lg pixel-text !mt-2">
            @{profileUser.username}
          </p>

          {isOwner && (
            <Link
              href={`/u/${profileUser.username}/edit`}
              className="inline-block px-6 py-2 border-4 border-green-400 bg-green-400 text-black font-bold pixel-text transition hover:scale-105"
              style={{ borderRadius: 0 }}
            >
              [ EDIT_PROFILE.EXE ]
            </Link>
          )}

          {profileUser.socialLinks?.length > 0 && (
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {profileUser.socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener"
                  className="px-4 py-2 border-2 border-cyan-400 text-cyan-400 pixel-text transition hover:bg-cyan-400 hover:text-black"
                  style={{ borderRadius: 0 }}
                >
                  {link.platform || link.url}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN: Stacks grouped by category ── */}
        <div className="md:w-2/3 space-y-12">
          {Object.entries(groupedStacks).length > 0 ? (
            Object.entries(groupedStacks).map(([category, items]) => (
              <section key={category}>
                <h2 className="text-2xl font-bold mb-4 pixel-text text-green-400">
                  {category.toUpperCase()}
                </h2>
                <div className="bg-gray-900 border-4 border-green-400 p-4 rounded-lg retro-pulse">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col items-center p-4 border-2 border-black bg-black pixel-text transition hover:scale-105"
                      >
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            width={56}
                            height={56}
                            className="mb-2"
                          />
                        ) : (
                          <div className="w-14 h-14 mb-2 bg-gray-700" />
                        )}
                        {item.linkUrl ? (
                          <a
                            href={item.linkUrl}
                            target="_blank"
                            rel="noopener"
                            className="text-sm text-cyan-400 underline"
                          >
                            {item.title}
                          </a>
                        ) : (
                          <span className="text-sm text-white">
                            {item.title}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))
          ) : (
            <p className="text-center text-gray-500 pixel-text">
              {"// This user hasn’t added any stacks yet."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
