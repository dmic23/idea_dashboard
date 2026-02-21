import { createServerSupabaseClient } from "@/lib/supabase-server";
import { PipelineFunnel } from "@/components/pipeline-funnel";
import { ActivityFeed } from "@/components/activity-feed";
import type { ActivityEvent, DashboardIdea } from "@/lib/types";

export const revalidate = 60; // ISR: revalidate every 60s

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();

  const { data: ideas } = await supabase
    .from("dashboard_ideas")
    .select("*")
    .order("updated_at", { ascending: false });

  const { data: events } = await supabase
    .from("dashboard_activity")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-black tracking-tight mb-6">
          Pipeline
        </h1>
        <PipelineFunnel ideas={(ideas as DashboardIdea[]) || []} />
      </div>

      <ActivityFeed initialEvents={(events as ActivityEvent[]) || []} />

      <p className="text-xs text-stone">
        Last synced:{" "}
        {ideas?.[0]?.synced_at
          ? new Date(ideas[0].synced_at).toLocaleString()
          : "never"}
      </p>
    </div>
  );
}
