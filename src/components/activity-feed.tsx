"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { ActivityEvent } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SEVERITY_COLORS, SEVERITY_BORDER_COLORS, formatTimeAgo, formatEvent } from "@/lib/format";
import {
  ArrowRight,
  X,
  Plus,
  Star,
  RefreshCw,
  Heart,
  Rocket,
  Globe,
  AlertTriangle,
  Share2,
  Circle,
} from "lucide-react";

const EVENT_ICONS: Record<string, React.ElementType> = {
  idea_advanced: ArrowRight,
  idea_killed: X,
  idea_created: Plus,
  review_completed: Star,
  orchestrator_run: RefreshCw,
  health_check: Heart,
  mvp_deployed: Rocket,
  landing_page_deployed: Globe,
  circuit_breaker_change: AlertTriangle,
  social_post_created: Share2,
};

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
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium text-zinc-50">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-1">
            {events.length === 0 ? (
              <p className="text-zinc-500 text-sm py-4 text-center">
                No activity yet. Events will appear here as the pipeline runs.
              </p>
            ) : (
              events.slice(0, 50).map((event) => {
                const Icon = EVENT_ICONS[event.event_type] || Circle;
                const borderColor = SEVERITY_BORDER_COLORS[event.severity] || "border-l-zinc-800";
                return (
                  <div
                    key={event.id}
                    className={`flex items-start gap-3 text-sm px-3 py-2 rounded-sm border-l-2 ${borderColor} motion-preset-fade motion-duration-300`}
                  >
                    <Icon className="h-3.5 w-3.5 text-zinc-500 shrink-0 mt-0.5" />
                    <span className={`flex-1 ${SEVERITY_COLORS[event.severity] || "text-zinc-300"}`}>
                      {formatEvent(event)}
                    </span>
                    <span className="text-zinc-600 font-mono text-xs shrink-0">
                      {formatTimeAgo(event.timestamp)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
