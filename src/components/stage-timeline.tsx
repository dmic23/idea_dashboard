import { Check } from "lucide-react";
import { STAGE_ORDER, STAGE_LABELS, type PipelineStage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StageTimelineProps {
  currentStage: string;
}

export function StageTimeline({ currentStage }: StageTimelineProps) {
  const currentIndex = STAGE_ORDER.indexOf(currentStage as PipelineStage);

  return (
    <div className="flex items-center gap-1 overflow-x-auto py-2">
      {STAGE_ORDER.map((stage, i) => {
        const isPast = i < currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={stage} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono border",
                  isPast && "bg-emerald-500/20 border-emerald-500/30 text-emerald-500",
                  isCurrent && "bg-emerald-500 border-emerald-500 text-zinc-950",
                  !isPast && !isCurrent && "bg-zinc-800 border-zinc-700 text-zinc-500"
                )}
              >
                {isPast ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] mt-1.5 whitespace-nowrap",
                  isCurrent ? "text-emerald-500 font-medium" : isPast ? "text-zinc-400" : "text-zinc-600"
                )}
              >
                {STAGE_LABELS[stage]}
              </span>
            </div>
            {i < STAGE_ORDER.length - 1 && (
              <div
                className={cn(
                  "w-6 h-px mx-0.5 mt-[-12px]",
                  i < currentIndex ? "bg-emerald-500/50" : "bg-zinc-700"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
