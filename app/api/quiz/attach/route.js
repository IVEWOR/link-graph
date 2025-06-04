// src/app/api/quiz/attach/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerSupabase } from "@/utils/supabase/server";

export async function POST(request) {
  try {
    const { sessionId } = await request.json();
    console.log("🔗 attach route hit. sessionId:", sessionId);

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId in request body" },
        { status: 400 }
      );
    }

    // 1) Initialize Supabase server client (async)
    const supabase = await createServerSupabase();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log("🔍 attach: Supabase session:", session);

    if (!session?.user) {
      return NextResponse.json(
        { error: "User must be logged in to attach quiz" },
        { status: 401 }
      );
    }
    const userId = session.user.id;

    // 2) Find the QuizResponse that matches sessionId and userId = null
    const quizResp = await prisma.quizResponse.findFirst({
      where: { sessionId, userId: null },
    });
    console.log("🔎 attach: found quizResp:", quizResp);

    if (!quizResp) {
      return NextResponse.json(
        { error: "No unattached quiz found for this sessionId" },
        { status: 404 }
      );
    }

    // 3) Link that QuizResponse to the user
    await prisma.quizResponse.update({
      where: { id: quizResp.id },
      data: { userId },
    });
    console.log("✅ attach: quizResponse updated to userId", userId);

    // 4) For each chosen tech, findOrCreate in Item, then create a UserStack
    const chosenArray = Array.isArray(quizResp.chosen)
      ? quizResp.chosen
      : JSON.parse(quizResp.chosen);

    for (const techName of chosenArray) {
      // 4A) findOrCreate an Item row
      const item = await prisma.item.upsert({
        where: { title: techName }, // uses unique constraint on title
        update: {}, // do not change anything if it exists
        create: {
          title: techName,
          imageUrl: "", // or a generic placeholder
          linkUrl: null,
          category: "Other",
        },
      });
      console.log("🛠 attach: upserted Item:", item);

      // 4B) Create the join row in UserStack (if not already exists)
      await prisma.userStack.upsert({
        where: {
          userId_itemId: {
            userId,
            itemId: item.id,
          },
        },
        update: {
          // you could update position or updatedAt if desired
        },
        create: {
          userId,
          itemId: item.id,
          position: 0, // default ordering; user can reorder later
        },
      });
      console.log(
        `✅ attach: UserStack created for user ${userId} and item ${item.id}`
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in /api/quiz/attach:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
