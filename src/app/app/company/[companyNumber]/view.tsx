"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  FileText,
  GitCompare,
  MapPin,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { PageShell } from "@/components/app/page-shell";
import { Badge, Button, Card, EmptyState, Skeleton, StatusBadge, buttonClasses } from "@/components/ui/primitives";
import { Tooltip } from "@/components/ui/tooltip";
import { apiGet, queryKeys, type CompanyBundleDto } from "@/lib/client-api";
import { cn, formatDate, formatOrgNumber, relativeTime } from "@/lib/utils";
import {
  ActivityTab,
  FinancialsTab,
  HiringTab,
  HistoryTab,
  LocationsTab,
  OverviewTab,
  PeopleTab,
  SourcesTab,
  TAB_LIST,
  WebsiteTab,
  type TabKey,
} from "./tabs";

export function CompanyView({ orgNumber }: { orgNumber: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const tabParam = (params.get("tab") as TabKey | null) ?? "overview";
  const [tab, setTab] = useState<TabKey>(TAB_LIST.some((t) => t.key === tabParam) ? tabParam : "overview");
  const [copied, setCopied] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: queryKeys.company(orgNumber),
    queryFn: () => apiGet<CompanyBundleDto>(`/api/company/${orgNumber}`),
  });

  useEffect(() => {
    if (tabParam !== tab) setTab(TAB_LIST.some((t) => t.key === tabParam) ? tabParam : "overview");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) setExportOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function selectTab(next: TabKey) {
    setTab(next);
    router.replace(`/app/company/${orgNumber}?tab=${next}`, { scroll: false });
  }

  const panel = useMemo(() => {
    if (!data) return null;
    switch (tab) {
      case "financials":
        return <FinancialsTab bundle={data} />;
      case "people":
        return <PeopleTab bundle={data} />;
      case "locations":
        return <LocationsTab bundle={data} />;
      case "website":
        return <WebsiteTab bundle={data} />;
      case "hiring":
        return <HiringTab bundle={data} />;
      case "activity":
        return <ActivityTab bundle={data} />;
      case "history":
        return <HistoryTab bundle={data} />;
      case "sources":
        return <SourcesTab bundle={data} />;
      default:
        return <OverviewTab bundle={data} />;
    }
  }, [data, tab]);

  if (isError) {
    return (
      <PageShell>
        <Card>
          <EmptyState
            icon={<TriangleAlert size={20} />}
            title="Company information couldn't be completed."
            description={`We could not verify enough permitted public evidence for organisation number ${formatOrgNumber(orgNumber)}.`}
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => refetch()}>
                  Try again
                </Button>
                <Link href="/app/sources" className={buttonClasses("ghost", "sm")}>
                  View available evidence
                </Link>
              </div>
            }
          />
        </Card>
      </PageShell>
    );
  }

  if (isLoading || !data) {
    return (
      <PageShell>
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-80" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </Card>
        <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
          <Card className="p-6">
            <Skeleton className="h-4 w-40" />
            <div className="mt-5 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <Skeleton className="h-4 w-32" />
            <div className="mt-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </Card>
        </div>
      </PageShell>
    );
  }

  const company = data.company;

  return (
    <PageShell>
      <Card elevated className="overflow-hidden">
        <div className="relative h-16 border-b border-[var(--sp-border)] bg-[var(--sp-surface-2)]/55">
          <div className="sp-dot-bg absolute inset-0 opacity-70" aria-hidden />
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--sp-surface)]"
            aria-hidden
          />
        </div>
        <div className="relative -mt-8 flex flex-col gap-5 px-5 pb-5 sm:px-6 sm:pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-[16px] border border-[var(--sp-border)] bg-gradient-to-b from-[var(--sp-surface)] to-[var(--sp-surface-2)] text-[var(--sp-text-muted)] shadow-[var(--sp-sheen),var(--sp-shadow-md)]">
              <Building2 size={22} />
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="sp-display text-[24px] font-semibold">{company.name}</h2>
              <StatusBadge status={company.status} />
              <Badge tone="outline">{company.legalForm}</Badge>
              <Tooltip content="Organisation number matched to the official registry record: legal name, organisation form, registered address and status all agree.">
                <span className="inline-flex cursor-help items-center gap-1 rounded-md border border-transparent bg-[var(--sp-positive-soft)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--sp-positive)]">
                  <ShieldCheck size={11} /> Identity verified
                </span>
              </Tooltip>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[var(--sp-text-muted)]">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(company.orgNumber).then(() => {
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1600);
                  });
                }}
                className="tnum inline-flex items-center gap-1.5 rounded-md transition-colors duration-150 hover:text-[var(--sp-text)]"
                aria-label="Copy organisation number"
              >
                {formatOrgNumber(company.orgNumber)}
                {copied ? <Check size={13} className="text-[var(--sp-positive)]" /> : <Copy size={13} />}
              </button>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={13} /> {company.city}, {company.country}
              </span>
              <a
                href={`https://www.${company.website}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-[var(--sp-accent)] hover:underline"
              >
                Official website <ExternalLink size={12} />
              </a>
              <span className="inline-flex items-center gap-1.5">
                Updated {relativeTime(company.lastUpdated)} · {formatDate(company.lastUpdated)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="md" onClick={() => refetch()} aria-label="Refresh profile">
              <RefreshCw size={15} className={isFetching ? "animate-spin" : undefined} />
              Refresh
            </Button>
            <Link href={`/app/compare?orgs=${company.orgNumber},996343005`} className={buttonClasses("secondary", "md")}>
              <GitCompare size={15} />
              Compare
            </Link>
            <div className="relative" ref={exportRef}>
              <Button variant="secondary" size="md" onClick={() => setExportOpen((v) => !v)} aria-expanded={exportOpen} aria-haspopup="menu">
                <Download size={15} />
                Export
                <ChevronDown size={14} />
              </Button>
              {exportOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 top-11 z-30 w-56 overflow-hidden rounded-xl border border-[var(--sp-border)] bg-[var(--sp-surface)] py-1 shadow-[var(--sp-shadow-md)]"
                >
                  <a
                    role="menuitem"
                    href={`/api/export/${company.orgNumber}?format=json`}
                    className="flex items-center gap-2 px-3.5 py-2 text-[13px] hover:bg-[var(--sp-surface-2)]"
                    onClick={() => setExportOpen(false)}
                  >
                    <FileText size={14} /> Export JSON
                  </a>
                  <a
                    role="menuitem"
                    href={`/api/export/${company.orgNumber}?format=csv`}
                    className="flex items-center gap-2 px-3.5 py-2 text-[13px] hover:bg-[var(--sp-surface-2)]"
                    onClick={() => setExportOpen(false)}
                  >
                    <FileText size={14} /> Export CSV (financials)
                  </a>
                  <Link
                    role="menuitem"
                    href={`/app/company/${company.orgNumber}/report`}
                    className="flex items-center gap-2 px-3.5 py-2 text-[13px] hover:bg-[var(--sp-surface-2)]"
                    onClick={() => setExportOpen(false)}
                  >
                    <FileText size={14} /> Export report
                  </Link>
                </div>
              ) : null}
            </div>
            <a
              href={`https://data.brreg.no/enhetsregisteret/oppslag/enheter/${company.orgNumber}`}
              target="_blank"
              rel="noreferrer noopener"
              className={buttonClasses("primary", "md")}
            >
              Open source <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="sp-scroll overflow-x-auto border-t border-[var(--sp-border)] bg-[var(--sp-surface-2)]/40">
          <div role="tablist" aria-label="Company profile sections" className="flex min-w-max gap-0.5 px-3">
            {TAB_LIST.map((item) => (
              <button
                key={item.key}
                role="tab"
                type="button"
                aria-selected={tab === item.key}
                onClick={() => selectTab(item.key)}
                className={cn(
                  "relative px-3 py-3 text-[13px] font-medium transition-colors duration-200",
                  tab === item.key
                    ? "text-[var(--sp-text)]"
                    : "text-[var(--sp-text-muted)] hover:text-[var(--sp-text)]",
                )}
              >
                {item.label}
                {tab === item.key ? (
                  <motion.span
                    layoutId="company-tab-indicator"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-x-2 bottom-0 h-[2px] rounded-t bg-[var(--sp-accent)]"
                    aria-hidden
                  />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div key={tab} className="sp-fade-up mt-5">
        {panel}
      </div>

      <p className="mt-6 text-center text-[11.5px] text-[var(--sp-text-subtle)]">
        Demonstration data. Figures, people and activity in this profile are illustrative and are not a live verified
        result.
      </p>
    </PageShell>
  );
}
