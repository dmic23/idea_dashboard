import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  X,
  Plus,
  Star,
  RefreshCw,
  Heart,
  Rocket,
  Globe,
  AlertTriangle,
  Share2,
  Circle,
} from "lucide-react";
import type { DashboardIdea, ActivityEvent } from "@/lib/types";
import { DECISION_LABELS } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StageBadge } from "@/components/stage-badge";
import { ScoreDisplay } from "@/components/score-display";
import { StageTimeline } from "@/components/stage-timeline";
import { ExternalLink } from "@/components/external-link";
import { formatTimeAgo, formatEvent, SEVERITY_COLORS, SEVERITY_BORDER_COLORS } from "@/lib/format";

const EVENT_ICONS: Record<string, React.ElementType> = {
  idea_advanced: ArrowRight,
  idea_killed: X,
  idea_created: Plus,
  review_completed: Star,
  orchestrator_run: RefreshCw,
  health_check: Heart,
  mvp_deployed: Rocket,
  landing_page_deployed: Globe,
  circuit_breaker_change: AlertTriangle,
  social_post_created: Share2,
};

interface IdeaDetailProps {
  idea: DashboardIdea;
  events: ActivityEvent[];
}

export function IdeaDetail({ idea, events }: IdeaDetailProps) {
  return (
    <div className="space-y-6 motion-preset-fade motion-duration-300">
      {/* Back link */}
      <Link
        href="/ideas"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Ideas
      </Link>

      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-zinc-50 tracking-tight">
                {idea.title}
              </h1>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
                {idea.description}
              </p>
              {idea.domain_tags.length > 0 && (
                <div className="flex gap-2 pt-1">
                  {idea.domain_tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <StageBadge stage={idea.stage} />
              <span className="text-xs text-zinc-500">
                {idea.status === "active" ? `${idea.days_in_stage}d in stage` : idea.status}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stage Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-zinc-50">Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <StageTimeline currentStage={idea.stage} />
        </CardContent>
      </Card>

      {/* Score & Decision */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-xs text-zinc-500 mb-1">Latest Score</div>
            <ScoreDisplay score={idea.latest_score} className="text-2xl" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xs text-zinc-500 mb-1">Decision</div>
            <span className="font-mono text-lg text-zinc-50">
              {idea.latest_decision
                ? DECISION_LABELS[idea.latest_decision] || idea.latest_decision
                : "--"}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xs text-zinc-500 mb-1">Reviews</div>
            <span className="font-mono text-lg text-zinc-50">{idea.review_count}</span>
          </CardContent>
        </Card>
      </div>

      {/* Validation Metrics */}
      {(idea.validation_url || idea.visitors > 0 || idea.signups > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium text-zinc-50">Validation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-zinc-500 mb-1">Visitors</div>
                <span className="font-mono text-lg text-zinc-50">{idea.visitors}</span>
              </div>
              <div>
                <div className="text-xs text-zinc-500 mb-1">Signups</div>
                <span className="font-mono text-lg text-zinc-50">{idea.signups}</span>
              </div>
              <div>
                <div className="text-xs text-zinc-500 mb-1">Conversion</div>
                <span className="font-mono text-lg text-zinc-50">
                  {idea.conversion_rate > 0
                    ? `${(idea.conversion_rate * 100).toFixed(1)}%`
                    : "--"}
                </span>
              </div>
              {idea.validation_url && (
                <div>
                  <div className="text-xs text-zinc-500 mb-1">Landing Page</div>
                  <ExternalLink href={idea.validation_url} className="text-sm">
                    Visit
                  </ExternalLink>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* MVP Info */}
      {(idea.mvp_status || idea.deploy_url || idea.repo_url) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium text-zinc-50">MVP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              {idea.mvp_status && (
                <div>
                  <div className="text-xs text-zinc-500 mb-1">Status</div>
                  <span className="font-mono text-sm text-zinc-300">{idea.mvp_status}</span>
                </div>
              )}
              {idea.deploy_url && (
                <div>
                  <div className="text-xs text-zinc-500 mb-1">Deployment</div>
                  <ExternalLink href={idea.deploy_url} className="text-sm">
                    Live Site
                  </ExternalLink>
                </div>
              )}
              {idea.repo_url && (
                <div>
                  <div className="text-xs text-zinc-500 mb-1">Repository</div>
                  <ExternalLink href={idea.repo_url} className="text-sm">
                    GitHub
                  </ExternalLink>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium text-zinc-50">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-zinc-500 text-sm">No activity recorded for this idea.</p>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-1">
                {events.map((event) => {
                  const Icon = EVENT_ICONS[event.event_type] || Circle;
                  const borderColor = SEVERITY_BORDER_COLORS[event.severity] || "border-l-zinc-800";
                  return (
                    <div
                      key={event.id}
                      className={`flex items-start gap-3 text-sm px-3 py-2 rounded-sm border-l-2 ${borderColor}`}
                    >
                      <Icon className="h-3.5 w-3.5 text-zinc-500 shrink-0 mt-0.5" />
                      <span className={`flex-1 ${SEVERITY_COLORS[event.severity] || "text-zinc-300"}`}>
                        {formatEvent(event)}
                      </span>
                      <span className="text-zinc-600 font-mono text-xs shrink-0">
                        {formatTimeAgo(event.timestamp)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Metadata footer */}
      <div className="flex justify-between text-xs text-zinc-600">
        <span>
          Source: {idea.source} &middot; Created{" "}
          {new Date(idea.created_at).toLocaleDateString()}
        </span>
        <span>
          Last synced: {new Date(idea.synced_at).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
