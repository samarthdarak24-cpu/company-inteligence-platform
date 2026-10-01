"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Activity as ActivityIcon, Briefcase, Building2, FileText, Globe2, Megaphone, Users } from "lucide-react";
import { PageHeader, PageShell } from "@/components/app/page-shell";
import { Badge, Card, CardHeader, EmptyState, Skeleton, buttonClasses } from "@/components/ui/primitives";
import { apiGet, queryKeys, type ActivityDto, type ChangeDto } from "@/lib/client-api";
import { cn, formatDate, relativeTime } from "@/lib/utils";

const TYPE_META: Record<string, { icon: React.ReactNode; label: string }> = {
  filing: { icon: <FileText size={14} />, label: "Filing" },
  hiring: { icon: <Briefcase size={14} />, label: "Hiring" },
  people: { icon: <Users size={14} />, label: "People" },
  news: { icon: <Megaphone size={14} />, label: "Announcement" },
  website: { icon: <Globe2 size={14} />, label: "Website" },
  registry: { icon: <Building2 size={14} />, label: "Registry" },
};

const FILTERS = ["All", "filing", "hiring", "people", "news", "website", "registry"];

export function ActivityView() {
  const [filter, setFilter] = useState("All");
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.activity,
    queryFn: () => apiGet<{ activity: ActivityDto[]; changes: ChangeDto[] }>("/api/activity"),
  });

  const entries = useMemo(
    () => (data?.activity ?? []).filter((entry) => filter === "All" || entry.type === filter),
    [data, filter],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, ActivityDto[]>();
    entries.forEach((entry) => {
      const key = entry.occurredAt;
      (map.get(key) ?? map.set(key, []).get(key)!).push(entry);
    });
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [entries]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Signals"
        title="Activity"
        description="Public signals detected across tracked companies — filings, vacancies, role changes, website updates and announcements."
      />

      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            aria-pressed={filter === item}
            className={cn(
              "rounded-lg border px-2.5 py-1.5 text-[12.5px] font-medium capitalize transition-colors duration-150",
              filter === item
                ? "border-[var(--sp-accent-border)] bg-[var(--sp-accent-soft)] text-[var(--sp-accent)]"
                : "border-[var(--sp-border)] text-[var(--sp-text-muted)] hover:text-[var(--sp-text)]",
            )}
          >
            {item === "All" ? "All signals" : (TYPE_META[item]?.label ?? item)}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Card className="overflow-hidden">
          <CardHeader title="Chronological timeline" description="Most recent public signals first." />
          <div className="px-5 py-5">
            {isLoading ? (
              <div className="space-y-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-7 w-7 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : grouped.length === 0 ? (
              <EmptyState
                icon={<ActivityIcon size={20} />}
                title="No public activity"
                description="No signals matched this filter. Public activity appears when a new filing, posting or announcement is detected."
              />
            ) : (
              <div className="space-y-7">
                {grouped.map(([date, items]) => (
                  <section key={date}>
                    <div className="mb-3 flex items-center gap-3">
                      <h3 className="tnum text-[12.5px] font-semibold text-[var(--sp-text)]">{formatDate(date)}</h3>
                      <span className="h-px flex-1 bg-[var(--sp-border)]" aria-hidden />
                      <span className="text-[11.5px] text-[var(--sp-text-subtle)]">{relativeTime(date)}</span>
                    </div>
                    <ol className="space-y-3">
                      {items.map((entry) => (
                        <li key={entry.id} className="flex gap-3">
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--sp-border)] bg-[var(--sp-surface-2)] text-[var(--sp-text-muted)]">
                            {TYPE_META[entry.type]?.icon ?? <ActivityIcon size={14} />}
                          </span>
                          <div className="min-w-0 flex-1 rounded-lg border border-[var(--sp-border)] px-3.5 py-2.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[13px] font-medium">{entry.title}</span>
                              <Badge tone="outline">{TYPE_META[entry.type]?.label ?? entry.type}</Badge>
                            </div>
                            <p className="mt-1 text-[12.5px] leading-5 text-[var(--sp-text-muted)]">{entry.description}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-[var(--sp-text-subtle)]">
                              <Link
                                href={`/app/company/${entry.orgNumber}`}
                                className="font-medium text-[var(--sp-accent)] hover:underline"
                              >
                                {entry.companyName}
                              </Link>
                              <span>Source: {entry.sourceKey.replace(/-/g, " ")}</span>
                              <Link
                                href={`/app/company/${entry.orgNumber}?tab=sources`}
                                className="hover:text-[var(--sp-text)] hover:underline"
                              >
                                View evidence
                              </Link>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader title="Value changes" description="Previous and current values across the workspace." />
          <ul className="divide-y divide-[var(--sp-border)]">
            {(data?.changes ?? []).slice(0, 12).map((change) => (
              <li key={change.id} className="px-5 py-3.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-[13px] font-medium">{change.field}</span>
                  <Badge tone="outline">{change.area}</Badge>
                </div>
                <Link
                  href={`/app/company/${change.orgNumber}?tab=history`}
                  className="mt-0.5 block truncate text-[12px] text-[var(--sp-accent)] hover:underline"
                >
                  {change.companyName}
                </Link>
                <div className="tnum mt-1.5 flex flex-wrap items-center gap-2 text-[12px] text-[var(--sp-text-muted)]">
                  <span className="line-through">{change.previousValue}</span>
                  <span aria-hidden>→</span>
                  <span className="font-medium text-[var(--sp-text)]">{change.currentValue}</span>
                </div>
                <div className="mt-1 text-[11.5px] text-[var(--sp-text-subtle)]">{formatDate(change.changedAt)}</div>
              </li>
            ))}
          </ul>
          <div className="border-t border-[var(--sp-border)] px-5 py-3">
            <Link href="/app/history" className={buttonClasses("ghost", "sm")}>
              Open full history
            </Link>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
