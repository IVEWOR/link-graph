export const dynamic = "force-dynamic";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createSupabaseServer();
  const { data, error } = await supabase.from("recommended_stacks").select("*");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
