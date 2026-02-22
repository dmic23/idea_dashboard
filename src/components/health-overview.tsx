"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { HealthSnapshot, ActivityEvent } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatTimeAgo, SEVERITY_COLORS, SEVERITY_BORDER_COLORS } from "@/lib/format";
import {
  Heart,
  AlertTriangle,
  RefreshCw,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HealthOverviewProps {
  initialSnapshot: HealthSnapshot | null;
  history: HealthSnapshot[];
  initialEvents: ActivityEvent[];
}

const STATUS_DOT: Record<string, string> = {
  healthy: "bg-status-green animate-pulse-dot",
  degraded: "bg-status-amber animate-pulse-dot",
  down: "bg-status-red animate-pulse-dot",
  unknown: "bg-zinc-700",
};

const EVENT_ICONS: Record<string, React.ElementType> = {
  health_check: Heart,
  circuit_breaker_change: AlertTriangle,
  orchestrator_run: RefreshCw,
};

function statusLabel(val: string | undefined): string {
  if (!val) return "Unknown";
  return val.charAt(0).toUpperCase() + val.slice(1);
}

export function HealthOverview({
  initialSnapshot,
  history,
  initialEvents,
}: HealthOverviewProps) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [events, setEvents] = useState(initialEvents);
  const supabase = createClient();

  useEffect(() => {
    const healthChannel = supabase
      .channel("dashboard_health_rt")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "dashboard_health" },
        (payload) => {
          setSnapshot(payload.new as HealthSnapshot);
        }
      )
      .subscribe();

    const activityChannel = supabase
      .channel("dashboard_health_activity")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "dashboard_activity" },
        (payload) => {
          const event = payload.new as ActivityEvent;
          if (
            ["health_check", "circuit_breaker_change", "orchestrator_run"].includes(
              event.event_type
            )
          ) {
            setEvents((prev) => [event, ...prev].slice(0, 20));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(healthChannel);
      supabase.removeChannel(activityChannel);
    };
  }, [supabase]);

  const chartData = history.map((h) => ({
    time: new Date(h.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    processed: h.orchestrator_ideas_processed,
  }));

  const circuitBreakers = snapshot?.circuit_breakers
    ? Object.entries(snapshot.circuit_breakers)
    : [];

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard label="Database" status={snapshot?.database} />
        <StatusCard label="Redis" status={snapshot?.redis} />
        <StatusCard
          label="Orchestrator"
          status={snapshot?.orchestrator_last_run ? "healthy" : "unknown"}
          detail={
            snapshot?.orchestrator_last_run
              ? `Last run: ${formatTimeAgo(snapshot.orchestrator_last_run)}`
              : "No runs recorded"
          }
        />
      </div>

      {/* Ideas Processed Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-zinc-50">
            Ideas Processed (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <p className="text-zinc-500 text-sm">No data available yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#27272A" strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "#27272A" }}
                />
                <YAxis
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "#27272A" }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181B",
                    border: "1px solid #27272A",
                    borderRadius: "6px",
                    fontSize: 12,
                    color: "#D4D4D8",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="processed"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Circuit Breakers */}
      {circuitBreakers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium text-zinc-50">
              Circuit Breakers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {circuitBreakers.map(([service, state]) => (
                <div
                  key={service}
                  className="flex items-center gap-2 text-sm"
                >
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      state === "CLOSED"
                        ? "bg-status-green"
                        : state === "HALF_OPEN"
                          ? "bg-status-amber"
                          : "bg-status-red"
                    )}
                  />
                  <span className="text-zinc-300">{service}</span>
                  <span className="text-zinc-500 font-mono text-xs ml-auto">
                    {state}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Health Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-zinc-50">Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-zinc-500 text-sm">No health events recorded.</p>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-1">
                {events.map((event) => {
                  const Icon = EVENT_ICONS[event.event_type] || Circle;
                  const borderColor = SEVERITY_BORDER_COLORS[event.severity] || "border-l-zinc-800";
                  return (
                    <div
                      key={event.id}
                      className={`flex items-start gap-3 text-sm px-3 py-2 rounded-sm border-l-2 ${borderColor}`}
                    >
                      <Icon className="h-3.5 w-3.5 text-zinc-500 shrink-0 mt-0.5" />
                      <span className={`flex-1 ${SEVERITY_COLORS[event.severity] || "text-zinc-300"}`}>
                        {formatEventDetail(event)}
                      </span>
                      <span className="text-zinc-600 font-mono text-xs shrink-0">
                        {formatTimeAgo(event.timestamp)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Last Updated */}
      {snapshot && (
        <p className="text-xs text-zinc-600">
          Last health check: {new Date(snapshot.timestamp).toLocaleString()}
        </p>
      )}
    </div>
  );
}

function StatusCard({
  label,
  status,
  detail,
}: {
  label: string;
  status: string | undefined;
  detail?: string;
}) {
  const dotColor = STATUS_DOT[status || "unknown"] || STATUS_DOT.unknown;
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn("w-2.5 h-2.5 rounded-full", dotColor)} />
          <span className="text-xs text-zinc-500">{label}</span>
        </div>
        <span className="font-mono text-lg text-zinc-50">
          {statusLabel(status)}
        </span>
        {detail && <p className="text-xs text-zinc-500 mt-1">{detail}</p>}
      </CardContent>
    </Card>
  );
}

function formatEventDetail(event: ActivityEvent): string {
  const details = event.details as Record<string, unknown>;
  switch (event.event_type) {
    case "health_check":
      return `Health: DB=${details.database}, Redis=${details.redis}`;
    case "circuit_breaker_change":
      return `${details.service}: ${details.old_state} → ${details.new_state}`;
    case "orchestrator_run":
      return `Orchestrator: ${details.advanced ?? 0} advanced, ${details.killed ?? 0} killed, ${details.scanned ?? 0} scanned`;
    default:
      return event.event_type;
  }
}
