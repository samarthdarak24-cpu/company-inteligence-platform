"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Building2,
  Briefcase,
  FileText,
  Globe2,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { PageHeader, PageShell } from "@/components/app/page-shell";
import { Sparkline } from "@/components/ui/charts";
import { Column, DataTable } from "@/components/ui/data-table";
import {
  Badge,
  Card,
  CardHeader,
  DemoBadge,
  EmptyState,
  MetricCard,
  Skeleton,
  StatusBadge,
  buttonClasses,
} from "@/components/ui/primitives";
import { apiGet, queryKeys, type ChangeDto, type CompanyDto } from "@/lib/client-api";
import { formatDate, formatMoney, formatNumber, formatOrgNumber, relativeTime } from "@/lib/utils";

type StatsResponse = {
  stats: {
    companiesResearched: number;
    profilesUpdated: number;
    sourcesChecked: number;
    evidenceCoverage: number;
    companiesTracked: number;
    openRoles: number;
  };
  recent: CompanyDto[];
  changes: ChangeDto[];
};

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const CHANGE_ICON: Record<string, React.ReactNode> = {
  Financials: <TrendingUp size={14} />,
  People: <Users size={14} />,
  Hiring: <Briefcase size={14} />,
  Locations: <MapPin size={14} />,
  "Company record": <Building2 size={14} />,
};

export function OverviewView() {
  const router = useRouter();
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: queryKeys.stats,
    queryFn: () => apiGet<StatsResponse>("/api/stats"),
  });

  const columns: Column<CompanyDto>[] = [
    {
      key: "name",
      header: "Company",
      sortable: true,
      sortValue: (row) => row.name,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--sp-border)] bg-[var(--sp-surface-2)] text-[var(--sp-text-subtle)]">
            <Building2 size={13} />
          </span>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium">{row.name}</div>
            <div className="truncate text-[11.5px] text-[var(--sp-text-subtle)]">{row.city}</div>
          </div>
        </div>
      ),
    },
    {
      key: "org",
      header: "Organisation number",
      hideOn: "sm",
      render: (row) => <span className="tnum text-[12.5px] text-[var(--sp-text-muted)]">{formatOrgNumber(row.orgNumber)}</span>,
    },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "updated",
      header: "Last updated",
      sortable: true,
      sortValue: (row) => new Date(row.lastUpdated).getTime(),
      render: (row) => <span className="text-[12.5px] text-[var(--sp-text-muted)]">{relativeTime(row.lastUpdated)}</span>,
    },
    {
      key: "evidence",
      header: "Evidence",
      align: "right",
      sortable: true,
      sortValue: (row) => Number(row.evidenceCoverage),
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <div className="hidden h-1.5 w-14 overflow-hidden rounded-full bg-[var(--sp-surface-3)] sm:block">
            <div className="h-full rounded-full bg-[var(--sp-accent)]" style={{ width: `${row.evidenceCoverage}%` }} />
          </div>
          <span className="tnum text-[12.5px] font-medium">{Number(row.evidenceCoverage).toFixed(0)}%</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (row) => (
        <Link
          href={`/app/company/${row.orgNumber}`}
          className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--sp-accent)] hover:underline"
          onClick={(event) => event.stopPropagation()}
        >
          Open
          <ArrowUpRight size={13} />
        </Link>
      ),
    },
  ];

  return (
    <PageShell>
      <PageHeader
        eyebrow={greeting()}
        title="Company intelligence at a glance."
        description="Demo workspace seeded with ten Norwegian companies. Every figure below is demonstration data with an attached source trail."
        actions={
          <>
            <button
              type="button"
              onClick={() => refetch()}
              className={buttonClasses("secondary", "md")}
              aria-label="Refresh workspace data"
            >
              <RefreshCw size={15} className={isFetching ? "animate-spin" : undefined} />
              Refresh
            </button>
            <Link href="/app/search" className={buttonClasses("primary", "md")}>
              <Search size={15} />
              Search company
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-3 h-7 w-28" />
              <Skeleton className="mt-3 h-3 w-36" />
            </Card>
          ))
        ) : (
          <>
            <MetricCard
              label="Companies researched"
              value={formatNumber(data?.stats.companiesResearched ?? 0)}
              sublabel={`${data?.stats.companiesTracked ?? 0} companies in this demo workspace`}
              icon={<Building2 size={15} />}
              delta={{ value: 4.2 }}
              visual={<Sparkline data={[18, 24, 21, 30, 28, 36, 41]} />}
            />
            <MetricCard
              label="Profiles updated"
              value={formatNumber(data?.stats.profilesUpdated ?? 0)}
              sublabel="Changes recorded with previous values"
              icon={<RefreshCw size={15} />}
              delta={{ value: 2.8 }}
              visual={<Sparkline data={[12, 15, 13, 19, 17, 22, 24]} />}
            />
            <MetricCard
              label="Sources checked"
              value={formatNumber(data?.stats.sourcesChecked ?? 0)}
              sublabel="Registry, financial, website, jobs and news"
              icon={<FileText size={15} />}
              delta={{ value: 6.1 }}
              visual={<Sparkline data={[40, 52, 48, 61, 70, 68, 82]} />}
            />
            <MetricCard
              label="Evidence coverage"
              value={`${(data?.stats.evidenceCoverage ?? 0).toFixed(1)}%`}
              sublabel="Share of facts with an attached source"
              icon={<ShieldCheck size={15} />}
              visual={<Sparkline data={[88, 89, 90, 91, 90.5, 91.5, 91.5]} accent="var(--sp-positive)" />}
            />
          </>
        )}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.65fr_1fr]">
        <Card className="overflow-hidden">
          <CardHeader
            title="Recently researched"
            description="Companies with a profile built in this workspace."
            action={
              <Link href="/app/companies" className={buttonClasses("ghost", "sm")}>
                View all
              </Link>
            }
          />
          {isError ? (
            <EmptyState
              icon={<Globe2 size={20} />}
              title="Company information couldn't be completed."
              description="We could not verify enough permitted public evidence for this workspace request."
              action={
                <button type="button" onClick={() => refetch()} className={buttonClasses("secondary", "sm")}>
                  Try again
                </button>
              }
            />
          ) : (
            <DataTable
              columns={columns}
              rows={data?.recent ?? []}
              loading={isLoading}
              getKey={(row) => row.orgNumber}
              onRowClick={(row) => router.push(`/app/company/${row.orgNumber}`)}
              empty={
                <EmptyState
                  icon={<Building2 size={20} />}
                  title="No company researched yet"
                  description="Search a Norwegian organisation number to build the first profile in this workspace."
                  action={
                    <Link href="/app/search" className={buttonClasses("primary", "sm")}>
                      Search a company
                    </Link>
                  }
                />
              }
              mobileCard={(row) => (
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-[13.5px] font-medium">{row.name}</span>
                    <StatusBadge status={row.status} />
                  </div>
                  <div className="tnum mt-1 text-[12px] text-[var(--sp-text-muted)]">
                    {formatOrgNumber(row.orgNumber)} · {row.city}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11.5px] text-[var(--sp-text-subtle)]">
                    <span>{relativeTime(row.lastUpdated)}</span>
                    <span className="tnum">Evidence {Number(row.evidenceCoverage).toFixed(0)}%</span>
                  </div>
                </div>
              )}
            />
          )}
        </Card>

        <Card className="overflow-hidden">
          <CardHeader title="Recent changes" description="What moved across tracked companies." action={<DemoBadge />} />
          <div className="px-5 py-4">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-6 w-6 rounded-md" />
                    <div className="flex-1">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="mt-2 h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (data?.changes.length ?? 0) === 0 ? (
              <EmptyState
                icon={<RefreshCw size={20} />}
                title="No historical changes yet"
                description="Changes appear here once a profile is re-checked and a value differs from the previous reading."
              />
            ) : (
              <ol className="relative space-y-0">
                {data?.changes.slice(0, 7).map((change, index, arr) => (
                  <li key={change.id} className="relative pl-8">
                    <span className="absolute left-0 top-0.5 flex h-6 w-6 items-center justify-center rounded-md border border-[var(--sp-border)] bg-[var(--sp-surface-2)] text-[var(--sp-text-muted)]">
                      {CHANGE_ICON[change.area] ?? <FileText size={14} />}
                    </span>
                    {index < arr.slice(0, 7).length - 1 ? (
                      <span className="absolute bottom-0 left-3 top-7 w-px bg-[var(--sp-border)]" aria-hidden />
                    ) : null}
                    <div className="pb-5">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-[13px] font-medium">{change.field} changed</span>
                        <Badge tone="outline">{change.area}</Badge>
                      </div>
                      <Link
                        href={`/app/company/${change.orgNumber}?tab=history`}
                        className="mt-0.5 block truncate text-[12.5px] text-[var(--sp-accent)] hover:underline"
                      >
                        {change.companyName}
                      </Link>
                      <div className="tnum mt-1 flex flex-wrap items-center gap-2 text-[12px] text-[var(--sp-text-muted)]">
                        <span className="line-through decoration-[var(--sp-text-subtle)]">{change.previousValue}</span>
                        <span aria-hidden>→</span>
                        <span className="font-medium text-[var(--sp-text)]">{change.currentValue}</span>
                      </div>
                      <div className="mt-1 text-[11.5px] text-[var(--sp-text-subtle)]">{formatDate(change.changedAt)}</div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Card className="flex items-center justify-between gap-4 p-5">
          <div>
            <div className="text-[12.5px] text-[var(--sp-text-muted)]">Open roles tracked</div>
            <div className="tnum mt-1 text-[22px] font-semibold tracking-[-0.02em]">{data?.stats.openRoles ?? 0}</div>
          </div>
          <Briefcase size={18} className="text-[var(--sp-text-subtle)]" />
        </Card>
        <Card className="flex items-center justify-between gap-4 p-5">
          <div>
            <div className="text-[12.5px] text-[var(--sp-text-muted)]">Largest tracked revenue</div>
            <div className="tnum mt-1 text-[22px] font-semibold tracking-[-0.02em]">
              {formatMoney(Math.max(0, ...(data?.recent ?? []).map((c) => c.revenueLatest)))}
            </div>
          </div>
          <TrendingUp size={18} className="text-[var(--sp-text-subtle)]" />
        </Card>
        <Card className="flex items-center justify-between gap-4 p-5">
          <div>
            <div className="text-[12.5px] text-[var(--sp-text-muted)]">Latest retrieval</div>
            <div className="tnum mt-1 text-[16px] font-semibold tracking-[-0.01em]">
              {formatDate(data?.recent?.[0]?.lastUpdated)}
            </div>
          </div>
          <ShieldCheck size={18} className="text-[var(--sp-text-subtle)]" />
        </Card>
      </div>
    </PageShell>
  );
}
