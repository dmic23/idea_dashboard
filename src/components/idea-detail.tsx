import Link from "next/link";
import type { DashboardIdea, ActivityEvent } from "@/lib/types";
import { DECISION_LABELS } from "@/lib/types";
import { StageBadge } from "@/components/stage-badge";
import { ScoreDisplay } from "@/components/score-display";
import { StageTimeline } from "@/components/stage-timeline";
import { ExternalLink } from "@/components/external-link";
import { formatTimeAgo, formatEvent, EVENT_ICONS, SEVERITY_COLORS } from "@/lib/format";

interface IdeaDetailProps {
  idea: DashboardIdea;
  events: ActivityEvent[];
}

export function IdeaDetail({ idea, events }: IdeaDetailProps) {
  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/ideas"
        className="text-sm text-stone hover:text-graphite transition-colors"
      >
        &larr; All Ideas
      </Link>

      {/* Header */}
      <div className="bg-ivory-warm border border-mist rounded-precision p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="font-serif text-2xl text-black tracking-tight">
              {idea.title}
            </h1>
            <p className="text-sm text-graphite leading-relaxed max-w-2xl">
              {idea.description}
            </p>
            {idea.domain_tags.length > 0 && (
              <div className="flex gap-2 pt-1">
                {idea.domain_tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-stone bg-ivory px-2 py-0.5 rounded-precision"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <StageBadge stage={idea.stage} />
            <span className="text-xs text-stone">
              {idea.status === "active" ? `${idea.days_in_stage}d in stage` : idea.status}
            </span>
          </div>
        </div>
      </div>

      {/* Stage Timeline */}
      <div className="bg-ivory-warm border border-mist rounded-precision p-6">
        <h2 className="font-serif text-lg text-black mb-3">Progress</h2>
        <StageTimeline currentStage={idea.stage} />
      </div>

      {/* Score & Decision */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-ivory-warm border border-mist rounded-precision p-6">
          <div className="text-xs text-stone mb-1">Latest Score</div>
          <ScoreDisplay score={idea.latest_score} className="text-2xl" />
        </div>
        <div className="bg-ivory-warm border border-mist rounded-precision p-6">
          <div className="text-xs text-stone mb-1">Decision</div>
          <span className="font-mono text-lg text-black">
            {idea.latest_decision
              ? DECISION_LABELS[idea.latest_decision] || idea.latest_decision
              : "--"}
          </span>
        </div>
        <div className="bg-ivory-warm border border-mist rounded-precision p-6">
          <div className="text-xs text-stone mb-1">Reviews</div>
          <span className="font-mono text-lg text-black">{idea.review_count}</span>
        </div>
      </div>

      {/* Validation Metrics (conditional) */}
      {(idea.validation_url || idea.visitors > 0 || idea.signups > 0) && (
        <div className="bg-ivory-warm border border-mist rounded-precision p-6">
          <h2 className="font-serif text-lg text-black mb-4">Validation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-stone mb-1">Visitors</div>
              <span className="font-mono text-lg text-black">{idea.visitors}</span>
            </div>
            <div>
              <div className="text-xs text-stone mb-1">Signups</div>
              <span className="font-mono text-lg text-black">{idea.signups}</span>
            </div>
            <div>
              <div className="text-xs text-stone mb-1">Conversion</div>
              <span className="font-mono text-lg text-black">
                {idea.conversion_rate > 0
                  ? `${(idea.conversion_rate * 100).toFixed(1)}%`
                  : "--"}
              </span>
            </div>
            {idea.validation_url && (
              <div>
                <div className="text-xs text-stone mb-1">Landing Page</div>
                <ExternalLink href={idea.validation_url} className="text-sm">
                  Visit
                </ExternalLink>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MVP Info (conditional) */}
      {(idea.mvp_status || idea.deploy_url || idea.repo_url) && (
        <div className="bg-ivory-warm border border-mist rounded-precision p-6">
          <h2 className="font-serif text-lg text-black mb-4">MVP</h2>
          <div className="flex flex-wrap gap-6">
            {idea.mvp_status && (
              <div>
                <div className="text-xs text-stone mb-1">Status</div>
                <span className="font-mono text-sm text-black">{idea.mvp_status}</span>
              </div>
            )}
            {idea.deploy_url && (
              <div>
                <div className="text-xs text-stone mb-1">Deployment</div>
                <ExternalLink href={idea.deploy_url} className="text-sm">
                  Live Site
                </ExternalLink>
              </div>
            )}
            {idea.repo_url && (
              <div>
                <div className="text-xs text-stone mb-1">Repository</div>
                <ExternalLink href={idea.repo_url} className="text-sm">
                  GitHub
                </ExternalLink>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-ivory-warm border border-mist rounded-precision p-6">
        <h2 className="font-serif text-lg text-black mb-4">Recent Activity</h2>
        {events.length === 0 ? (
          <p className="text-stone text-sm">No activity recorded for this idea.</p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-start gap-3 text-sm">
                <span className="text-stone font-mono text-xs w-16 shrink-0 pt-0.5">
                  {formatTimeAgo(event.timestamp)}
                </span>
                <span className="font-mono text-xs text-stone w-6 shrink-0 pt-0.5">
                  {EVENT_ICONS[event.event_type] || ".."}
                </span>
                <span className={SEVERITY_COLORS[event.severity] || "text-graphite"}>
                  {formatEvent(event)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Metadata footer */}
      <div className="flex justify-between text-xs text-stone">
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
