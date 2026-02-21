import { createServerSupabaseClient } from "@/lib/supabase-server";
import { PatternList } from "@/components/pattern-list";
import type { DashboardPattern } from "@/lib/types";

export const revalidate = 60;

export default async function PatternsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: patterns } = await supabase
    .from("dashboard_patterns")
    .select("*")
    .order("confidence", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-3xl text-black tracking-tight mb-6">
        Learned Patterns
      </h1>
      <PatternList patterns={(patterns as DashboardPattern[]) || []} />
    </div>
  );
}
