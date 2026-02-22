import { createServerSupabaseClient } from "@/lib/supabase-server";
import { PatternList } from "@/components/pattern-list";
import type { DashboardPattern } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PatternsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: patterns } = await supabase
    .from("dashboard_patterns")
    .select("*")
    .order("confidence", { ascending: false });

  return (
    <div className="motion-preset-fade motion-duration-300">
      <h1 className="text-2xl font-semibold text-zinc-50 tracking-tight mb-6">
        Learned Patterns
      </h1>
      <PatternList patterns={(patterns as DashboardPattern[]) || []} />
    </div>
  );
}
