import type { DashboardIdea } from "@/lib/types";
import { DECISION_LABELS } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataCell } from "@/components/data-cell";
import { ScoreDisplay } from "@/components/score-display";
import { StageTimeline } from "@/components/stage-timeline";
import { ExternalLink } from "@/components/external-link";

interface OverviewTabProps {
  idea: DashboardIdea;
}

export function OverviewTab({ idea }: OverviewTabProps) {
  return (
    <div className="space-y-4">
      {/* Stage Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-zinc-400">Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <StageTimeline currentStage={idea.stage} />
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="data-grid grid-cols-3 rounded-md overflow-hidden">
        <div>
          <div className="data-label">Score</div>
          <ScoreDisplay score={idea.latest_score} className="text-lg" />
        </div>
        <div>
          <div className="data-label">Decision</div>
          <div className="data-value">
            {idea.latest_decision
              ? DECISION_LABELS[idea.latest_decision] || idea.latest_decision
              : "--"}
          </div>
        </div>
        <div>
          <div className="data-label">Reviews</div>
          <div className="data-value">{idea.review_count}</div>
        </div>
      </div>

      {/* Planning Fields */}
      {(idea.target_user || idea.differentiation || idea.mvp_scope) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400">Planning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {idea.target_user && <DataCell label="Target User" value={idea.target_user} />}
            {idea.differentiation && <DataCell label="Differentiation" value={idea.differentiation} />}
            {idea.mvp_scope && <DataCell label="MVP Scope" value={idea.mvp_scope} />}
          </CardContent>
        </Card>
      )}

      {/* Validation */}
      {(idea.validation_url || idea.visitors > 0 || idea.signups > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400">Validation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <DataCell label="Visitors" value={idea.visitors} />
              <DataCell label="Signups" value={idea.signups} />
              <DataCell
                label="Conversion"
                value={
                  idea.conversion_rate > 0
                    ? `${(idea.conversion_rate * 100).toFixed(1)}%`
                    : "--"
                }
              />
              {idea.validation_url && (
                <div className="space-y-1">
                  <div className="data-label">Landing Page</div>
                  <ExternalLink href={idea.validation_url} className="text-sm">
                    Visit
                  </ExternalLink>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* MVP */}
      {(idea.mvp_status || idea.deploy_url || idea.repo_url) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-400">MVP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              {idea.mvp_status && <DataCell label="Status" value={idea.mvp_status} />}
              {idea.deploy_url && (
                <div className="space-y-1">
                  <div className="data-label">Deployment</div>
                  <ExternalLink href={idea.deploy_url} className="text-sm">
                    Live Site
                  </ExternalLink>
                </div>
              )}
              {idea.repo_url && (
                <div className="space-y-1">
                  <div className="data-label">Repository</div>
                  <ExternalLink href={idea.repo_url} className="text-sm">
                    GitHub
                  </ExternalLink>
                </div>
              )}
              {idea.mvp_tech_stack && (
                <DataCell
                  label="Tech Stack"
                  value={Object.entries(idea.mvp_tech_stack)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")}
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="data-grid grid-cols-4 rounded-md overflow-hidden">
        <div>
          <div className="data-label">Total Cost</div>
          <div className="data-value">{idea.total_cost > 0 ? `$${idea.total_cost.toFixed(2)}` : "$0.00"}</div>
        </div>
        <div>
          <div className="data-label">Experts</div>
          <div className="data-value">{idea.expert_count}</div>
        </div>
        <div>
          <div className="data-label">Pivots</div>
          <div className="data-value">{idea.pivot_count}</div>
        </div>
        <div>
          <div className="data-label">Decisions</div>
          <div className="data-value">{idea.decision_count}</div>
        </div>
      </div>
    </div>
  );
}
