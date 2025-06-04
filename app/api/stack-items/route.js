export const dynamic = "force-dynamic";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

// GET /api/stack-items → list current user items
export async function GET() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user)
    return NextResponse.json({ error: "Not auth" }, { status: 401 });

  const { data, error } = await supabase
    .from("stack_items")
    .select("*")
    .eq("user_id", user.id)
    .order("position_index");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/stack-items → create
export async function POST(request) {
  const body = await request.json();
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not auth" }, { status: 401 });
  const { error, data } = await supabase
    .from("stack_items")
    .insert({ ...body, user_id: user.id })
    .select()
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
