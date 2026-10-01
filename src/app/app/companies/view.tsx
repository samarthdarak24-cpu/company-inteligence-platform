"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowUpRight, Building2, GitCompare, Search } from "lucide-react";
import { PageHeader, PageShell } from "@/components/app/page-shell";
import { Column, DataTable } from "@/components/ui/data-table";
import { Badge, Card, EmptyState, StatusBadge, buttonClasses } from "@/components/ui/primitives";
import { apiGet, queryKeys, type CompanyDto } from "@/lib/client-api";
import { cn, formatMoney, formatNumber, formatOrgNumber, relativeTime } from "@/lib/utils";

const FORMS = ["All", "AS", "ASA", "Other"];

export function CompaniesView() {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [term, setTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.companies,
    queryFn: () => apiGet<{ companies: CompanyDto[] }>("/api/companies"),
  });

  const rows = useMemo(() => {
    const all = data?.companies ?? [];
    return all.filter((company) => {
      const matchesForm =
        filter === "All" ||
        (filter === "Other" ? !["AS", "ASA"].includes(company.legalForm) : company.legalForm === filter);
      const matchesTerm =
        !term ||
        company.name.toLowerCase().includes(term.toLowerCase()) ||
        company.orgNumber.includes(term.replace(/\D/g, "")) ||
        company.city.toLowerCase().includes(term.toLowerCase());
      return matchesForm && matchesTerm;
    });
  }, [data, filter, term]);

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
            <div className="tnum truncate text-[11.5px] text-[var(--sp-text-subtle)]">
              {formatOrgNumber(row.orgNumber)}
            </div>
          </div>
        </div>
      ),
    },
    { key: "form", header: "Form", hideOn: "sm", render: (row) => <Badge tone="outline">{row.legalForm}</Badge> },
    {
      key: "sector",
      header: "Sector",
      hideOn: "md",
      render: (row) => <span className="text-[12.5px] text-[var(--sp-text-muted)]">{row.sector}</span>,
    },
    {
      key: "city",
      header: "Location",
      hideOn: "sm",
      render: (row) => <span className="text-[12.5px] text-[var(--sp-text-muted)]">{row.city}</span>,
    },
    {
      key: "revenue",
      header: "Revenue (2025)",
      align: "right",
      sortable: true,
      sortValue: (row) => row.revenueLatest,
      render: (row) => <span className="tnum text-[12.5px] font-medium">{formatMoney(row.revenueLatest)}</span>,
    },
    {
      key: "employees",
      header: "Employees",
      align: "right",
      hideOn: "sm",
      sortable: true,
      sortValue: (row) => row.employees,
      render: (row) => <span className="tnum text-[12.5px]">{formatNumber(row.employees)}</span>,
    },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "updated",
      header: "Updated",
      align: "right",
      sortable: true,
      sortValue: (row) => new Date(row.lastUpdated).getTime(),
      render: (row) => <span className="text-[12px] text-[var(--sp-text-muted)]">{relativeTime(row.lastUpdated)}</span>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (row) => (
        <Link
          href={`/app/company/${row.orgNumber}`}
          onClick={(event) => event.stopPropagation()}
          className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--sp-accent)] hover:underline"
        >
          Open <ArrowUpRight size={13} />
        </Link>
      ),
    },
  ];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Workspace"
        title="Companies"
        description="Every company with a profile in this demo workspace, including identity, latest reported revenue and retrieval freshness."
        actions={
          <>
            <Link href="/app/compare" className={buttonClasses("secondary", "md")}>
              <GitCompare size={15} />
              Compare
            </Link>
            <Link href="/app/search" className={buttonClasses("primary", "md")}>
              <Search size={15} />
              Search company
            </Link>
          </>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[var(--sp-border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sp-text-subtle)]" />
            <input
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Filter by name, number or city"
              aria-label="Filter companies"
              className="h-9 w-full rounded-lg border border-[var(--sp-border)] bg-[var(--sp-surface)] pl-9 pr-3 text-[13px] outline-none transition-colors duration-150 placeholder:text-[var(--sp-text-subtle)] focus:border-[var(--sp-accent)]"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-[var(--sp-border)] p-0.5" role="tablist" aria-label="Organisation form">
            {FORMS.map((form) => (
              <button
                key={form}
                type="button"
                role="tab"
                aria-selected={filter === form}
                onClick={() => setFilter(form)}
                className={cn(
                  "rounded-[6px] px-2.5 py-1 text-[12.5px] font-medium transition-colors duration-150",
                  filter === form
                    ? "bg-[var(--sp-surface-3)] text-[var(--sp-text)]"
                    : "text-[var(--sp-text-muted)] hover:text-[var(--sp-text)]",
                )}
              >
                {form}
              </button>
            ))}
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          loading={isLoading}
          dense
          getKey={(row) => row.orgNumber}
          onRowClick={(row) => router.push(`/app/company/${row.orgNumber}`)}
          empty={
            <EmptyState
              icon={<Building2 size={20} />}
              title="No companies match this filter"
              description="Adjust the filter, or search a Norwegian organisation number to add a company profile to the workspace."
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
                {formatOrgNumber(row.orgNumber)} · {row.legalForm} · {row.city}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11.5px] text-[var(--sp-text-subtle)]">
                <span className="tnum">{formatMoney(row.revenueLatest)}</span>
                <span>{relativeTime(row.lastUpdated)}</span>
              </div>
            </div>
          )}
        />
      </Card>
    </PageShell>
  );
}
