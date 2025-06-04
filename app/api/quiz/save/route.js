// src/app/api/quiz/save/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { sessionId, questionPairs, chosen } = await request.json();

    await prisma.quizResponse.create({
      data: { sessionId, questionPairs, chosen },
    });

    // Build mockStacks from the central Item table
    const mockStacks = [];

    for (const techName of chosen) {
      const item = await prisma.item.findFirst({
        where: { title: techName },
      });

      if (item) {
        mockStacks.push({
          title: item.title,
          imageUrl: item.imageUrl,
          category: item.category,
        });
      } else {
        mockStacks.push({
          title: techName,
          imageUrl: "",
          category: "Other",
        });
      }
    }

    return NextResponse.json({ mockStacks });
  } catch (error) {
    console.error("Error in /api/quiz/save:", error);
    return new Response(
      JSON.stringify({ error: "Could not save quiz response" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
