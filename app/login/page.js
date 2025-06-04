"use client";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  async function signIn() {
    const {
      data: { url },
      error,
    } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    if (error) alert(error.message);
    else router.push(url); // redirect to Google
  }
  return (
    <main className="flex min-h-screen items-center justify-center">
      <button
        className="px-4 py-2 rounded bg-blue-600 text-white"
        onClick={signIn}
      >
        Sign in with Google
      </button>
    </main>
  );
}
