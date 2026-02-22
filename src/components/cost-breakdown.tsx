import { cn } from "@/lib/utils";
import type { DashboardCost } from "@/lib/types";

interface CostBreakdownProps {
  costs: DashboardCost[];
  className?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  research: "Research",
  validation: "Validation",
  build: "Build",
  operations: "Operations",
};

export function CostBreakdown({ costs, className }: CostBreakdownProps) {
  const grouped = costs.reduce<Record<string, { total: number; items: DashboardCost[] }>>((acc, c) => {
    const cat = c.category;
    if (!acc[cat]) acc[cat] = { total: 0, items: [] };
    acc[cat].total += c.amount;
    acc[cat].items.push(c);
    return acc;
  }, {});

  const grandTotal = costs.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className={cn("space-y-3", className)}>
      {Object.entries(grouped).map(([category, { total, items }]) => (
        <div key={category} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">
              {CATEGORY_LABELS[category] || category}
            </span>
            <span className="font-mono text-xs text-zinc-300">
              ${total.toFixed(2)}
            </span>
          </div>
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between pl-3">
              <span className="text-[11px] text-zinc-500 truncate max-w-[200px]">
                {item.description}
              </span>
              <span className="font-mono text-[11px] text-zinc-400">
                ${item.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      ))}
      <div className="border-t border-border pt-2 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-300">Total</span>
        <span className="font-mono text-sm font-medium text-zinc-100">
          ${grandTotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
