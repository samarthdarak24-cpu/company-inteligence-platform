"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ExternalLink, FileText, Globe2, LayoutGrid, List, Megaphone, ShieldCheck, Briefcase } from "lucide-react";
import { PageHeader, PageShell } from "@/components/app/page-shell";
import { Column, DataTable } from "@/components/ui/data-table";
import { Badge, Card, EmptyState, IconButton } from "@/components/ui/primitives";
import { useEvidence } from "@/components/app/evidence-drawer";
import { apiGet, queryKeys, type SourceDto } from "@/lib/client-api";
import { cn, formatDate, formatOrgNumber } from "@/lib/utils";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "official", label: "Official" },
  { key: "financial", label: "Financial" },
  { key: "jobs", label: "Jobs" },
  { key: "news", label: "News" },
  { key: "other", label: "Other" },
];

export function SourceTypeIcon({ type }: { type: string }) {
  if (type === "official") return <ShieldCheck size={14} />;
  if (type === "financial") return <FileText size={14} />;
  if (type === "jobs") return <Briefcase size={14} />;
  if (type === "news") return <Megaphone size={14} />;
  return <Globe2 size={14} />;
}

export function SourcesView() {
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState<"table" | "cards">("table");
  const evidence = useEvidence();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.sources(filter),
    queryFn: () => apiGet<{ sources: SourceDto[] }>(`/api/sources?type=${filter}`),
  });

  const sources = data?.sources ?? [];

  const columns: Column<SourceDto>[] = [
    {
      key: "title",
      header: "Source",
      sortable: true,
      sortValue: (row) => row.title,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--sp-border)] bg-[var(--sp-surface-2)] text-[var(--sp-text-subtle)]">
            <SourceTypeIcon type={row.type} />
          </span>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-medium">{row.title}</div>
            <div className="truncate text-[11.5px] text-[var(--sp-text-subtle)]">{row.domain}</div>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (row) => (
        <Badge tone="neutral" className="capitalize">
          {row.type}
        </Badge>
      ),
    },
    {
      key: "company",
      header: "Company",
      hideOn: "sm",
      render: (row) => (
        <div className="min-w-0">
          <div className="truncate text-[12.5px]">{row.companyName}</div>
          <div className="tnum truncate text-[11.5px] text-[var(--sp-text-subtle)]">{formatOrgNumber(row.orgNumber)}</div>
        </div>
      ),
    },
    {
      key: "retrieved",
      header: "Retrieved",
      align: "right",
      sortable: true,
      sortValue: (row) => row.retrievedAt,
      render: (row) => <span className="tnum text-[12.5px] text-[var(--sp-text-muted)]">{formatDate(row.retrievedAt)}</span>,
    },
    {
      key: "published",
      header: "Published",
      align: "right",
      hideOn: "md",
      sortable: true,
      sortValue: (row) => row.publishedAt,
      render: (row) => <span className="tnum text-[12.5px] text-[var(--sp-text-muted)]">{formatDate(row.publishedAt)}</span>,
    },
    {
      key: "status",
      header: "Status",
      align: "right",
      render: (row) => (
        <Badge tone={row.status === "verified" ? "positive" : row.status === "ambiguous" ? "warning" : "accent"}>
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Evidence"
        title="Sources"
        description="Every source checked in this workspace, with retrieval and publication dates. Open a source to inspect its excerpt and verification status."
        actions={
          <div className="flex items-center gap-1 rounded-lg border border-[var(--sp-border)] p-0.5">
            <IconButton label="Table view" onClick={() => setView("table")} className={view === "table" ? "bg-[var(--sp-surface-3)] text-[var(--sp-text)]" : ""}>
              <List size={15} />
            </IconButton>
            <IconButton label="Card view" onClick={() => setView("cards")} className={view === "cards" ? "bg-[var(--sp-surface-3)] text-[var(--sp-text)]" : ""}>
              <LayoutGrid size={15} />
            </IconButton>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {FILTERS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            aria-pressed={filter === item.key}
            className={cn(
              "rounded-lg border px-2.5 py-1.5 text-[12.5px] font-medium transition-colors duration-150",
              filter === item.key
                ? "border-[var(--sp-accent-border)] bg-[var(--sp-accent-soft)] text-[var(--sp-accent)]"
                : "border-[var(--sp-border)] text-[var(--sp-text-muted)] hover:text-[var(--sp-text)]",
            )}
          >
            {item.label}
          </button>
        ))}
        <span className="tnum ml-auto text-[12px] text-[var(--sp-text-subtle)]">{sources.length} sources</span>
      </div>

      {view === "table" ? (
        <Card className="overflow-hidden">
          <DataTable
            columns={columns}
            rows={sources}
            loading={isLoading}
            dense
            getKey={(row) => `${row.orgNumber}-${row.key}`}
            onRowClick={(row) => evidence.open({ source: row, companyName: row.companyName, orgNumber: row.orgNumber })}
            empty={
              <EmptyState
                icon={<FileText size={20} />}
                title="No source available"
                description="No sources of this type have been retrieved yet. Sources appear as soon as a profile is researched."
              />
            }
            mobileCard={(row) => (
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-[13px] font-medium">{row.title}</span>
                  <Badge tone={row.status === "verified" ? "positive" : row.status === "ambiguous" ? "warning" : "accent"}>
                    {row.status}
                  </Badge>
                </div>
                <div className="mt-1 truncate text-[12px] text-[var(--sp-text-muted)]">
                  {row.domain} · {row.companyName}
                </div>
                <div className="tnum mt-1.5 text-[11.5px] text-[var(--sp-text-subtle)]">
                  Retrieved {formatDate(row.retrievedAt)}
                </div>
              </div>
            )}
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Card key={i} className="h-44 animate-pulse" />)
            : sources.map((source) => (
                <Card key={`${source.orgNumber}-${source.key}`} interactive className="flex flex-col p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--sp-border)] bg-[var(--sp-surface-2)] text-[var(--sp-text-muted)]">
                        <SourceTypeIcon type={source.type} />
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate text-[13.5px] font-medium">{source.title}</h3>
                        <p className="truncate text-[11.5px] text-[var(--sp-text-subtle)]">{source.domain}</p>
                      </div>
                    </div>
                    <Badge tone={source.status === "verified" ? "positive" : source.status === "ambiguous" ? "warning" : "accent"}>
                      {source.status === "verified" ? "Verified" : source.status === "ambiguous" ? "Ambiguous" : "Source-backed"}
                    </Badge>
                  </div>
                  <p className="mt-3 line-clamp-3 text-[12.5px] leading-5 text-[var(--sp-text-muted)]">{source.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--sp-border)] pt-3 text-[11.5px] text-[var(--sp-text-subtle)]">
                    <span className="tnum truncate">Last checked {formatDate(source.retrievedAt)}</span>
                    <button
                      type="button"
                      onClick={() => evidence.open({ source, companyName: source.companyName, orgNumber: source.orgNumber })}
                      className="inline-flex items-center gap-1 font-medium text-[var(--sp-accent)] hover:underline"
                    >
                      Evidence <ExternalLink size={12} />
                    </button>
                  </div>
                </Card>
              ))}
        </div>
      )}
    </PageShell>
  );
}
