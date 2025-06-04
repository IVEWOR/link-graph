import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
    // Ensure profile row exists
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("users").upsert({
        id: user.id,
        email: user.email,
        name: user.user_metadata.full_name || user.user_metadata.name,
      });
    }
  }
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
