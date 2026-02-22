import { createServerSupabaseClient } from "@/lib/supabase-server";
import { BusinessGrid } from "@/components/business-grid";
import type { DashboardBusiness } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BusinessesPage() {
  const supabase = await createServerSupabaseClient();

  const { data: businesses } = await supabase
    .from("dashboard_businesses")
    .select("*")
    .order("launched_at", { ascending: false });

  return (
    <div className="motion-preset-fade motion-duration-300">
      <h1 className="text-2xl font-semibold text-zinc-50 tracking-tight mb-6">
        Businesses
      </h1>
      <BusinessGrid businesses={(businesses as DashboardBusiness[]) || []} />
    </div>
  );
}
