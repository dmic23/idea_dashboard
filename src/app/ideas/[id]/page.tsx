import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { IdeaDossier } from "@/components/idea-dossier";
import type {
  DashboardIdea,
  DashboardResearch,
  DashboardReview,
  DashboardExpertReview,
  DashboardCost,
  DashboardDecision,
  DashboardPivot,
  ActivityEvent,
} from "@/lib/types";

export const revalidate = 60;

interface IdeaPageProps {
  params: Promise<{ id: string }>;
}

export default async function IdeaPage({ params }: IdeaPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const [
    ideaRes,
    researchRes,
    reviewsRes,
    expertsRes,
    costsRes,
    decisionsRes,
    pivotsRes,
    eventsRes,
  ] = await Promise.all([
    supabase.from("dashboard_ideas").select("*").eq("id", id).single(),
    supabase
      .from("dashboard_research")
      .select("*")
      .eq("idea_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("dashboard_reviews")
      .select("*")
      .eq("idea_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("dashboard_expert_reviews")
      .select("*")
      .eq("idea_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("dashboard_costs")
      .select("*")
      .eq("idea_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("dashboard_decisions")
      .select("*")
      .eq("idea_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("dashboard_pivots")
      .select("*")
      .eq("idea_id", id)
      .order("pivot_number", { ascending: true }),
    supabase
      .from("dashboard_activity")
      .select("*")
      .eq("idea_id", id)
      .order("timestamp", { ascending: false })
      .limit(50),
  ]);

  if (!ideaRes.data) notFound();

  return (
    <IdeaDossier
      idea={ideaRes.data as DashboardIdea}
      research={(researchRes.data as DashboardResearch[]) || []}
      reviews={(reviewsRes.data as DashboardReview[]) || []}
      expertReviews={(expertsRes.data as DashboardExpertReview[]) || []}
      costs={(costsRes.data as DashboardCost[]) || []}
      decisions={(decisionsRes.data as DashboardDecision[]) || []}
      pivots={(pivotsRes.data as DashboardPivot[]) || []}
      events={(eventsRes.data as ActivityEvent[]) || []}
    />
  );
}
