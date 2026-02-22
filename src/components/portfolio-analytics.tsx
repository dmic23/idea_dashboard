"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type {
  DashboardIdea,
  DashboardReview,
  DashboardCost,
  DashboardBusiness,
  DashboardPattern,
} from "@/lib/types";
import { STAGE_ORDER, STAGE_LABELS, type PipelineStage } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PortfolioAnalyticsProps {
  ideas: DashboardIdea[];
  reviews: DashboardReview[];
  costs: DashboardCost[];
  businesses: DashboardBusiness[];
  patterns: DashboardPattern[];
}

const STAGE_COLORS: Record<string, string> = {
  discovery: "#3B82F6",
  quick_scan: "#F59E0B",
  deep_dive: "#F59E0B",
  validation: "#8B5CF6",
  mvp_build: "#10B981",
  operating: "#22C55E",
  exited: "#71717A",
};

export function PortfolioAnalytics({
  ideas,
  reviews,
  costs,
  businesses,
  patterns,
}: PortfolioAnalyticsProps) {
  // Current stage distribution
  const stageDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const idea of ideas) {
      counts[idea.stage] = (counts[idea.stage] || 0) + 1;
    }
    return [...STAGE_ORDER, "exited" as PipelineStage]
      .map((stage) => ({
        stage: STAGE_LABELS[stage] || stage,
        count: counts[stage] || 0,
        color: STAGE_COLORS[stage] || "#71717A",
      }))
      .filter((d) => d.count > 0);
  }, [ideas]);

  // Cost by category
  const costByCategory = useMemo(() => {
    const cats: Record<string, number> = {};
    for (const c of costs) {
      cats[c.category] = (cats[c.category] || 0) + c.amount;
    }
    return Object.entries(cats)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [costs]);

  const totalCost = costs.reduce((sum, c) => sum + c.amount, 0);

  // Review stats
  const reviewStats = useMemo(() => {
    const total = reviews.length;
    const advances = reviews.filter((r) => r.decision === "advance").length;
    const iterates = reviews.filter((r) => r.decision === "iterate").length;
    const kills = reviews.filter((r) => r.decision === "kill").length;
    const vetoes = reviews.filter((r) => r.veto_flags.length > 0).length;
    const avgScore =
      total > 0
        ? reviews.reduce((sum, r) => sum + r.weighted_average, 0) / total
        : 0;
    const avgIterations =
      total > 0
        ? reviews.reduce((sum, r) => sum + r.iteration_number, 0) / total
        : 0;

    return {
      total,
      advances,
      iterates,
      kills,
      vetoes,
      advanceRate: total > 0 ? ((advances / total) * 100).toFixed(1) : "0",
      killRate: total > 0 ? ((kills / total) * 100).toFixed(1) : "0",
      vetoRate: total > 0 ? ((vetoes / total) * 100).toFixed(1) : "0",
      avgScore: avgScore.toFixed(1),
      avgIterations: avgIterations.toFixed(1),
    };
  }, [reviews]);

  // Portfolio summary
  const portfolioSummary = useMemo(() => {
    if (businesses.length === 0) return null;
    const totalRevenue = businesses.reduce((s, b) => s + b.revenue, 0);
    const totalCosts = businesses.reduce((s, b) => s + b.costs, 0);
    const totalProfit = businesses.reduce((s, b) => s + b.profit, 0);
    const avgMrr =
      businesses.reduce((s, b) => s + b.mrr, 0) / businesses.length;
    const avgChurn =
      businesses.reduce((s, b) => s + b.churn_rate, 0) / businesses.length;
    const best = businesses.reduce(
      (best, b) => (b.mrr > best.mrr ? b : best),
      businesses[0]
    );
    return {
      totalRevenue,
      totalCosts,
      totalProfit,
      avgMrr,
      avgChurn,
      best,
      count: businesses.length,
    };
  }, [businesses]);

  // Top patterns
  const topPatterns = useMemo(() => {
    return [...patterns]
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);
  }, [patterns]);

  return (
    <div className="space-y-6 motion-preset-fade motion-duration-300">
      <h1 className="text-xl font-semibold text-zinc-50 tracking-tight">
        Portfolio Analytics
      </h1>

      {/* Top-level metrics */}
      <div className="data-grid grid-cols-2 md:grid-cols-5 rounded-md overflow-hidden">
        <div>
          <div className="data-label">Total Ideas</div>
          <div className="data-value">{ideas.length}</div>
        </div>
        <div>
          <div className="data-label">Active</div>
          <div className="data-value">
            {ideas.filter((i) => i.status === "active").length}
          </div>
        </div>
        <div>
          <div className="data-label">Businesses</div>
          <div className="data-value">{businesses.length}</div>
        </div>
        <div>
          <div className="data-label">Total Spend</div>
          <div className="data-value">${totalCost.toFixed(2)}</div>
        </div>
        <div>
          <div className="data-label">Reviews</div>
          <div className="data-value">{reviews.length}</div>
        </div>
      </div>

      {/* Pipeline Distribution */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-zinc-400">
            Pipeline Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stageDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={stageDistribution}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                <XAxis
                  dataKey="stage"
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  axisLine={{ stroke: "#27272A" }}
                />
                <YAxis
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  axisLine={{ stroke: "#27272A" }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181B",
                    border: "1px solid #27272A",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#FAFAFA",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stageDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-zinc-500">No data available.</p>
          )}
        </CardContent>
      </Card>

      {/* Success Rates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-zinc-400">
            Review Success Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="data-grid grid-cols-2 md:grid-cols-5 rounded-md overflow-hidden">
            <div>
              <div className="data-label">Advance Rate</div>
              <div className="data-value text-status-green">
                {reviewStats.advanceRate}%
              </div>
            </div>
            <div>
              <div className="data-label">Kill Rate</div>
              <div className="data-value text-status-red">
                {reviewStats.killRate}%
              </div>
            </div>
            <div>
              <div className="data-label">Veto Rate</div>
              <div className="data-value text-status-amber">
                {reviewStats.vetoRate}%
              </div>
            </div>
            <div>
              <div className="data-label">Avg Score</div>
              <div className="data-value">{reviewStats.avgScore}</div>
            </div>
            <div>
              <div className="data-label">Avg Iterations</div>
              <div className="data-value">{reviewStats.avgIterations}</div>
            </div>
          </div>
          <div className="mt-4 flex gap-4 text-xs text-zinc-500">
            <span>{reviewStats.advances} advances</span>
            <span>{reviewStats.iterates} iterates</span>
            <span>{reviewStats.kills} kills</span>
            <span>{reviewStats.vetoes} with vetoes</span>
          </div>
        </CardContent>
      </Card>

      {/* Cost Analysis */}
      {costByCategory.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Cost by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={costByCategory}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 60, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272A"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  axisLine={{ stroke: "#27272A" }}
                  tickFormatter={(v: number) => `$${v}`}
                />
                <YAxis
                  dataKey="category"
                  type="category"
                  tick={{ fill: "#71717A", fontSize: 11 }}
                  axisLine={{ stroke: "#27272A" }}
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181B",
                    border: "1px solid #27272A",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#FAFAFA",
                  }}
                  formatter={(value: number) => [
                    `$${value.toFixed(2)}`,
                    "Amount",
                  ]}
                />
                <Bar dataKey="amount" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Summary */}
      {portfolioSummary && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Portfolio Summary ({portfolioSummary.count} businesses)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="data-grid grid-cols-2 md:grid-cols-5 rounded-md overflow-hidden">
              <div>
                <div className="data-label">Revenue</div>
                <div className="data-value">
                  ${portfolioSummary.totalRevenue.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="data-label">Costs</div>
                <div className="data-value">
                  ${portfolioSummary.totalCosts.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="data-label">Profit</div>
                <div className="data-value">
                  ${portfolioSummary.totalProfit.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="data-label">Avg MRR</div>
                <div className="data-value">
                  ${portfolioSummary.avgMrr.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="data-label">Avg Churn</div>
                <div className="data-value">
                  {(portfolioSummary.avgChurn * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-zinc-500">
              Best performing:{" "}
              <span className="text-zinc-300">
                {portfolioSummary.best.name}
              </span>{" "}
              (${portfolioSummary.best.mrr}/mo MRR)
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pattern Insights */}
      {topPatterns.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Top Patterns ({patterns.length} total)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topPatterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="flex items-start gap-3 p-3 rounded-md border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-[10px]">
                        {pattern.pattern_type}
                      </Badge>
                      <span className="font-mono text-[10px] text-zinc-500">
                        {(pattern.confidence * 100).toFixed(0)}% confidence
                      </span>
                      <span className="font-mono text-[10px] text-zinc-600">
                        n={pattern.sample_size}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 line-clamp-2">
                      {pattern.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
