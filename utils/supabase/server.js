// src/utils/supabase/server.js

import { createServerComponentClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createServerSupabase() {
  return createServerComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    cookies, // Next.js built-in cookies helper
  });
}
