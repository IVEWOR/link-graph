import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";

export default async function DashboardLayout({ children }) {
  const supabase = createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/login");
  return <section className="p-4 max-w-4xl mx-auto">{children}</section>;
}
