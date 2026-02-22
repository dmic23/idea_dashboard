"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StageBadge } from "@/components/stage-badge";
import { TabNav } from "@/components/tab-nav";
import { OverviewTab } from "@/components/dossier/overview-tab";
import { ResearchTab } from "@/components/dossier/research-tab";
import { ExpertsTab } from "@/components/dossier/experts-tab";
import { FinancialsTab } from "@/components/dossier/financials-tab";
import { HistoryTab } from "@/components/dossier/history-tab";

interface IdeaDossierProps {
  idea: DashboardIdea;
  research: DashboardResearch[];
  reviews: DashboardReview[];
  expertReviews: DashboardExpertReview[];
  costs: DashboardCost[];
  decisions: DashboardDecision[];
  pivots: DashboardPivot[];
  events: ActivityEvent[];
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "research", label: "Research" },
  { id: "experts", label: "Experts" },
  { id: "financials", label: "Financials" },
  { id: "history", label: "History" },
];

export function IdeaDossier({
  idea,
  research,
  reviews,
  expertReviews,
  costs,
  decisions,
  pivots,
  events,
}: IdeaDossierProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const tabsWithCounts = TABS.map((tab) => {
    switch (tab.id) {
      case "research":
        return { ...tab, count: research.length };
      case "experts":
        return { ...tab, count: reviews.length };
      case "financials":
        return { ...tab, count: costs.length };
      case "history":
        return { ...tab, count: decisions.length + pivots.length + events.length };
      default:
        return tab;
    }
  });

  return (
    <div className="space-y-4 motion-preset-fade motion-duration-300">
      {/* Back link */}
      <Link
        href="/ideas"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Ideas
      </Link>

      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-xl font-semibold text-zinc-50 tracking-tight">
                {idea.title}
              </h1>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
                {idea.description}
              </p>
              {idea.domain_tags.length > 0 && (
                <div className="flex gap-2 pt-1">
                  {idea.domain_tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <StageBadge stage={idea.stage} />
              <span className="text-xs text-zinc-500">
                {idea.status === "active" ? `${idea.days_in_stage}d in stage` : idea.status}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <TabNav tabs={tabsWithCounts} />

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && <OverviewTab idea={idea} />}
        {activeTab === "research" && <ResearchTab research={research} />}
        {activeTab === "experts" && (
          <ExpertsTab reviews={reviews} expertReviews={expertReviews} />
        )}
        {activeTab === "financials" && (
          <FinancialsTab idea={idea} costs={costs} research={research} />
        )}
        {activeTab === "history" && (
          <HistoryTab decisions={decisions} pivots={pivots} events={events} />
        )}
      </div>

      {/* Metadata footer */}
      <div className="flex justify-between text-xs text-zinc-600 pt-2">
        <span>
          Source: {idea.source}
          {idea.source_url && (
            <>
              {" · "}
              <a
                href={idea.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-500/50 hover:text-emerald-500"
              >
                origin
              </a>
            </>
          )}
          {" · Created "}
          {new Date(idea.created_at).toLocaleDateString()}
        </span>
        <span>Last synced: {new Date(idea.synced_at).toLocaleString()}</span>
      </div>
    </div>
  );
}
