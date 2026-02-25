"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Globe, GithubIcon, Bot, User } from "lucide-react";
import type {
  DashboardStudioProduct,
  DashboardStudioActivity,
  DashboardStudioLearning,
  StudioPhase,
} from "@/lib/types";
import {
  STUDIO_PHASE_LABELS,
  STUDIO_PHASE_ORDER,
  FORM_FACTOR_LABELS,
  CUSTOMER_TYPE_LABELS,
  AGENT_TYPE_LABELS,
} from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "@/components/external-link";
import { TabNav } from "@/components/tab-nav";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

interface StudioProductDetailProps {
  product: DashboardStudioProduct;
  activity: DashboardStudioActivity[];
  learnings: DashboardStudioLearning[];
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

const OUTCOME_COLORS: Record<string, string> = {
  IMPROVED: "text-status-green",
  STALLED: "text-status-amber",
  FAILED: "text-status-red",
};

const BUDGET_TIER_LABELS: Record<number, string> = {
  0: "$0 (Bootstrap)",
  1: "$10 (Seed)",
  2: "$25 (Early)",
  3: "$50 (Growth)",
  4: "Match Revenue",
  5: "Reinvest 50%",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "agents", label: "Agents" },
  { id: "activity", label: "Activity" },
  { id: "learnings", label: "Learnings" },
];

export function StudioProductDetail({
  product,
  activity,
  learnings,
}: StudioProductDetailProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const tabsWithCounts = TABS.map((tab) => {
    switch (tab.id) {
      case "agents":
        return { ...tab, count: product.agent_count };
      case "activity":
        return { ...tab, count: activity.length };
      case "learnings":
        return { ...tab, count: learnings.length };
      default:
        return tab;
    }
  });

  return (
    <div className="space-y-4 motion-preset-fade motion-duration-300">
      {/* Back link */}
      <Link
        href="/studio"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Products
      </Link>

      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-xl font-semibold text-zinc-50 tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-sm text-zinc-400">
                  {product.customer_type === "AGENT" ? (
                    <Bot className="h-3.5 w-3.5" />
                  ) : (
                    <User className="h-3.5 w-3.5" />
                  )}
                  {CUSTOMER_TYPE_LABELS[product.customer_type] || product.customer_type}
                </span>
                <span className="text-zinc-700">·</span>
                <span className="text-sm text-zinc-400">
                  {FORM_FACTOR_LABELS[product.form_factor] || product.form_factor}
                </span>
                {product.deploy_url && (
                  <>
                    <span className="text-zinc-700">·</span>
                    <a
                      href={product.deploy_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      Live
                    </a>
                  </>
                )}
                {product.repo_url && (
                  <>
                    <span className="text-zinc-700">·</span>
                    <a
                      href={product.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
                    >
                      <GithubIcon className="h-3.5 w-3.5" />
                      Repo
                    </a>
                  </>
                )}
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "font-mono text-xs border shrink-0",
                PHASE_VARIANTS[product.phase] || "bg-zinc-500/10"
              )}
            >
              {STUDIO_PHASE_LABELS[product.phase] || product.phase}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tab Nav */}
      <TabNav tabs={tabsWithCounts} />

      {/* Tab content */}
      <div>
        {activeTab === "overview" && <OverviewTab product={product} />}
        {activeTab === "agents" && <AgentsTab product={product} />}
        {activeTab === "activity" && <ActivityTab activity={activity} />}
        {activeTab === "learnings" && <LearningsTab learnings={learnings} />}
      </div>

      {/* Footer */}
      <div className="flex justify-between text-xs text-zinc-600 pt-2">
        <span>Created {formatDate(product.created_at)}</span>
        <span>Last synced: {new Date(product.synced_at).toLocaleString()}</span>
      </div>
    </div>
  );
}

// --- Overview Tab ---

function OverviewTab({ product }: { product: DashboardStudioProduct }) {
  return (
    <div className="space-y-4">
      {/* Phase Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-zinc-400">
            Phase Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StudioPhaseTimeline currentPhase={product.phase} />
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="data-grid grid-cols-4 rounded-md overflow-hidden">
        <div>
          <div className="data-label">Visitors</div>
          <div className="data-value">{product.visitors}</div>
        </div>
        <div>
          <div className="data-label">Signups</div>
          <div className="data-value">{product.signups}</div>
        </div>
        <div>
          <div className="data-label">Active Users</div>
          <div className="data-value">{product.active_users}</div>
        </div>
        <div>
          <div className="data-label">D7 Retention</div>
          <div className="data-value">
            {product.d7_retention > 0
              ? `${product.d7_retention.toFixed(1)}%`
              : "--"}
          </div>
        </div>
      </div>

      {/* Budget + Iterations */}
      <div className="data-grid grid-cols-4 rounded-md overflow-hidden">
        <div>
          <div className="data-label">Budget Tier</div>
          <div className="data-value">
            {BUDGET_TIER_LABELS[product.budget_tier] || `Tier ${product.budget_tier}`}
          </div>
        </div>
        <div>
          <div className="data-label">Spent</div>
          <div className="data-value">{formatCurrency(product.budget_spent)}</div>
        </div>
        <div>
          <div className="data-label">Iterations</div>
          <div className="data-value">
            {product.iteration_count}
            {product.failed_iterations > 0 && (
              <span className="text-status-red ml-1">
                ({product.failed_iterations} failed)
              </span>
            )}
          </div>
        </div>
        <div>
          <div className="data-label">Recommendation</div>
          <div
            className={cn(
              "data-value",
              product.recommendation === "KILL" && "text-status-red",
              product.recommendation === "ITERATE" && "text-status-amber",
              product.recommendation === "CONTINUE" && "text-status-green"
            )}
          >
            {product.recommendation || "--"}
          </div>
        </div>
      </div>

      {/* Distribution */}
      <div className="data-grid grid-cols-3 rounded-md overflow-hidden">
        <div>
          <div className="data-label">Posts Published</div>
          <div className="data-value">{product.distribution_post_count}</div>
        </div>
        <div>
          <div className="data-label">Agents</div>
          <div className="data-value">{product.agent_count}</div>
        </div>
        <div>
          <div className="data-label">Latest Outcome</div>
          <div
            className={cn(
              "data-value",
              OUTCOME_COLORS[product.latest_iteration_outcome || ""] || ""
            )}
          >
            {product.latest_iteration_outcome
              ? product.latest_iteration_outcome.charAt(0) +
                product.latest_iteration_outcome.slice(1).toLowerCase()
              : "--"}
          </div>
        </div>
      </div>

      {/* Links */}
      {(product.deploy_url || product.repo_url) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Links
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6">
            {product.deploy_url && (
              <ExternalLink href={product.deploy_url}>Live Site</ExternalLink>
            )}
            {product.repo_url && (
              <ExternalLink href={product.repo_url}>GitHub Repo</ExternalLink>
            )}
          </CardContent>
        </Card>
      )}

      {/* Kill reason */}
      {product.phase === "KILLED" && product.kill_reason && (
        <Card className="border-status-red/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-status-red">
              Kill Reason
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-300">{product.kill_reason}</p>
            {product.killed_at && (
              <p className="text-xs text-zinc-600 mt-2">
                Killed on {formatDate(product.killed_at)}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// --- Agents Tab ---

function AgentsTab({ product }: { product: DashboardStudioProduct }) {
  if (product.agent_count === 0) {
    return <EmptyState message="No agents spawned yet." />;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-zinc-400">
          Active Team ({product.active_agent_types.length} of {product.agent_count})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {product.active_agent_types.map((type) => (
            <div
              key={type}
              className="flex items-center gap-3 px-3 py-2 rounded-md bg-zinc-800/50"
            >
              <div className="h-2 w-2 rounded-full bg-status-green" />
              <span className="text-sm font-medium text-zinc-200">
                {AGENT_TYPE_LABELS[type] || type}
              </span>
              <Badge variant="secondary" className="text-[10px] ml-auto">
                ACTIVE
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Activity Tab ---

function ActivityTab({ activity }: { activity: DashboardStudioActivity[] }) {
  if (activity.length === 0) {
    return <EmptyState message="No activity recorded yet." />;
  }

  return (
    <div className="space-y-2">
      {activity.map((event) => (
        <Card key={event.id}>
          <CardContent className="py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-mono",
                      event.event_type === "iteration"
                        ? "border-status-blue/30 text-status-blue"
                        : "border-purple-500/30 text-purple-400"
                    )}
                  >
                    {event.event_type}
                  </Badge>
                  <span className="text-sm font-medium text-zinc-200">
                    {event.title}
                  </span>
                </div>
                {event.detail && (
                  <p className="text-xs text-zinc-500 mt-1 truncate max-w-lg">
                    {event.detail}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {event.outcome && (
                  <span
                    className={cn(
                      "text-xs font-mono",
                      OUTCOME_COLORS[event.outcome] || "text-zinc-400"
                    )}
                  >
                    {event.outcome.toLowerCase()}
                  </span>
                )}
                <span className="text-xs text-zinc-600">
                  {formatTimeAgo(event.event_at)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// --- Learnings Tab ---

function LearningsTab({
  learnings,
}: {
  learnings: DashboardStudioLearning[];
}) {
  if (learnings.length === 0) {
    return (
      <EmptyState message="No learnings extracted yet. Learnings are captured when products iterate or exit." />
    );
  }

  return (
    <div className="space-y-3">
      {learnings.map((learning) => (
        <Card key={learning.id}>
          <CardContent className="py-4 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-mono",
                    learning.category === "PATTERN"
                      ? "border-status-green/30 text-status-green"
                      : learning.category === "ANTI_PATTERN"
                        ? "border-status-red/30 text-status-red"
                        : "border-status-blue/30 text-status-blue"
                  )}
                >
                  {learning.category.replace("_", " ")}
                </Badge>
                <span className="text-sm font-medium text-zinc-200">
                  {learning.title}
                </span>
              </div>
              {learning.confidence !== null && (
                <span className="text-xs font-mono text-zinc-500 shrink-0">
                  {(learning.confidence * 100).toFixed(0)}% conf
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {learning.insight}
            </p>
            <div className="flex gap-4 text-xs text-zinc-600">
              <span>Applied {learning.times_applied}x</span>
              <span>Validated {learning.times_validated}x</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// --- Phase Timeline ---

function StudioPhaseTimeline({ currentPhase }: { currentPhase: string }) {
  const currentIndex = STUDIO_PHASE_ORDER.indexOf(currentPhase as StudioPhase);
  const isKilled = currentPhase === "KILLED";

  return (
    <div className="flex items-center gap-1">
      {STUDIO_PHASE_ORDER.map((phase, i) => {
        const isPast = !isKilled && currentIndex > i;
        const isCurrent = !isKilled && currentIndex === i;

        return (
          <div key={phase} className="flex items-center flex-1">
            <div
              className={cn(
                "flex-1 py-1.5 px-2 text-center text-[10px] font-mono uppercase tracking-wider rounded-sm transition-colors",
                isPast && "bg-emerald-500/20 text-emerald-500",
                isCurrent && "bg-emerald-500/30 text-emerald-400 ring-1 ring-emerald-500/40",
                !isPast && !isCurrent && "bg-zinc-800/50 text-zinc-600",
                isKilled && "bg-zinc-800/50 text-zinc-600"
              )}
            >
              {STUDIO_PHASE_LABELS[phase]}
            </div>
            {i < STUDIO_PHASE_ORDER.length - 1 && (
              <div
                className={cn(
                  "w-2 h-px mx-0.5",
                  isPast ? "bg-emerald-500/40" : "bg-zinc-800"
                )}
              />
            )}
          </div>
        );
      })}
      {isKilled && (
        <>
          <div className="w-2 h-px mx-0.5 bg-status-red/40" />
          <div className="py-1.5 px-3 text-center text-[10px] font-mono uppercase tracking-wider rounded-sm bg-status-red/20 text-status-red ring-1 ring-status-red/40">
            Killed
          </div>
        </>
      )}
    </div>
  );
}
