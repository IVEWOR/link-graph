export const dynamic = "force-dynamic";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const body = await request.json();
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not auth" }, { status: 401 });

  const { data, error } = await supabase
    .from("stack_items")
    .update(body)
    .eq("id", params.id)
    .eq("user_id", user.id)
    .select()
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_, { params }) {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not auth" }, { status: 401 });
  const { error } = await supabase
    .from("stack_items")
    .delete()
    .eq("id", params.id)
    .eq("user_id", user.id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
