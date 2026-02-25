"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Lightbulb,
  Activity,
  Building2,
  BrainCircuit,
  ChartBar,
  Rocket,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HealthDots } from "./health-dots";

const NAV_ITEMS = [
  { href: "/", label: "Pipeline", icon: LayoutDashboard },
  { href: "/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/health", label: "Health", icon: Activity },
  { href: "/studio", label: "Studio", icon: Rocket },
  { href: "/businesses", label: "Businesses", icon: Building2 },
  { href: "/patterns", label: "Patterns", icon: BrainCircuit },
  { href: "/analytics", label: "Analytics", icon: ChartBar },
];

function SidebarContent({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className={cn("flex items-center h-14 px-4 border-b border-border", collapsed && "justify-center")}>
        <Link href="/" className="flex items-center gap-2">
          <span className="font-mono text-lg font-bold text-emerald-500">IG</span>
          {!collapsed && (
            <span className="text-sm font-medium text-zinc-300">Idea Generator</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors relative",
                isActive
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800",
                collapsed && "justify-center px-2"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-emerald-500 rounded-r" />
              )}
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={cn("border-t border-border px-4 py-3", collapsed && "px-2")}>
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
          <HealthDots />
          {!collapsed && (
            <button
              onClick={onToggle}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
          {collapsed && (
            <button
              onClick={onToggle}
              className="text-zinc-500 hover:text-zinc-300 transition-colors ml-2"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  function toggleCollapse() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:block shrink-0 transition-all duration-200",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <SidebarContent collapsed={collapsed} onToggle={toggleCollapse} />
      </aside>

      {/* Mobile hamburger + sheet */}
      <div className="md:hidden fixed top-3 left-3 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-400">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0 bg-card border-border">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarContent collapsed={false} onToggle={() => {}} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
