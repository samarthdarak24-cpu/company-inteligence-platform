"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  Globe2,
  Loader2,
  MapPin,
  Search,
  ShieldCheck,
  Sparkle,
  TriangleAlert,
  Users,
} from "lucide-react";
import { PageHeader, PageShell } from "@/components/app/page-shell";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  EmptyState,
  SectionLabel,
  Skeleton,
  buttonClasses,
} from "@/components/ui/primitives";
import { apiGet, apiPost, queryKeys, type SearchHitDto } from "@/lib/client-api";
import { cn, formatOrgNumber, isOrgNumber, relativeTime } from "@/lib/utils";

const STEPS = [
  { label: "Identity resolved", icon: <ShieldCheck size={15} />, sources: 3, ms: 520 },
  { label: "Official company record checked", icon: <Building2 size={15} />, sources: 2, ms: 480 },
  { label: "Financial information checked", icon: <FileText size={15} />, sources: 2, ms: 620 },
  { label: "People and locations checked", icon: <Users size={15} />, sources: 3, ms: 540 },
  { label: "Website researched", icon: <Globe2 size={15} />, sources: 2, ms: 500 },
  { label: "Hiring activity checked", icon: <Briefcase size={15} />, sources: 2, ms: 460 },
  { label: "Public signals checked", icon: <Sparkle size={15} />, sources: 4, ms: 580 },
  { label: "Evidence verified", icon: <CheckCircle2 size={15} />, sources: 1, ms: 420 },
];

const DEMO_COMPANIES = [
  { org: "979543883", name: "DIPS AS" },
  { org: "996343005", name: "Kahoot! AS" },
  { org: "912285519", name: "Oda AS" },
  { org: "986102551", name: "Aker Solutions ASA" },
  { org: "925067304", name: "AutoStore Holdings Ltd." },
  { org: "964118191", name: "Mowi ASA" },
];

type Phase = "idle" | "running" | "done" | "error";

export function SearchView() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<SearchHitDto | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  const { data: suggestions, isLoading: loadingSuggestions } = useQuery({
    queryKey: queryKeys.search(""),
    queryFn: () =>
      apiGet<{
        companies: SearchHitDto[];
        recent: { id: number; query: string; orgNumber: string | null; companyName: string | null; createdAt: string }[];
      }>("/api/search?q="),
  });

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const run = useCallback(
    async (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;
      clearTimers();
      setPhase("running");
      setStepIndex(0);
      setResult(null);
      setMessage(null);

      let hit: SearchHitDto | null = null;
      try {
        const response = await apiPost<{ results: SearchHitDto[] }>("/api/search", { query: trimmed });
        hit = response.results[0] ?? null;
      } catch {
        hit = null;
      }

      if (!hit) {
        setPhase("error");
        setMessage(
          isOrgNumber(trimmed)
            ? `No permitted public evidence was found for organisation number ${formatOrgNumber(trimmed)} in this demo workspace.`
            : "No company in this demo workspace matched that query.",
        );
        return;
      }

      let elapsed = 0;
      STEPS.forEach((step, index) => {
        elapsed += step.ms;
        const timer = window.setTimeout(() => {
          setStepIndex(index + 1);
          if (index === STEPS.length - 1) {
            setResult(hit);
            setPhase("done");
          }
        }, elapsed);
        timers.current.push(timer);
      });
    },
    [clearTimers],
  );

  useEffect(() => {
    if (initial) void run(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit(event: FormEvent) {
    event.preventDefault();
    void run(query);
  }

  const totalSources = STEPS.slice(0, stepIndex).reduce((sum, step) => sum + step.sources, 0);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Research"
        title="Search company information"
        description="Enter a Norwegian organisation number. Name search is supported, but organisation numbers resolve to a single verified identity."
      />

      <Card className="p-5 sm:p-6">
        <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sp-text-subtle)]"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Enter Norwegian organisation number"
              aria-label="Organisation number or company name"
              inputMode="search"
              className="tnum h-12 w-full rounded-xl border border-[var(--sp-border)] bg-[var(--sp-surface)] pl-11 pr-28 text-[15px] outline-none transition-colors duration-150 placeholder:text-[var(--sp-text-subtle)] focus:border-[var(--sp-accent)]"
            />
            {isOrgNumber(query) ? (
              <Badge tone="accent" className="absolute right-3 top-1/2 -translate-y-1/2">
                Organisation number
              </Badge>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="primary" size="lg" disabled={phase === "running"}>
              {phase === "running" ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              Search
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => {
                setQuery("979543883");
                void run("979543883");
              }}
            >
              Add example
            </Button>
          </div>
        </form>
        <p className="mt-3 text-[12.5px] text-[var(--sp-text-subtle)]">
          Example: <span className="tnum">979543883</span> — DIPS AS. This demo workspace resolves ten Norwegian
          companies.
        </p>
      </Card>

      {phase === "idle" ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <Card className="overflow-hidden">
            <CardHeader title="Recent searches" icon={<Clock3 size={15} />} />
            <div className="p-2">
              {loadingSuggestions ? (
                <div className="space-y-2 p-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (suggestions?.recent?.length ?? 0) === 0 ? (
                <EmptyState
                  className="py-8"
                  icon={<Clock3 size={18} />}
                  title="No searches yet"
                  description="Your recent organisation-number lookups will be listed here."
                />
              ) : (
                <ul>
                  {suggestions?.recent.slice(0, 6).map((entry) => (
                    <li key={entry.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setQuery(entry.orgNumber ?? entry.query);
                          void run(entry.orgNumber ?? entry.query);
                        }}
                        className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors duration-150 hover:bg-[var(--sp-surface-2)]"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-medium">
                            {entry.companyName ?? entry.query}
                          </span>
                          <span className="tnum block truncate text-[11.5px] text-[var(--sp-text-subtle)]">
                            {entry.orgNumber ? formatOrgNumber(entry.orgNumber) : entry.query}
                          </span>
                        </span>
                        <span className="shrink-0 text-[11.5px] text-[var(--sp-text-subtle)]">
                          {relativeTime(entry.createdAt)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader title="Suggested searches" icon={<Sparkle size={15} />} />
            <ul className="p-2">
              {[
                { label: "Health technology in Nordland", q: "Health information systems" },
                { label: "Companies in Oslo", q: "Oslo" },
                { label: "Seafood and aquaculture", q: "Seafood" },
                { label: "Warehouse automation", q: "Warehouse" },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery(item.q);
                      void run(item.q);
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[13px] transition-colors duration-150 hover:bg-[var(--sp-surface-2)]"
                  >
                    {item.label}
                    <ArrowUpRight size={14} className="text-[var(--sp-text-subtle)]" />
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader title="Demo companies" icon={<Building2 size={15} />} />
            <ul className="p-2">
              {DEMO_COMPANIES.map((company) => (
                <li key={company.org}>
                  <Link
                    href={`/app/company/${company.org}`}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition-colors duration-150 hover:bg-[var(--sp-surface-2)]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-medium">{company.name}</span>
                      <span className="tnum block text-[11.5px] text-[var(--sp-text-subtle)]">
                        {formatOrgNumber(company.org)}
                      </span>
                    </span>
                    <ArrowUpRight size={14} className="shrink-0 text-[var(--sp-text-subtle)]" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      ) : null}

      {phase === "running" || phase === "done" ? (
        <Card className="mt-6 overflow-hidden">
          <CardHeader
            title="Building company profile"
            description={
              phase === "done"
                ? `Profile assembled from ${totalSources} source checks.`
                : "Checking permitted public sources in sequence."
            }
            action={
              phase === "done" ? (
                <Badge tone="positive">
                  <CheckCircle2 size={11} /> Completed
                </Badge>
              ) : (
                <Badge tone="accent">
                  <Loader2 size={11} className="animate-spin" /> In progress
                </Badge>
              )
            }
          />
          <ol className="divide-y divide-[var(--sp-border)]">
            {STEPS.map((step, index) => {
              const state = index < stepIndex ? "done" : index === stepIndex ? "active" : "pending";
              return (
                <li key={step.label} className="flex items-center gap-3 px-5 py-3">
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors duration-200",
                      state === "done"
                        ? "border-transparent bg-[var(--sp-positive-soft)] text-[var(--sp-positive)]"
                        : state === "active"
                          ? "border-[var(--sp-accent-border)] bg-[var(--sp-accent-soft)] text-[var(--sp-accent)]"
                          : "border-[var(--sp-border)] bg-[var(--sp-surface-2)] text-[var(--sp-text-subtle)]",
                    )}
                  >
                    {state === "active" ? <Loader2 size={14} className="animate-spin" /> : step.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13.5px] font-medium">{step.label}</div>
                    <div className="text-[12px] text-[var(--sp-text-muted)]">
                      {state === "done" ? "Completed" : state === "active" ? "In progress" : "Queued"} ·{" "}
                      <span className="tnum">{step.sources} sources</span>
                    </div>
                  </div>
                  <span className="tnum shrink-0 text-[12px] text-[var(--sp-text-subtle)]">
                    {state === "pending" ? "—" : `${(step.ms / 1000).toFixed(1)}s`}
                  </span>
                </li>
              );
            })}
          </ol>

          {phase === "done" && result ? (
            <div className="flex flex-col gap-3 border-t border-[var(--sp-border)] bg-[var(--sp-surface-2)]/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <SectionLabel>Resolved identity</SectionLabel>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-[15px] font-semibold tracking-[-0.015em]">{result.name}</span>
                  <Badge tone="outline" className="tnum">
                    {formatOrgNumber(result.orgNumber)}
                  </Badge>
                  <Badge tone="positive">
                    <ShieldCheck size={11} /> Identity verified
                  </Badge>
                  {result.matchedOn !== "organisation-number" ? (
                    <Badge tone="warning">Matched on {result.matchedOn}</Badge>
                  ) : null}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[12.5px] text-[var(--sp-text-muted)]">
                  <MapPin size={12} /> {result.city} · {result.legalForm} · {result.sector}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="secondary" size="md" onClick={() => setPhase("idle")}>
                  New search
                </Button>
                <Link href={`/app/company/${result.orgNumber}`} className={buttonClasses("primary", "md")}>
                  Open profile
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          ) : null}
        </Card>
      ) : null}

      {phase === "error" ? (
        <Card className="mt-6">
          <EmptyState
            icon={<TriangleAlert size={20} />}
            title="Company information couldn't be completed."
            description={message ?? "We could not verify enough permitted public evidence for this company."}
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => void run(query)}>
                  Try again
                </Button>
                <button type="button" onClick={() => router.push("/app/sources")} className={buttonClasses("ghost", "sm")}>
                  View available evidence
                </button>
              </div>
            }
          />
        </Card>
      ) : null}
    </PageShell>
  );
}
