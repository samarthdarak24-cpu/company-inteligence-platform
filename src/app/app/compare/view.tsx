"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, GitCompare, Plus, X } from "lucide-react";
import { PageHeader, PageShell } from "@/components/app/page-shell";
import { Badge, Card, EmptyState, buttonClasses } from "@/components/ui/primitives";
import { apiGet, queryKeys, type ActivityDto, type CompanyDto, type FinancialDto } from "@/lib/client-api";
import { cn, formatDate, formatMoney, formatNumber, formatOrgNumber, relativeTime } from "@/lib/utils";

type CompareEntry = {
  company: CompanyDto;
  latestFinancial: FinancialDto | null;
  openRoles: number;
  latestActivity: ActivityDto | null;
};

const DEFAULT = ["979543883", "996343005", "912285519"];

export function CompareView() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = (params.get("orgs") ?? "").split(",").filter(Boolean);
  const [selected, setSelected] = useState<string[]>(initial.length ? initial.slice(0, 4) : DEFAULT);
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    const next = selected.join(",");
    const current = params.get("orgs") ?? "";
    if (next !== current) router.replace(`/app/compare${next ? `?orgs=${next}` : ""}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const { data: companiesData } = useQuery({
    queryKey: queryKeys.companies,
    queryFn: () => apiGet<{ companies: CompanyDto[] }>("/api/companies"),
  });

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.compare(selected),
    queryFn: () => apiGet<{ companies: CompareEntry[] }>(`/api/compare?orgs=${selected.join(",")}`),
    enabled: selected.length > 0,
  });

  const entries = data?.companies ?? [];
  const available = (companiesData?.companies ?? []).filter((c) => !selected.includes(c.orgNumber));

  const rows = useMemo(
    () => [
      {
        label: "Revenue (2025)",
        value: (entry: CompareEntry) => formatMoney(entry.latestFinancial?.revenue ?? entry.company.revenueLatest),
        compare: (entry: CompareEntry) => entry.latestFinancial?.revenue ?? entry.company.revenueLatest,
      },
      {
        label: "Operating profit",
        value: (entry: CompareEntry) => (entry.latestFinancial ? formatMoney(entry.latestFinancial.operatingProfit) : "Not available"),
        compare: (entry: CompareEntry) => entry.latestFinancial?.operatingProfit ?? 0,
      },
      {
        label: "Employees",
        value: (entry: CompareEntry) => formatNumber(entry.company.employees),
        compare: (entry: CompareEntry) => entry.company.employees,
      },
      { label: "Location", value: (entry: CompareEntry) => `${entry.company.city}, ${entry.company.country}` },
      { label: "Organisation form", value: (entry: CompareEntry) => entry.company.legalForm },
      {
        label: "Latest filing",
        value: (entry: CompareEntry) => (entry.latestFinancial ? entry.latestFinancial.reportingPeriod : "Not available"),
      },
      {
        label: "Open roles",
        value: (entry: CompareEntry) => `${entry.openRoles}`,
        compare: (entry: CompareEntry) => entry.openRoles,
      },
      {
        label: "Recent activity",
        value: (entry: CompareEntry) =>
          entry.latestActivity ? `${entry.latestActivity.title} · ${formatDate(entry.latestActivity.occurredAt)}` : "No public activity",
      },
      {
        label: "Evidence coverage",
        value: (entry: CompareEntry) => `${Number(entry.company.evidenceCoverage).toFixed(1)}%`,
        compare: (entry: CompareEntry) => Number(entry.company.evidenceCoverage),
      },
      { label: "Last retrieved", value: (entry: CompareEntry) => relativeTime(entry.company.lastUpdated) },
    ],
    [],
  );

  return (
    <PageShell>
      <PageHeader
        eyebrow="Analysis"
        title="Compare companies"
        description="Place two to four demo companies side by side. Differences are highlighted subtly — no winners are declared."
        actions={
          <button
            type="button"
            onClick={() => setPicking((v) => !v)}
            className={buttonClasses("secondary", "md")}
            disabled={selected.length >= 4 || available.length === 0}
          >
            <Plus size={15} />
            Add company
          </button>
        }
      />

      {picking ? (
        <Card className="mb-4 p-3">
          <div className="flex flex-wrap gap-2">
            {available.map((company) => (
              <button
                key={company.orgNumber}
                type="button"
                onClick={() => {
                  setSelected((prev) => (prev.length < 4 ? [...prev, company.orgNumber] : prev));
                  setPicking(false);
                }}
                className="rounded-lg border border-[var(--sp-border)] px-2.5 py-1.5 text-[12.5px] transition-colors duration-150 hover:border-[var(--sp-border-strong)] hover:bg-[var(--sp-surface-2)]"
              >
                {company.name}
              </button>
            ))}
          </div>
        </Card>
      ) : null}

      {selected.length === 0 ? (
        <Card>
          <EmptyState
            icon={<GitCompare size={20} />}
            title="No companies selected"
            description="Add up to four companies to compare their reported figures, hiring activity and evidence coverage."
            action={
              <button type="button" onClick={() => setSelected(DEFAULT)} className={buttonClasses("primary", "sm")}>
                Load demo comparison
              </button>
            }
          />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="sp-scroll overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="border-b border-[var(--sp-border)]">
                  <th scope="col" className="w-[180px] px-5 py-3 text-left text-[11.5px] font-medium uppercase tracking-[0.07em] text-[var(--sp-text-subtle)]">
                    Field
                  </th>
                  {entries.map((entry) => (
                    <th key={entry.company.orgNumber} scope="col" className="px-5 py-3 text-left align-top">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href={`/app/company/${entry.company.orgNumber}`}
                            className="block truncate text-[14px] font-semibold tracking-[-0.01em] hover:text-[var(--sp-accent)]"
                          >
                            {entry.company.name}
                          </Link>
                          <div className="tnum mt-0.5 truncate text-[11.5px] font-normal text-[var(--sp-text-subtle)]">
                            {formatOrgNumber(entry.company.orgNumber)}
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${entry.company.name} from comparison`}
                          onClick={() => setSelected((prev) => prev.filter((o) => o !== entry.company.orgNumber))}
                          className="shrink-0 rounded-md p-1 text-[var(--sp-text-subtle)] transition-colors duration-150 hover:bg-[var(--sp-surface-2)] hover:text-[var(--sp-text)]"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b border-[var(--sp-border)]">
                        <td className="px-5 py-3.5">
                          <div className="sp-skeleton h-3 w-24 rounded" />
                        </td>
                        {selected.map((org) => (
                          <td key={org} className="px-5 py-3.5">
                            <div className="sp-skeleton h-3 w-20 rounded" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : rows.map((row) => {
                      const numbers = row.compare ? entries.map(row.compare) : [];
                      const maxValue = numbers.length ? Math.max(...numbers) : null;
                      const allEqual = numbers.length > 1 && numbers.every((n) => n === numbers[0]);
                      return (
                        <tr key={row.label} className="border-b border-[var(--sp-border)] last:border-b-0">
                          <th scope="row" className="px-5 py-3.5 text-left text-[12.5px] font-medium text-[var(--sp-text-muted)]">
                            {row.label}
                          </th>
                          {entries.map((entry, index) => {
                            const highlight =
                              row.compare && maxValue !== null && !allEqual && numbers[index] === maxValue;
                            return (
                              <td
                                key={entry.company.orgNumber}
                                className={cn(
                                  "tnum px-5 py-3.5 text-[13px]",
                                  highlight ? "bg-[var(--sp-accent-soft)]/50 font-medium text-[var(--sp-text)]" : "text-[var(--sp-text)]",
                                )}
                              >
                                {row.value(entry)}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--sp-border)] bg-[var(--sp-surface-2)]/50 px-5 py-3">
            <Badge tone="outline">Highlight marks the highest reported value, not a ranking</Badge>
            <Link href="/app/companies" className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--sp-accent)] hover:underline">
              Browse companies <ArrowUpRight size={13} />
            </Link>
          </div>
        </Card>
      )}
    </PageShell>
  );
}
