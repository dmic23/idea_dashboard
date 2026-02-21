import { STAGE_ORDER, STAGE_LABELS, type PipelineStage } from "@/lib/types";

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
        const isFuture = i > currentIndex;

        return (
          <div key={stage} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono ${
                  isPast
                    ? "bg-status-green/20 text-status-green"
                    : isCurrent
                      ? "bg-indigo text-ivory"
                      : "bg-mist/50 text-stone"
                }`}
              >
                {isPast ? "ok" : i + 1}
              </div>
              <span
                className={`text-[10px] mt-1 whitespace-nowrap ${
                  isCurrent ? "text-indigo font-medium" : isFuture ? "text-mist" : "text-stone"
                }`}
              >
                {STAGE_LABELS[stage]}
              </span>
            </div>
            {i < STAGE_ORDER.length - 1 && (
              <div
                className={`w-6 h-px mx-0.5 mt-[-12px] ${
                  i < currentIndex ? "bg-status-green" : "bg-mist"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
