"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, GithubIcon, Users, Eye, UserPlus, Bot, User } from "lucide-react";
import type { DashboardStudioProduct, StudioPhase } from "@/lib/types";
import {
  STUDIO_PHASE_LABELS,
  FORM_FACTOR_LABELS,
  CUSTOMER_TYPE_LABELS,
  AGENT_TYPE_LABELS,
} from "@/lib/types";
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

interface StudioOverviewProps {
  products: DashboardStudioProduct[];
}

const PHASE_VARIANTS: Record<string, string> = {
  INTAKE: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  BUILD: "bg-status-blue/10 text-status-blue border-status-blue/20",
  DISTRIBUTE: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  MEASURE: "bg-status-amber/10 text-status-amber border-status-amber/20",
  ITERATE: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  SCALE: "bg-status-green/10 text-status-green border-status-green/20",
  KILLED: "bg-status-red/10 text-status-red border-status-red/20",
};

const BUDGET_TIER_LABELS: Record<number, string> = {
  0: "$0",
  1: "$10",
  2: "$25",
  3: "$50",
  4: "Match",
  5: "Reinvest",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function StudioOverview({ products }: StudioOverviewProps) {
  const router = useRouter();
  const [phaseFilter, setPhaseFilter] = useState("all");

  const filtered = useMemo(() => {
    if (phaseFilter === "all") return products;
    return products.filter((p) => p.phase === phaseFilter);
  }, [products, phaseFilter]);

  const phaseCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      counts[p.phase] = (counts[p.phase] || 0) + 1;
    }
    return counts;
  }, [products]);

  if (products.length === 0) {
    return (
      <EmptyState message="No studio products yet. Ideas that pass Deep Dive will enter the studio pipeline." />
    );
  }

  return (
    <div className="space-y-4">
      {/* Phase summary bar */}
      <div className="data-grid grid-cols-7 rounded-md overflow-hidden">
        {(["INTAKE", "BUILD", "DISTRIBUTE", "MEASURE", "ITERATE", "SCALE", "KILLED"] as StudioPhase[]).map(
          (phase) => (
            <div key={phase}>
              <div className="data-label">{STUDIO_PHASE_LABELS[phase]}</div>
              <div className="data-value">{phaseCounts[phase] || 0}</div>
            </div>
          )
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Select value={phaseFilter} onValueChange={setPhaseFilter}>
          <SelectTrigger className="w-[160px] h-9 text-sm">
            <SelectValue placeholder="All phases" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All phases</SelectItem>
            {(["INTAKE", "BUILD", "DISTRIBUTE", "MEASURE", "ITERATE", "SCALE", "KILLED"] as StudioPhase[]).map(
              (phase) => (
                <SelectItem key={phase} value={phase}>
                  {STUDIO_PHASE_LABELS[phase]}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Product cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product) => (
          <Card
            key={product.id}
            className="cursor-pointer hover:border-zinc-700 transition-colors"
            onClick={() => router.push(`/studio/${product.id}`)}
          >
            <CardContent className="pt-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <h3 className="text-base font-medium text-zinc-50 truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-500">
                      {FORM_FACTOR_LABELS[product.form_factor] || product.form_factor}
                    </span>
                    <span className="text-zinc-700">·</span>
                    <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                      {product.customer_type === "AGENT" ? (
                        <Bot className="h-3 w-3" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                      {CUSTOMER_TYPE_LABELS[product.customer_type] || product.customer_type}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "font-mono text-[11px] border shrink-0",
                    PHASE_VARIANTS[product.phase] || "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                  )}
                >
                  {STUDIO_PHASE_LABELS[product.phase] || product.phase}
                </Badge>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-4 gap-3">
                <Metric
                  icon={<Eye className="h-3 w-3 text-zinc-600" />}
                  label="Visitors"
                  value={String(product.visitors)}
                />
                <Metric
                  icon={<UserPlus className="h-3 w-3 text-zinc-600" />}
                  label="Signups"
                  value={String(product.signups)}
                />
                <Metric
                  icon={<Users className="h-3 w-3 text-zinc-600" />}
                  label="Active"
                  value={String(product.active_users)}
                />
                <Metric
                  label="D7 Ret."
                  value={
                    product.d7_retention > 0
                      ? `${product.d7_retention.toFixed(0)}%`
                      : "--"
                  }
                />
              </div>

              {/* Agents + Budget */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex flex-wrap gap-1">
                  {product.active_agent_types.slice(0, 4).map((type) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {AGENT_TYPE_LABELS[type] || type}
                    </Badge>
                  ))}
                  {product.active_agent_types.length > 4 && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      +{product.active_agent_types.length - 4}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-mono text-zinc-500">
                  Tier {product.budget_tier} ({BUDGET_TIER_LABELS[product.budget_tier] || `$${product.budget_tier}`})
                  {" · "}
                  {formatCurrency(product.budget_spent)} spent
                </span>
              </div>

              {/* Links + iteration info */}
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <div className="flex gap-3">
                  {product.deploy_url && (
                    <a
                      href={product.deploy_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-emerald-500 hover:text-emerald-400 transition-colors"
                    >
                      <Globe className="h-3 w-3" />
                      Live
                    </a>
                  )}
                  {product.repo_url && (
                    <a
                      href={product.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-emerald-500 hover:text-emerald-400 transition-colors"
                    >
                      <GithubIcon className="h-3 w-3" />
                      Repo
                    </a>
                  )}
                </div>
                {product.iteration_count > 0 && (
                  <span>
                    {product.iteration_count} iteration{product.iteration_count !== 1 ? "s" : ""}
                    {product.latest_iteration_outcome && (
                      <span
                        className={cn(
                          "ml-1",
                          product.latest_iteration_outcome === "IMPROVED" && "text-status-green",
                          product.latest_iteration_outcome === "STALLED" && "text-status-amber",
                          product.latest_iteration_outcome === "FAILED" && "text-status-red"
                        )}
                      >
                        · {product.latest_iteration_outcome.toLowerCase()}
                      </span>
                    )}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-[10px] text-zinc-500">{label}</span>
      </div>
      <div className="font-mono text-sm text-zinc-50">{value}</div>
    </div>
  );
}
