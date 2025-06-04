// src/app/api/item/route.js

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerSupabase } from "@/utils/supabase/server";

export async function POST(request) {
  try {
    // Expect JSON: { title, imageUrl, linkUrl, category }
    const { title, imageUrl, linkUrl, category } = await request.json();

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required and must be a string" },
        { status: 400 }
      );
    }

    // 1) Ensure the user is logged in
    const supabase = await createServerSupabase();
    const {
      data: { user: sessionUser },
      error: getUserError,
    } = await supabase.auth.getUser();

    if (getUserError || !sessionUser) {
      return NextResponse.json(
        { error: "User must be logged in to create an item" },
        { status: 401 }
      );
    }

    // 2) Upsert the item using the provided details
    const newItem = await prisma.item.upsert({
      where: { title },
      update: {
        imageUrl: imageUrl || "",
        linkUrl: linkUrl || null,
        category: category || "Other",
      },
      create: {
        title,
        imageUrl: imageUrl || "",
        linkUrl: linkUrl || null,
        category: category || "Other",
      },
    });

    return NextResponse.json({ item: newItem });
  } catch (error) {
    console.error("Error in POST /api/item:", error);
    return NextResponse.json(
      { error: "Could not create or update item" },
      { status: 500 }
    );
  }
}
