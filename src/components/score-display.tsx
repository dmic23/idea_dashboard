interface ScoreDisplayProps {
  score: number | null;
  className?: string;
}

export function ScoreDisplay({ score, className = "" }: ScoreDisplayProps) {
  if (score === null) {
    return <span className={`font-mono text-stone ${className}`}>--</span>;
  }

  let color = "text-status-red";
  if (score >= 7) color = "text-status-green";
  else if (score >= 5) color = "text-status-yellow";

  return (
    <span className={`font-mono font-medium ${color} ${className}`}>
      {score.toFixed(1)}
    </span>
  );
}
