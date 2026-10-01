"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { History as HistoryIcon, Search, Trash2 } from "lucide-react";
import { PageHeader, PageShell } from "@/components/app/page-shell";
import { Badge, Button, Card, CardHeader, EmptyState, Skeleton, buttonClasses } from "@/components/ui/primitives";
import { apiDelete, apiGet, queryKeys, type ChangeDto } from "@/lib/client-api";
import { formatDate, formatOrgNumber, relativeTime } from "@/lib/utils";

type HistoryResponse = {
  searches: { id: number; query: string; orgNumber: string | null; companyName: string | null; createdAt: string }[];
  changes: ChangeDto[];
};

export function HistoryView() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.history,
    queryFn: () => apiGet<HistoryResponse>("/api/history"),
  });

  const clear = useMutation({
    mutationFn: () => apiDelete<{ ok: boolean }>("/api/history"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.history }),
  });

  return (
    <PageShell>
      <PageHeader
        eyebrow="Workspace"
        title="What changed?"
        description="Signalpost keeps previous values next to current values so a profile can be read as a timeline rather than a snapshot."
      />

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card className="overflow-hidden">
          <CardHeader title="Value history" description="Observed changes with the source that recorded them." />
          <div className="px-5 py-5">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : (data?.changes.length ?? 0) === 0 ? (
              <EmptyState
                icon={<HistoryIcon size={20} />}
                title="No historical changes"
                description="Once a profile is re-checked and a value differs from the previous reading, the change is recorded here."
              />
            ) : (
              <ol className="space-y-3">
                {data?.changes.map((change) => (
                  <li
                    key={change.id}
                    className="rounded-xl border border-[var(--sp-border)] p-4 transition-colors duration-150 hover:border-[var(--sp-border-strong)]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-semibold tracking-[-0.01em]">{change.field}</span>
                        <Badge tone="outline">{change.area}</Badge>
                      </div>
                      <span className="tnum text-[12px] text-[var(--sp-text-subtle)]">{formatDate(change.changedAt)}</span>
                    </div>
                    <Link
                      href={`/app/company/${change.orgNumber}?tab=history`}
                      className="mt-1 inline-block text-[12.5px] font-medium text-[var(--sp-accent)] hover:underline"
                    >
                      {change.companyName}
                    </Link>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-lg border border-[var(--sp-border)] bg-[var(--sp-surface-2)]/50 px-3 py-2">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-subtle)]">
                          Previous
                        </div>
                        <div className="tnum mt-1 text-[13px] text-[var(--sp-text-muted)]">{change.previousValue}</div>
                      </div>
                      <div className="rounded-lg border border-[var(--sp-accent-border)] bg-[var(--sp-accent-soft)]/60 px-3 py-2">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-accent)]">
                          Current
                        </div>
                        <div className="tnum mt-1 text-[13px] font-medium">{change.currentValue}</div>
                      </div>
                    </div>
                    <div className="mt-2.5 text-[11.5px] text-[var(--sp-text-subtle)]">
                      Source: {change.sourceKey.replace(/-/g, " ")}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader
            title="Search history"
            description="Organisation numbers looked up in this workspace."
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clear.mutate()}
                disabled={clear.isPending || (data?.searches.length ?? 0) === 0}
              >
                <Trash2 size={14} />
                Clear
              </Button>
            }
          />
          {isLoading ? (
            <div className="space-y-2 p-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (data?.searches.length ?? 0) === 0 ? (
            <EmptyState
              icon={<Search size={20} />}
              title="No searches recorded"
              description="Run a search to build a lookup trail for this workspace."
              action={
                <Link href="/app/search" className={buttonClasses("primary", "sm")}>
                  Search a company
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-[var(--sp-border)]">
              {data?.searches.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-medium">{entry.companyName ?? entry.query}</div>
                    <div className="tnum truncate text-[11.5px] text-[var(--sp-text-subtle)]">
                      {entry.orgNumber ? formatOrgNumber(entry.orgNumber) : `Query: ${entry.query}`}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-[11.5px] text-[var(--sp-text-subtle)]">{relativeTime(entry.createdAt)}</span>
                    {entry.orgNumber ? (
                      <Link
                        href={`/app/company/${entry.orgNumber}`}
                        className="text-[12.5px] font-medium text-[var(--sp-accent)] hover:underline"
                      >
                        Open
                      </Link>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </PageShell>
  );
}
