"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabNavProps {
  tabs: TabItem[];
  paramName?: string;
  className?: string;
}

export function TabNav({ tabs, paramName = "tab", className }: TabNavProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = searchParams.get(paramName) || tabs[0]?.id;

  function setTab(tabId: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (tabId === tabs[0]?.id) {
      params.delete(paramName);
    } else {
      params.set(paramName, tabId);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className={cn("flex border-b border-border", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setTab(tab.id)}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-colors relative",
            activeTab === tab.id
              ? "text-emerald-500"
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1.5 text-[10px] font-mono text-zinc-600">
              {tab.count}
            </span>
          )}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
          )}
        </button>
      ))}
    </div>
  );
}
