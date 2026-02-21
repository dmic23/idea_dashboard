import { createServerSupabaseClient } from "@/lib/supabase-server";
import { IdeasTable } from "@/components/ideas-table";
import type { DashboardIdea } from "@/lib/types";

export const revalidate = 60;

export default async function IdeasPage() {
  const supabase = await createServerSupabaseClient();

  const { data: ideas } = await supabase
    .from("dashboard_ideas")
    .select("*")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-3xl text-black tracking-tight mb-6">
        Ideas
      </h1>
      <IdeasTable ideas={(ideas as DashboardIdea[]) || []} />
    </div>
  );
}
