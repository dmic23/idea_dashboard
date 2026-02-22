import { createServerSupabaseClient } from "@/lib/supabase-server";
import { IdeasTable } from "@/components/ideas-table";
import type { DashboardIdea } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function IdeasPage() {
  const supabase = await createServerSupabaseClient();

  const { data: ideas } = await supabase
    .from("dashboard_ideas")
    .select("*")
    .order("updated_at", { ascending: false });

  return (
    <div className="motion-preset-fade motion-duration-300">
      <h1 className="text-2xl font-semibold text-zinc-50 tracking-tight mb-6">
        Ideas
      </h1>
      <IdeasTable ideas={(ideas as DashboardIdea[]) || []} />
    </div>
  );
}
