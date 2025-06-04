import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/utils/supabase/server";
import ProfileEdit from "@/components/ProfileEdit";

export default async function EditPage({ params }) {
  const { username } = await params;

  // 1) Initialize Supabase server client
  const supabase = await createServerSupabase();

  // 2) getUser()
  const {
    data: { user: sessionUser },
    error: getUserError,
  } = await supabase.auth.getUser();

  // 3) If user not logged in → redirect to homepage
  if (getUserError || !sessionUser) {
    redirect("/");
  }

  // 4) Fetch the profile user by username
  const profileUser = await prisma.user.findUnique({
    where: { username },
  });

  // 5) If no such user OR logged‐in user doesn’t match → redirect to view‐only
  if (!profileUser || sessionUser.id !== profileUser.id) {
    redirect(`/u/${username}`);
  }

  // 6) Fetch the user’s stacks (join UserStack → Item)
  const userStacks = await prisma.userStack.findMany({
    where: { userId: profileUser.id },
    include: {
      item: true, // so we get item.title, item.imageUrl, item.category
    },
    orderBy: { position: "asc" },
  });

  // 7) Fetch all items for the sidebar
  const allItems = await prisma.item.findMany({
    orderBy: { title: "asc" },
  });

  // 8) Pass data into the client component
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Edit Profile: {profileUser.username}
      </h1>
      <ProfileEdit userStacks={userStacks} allItems={allItems} />
    </div>
  );
}
