import type { DashboardReview, DashboardExpertReview } from "@/lib/types";
import { DECISION_LABELS } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExpertBar } from "@/components/expert-bar";
import { ScoreDisplay } from "@/components/score-display";
import { EmptyState } from "@/components/empty-state";

interface ExpertsTabProps {
  reviews: DashboardReview[];
  expertReviews: DashboardExpertReview[];
}

export function ExpertsTab({ reviews, expertReviews }: ExpertsTabProps) {
  if (reviews.length === 0) {
    return <EmptyState message="No expert reviews available for this idea." />;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const experts = expertReviews.filter((er) => er.review_id === review.id);
        const decisionColor =
          review.decision === "advance"
            ? "bg-status-green/10 text-status-green border-status-green/20"
            : review.decision === "kill"
              ? "bg-status-red/10 text-status-red border-status-red/20"
              : review.decision === "iterate"
                ? "bg-status-amber/10 text-status-amber border-status-amber/20"
                : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";

        return (
          <Card key={review.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-sm font-medium text-zinc-400">
                    {review.gate} — Iteration {review.iteration_number}
                  </CardTitle>
                  <Badge variant="outline" className={`font-mono text-[11px] border ${decisionColor}`}>
                    {DECISION_LABELS[review.decision] || review.decision}
                  </Badge>
                </div>
                <span className="text-[10px] font-mono text-zinc-600">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Weighted Average */}
              <div className="flex items-center gap-4">
                <div>
                  <div className="data-label">Weighted Average</div>
                  <ScoreDisplay score={review.weighted_average} className="text-xl" />
                </div>
              </div>

              {/* Expert Score Bars */}
              {Object.keys(review.expert_scores).length > 0 && (
                <div>
                  <div className="data-label mb-2">Expert Scores</div>
                  <ExpertBar scores={review.expert_scores} />
                </div>
              )}

              {/* Veto Flags */}
              {review.veto_flags.length > 0 && (
                <div>
                  <div className="data-label mb-2">Veto Flags</div>
                  <div className="space-y-1">
                    {review.veto_flags.map((flag, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-sm px-3 py-2 rounded-sm border-l-2 border-l-status-red bg-status-red/5"
                      >
                        <span className="font-mono text-[10px] text-status-red uppercase shrink-0 mt-0.5">
                          {flag.expert}
                        </span>
                        <span className="text-zinc-300">{flag.reason}</span>
                        <Badge variant="secondary" className="text-[10px] ml-auto shrink-0">
                          {flag.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reasoning */}
              {review.reasoning && (
                <div>
                  <div className="data-label mb-1">Reasoning</div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{review.reasoning}</p>
                </div>
              )}

              {/* Individual Expert Reviews */}
              {experts.length > 0 && (
                <div>
                  <div className="data-label mb-2">Individual Expert Reviews ({experts.length})</div>
                  <div className="space-y-2">
                    {experts.map((er) => (
                      <div
                        key={er.id}
                        className="border border-border rounded-md p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs uppercase text-zinc-400">
                            {er.expert_type}
                          </span>
                          <ScoreDisplay score={er.score} className="text-sm" />
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          {er.reasoning}
                        </p>
                        {er.concerns.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {er.concerns.map((concern, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-[10px] bg-status-amber/10 text-status-amber border-status-amber/20"
                              >
                                {typeof concern === "string" ? concern : JSON.stringify(concern)}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
