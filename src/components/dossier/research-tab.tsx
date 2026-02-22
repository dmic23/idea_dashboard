import type { DashboardResearch } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataCell } from "@/components/data-cell";
import { MarketSizeDisplay } from "@/components/market-size-display";
import { CompetitorRow } from "@/components/competitor-row";
import { EmptyState } from "@/components/empty-state";

interface ResearchTabProps {
  research: DashboardResearch[];
}

export function ResearchTab({ research }: ResearchTabProps) {
  if (research.length === 0) {
    return <EmptyState message="No research data available for this idea." />;
  }

  return (
    <div className="space-y-4">
      {research.map((r) => (
        <Card key={r.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Research — {r.stage}
              </CardTitle>
              <span className="text-[10px] font-mono text-zinc-600">
                {new Date(r.created_at).toLocaleDateString()}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Market Size */}
            {r.market_size && Object.keys(r.market_size).length > 0 && (
              <div>
                <div className="data-label mb-2">Market Size</div>
                <MarketSizeDisplay marketSize={r.market_size} />
              </div>
            )}

            {/* Competitors */}
            {r.competitors && r.competitors.length > 0 && (
              <div>
                <div className="data-label mb-2">Competitors ({r.competitors.length})</div>
                <div className="grid gap-2">
                  {r.competitors.map((comp, i) => (
                    <CompetitorRow key={i} competitor={comp} />
                  ))}
                </div>
              </div>
            )}

            {/* Feasibility */}
            {r.feasibility && (
              <div>
                <div className="data-label mb-2">Feasibility</div>
                <div className="flex flex-wrap gap-4">
                  {r.feasibility.score !== undefined && (
                    <DataCell label="Score" value={r.feasibility.score.toFixed(1)} />
                  )}
                  {r.feasibility.technical_risk && (
                    <DataCell label="Technical Risk" value={r.feasibility.technical_risk} />
                  )}
                  {r.feasibility.dependencies && r.feasibility.dependencies.length > 0 && (
                    <div className="space-y-1">
                      <div className="data-label">Dependencies</div>
                      <div className="flex flex-wrap gap-1">
                        {r.feasibility.dependencies.map((dep, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px]">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Business Model */}
            {r.business_model && (
              <div>
                <div className="data-label mb-2">Business Model</div>
                <div className="flex flex-wrap gap-4">
                  {r.business_model.model && (
                    <DataCell label="Model" value={r.business_model.model} />
                  )}
                  {r.business_model.revenue_streams && r.business_model.revenue_streams.length > 0 && (
                    <div className="space-y-1">
                      <div className="data-label">Revenue Streams</div>
                      <div className="flex flex-wrap gap-1">
                        {r.business_model.revenue_streams.map((stream, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px]">
                            {stream}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Operability */}
            {r.ai_operability_score !== null && (
              <DataCell
                label="AI Operability Score"
                value={r.ai_operability_score.toFixed(1)}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
