import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { StudioProductDetail } from "@/components/studio-product-detail";
import type {
  DashboardStudioProduct,
  DashboardStudioActivity,
  DashboardStudioLearning,
} from "@/lib/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function StudioProductPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const [productRes, activityRes, learningsRes] = await Promise.all([
    supabase
      .from("dashboard_studio_products")
      .select("*")
      .eq("id", id)
      .single(),
    supabase
      .from("dashboard_studio_activity")
      .select("*")
      .eq("product_id", id)
      .order("event_at", { ascending: false }),
    supabase
      .from("dashboard_studio_learnings")
      .select("*")
      .eq("product_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!productRes.data) notFound();

  return (
    <StudioProductDetail
      product={productRes.data as DashboardStudioProduct}
      activity={(activityRes.data as DashboardStudioActivity[]) || []}
      learnings={(learningsRes.data as DashboardStudioLearning[]) || []}
    />
  );
}
