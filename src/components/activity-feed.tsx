"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { ActivityEvent } from "@/lib/types";

const EVENT_ICONS: Record<string, string> = {
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

const SEVERITY_COLORS: Record<string, string> = {
  info: "text-stone",
  warning: "text-status-yellow",
  error: "text-status-red",
};

function formatTimeAgo(timestamp: string): string {
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

function formatEvent(event: ActivityEvent): string {
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

interface ActivityFeedProps {
  initialEvents: ActivityEvent[];
}

export function ActivityFeed({ initialEvents }: ActivityFeedProps) {
  const [events, setEvents] = useState<ActivityEvent[]>(initialEvents);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("dashboard_activity")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "dashboard_activity" },
        (payload) => {
          setEvents((prev) => [payload.new as ActivityEvent, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="bg-ivory-warm border border-mist rounded-precision p-6">
      <h2 className="font-serif text-lg text-black mb-4">Recent Activity</h2>
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {events.length === 0 ? (
          <p className="text-stone text-sm">No activity yet. Events will appear here as the pipeline runs.</p>
        ) : (
          events.slice(0, 50).map((event) => (
            <div key={event.id} className="flex items-start gap-3 text-sm">
              <span className="text-stone font-mono text-xs w-16 shrink-0 pt-0.5">
                {formatTimeAgo(event.timestamp)}
              </span>
              <span className="font-mono text-xs text-stone w-6 shrink-0 pt-0.5">
                {EVENT_ICONS[event.event_type] || ".."}
              </span>
              <span className={SEVERITY_COLORS[event.severity] || "text-graphite"}>
                {formatEvent(event)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
