import { cn } from "@/lib/utils";

interface DataCellProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export function DataCell({ label, value, className }: DataCellProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="data-label">{label}</div>
      <div className="data-value">{value ?? "--"}</div>
    </div>
  );
}
