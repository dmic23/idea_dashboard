import type { DashboardBusiness } from "@/lib/types";
import { ExternalLink } from "@/components/external-link";
import { EmptyState } from "@/components/empty-state";

interface BusinessGridProps {
  businesses: DashboardBusiness[];
}

const STATUS_COLORS: Record<string, string> = {
  operating: "bg-status-green/10 text-status-green",
  paused: "bg-status-yellow/10 text-status-yellow",
  killed: "bg-status-red/10 text-status-red",
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
      {businesses.map((biz) => (
        <div
          key={biz.id}
          className="bg-ivory-warm border border-mist rounded-precision p-6 space-y-4"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-serif text-lg text-black">{biz.name}</h3>
              {biz.domain && (
                <p className="text-xs text-stone mt-0.5">{biz.domain}</p>
              )}
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-precision font-mono ${
                STATUS_COLORS[biz.status] || "bg-stone/10 text-stone"
              }`}
            >
              {biz.status}
            </span>
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
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-mist/50">
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
                    ? "text-status-yellow"
                    : "text-status-green"
              }
            />
          </div>

          {/* Links */}
          {biz.deploy_url && (
            <div className="flex gap-4 pt-2 border-t border-mist/50">
              <ExternalLink href={biz.deploy_url} className="text-xs">
                Live
              </ExternalLink>
            </div>
          )}
        </div>
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
      <div className="text-[10px] text-stone">{label}</div>
      <div className={`font-mono text-sm ${color || "text-black"}`}>
        {value}
      </div>
    </div>
  );
}
