"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { ActivityEvent } from "@/lib/types";
import { EVENT_ICONS, SEVERITY_COLORS, formatTimeAgo, formatEvent } from "@/lib/format";

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
