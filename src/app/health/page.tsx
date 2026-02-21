import { createServerSupabaseClient } from "@/lib/supabase-server";
import { HealthOverview } from "@/components/health-overview";
import type { HealthSnapshot, ActivityEvent } from "@/lib/types";

export const revalidate = 60;

export default async function HealthPage() {
  const supabase = await createServerSupabaseClient();

  const { data: latest } = await supabase
    .from("dashboard_health")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(1)
    .single();

  const { data: history } = await supabase
    .from("dashboard_health")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(48);

  const { data: healthEvents } = await supabase
    .from("dashboard_activity")
    .select("*")
    .in("event_type", ["health_check", "circuit_breaker_change", "orchestrator_run"])
    .order("timestamp", { ascending: false })
    .limit(20);

  return (
    <div>
      <h1 className="font-serif text-3xl text-black tracking-tight mb-6">
        System Health
      </h1>
      <HealthOverview
        initialSnapshot={latest as HealthSnapshot | null}
        history={((history as HealthSnapshot[]) || []).reverse()}
        initialEvents={(healthEvents as ActivityEvent[]) || []}
      />
    </div>
  );
}
