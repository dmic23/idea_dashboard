import { createServerSupabaseClient } from "@/lib/supabase-server";
import { PortfolioAnalytics } from "@/components/portfolio-analytics";
import type {
  DashboardIdea,
  DashboardReview,
  DashboardCost,
  DashboardBusiness,
  DashboardPattern,
} from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const supabase = await createServerSupabaseClient();

  const [ideasRes, reviewsRes, costsRes, businessesRes, patternsRes] =
    await Promise.all([
      supabase.from("dashboard_ideas").select("*"),
      supabase.from("dashboard_reviews").select("*"),
      supabase.from("dashboard_costs").select("*"),
      supabase.from("dashboard_businesses").select("*"),
      supabase.from("dashboard_patterns").select("*"),
    ]);

  return (
    <PortfolioAnalytics
      ideas={(ideasRes.data as DashboardIdea[]) || []}
      reviews={(reviewsRes.data as DashboardReview[]) || []}
      costs={(costsRes.data as DashboardCost[]) || []}
      businesses={(businessesRes.data as DashboardBusiness[]) || []}
      patterns={(patternsRes.data as DashboardPattern[]) || []}
    />
  );
}
