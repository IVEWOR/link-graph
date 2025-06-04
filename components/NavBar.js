"use client";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function NavBar({ session }) {
  return (
    <header className="border-b bg-white py-3 px-4 flex justify-between">
      <Link href="/">Dev Stack Share</Link>
      {session ? (
        <button onClick={() => supabase.auth.signOut()}>Logout</button>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </header>
  );
}
