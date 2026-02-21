"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { HealthSnapshot, ActivityEvent } from "@/lib/types";
import { formatTimeAgo, EVENT_ICONS, SEVERITY_COLORS } from "@/lib/format";
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
  healthy: "bg-status-green",
  degraded: "bg-status-yellow",
  down: "bg-status-red",
  unknown: "bg-stone",
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
      <div className="bg-ivory-warm border border-mist rounded-precision p-6">
        <h2 className="font-serif text-lg text-black mb-4">
          Ideas Processed (24h)
        </h2>
        {chartData.length === 0 ? (
          <p className="text-stone text-sm">No data available yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#D4D4CF" strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tick={{ fill: "#8A8A86", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#D4D4CF" }}
              />
              <YAxis
                tick={{ fill: "#8A8A86", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#D4D4CF" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#F5F4F0",
                  border: "1px solid #D4D4CF",
                  borderRadius: "4px",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="processed"
                stroke="#1A1A6B"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Circuit Breakers */}
      {circuitBreakers.length > 0 && (
        <div className="bg-ivory-warm border border-mist rounded-precision p-6">
          <h2 className="font-serif text-lg text-black mb-4">
            Circuit Breakers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {circuitBreakers.map(([service, state]) => (
              <div
                key={service}
                className="flex items-center gap-2 text-sm"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    state === "CLOSED"
                      ? "bg-status-green"
                      : state === "HALF_OPEN"
                        ? "bg-status-yellow"
                        : "bg-status-red"
                  }`}
                />
                <span className="text-graphite">{service}</span>
                <span className="text-stone font-mono text-xs ml-auto">
                  {state}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Events */}
      <div className="bg-ivory-warm border border-mist rounded-precision p-6">
        <h2 className="font-serif text-lg text-black mb-4">Recent Events</h2>
        {events.length === 0 ? (
          <p className="text-stone text-sm">No health events recorded.</p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {events.map((event) => (
              <div key={event.id} className="flex items-start gap-3 text-sm">
                <span className="text-stone font-mono text-xs w-16 shrink-0 pt-0.5">
                  {formatTimeAgo(event.timestamp)}
                </span>
                <span className="font-mono text-xs text-stone w-6 shrink-0 pt-0.5">
                  {EVENT_ICONS[event.event_type] || ".."}
                </span>
                <span className={SEVERITY_COLORS[event.severity] || "text-graphite"}>
                  {formatEventDetail(event)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Last Updated */}
      {snapshot && (
        <p className="text-xs text-stone">
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
    <div className="bg-ivory-warm border border-mist rounded-precision p-6">
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
        <span className="text-xs text-stone">{label}</span>
      </div>
      <span className="font-mono text-lg text-black">
        {statusLabel(status)}
      </span>
      {detail && <p className="text-xs text-stone mt-1">{detail}</p>}
    </div>
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
