interface EmptyStateProps {
  message: string;
  className?: string;
}

export function EmptyState({ message, className = "" }: EmptyStateProps) {
  return (
    <div
      className={`bg-ivory-warm border border-mist rounded-precision p-12 text-center ${className}`}
    >
      <p className="text-stone text-sm">{message}</p>
    </div>
  );
}
