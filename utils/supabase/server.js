import { createServerClient } from "@supabase/ssr";
import { cookies as nextCookies } from "next/headers";

export async function createServerSupabase() {
  // Read environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase URL and Service Role Key are required. " +
        "Check your .env.local: NEXT_PUBLIC_SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  // Get the Next.js cookie store (this is a CookieStore object, not raw cookies)
  const cookieStore = await nextCookies();

  // createServerClient now expects { cookies: { getAll(), setAll() } }
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // If setAll is called from a Server Component, it might throw,
          // but we can safely ignore. Supabase session refresh in middleware can cover that.
        }
      },
    },
  });
}
