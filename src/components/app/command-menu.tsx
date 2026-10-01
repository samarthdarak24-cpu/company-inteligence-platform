"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Building2,
  Clock3,
  FileText,
  GitCompare,
  History,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { apiGet, queryKeys, type SearchHitDto } from "@/lib/client-api";
import { Kbd } from "@/components/ui/primitives";
import { cn, formatOrgNumber, isOrgNumber } from "@/lib/utils";

type Item = {
  id: string;
  group: "Companies" | "Recent searches" | "Actions";
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  run: () => void;
};

export function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { data } = useQuery({
    queryKey: queryKeys.search(query),
    queryFn: () =>
      apiGet<{ companies: SearchHitDto[]; recent: { id: number; query: string; orgNumber: string | null; companyName: string | null }[] }>(
        `/api/search?q=${encodeURIComponent(query)}`,
      ),
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
      return () => window.clearTimeout(timer);
    }
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const companyItems: Item[] = (data?.companies ?? []).slice(0, 6).map((hit) => ({
      id: `company-${hit.orgNumber}`,
      group: "Companies",
      title: hit.name,
      subtitle: `${formatOrgNumber(hit.orgNumber)} · ${hit.city}${hit.matchedOn === "organisation-number" ? " · matched on organisation number" : ""}`,
      icon: <Building2 size={15} />,
      run: () => router.push(`/app/company/${hit.orgNumber}`),
    }));

    const recentItems: Item[] = (data?.recent ?? [])
      .filter((entry) => entry.orgNumber)
      .slice(0, 3)
      .map((entry) => ({
        id: `recent-${entry.id}`,
        group: "Recent searches",
        title: entry.companyName ?? entry.query,
        subtitle: entry.orgNumber ? formatOrgNumber(entry.orgNumber) : entry.query,
        icon: <Clock3 size={15} />,
        run: () => router.push(`/app/company/${entry.orgNumber}`),
      }));

    const actionItems: Item[] = ([
      {
        id: "action-search",
        group: "Actions" as const,
        title: isOrgNumber(query) ? `Search organisation number ${formatOrgNumber(query)}` : "Search company",
        subtitle: "Open the search workspace",
        icon: <Search size={15} />,
        run: () => router.push(`/app/search${query ? `?q=${encodeURIComponent(query)}` : ""}`),
      },
      {
        id: "action-compare",
        group: "Actions",
        title: "Compare companies",
        subtitle: "Open side-by-side comparison",
        icon: <GitCompare size={15} />,
        run: () => router.push("/app/compare"),
      },
      {
        id: "action-sources",
        group: "Actions",
        title: "Open sources",
        subtitle: "Source register and verification state",
        icon: <FileText size={15} />,
        run: () => router.push("/app/sources"),
      },
      {
        id: "action-history",
        group: "Actions",
        title: "View history",
        subtitle: "Changes and search history",
        icon: <History size={15} />,
        run: () => router.push("/app/history"),
      },
      {
        id: "action-refresh",
        group: "Actions",
        title: "Refresh current profile",
        subtitle: "Re-check sources for the open company",
        icon: <RefreshCw size={15} />,
        run: () => router.refresh(),
      },
      {
        id: "action-settings",
        group: "Actions",
        title: "Settings",
        subtitle: "Workspace, data preferences, API",
        icon: <Settings size={15} />,
        run: () => router.push("/app/settings"),
      },
    ] satisfies Item[]).filter(
      (item) => !query || item.title.toLowerCase().includes(query.toLowerCase()) || isOrgNumber(query),
    );

    return [...companyItems, ...recentItems, ...actionItems];
  }, [data, query, router]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  if (typeof window !== "undefined") {
    // keep active index in range
    if (active >= items.length && items.length > 0) setActive(0);
  }

  const grouped = items.reduce<Record<string, Item[]>>((acc, item) => {
    (acc[item.group] ??= []).push(item);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-[rgba(16,18,24,0.4)] backdrop-blur-[2px]"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            initial={{ opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute left-1/2 top-[11vh] w-[min(640px,92vw)] -translate-x-1/2 overflow-hidden rounded-[16px] border border-[var(--sp-border)] bg-[var(--sp-surface)] shadow-[var(--sp-sheen),var(--sp-shadow-lg)]"
            onKeyDown={(event) => {
              if (event.key === "Escape") onOpenChange(false);
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((prev) => (prev + 1) % Math.max(1, items.length));
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((prev) => (prev - 1 + items.length) % Math.max(1, items.length));
              }
              if (event.key === "Enter") {
                event.preventDefault();
                const item = items[active];
                if (item) {
                  item.run();
                  onOpenChange(false);
                }
              }
            }}
          >
            <div className="flex items-center gap-3 border-b border-[var(--sp-border)] px-4 py-3.5">
              <Search size={17} className="shrink-0 text-[var(--sp-text-subtle)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search organisation number, company or action…"
                aria-label="Command menu search"
                className="h-6 w-full bg-transparent text-[14.5px] outline-none placeholder:text-[var(--sp-text-subtle)] focus-visible:outline-none"
              />
              <Kbd>Esc</Kbd>
            </div>

            <ul ref={listRef} className="sp-scroll max-h-[52vh] overflow-y-auto p-2" role="listbox">
              {items.length === 0 ? (
                <li className="px-3 py-8 text-center text-[13px] text-[var(--sp-text-muted)]">
                  No matches. Try a nine-digit organisation number.
                </li>
              ) : (
                Object.entries(grouped).map(([group, groupItems]) => (
                  <li key={group} className="mb-1">
                    <div className="px-2.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[var(--sp-text-subtle)]">
                      {group}
                    </div>
                    <ul>
                      {groupItems.map((item) => {
                        const index = items.indexOf(item);
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={index === active}
                              onMouseEnter={() => setActive(index)}
                              onClick={() => {
                                item.run();
                                onOpenChange(false);
                              }}
                              className={cn(
                                "flex w-full items-center gap-3 rounded-[9px] px-2.5 py-2 text-left transition-colors duration-100",
                                index === active
                                  ? "bg-[var(--sp-surface-2)] shadow-[var(--sp-sheen)]"
                                  : "hover:bg-[var(--sp-surface-2)]",
                              )}
                            >
                              <span
                                className={cn(
                                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] border transition-colors duration-150",
                                  index === active
                                    ? "border-[var(--sp-accent-border)] bg-[var(--sp-accent-soft)] text-[var(--sp-accent)]"
                                    : "border-[var(--sp-border)] bg-[var(--sp-surface)] text-[var(--sp-text-subtle)]",
                                )}
                              >
                                {item.icon}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-[13.5px] font-medium">{item.title}</span>
                                {item.subtitle ? (
                                  <span className="tnum block truncate text-[12px] text-[var(--sp-text-muted)]">
                                    {item.subtitle}
                                  </span>
                                ) : null}
                              </span>
                              {index === active ? <ArrowRight size={14} className="text-[var(--sp-text-subtle)]" /> : null}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))
              )}
            </ul>

            <div className="flex items-center justify-between border-t border-[var(--sp-border)] bg-[var(--sp-surface-2)]/60 px-4 py-2.5 text-[11.5px] text-[var(--sp-text-subtle)]">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={12} /> Organisation numbers rank highest
              </span>
              <span className="flex items-center gap-1.5">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd> navigate
                <Kbd>↵</Kbd> open
              </span>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
