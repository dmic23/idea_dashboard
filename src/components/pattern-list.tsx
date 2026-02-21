import type { DashboardPattern } from "@/lib/types";
import { EmptyState } from "@/components/empty-state";

interface PatternListProps {
  patterns: DashboardPattern[];
}

function confidenceColor(confidence: number): string {
  if (confidence >= 0.8) return "bg-status-green";
  if (confidence >= 0.5) return "bg-status-yellow";
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
      {patterns.map((pattern) => (
        <div
          key={pattern.id}
          className="bg-ivory-warm border border-mist rounded-precision p-6 space-y-3"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-stone">
                {pattern.pattern_type}
              </span>
              <p className="text-sm text-graphite leading-relaxed">
                {pattern.description}
              </p>
            </div>
            <span className="text-xs text-stone whitespace-nowrap">
              n={pattern.sample_size}
            </span>
          </div>

          {/* Confidence Bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone w-20 shrink-0">Confidence</span>
            <div className="flex-1 h-2 bg-mist/50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${confidenceColor(pattern.confidence)}`}
                style={{ width: `${pattern.confidence * 100}%` }}
              />
            </div>
            <span className="font-mono text-xs text-graphite w-12 text-right">
              {(pattern.confidence * 100).toFixed(0)}%
            </span>
          </div>

          {/* Conditions & Outcome */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-mist/50">
            {Object.keys(pattern.conditions).length > 0 && (
              <div>
                <div className="text-xs text-stone mb-1.5">Conditions</div>
                <div className="space-y-1">
                  {Object.entries(pattern.conditions).map(([k, v]) => (
                    <div
                      key={k}
                      className="text-xs flex gap-2"
                    >
                      <span className="text-stone">{k}:</span>
                      <span className="text-graphite font-mono">
                        {String(v)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {Object.keys(pattern.outcome).length > 0 && (
              <div>
                <div className="text-xs text-stone mb-1.5">Outcome</div>
                <div className="space-y-1">
                  {Object.entries(pattern.outcome).map(([k, v]) => (
                    <div
                      key={k}
                      className="text-xs flex gap-2"
                    >
                      <span className="text-stone">{k}:</span>
                      <span className="text-graphite font-mono">
                        {String(v)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
