"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HealthDots } from "./health-dots";

const NAV_ITEMS = [
  { href: "/", label: "Pipeline" },
  { href: "/ideas", label: "Ideas" },
  { href: "/health", label: "Health" },
  { href: "/businesses", label: "Biz" },
  { href: "/patterns", label: "Patterns" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-mist bg-ivory">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-serif text-xl text-black tracking-tight">
            IG
          </Link>
          <div className="flex items-center gap-6">
            {NAV_ITEMS.map(({ href, label }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm font-sans pb-0.5 transition-colors ${
                    isActive
                      ? "text-indigo border-b-2 border-indigo"
                      : "text-stone hover:text-graphite"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
        <HealthDots />
      </div>
    </nav>
  );
}
