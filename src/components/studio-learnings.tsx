"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { DashboardStudioLearning } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface StudioLearningsProps {
  learnings: DashboardStudioLearning[];
}

const CATEGORY_VARIANTS: Record<string, string> = {
  PATTERN: "border-status-green/30 text-status-green",
  ANTI_PATTERN: "border-status-red/30 text-status-red",
  TEMPLATE: "border-status-blue/30 text-status-blue",
};

export function StudioLearnings({ learnings }: StudioLearningsProps) {
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = useMemo(() => {
    if (categoryFilter === "all") return learnings;
    return learnings.filter((l) => l.category === categoryFilter);
  }, [learnings, categoryFilter]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const l of learnings) {
      counts[l.category] = (counts[l.category] || 0) + 1;
    }
    return counts;
  }, [learnings]);

  if (learnings.length === 0) {
    return (
      <EmptyState message="No studio learnings yet. Learnings are extracted when products iterate, scale, or get killed." />
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="data-grid grid-cols-3 rounded-md overflow-hidden">
        <div>
          <div className="data-label">Patterns</div>
          <div className="data-value text-status-green">
            {categoryCounts["PATTERN"] || 0}
          </div>
        </div>
        <div>
          <div className="data-label">Anti-Patterns</div>
          <div className="data-value text-status-red">
            {categoryCounts["ANTI_PATTERN"] || 0}
          </div>
        </div>
        <div>
          <div className="data-label">Templates</div>
          <div className="data-value text-status-blue">
            {categoryCounts["TEMPLATE"] || 0}
          </div>
        </div>
      </div>

      {/* Filter */}
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-[160px] h-9 text-sm">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          <SelectItem value="PATTERN">Patterns</SelectItem>
          <SelectItem value="ANTI_PATTERN">Anti-Patterns</SelectItem>
          <SelectItem value="TEMPLATE">Templates</SelectItem>
        </SelectContent>
      </Select>

      {/* Learning cards */}
      <div className="space-y-3">
        {filtered.map((learning) => (
          <Card key={learning.id}>
            <CardContent className="py-4 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-mono shrink-0",
                      CATEGORY_VARIANTS[learning.category] ||
                        "border-zinc-500/30 text-zinc-400"
                    )}
                  >
                    {learning.category.replace("_", " ")}
                  </Badge>
                  <span className="text-sm font-medium text-zinc-200 truncate">
                    {learning.title}
                  </span>
                </div>
                {learning.confidence !== null && (
                  <ConfidenceBar confidence={learning.confidence} />
                )}
              </div>

              {/* Insight */}
              <p className="text-sm text-zinc-400 leading-relaxed">
                {learning.insight}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-zinc-600">
                <div className="flex gap-4">
                  <span>
                    Applied{" "}
                    <span className="font-mono text-zinc-500">
                      {learning.times_applied}x
                    </span>
                  </span>
                  <span>
                    Validated{" "}
                    <span className="font-mono text-zinc-500">
                      {learning.times_validated}x
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {learning.product_name && (
                    <Link
                      href={`/studio/${learning.product_id}`}
                      className="text-emerald-500/70 hover:text-emerald-500 transition-colors"
                    >
                      {learning.product_name}
                    </Link>
                  )}
                  <span>
                    {new Date(learning.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ConfidenceBar({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            pct >= 70
              ? "bg-status-green"
              : pct >= 40
                ? "bg-status-amber"
                : "bg-status-red"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-mono text-zinc-500">{pct}%</span>
    </div>
  );
}
