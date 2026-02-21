import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { IdeaDetail } from "@/components/idea-detail";
import type { DashboardIdea, ActivityEvent } from "@/lib/types";

export const revalidate = 60;

interface IdeaPageProps {
  params: Promise<{ id: string }>;
}

export default async function IdeaPage({ params }: IdeaPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: idea } = await supabase
    .from("dashboard_ideas")
    .select("*")
    .eq("id", id)
    .single();

  if (!idea) notFound();

  const { data: events } = await supabase
    .from("dashboard_activity")
    .select("*")
    .eq("idea_id", id)
    .order("timestamp", { ascending: false })
    .limit(20);

  return (
    <IdeaDetail
      idea={idea as DashboardIdea}
      events={(events as ActivityEvent[]) || []}
    />
  );
}
