import type { ActivityEvent } from "@/lib/types";

export const EVENT_ICONS: Record<string, string> = {
  idea_advanced: ">>",
  idea_killed: "xx",
  idea_created: "++",
  review_completed: "**",
  orchestrator_run: "~~",
  health_check: "ok",
  mvp_deployed: "->",
  landing_page_deployed: "->",
  circuit_breaker_change: "!!",
  social_post_created: ">>",
};

export const SEVERITY_COLORS: Record<string, string> = {
  info: "text-stone",
  warning: "text-status-yellow",
  error: "text-status-red",
};

export function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export function formatEvent(event: ActivityEvent): string {
  const details = event.details as Record<string, unknown>;
  switch (event.event_type) {
    case "idea_advanced":
      return `${event.idea_title} advanced ${details.old_stage} → ${details.new_stage}`;
    case "idea_killed":
      return `${event.idea_title} killed at ${details.stage}`;
    case "idea_created":
      return `New idea: ${event.idea_title}`;
    case "orchestrator_run":
      return `Orchestrator: ${details.advanced ?? 0} advanced, ${details.killed ?? 0} killed, ${details.scanned ?? 0} scanned`;
    case "health_check":
      return `Health: DB=${details.database}, Redis=${details.redis}`;
    case "review_completed":
      return `${event.idea_title} reviewed: ${details.decision} (${details.score})`;
    case "circuit_breaker_change":
      return `Circuit breaker ${details.service}: ${details.old_state} → ${details.new_state}`;
    default:
      return `${event.event_type}: ${event.idea_title || JSON.stringify(details).slice(0, 80)}`;
  }
}
