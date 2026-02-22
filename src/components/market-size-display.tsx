import { cn } from "@/lib/utils";

interface MarketSize {
  tam?: string;
  sam?: string;
  som?: string;
  growth_rate?: string;
}

interface MarketSizeDisplayProps {
  marketSize: MarketSize;
  className?: string;
}

export function MarketSizeDisplay({ marketSize, className }: MarketSizeDisplayProps) {
  const items = [
    { label: "TAM", value: marketSize.tam },
    { label: "SAM", value: marketSize.sam },
    { label: "SOM", value: marketSize.som },
  ].filter((i) => i.value);

  if (items.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="grid grid-cols-3 gap-px bg-zinc-800/50 rounded-md overflow-hidden">
        {items.map(({ label, value }) => (
          <div key={label} className="bg-zinc-900 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">{label}</div>
            <div className="font-mono text-sm text-zinc-200">{value}</div>
          </div>
        ))}
      </div>
      {marketSize.growth_rate && (
        <div className="text-xs text-zinc-400">
          Growth: <span className="font-mono text-emerald-400">{marketSize.growth_rate}</span>
        </div>
      )}
    </div>
  );
}
