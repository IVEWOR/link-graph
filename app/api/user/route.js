import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  // Expect a JSON body: { id, email, name }
  const { id, email, name } = await request.json();

  // Derive a simple username from the email prefix
  const prefix = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
  let username = prefix;

  // If that username already exists, append a random 4-digit suffix
  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) {
    username = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
  }

  // Upsert the user record
  await prisma.user.upsert({
    where: { id },
    update: { email, name },
    create: { id, email, name, username },
  });

  return NextResponse.json({ success: true });
}
