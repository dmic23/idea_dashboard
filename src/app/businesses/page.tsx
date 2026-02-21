import { createServerSupabaseClient } from "@/lib/supabase-server";
import { BusinessGrid } from "@/components/business-grid";
import type { DashboardBusiness } from "@/lib/types";

export const revalidate = 60;

export default async function BusinessesPage() {
  const supabase = await createServerSupabaseClient();

  const { data: businesses } = await supabase
    .from("dashboard_businesses")
    .select("*")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-3xl text-black tracking-tight mb-6">
        Businesses
      </h1>
      <BusinessGrid businesses={(businesses as DashboardBusiness[]) || []} />
    </div>
  );
}
