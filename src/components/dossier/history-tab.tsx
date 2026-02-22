import {
  ArrowRight,
  X,
  Plus,
  Star,
  RefreshCw,
  Heart,
  Rocket,
  Globe,
  TriangleAlert,
  Share2,
  Circle,
  GitBranch,
  Scale,
} from "lucide-react";
import type { DashboardDecision, DashboardPivot, ActivityEvent } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/empty-state";
import { formatTimeAgo } from "@/lib/format";

const EVENT_ICONS: Record<string, React.ElementType> = {
  idea_advanced: ArrowRight,
  idea_killed: X,
  idea_created: Plus,
  review_completed: Star,
  orchestrator_run: RefreshCw,
  health_check: Heart,
  mvp_deployed: Rocket,
  landing_page_deployed: Globe,
  circuit_breaker_change: TriangleAlert,
  social_post_created: Share2,
};

interface HistoryTabProps {
  decisions: DashboardDecision[];
  pivots: DashboardPivot[];
  events: ActivityEvent[];
}

interface TimelineItem {
  id: string;
  type: "decision" | "pivot" | "event";
  timestamp: string;
  content: React.ReactNode;
}

export function HistoryTab({ decisions, pivots, events }: HistoryTabProps) {
  const items: TimelineItem[] = [];

  // Add decisions
  for (const d of decisions) {
    items.push({
      id: `decision-${d.id}`,
      type: "decision",
      timestamp: d.created_at,
      content: (
        <div className="flex items-start gap-3">
          <Scale className="h-3.5 w-3.5 text-status-blue shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-200">{d.decision_type}</span>
              <Badge variant="secondary" className="text-[10px]">{d.made_by}</Badge>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{d.reasoning}</p>
          </div>
        </div>
      ),
    });
  }

  // Add pivots
  for (const p of pivots) {
    const outcomeColor =
      p.outcome === "success"
        ? "text-status-green"
        : p.outcome === "failure"
          ? "text-status-red"
          : "text-status-amber";

    items.push({
      id: `pivot-${p.id}`,
      type: "pivot",
      timestamp: p.created_at,
      content: (
        <div className="flex items-start gap-3">
          <GitBranch className="h-3.5 w-3.5 text-status-amber shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-200">
                Pivot #{p.pivot_number}: {p.pivot_type}
              </span>
              <span className={`font-mono text-[10px] ${outcomeColor}`}>
                {p.outcome}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">{p.new_direction}</p>
          </div>
        </div>
      ),
    });
  }

  // Add events
  for (const e of events) {
    const Icon = EVENT_ICONS[e.event_type] || Circle;
    items.push({
      id: `event-${e.id}`,
      type: "event",
      timestamp: e.timestamp,
      content: (
        <div className="flex items-start gap-3">
          <Icon className="h-3.5 w-3.5 text-zinc-500 shrink-0 mt-0.5" />
          <span className="text-sm text-zinc-400">
            {e.event_type.replace(/_/g, " ")}
            {e.idea_title && `: ${e.idea_title}`}
          </span>
        </div>
      ),
    });
  }

  // Sort by timestamp, newest first
  items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (items.length === 0) {
    return <EmptyState message="No history recorded for this idea." />;
  }

  const borderColors: Record<string, string> = {
    decision: "border-l-status-blue",
    pivot: "border-l-status-amber",
    event: "border-l-zinc-700",
  };

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.id}
            className={`px-3 py-2.5 rounded-sm border-l-2 ${borderColors[item.type]}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">{item.content}</div>
              <span className="text-zinc-600 font-mono text-[10px] shrink-0">
                {formatTimeAgo(item.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
