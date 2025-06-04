export const dynamic = "force-dynamic";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json(); // expects { session_id, question_pairs, chosen }
  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from("quiz_responses")
    .upsert(body, { onConflict: "session_id" })
    .select()
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function GET(request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId)
    return NextResponse.json({ error: "session_id req" }, { status: 400 });
  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from("quiz_responses")
    .select("*")
    .eq("session_id", sessionId)
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}
