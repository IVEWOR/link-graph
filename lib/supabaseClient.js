// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// IMPORTANT: Replace with your actual Supabase URL and Anon Key
// You should store these in environment variables (.env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase URL or Anon Key is missing. Please check your .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
