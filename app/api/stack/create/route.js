// app/api/stack/create/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// A simple function to categorize items based on keywords
const categorizeItem = (itemName) => {
  const lowerItem = itemName.toLowerCase();
  if (
    ["vscode", "vim", "neovim", "sublime", "atom"].some((k) =>
      lowerItem.includes(k)
    )
  )
    return "Editor";
  if (
    ["react", "vue", "angular", "svelte", "next.js"].some((k) =>
      lowerItem.includes(k)
    )
  )
    return "Framework";
  if (
    ["javascript", "python", "go", "rust", "typescript"].some((k) =>
      lowerItem.includes(k)
    )
  )
    return "Language";
  if (
    ["postgres", "mongo", "mysql", "redis"].some((k) => lowerItem.includes(k))
  )
    return "Database";
  if (
    ["aws", "gcp", "azure", "vercel", "netlify"].some((k) =>
      lowerItem.includes(k)
    )
  )
    return "Hosting";
  return "Tool"; // Default category
};

export async function POST(request) {
  try {
    const { answers, userId } = await request.json();

    if (!answers || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing answers or user ID" },
        { status: 400 }
      );
    }

    // 1. Find or create the Items from the quiz answers
    const itemUpserts = answers.map((answer) => {
      const itemName = answer.answer;
      return prisma.item.upsert({
        where: { title: itemName },
        update: {},
        create: {
          title: itemName,
          category: categorizeItem(itemName),
          // You can add default image/link URLs here
          imageUrl: `https://logo.clearbit.com/${itemName
            .toLowerCase()
            .replace(/\s/g, "")}.com`,
          linkUrl: "#",
        },
      });
    });

    const createdItems = await prisma.$transaction(itemUpserts);

    // 2. Prepare the data for the UserStack join table
    const userStackData = createdItems.map((item, index) => ({
      userId: userId,
      itemId: item.id,
      position: index,
    }));

    // 3. Delete any existing stack for this user to prevent duplicates, then create the new one
    await prisma.userStack.deleteMany({ where: { userId: userId } });
    await prisma.userStack.createMany({
      data: userStackData,
    });

    // 4. Get the user's username for the redirect
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, username: user.username });
  } catch (error) {
    console.error("Error creating stack:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
