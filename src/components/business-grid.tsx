import { Globe, FileCode, GithubIcon, CircleAlert, Loader2 } from "lucide-react";
import type { DashboardBusiness } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

interface BusinessGridProps {
  businesses: DashboardBusiness[];
}

const STATUS_VARIANTS: Record<string, string> = {
  operating: "bg-status-green/10 text-status-green border-status-green/20",
  paused: "bg-status-amber/10 text-status-amber border-status-amber/20",
  killed: "bg-status-red/10 text-status-red border-status-red/20",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function BusinessGrid({ businesses }: BusinessGridProps) {
  if (businesses.length === 0) {
    return (
      <EmptyState message="No operating businesses yet. Ideas that reach the OPERATING stage will appear here." />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {businesses.map((biz, i) => (
        <Card
          key={biz.id}
          className={cn(
            "motion-preset-fade motion-duration-300",
            i > 0 && `motion-delay-[${i * 100}ms]`
          )}
        >
          <CardContent className="pt-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-medium text-zinc-50">{biz.name}</h3>
                {biz.domain && (
                  <p className="text-xs text-zinc-500 mt-0.5">{biz.domain}</p>
                )}
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "font-mono text-[11px] border",
                  STATUS_VARIANTS[biz.status] || "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                )}
              >
                {biz.status}
              </Badge>
            </div>

            {/* Financial Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <Metric label="Revenue" value={formatCurrency(biz.revenue)} />
              <Metric label="Costs" value={formatCurrency(biz.costs)} />
              <Metric
                label="Profit"
                value={formatCurrency(biz.profit)}
                color={biz.profit >= 0 ? "text-status-green" : "text-status-red"}
              />
            </div>

            {/* Operational Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
              <Metric label="MRR" value={formatCurrency(biz.mrr)} />
              <Metric label="Users" value={String(biz.users)} />
              <Metric
                label="Churn"
                value={
                  biz.churn_rate > 0
                    ? `${(biz.churn_rate * 100).toFixed(1)}%`
                    : "--"
                }
                color={
                  biz.churn_rate > 0.1
                    ? "text-status-red"
                    : biz.churn_rate > 0.05
                      ? "text-status-amber"
                      : "text-status-green"
                }
              />
            </div>

            {/* Links & Deploy Status */}
            {(biz.deploy_url || biz.repo_url || biz.validation_url || biz.mvp_status) && (
              <div className="flex flex-wrap gap-4 pt-3 border-t border-border">
                {biz.deploy_url && biz.mvp_status === "deployed" ? (
                  <a
                    href={biz.deploy_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    Live Site
                  </a>
                ) : biz.mvp_status === "failed" ? (
                  <span
                    className="inline-flex items-center gap-1.5 text-xs text-red-400 cursor-default"
                    title={biz.build_error || "Build failed"}
                  >
                    <CircleAlert className="h-3 w-3" />
                    Build Failed
                  </span>
                ) : biz.mvp_status === "building" ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-amber-400">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Building...
                  </span>
                ) : biz.deploy_url ? (
                  <a
                    href={biz.deploy_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-300 transition-colors"
                  >
                    <Globe className="h-3 w-3" />
                    Live Site
                  </a>
                ) : null}
                {biz.validation_url && (
                  <a
                    href={biz.validation_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
                  >
                    <FileCode className="h-3 w-3" />
                    Landing Page
                  </a>
                )}
                {biz.repo_url && (
                  <a
                    href={biz.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
                  >
                    <GithubIcon className="h-3 w-3" />
                    GitHub
                  </a>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Metric({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div>
      <div className="text-[10px] text-zinc-500">{label}</div>
      <div className={cn("font-mono text-sm", color || "text-zinc-50")}>
        {value}
      </div>
    </div>
  );
}
