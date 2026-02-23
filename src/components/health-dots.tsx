"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import type { HealthSnapshot } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function HealthDots() {
  const [health, setHealth] = useState<HealthSnapshot | null>(null);
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

  useEffect(() => {
    // Only create client in the browser — never during SSR/prerendering
    const supabase = createClient();
    supabaseRef.current = supabase;

    async function fetchHealth() {
      const { data } = await supabase
        .from("dashboard_health")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(1)
        .single();

      if (data) setHealth(data as HealthSnapshot);
    }

    fetchHealth();

    const channel = supabase
      .channel("dashboard_health")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "dashboard_health" },
        (payload) => setHealth(payload.new as HealthSnapshot)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function dotColor(status: string | undefined): string {
    if (!status) return "bg-zinc-700";
    if (status === "healthy") return "bg-status-green animate-pulse-dot";
    if (status.startsWith("error")) return "bg-status-red animate-pulse-dot";
    return "bg-status-amber animate-pulse-dot";
  }

  function dotLabel(status: string | undefined): string {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  const apiStatus =
    health?.circuit_breakers && Object.values(health.circuit_breakers).some((v) => v !== "closed")
      ? "degraded"
      : health
        ? "healthy"
        : undefined;

  return (
    <Link href="/health" className="flex items-center gap-1.5">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn("w-2 h-2 rounded-full", dotColor(health?.database))} />
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          Database: {dotLabel(health?.database)}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn("w-2 h-2 rounded-full", dotColor(health?.redis))} />
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          Redis: {dotLabel(health?.redis)}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn("w-2 h-2 rounded-full", dotColor(apiStatus))} />
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          APIs: {dotLabel(apiStatus)}
        </TooltipContent>
      </Tooltip>
    </Link>
  );
}
