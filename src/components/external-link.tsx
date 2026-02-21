interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function ExternalLink({ href, children, className = "" }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-indigo hover:text-indigo-deep transition-colors ${className}`}
    >
      {children}
      <span className="text-xs">&nearr;</span>
    </a>
  );
}
