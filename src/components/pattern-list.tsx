import type { DashboardPattern } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

interface PatternListProps {
  patterns: DashboardPattern[];
}

function confidenceColor(confidence: number): string {
  if (confidence >= 0.8) return "bg-status-green";
  if (confidence >= 0.5) return "bg-status-amber";
  return "bg-status-red";
}

export function PatternList({ patterns }: PatternListProps) {
  if (patterns.length === 0) {
    return (
      <EmptyState message="No patterns learned yet. Patterns emerge as ideas progress through the pipeline and outcomes are recorded." />
    );
  }

  return (
    <div className="space-y-4">
      {patterns.map((pattern, i) => (
        <Card
          key={pattern.id}
          className={cn(
            "motion-preset-fade motion-duration-300",
            i > 0 && `motion-delay-[${i * 75}ms]`
          )}
        >
          <CardContent className="pt-6 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <Badge variant="secondary" className="font-mono text-[11px]">
                  {pattern.pattern_type}
                </Badge>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {pattern.description}
                </p>
              </div>
              <span className="text-xs text-zinc-500 whitespace-nowrap font-mono">
                n={pattern.sample_size}
              </span>
            </div>

            {/* Confidence Bar */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 w-20 shrink-0">Confidence</span>
              <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", confidenceColor(pattern.confidence))}
                  style={{ width: `${pattern.confidence * 100}%` }}
                />
              </div>
              <span className="font-mono text-xs text-zinc-400 w-12 text-right">
                {(pattern.confidence * 100).toFixed(0)}%
              </span>
            </div>

            {/* Conditions & Outcome */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-border">
              {Object.keys(pattern.conditions).length > 0 && (
                <div>
                  <div className="text-xs text-zinc-500 mb-1.5">Conditions</div>
                  <div className="space-y-1">
                    {Object.entries(pattern.conditions).map(([k, v]) => (
                      <div key={k} className="text-xs flex gap-2">
                        <span className="text-zinc-500">{k}:</span>
                        <span className="text-zinc-300 font-mono">
                          {String(v)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {Object.keys(pattern.outcome).length > 0 && (
                <div>
                  <div className="text-xs text-zinc-500 mb-1.5">Outcome</div>
                  <div className="space-y-1">
                    {Object.entries(pattern.outcome).map(([k, v]) => (
                      <div key={k} className="text-xs flex gap-2">
                        <span className="text-zinc-500">{k}:</span>
                        <span className="text-zinc-300 font-mono">
                          {String(v)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
