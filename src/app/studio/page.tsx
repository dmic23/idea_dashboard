import { createServerSupabaseClient } from "@/lib/supabase-server";
import { StudioOverview } from "@/components/studio-overview";
import type { DashboardStudioProduct } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const supabase = await createServerSupabaseClient();

  const { data: products } = await supabase
    .from("dashboard_studio_products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="motion-preset-fade motion-duration-300">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-zinc-50 tracking-tight">
          Startup Studio
        </h1>
        <span className="text-xs font-mono text-zinc-500">
          {(products || []).filter((p: DashboardStudioProduct) => p.phase !== "KILLED").length} active
        </span>
      </div>
      <StudioOverview products={(products as DashboardStudioProduct[]) || []} />
    </div>
  );
}
