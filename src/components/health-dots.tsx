"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import type { HealthSnapshot } from "@/lib/types";

export function HealthDots() {
  const [health, setHealth] = useState<HealthSnapshot | null>(null);
  const supabase = createClient();

  useEffect(() => {
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
  }, [supabase]);

  function dotColor(status: string | undefined): string {
    if (!status) return "bg-status-gray";
    if (status === "healthy") return "bg-status-green";
    if (status.startsWith("error")) return "bg-status-red";
    return "bg-status-yellow";
  }

  return (
    <Link href="/health" className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${dotColor(health?.database)}`} title="Database" />
      <span className={`w-2 h-2 rounded-full ${dotColor(health?.redis)}`} title="Redis" />
      <span
        className={`w-2 h-2 rounded-full ${
          health?.circuit_breakers && Object.values(health.circuit_breakers).some((v) => v !== "closed")
            ? "bg-status-yellow"
            : health
              ? "bg-status-green"
              : "bg-status-gray"
        }`}
        title="APIs"
      />
    </Link>
  );
}
