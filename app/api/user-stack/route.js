import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerSupabase } from "@/utils/supabase/server";

export async function POST(request) {
  try {
    const { itemId, position } = await request.json();
    if (!itemId || typeof position !== "number") {
      return NextResponse.json(
        { error: "itemId and position are required" },
        { status: 400 }
      );
    }

    // 1) Get the logged-in user from Supabase session
    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser();

    if (getUserError || !user) {
      return NextResponse.json(
        { error: "User must be logged in" },
        { status: 401 }
      );
    }
    const userId = user.id;

    // 2) Create UserStack (or upsert if it already exists)
    const userStack = await prisma.userStack.upsert({
      where: {
        userId_itemId: { userId, itemId },
      },
      update: {
        position,
      },
      create: {
        userId,
        itemId,
        position,
      },
    });

    return NextResponse.json({ success: true, userStack });
  } catch (error) {
    console.error("Error in POST /api/user-stack:", error);
    return NextResponse.json(
      { error: "Could not add item to user stack" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { itemId, position } = await request.json();
    if (!itemId || typeof position !== "number") {
      return NextResponse.json(
        { error: "itemId and position are required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser();

    if (getUserError || !user) {
      return NextResponse.json(
        { error: "User must be logged in" },
        { status: 401 }
      );
    }
    const userId = user.id;

    // Update only the position of the existing UserStack
    const updated = await prisma.userStack.update({
      where: {
        userId_itemId: { userId, itemId },
      },
      data: {
        position,
      },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("Error in PATCH /api/user-stack:", error);
    return NextResponse.json(
      { error: "Could not update user stack" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { itemId } = Object.fromEntries(new URL(request.url).searchParams);
    if (!itemId) {
      return NextResponse.json(
        { error: "itemId query parameter is required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabase();
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser();

    if (getUserError || !user) {
      return NextResponse.json(
        { error: "User must be logged in" },
        { status: 401 }
      );
    }
    const userId = user.id;

    await prisma.userStack.delete({
      where: {
        userId_itemId: { userId, itemId },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/user-stack:", error);
    return NextResponse.json(
      { error: "Could not delete user stack" },
      { status: 500 }
    );
  }
}
