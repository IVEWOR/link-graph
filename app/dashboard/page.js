import { createSupabaseServer } from "@/lib/supabaseServer";
import StackItemCard from "@/components/StackItemCard";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: stacks } = await supabase
    .from("stack_items")
    .select("*")
    .eq("user_id", user.id)
    .order("position_index");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Stack</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stacks?.map((item) => (
          <StackItemCard key={item.id} item={item} />
        ))}
        <Link
          href="/dashboard/add"
          className="flex items-center justify-center border-2 border-dashed rounded p-4 text-slate-400 hover:border-blue-500 hover:text-blue-500"
        >
          + Add
        </Link>
      </div>
    </div>
  );
}
