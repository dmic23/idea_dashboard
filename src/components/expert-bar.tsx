import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const EXPERT_COLORS: Record<string, string> = {
  market: "bg-status-blue",
  technical: "bg-emerald-500",
  user: "bg-purple-400",
  finance: "bg-status-amber",
  contrarian: "bg-status-red",
};

const EXPERT_LABELS: Record<string, string> = {
  market: "MKT",
  technical: "TECH",
  user: "USR",
  finance: "FIN",
  contrarian: "CTR",
};

interface ExpertBarProps {
  scores: Record<string, number>;
  compact?: boolean;
  className?: string;
}

export function ExpertBar({ scores, compact = false, className }: ExpertBarProps) {
  const expertOrder = ["market", "technical", "user", "finance", "contrarian"];
  const entries = expertOrder.filter((k) => k in scores);

  if (entries.length === 0) return <span className="text-zinc-600 font-mono text-xs">--</span>;

  if (compact) {
    return (
      <TooltipProvider>
        <div className={cn("flex gap-0.5", className)}>
          {entries.map((key) => {
            const score = scores[key];
            const color = score >= 7 ? "bg-status-green" : score >= 5 ? "bg-status-amber" : "bg-status-red";
            return (
              <Tooltip key={key}>
                <TooltipTrigger>
                  <div className={cn("w-2.5 h-2.5 rounded-sm", color)} />
                </TooltipTrigger>
                <TooltipContent side="top" className="font-mono text-xs">
                  {EXPERT_LABELS[key] || key}: {score.toFixed(1)}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      {entries.map((key) => {
        const score = scores[key];
        const barColor = EXPERT_COLORS[key] || "bg-zinc-500";
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-500 w-8 shrink-0 uppercase">
              {EXPERT_LABELS[key] || key}
            </span>
            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full", barColor)}
                style={{ width: `${(score / 10) * 100}%` }}
              />
            </div>
            <span className="font-mono text-xs text-zinc-300 w-7 text-right">
              {score.toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
