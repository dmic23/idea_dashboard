import { createServerSupabaseClient } from "@/lib/supabase-server";
import { StudioLearnings } from "@/components/studio-learnings";
import type { DashboardStudioLearning } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function StudioLearningsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: learnings } = await supabase
    .from("dashboard_studio_learnings")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="motion-preset-fade motion-duration-300">
      <h1 className="text-2xl font-semibold text-zinc-50 tracking-tight mb-6">
        Studio Learnings
      </h1>
      <StudioLearnings learnings={(learnings as DashboardStudioLearning[]) || []} />
    </div>
  );
}
