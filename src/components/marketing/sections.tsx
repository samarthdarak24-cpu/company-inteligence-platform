import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Briefcase,
  Building2,
  CalendarClock,
  Clock3,
  ExternalLink,
  FileText,
  Globe2,
  History,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  Badge,
  Card,
  DemoBadge,
  IconTile,
  SectionLabel,
  buttonClasses,
} from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative mx-auto w-full max-w-[1180px] px-5 lg:px-8", className)}>
      {children}
    </section>
  );
}

export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="mx-auto flex w-full max-w-[1180px] items-center gap-4 px-5 lg:px-8">
      <span className="sp-hairline flex-1" aria-hidden />
      <SectionLabel className="shrink-0">{label}</SectionLabel>
      <span className="sp-hairline flex-1" aria-hidden />
    </div>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <div className="mb-3.5 flex items-center gap-2.5">
          {align === "center" ? <span className="h-px w-6 bg-[var(--sp-border-strong)]" aria-hidden /> : null}
          <SectionLabel>{eyebrow}</SectionLabel>
          <span className={cn("h-px flex-1 bg-[var(--sp-border)]", align === "center" && "max-w-6 flex-none")} aria-hidden />
        </div>
      ) : null}
      <h2 className="sp-display text-[28px] font-semibold leading-[1.1] text-[var(--sp-text)] sm:text-[34px]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-[15.5px] leading-[1.7] text-[var(--sp-text-muted)]">{description}</p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ Trust */

const TRUST = [
  {
    icon: <ShieldCheck size={17} />,
    title: "Verified identity",
    body: "Organisation-number-first company matching.",
    detail: "Registry record resolved before anything is published.",
  },
  {
    icon: <FileText size={17} />,
    title: "Source-backed facts",
    body: "Facts remain connected to their supporting sources.",
    detail: "URL, excerpt and page reference travel with each value.",
  },
  {
    icon: <History size={17} />,
    title: "Temporal history",
    body: "See what changed and when.",
    detail: "Previous values kept beside current ones.",
  },
  {
    icon: <Clock3 size={17} />,
    title: "Fresh public signals",
    body: "Track new company information over time.",
    detail: "Retrieval dates shown as prominently as values.",
  },
];

export function TrustSection() {
  return (
    <Section className="py-20 sm:py-24">
      <SectionIntro eyebrow="Why Signalpost" title="Built around evidence, identity and freshness." />
      <div className="mt-12 grid gap-px overflow-hidden rounded-[18px] border border-[var(--sp-border)] bg-[var(--sp-border)] sm:grid-cols-2 lg:grid-cols-4">
        {TRUST.map((item, index) => (
          <div
            key={item.title}
            className="group relative bg-[var(--sp-surface)] p-6 transition-colors duration-250 hover:bg-[var(--sp-surface-2)]/60"
          >
            <span
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--sp-accent)] to-transparent opacity-0 transition-opacity duration-250 group-hover:opacity-60"
              aria-hidden
            />
            <div className="flex items-center justify-between">
              <IconTile tone="accent">{item.icon}</IconTile>
              <span className="tnum text-[11px] font-semibold tracking-[0.1em] text-[var(--sp-text-subtle)]">
                0{index + 1}
              </span>
            </div>
            <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.015em]">{item.title}</h3>
            <p className="mt-2 text-[13.5px] leading-6 text-[var(--sp-text-muted)]">{item.body}</p>
            <p className="mt-3 border-t border-[var(--sp-border-soft)] pt-3 text-[12.5px] leading-5 text-[var(--sp-text-subtle)]">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* --------------------------------------------------------------- Process */

export const PROCESS_STEPS = [
  {
    n: "01",
    title: "Enter organisation number",
    body: "Start from the one identifier that cannot be confused — the nine-digit organisation number.",
  },
  {
    n: "02",
    title: "Resolve the official identity",
    body: "Match the number against the official registry record for legal name, form, address and status.",
  },
  {
    n: "03",
    title: "Research permitted sources",
    body: "Collect registry data, published accounts, the company website, vacancy registers and announcements.",
  },
  {
    n: "04",
    title: "Verify facts against evidence",
    body: "Each fact is checked against the passage, page or field it was taken from.",
  },
  {
    n: "05",
    title: "Build the current profile",
    body: "Assemble financials, people, locations, presence, hiring and activity into one record.",
  },
  {
    n: "06",
    title: "Track changes over time",
    body: "Store previous values so later checks show exactly what moved, and when.",
  },
];

export function ProcessSection({ compact = false }: { compact?: boolean }) {
  return (
    <Section className={compact ? "py-16" : "py-20 sm:py-24"} id="how-it-works">
      <SectionIntro
        eyebrow="How it works"
        title="From registry record to current picture."
        description="Start with the official company identity, then build the profile from financials, roles, locations, websites, hiring activity and public signals."
      />
      <ol className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {PROCESS_STEPS.map((step) => (
          <li key={step.n} className="group relative">
            <div className="relative h-px w-full bg-[var(--sp-border)]">
              <span className="absolute inset-y-0 left-0 w-0 bg-[var(--sp-accent)] transition-[width] duration-400 ease-out group-hover:w-full" />
            </div>
            <div className="pt-5">
              <span className="tnum inline-flex items-center gap-2 text-[11.5px] font-semibold tracking-[0.14em] text-[var(--sp-accent)]">
                {step.n}
                <span className="h-px w-5 bg-[var(--sp-accent-border)]" aria-hidden />
              </span>
              <h3 className="mt-3 text-[16.5px] font-semibold tracking-[-0.02em]">{step.title}</h3>
              <p className="mt-2 text-[13.5px] leading-[1.65] text-[var(--sp-text-muted)]">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* -------------------------------------------------------------- Features */

function MiniRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--sp-border-soft)] py-[7px] last:border-b-0">
      <span className="truncate text-[11.5px] text-[var(--sp-text-subtle)]">{label}</span>
      <span
        className={cn(
          "tnum truncate text-[11.5px]",
          strong ? "font-semibold text-[var(--sp-text)]" : "text-[var(--sp-text-muted)]",
        )}
      >
        {value}
      </span>
    </div>
  );
}

const FEATURES: { icon: ReactNode; title: string; body: string; preview: ReactNode }[] = [
  {
    icon: <Building2 size={16} />,
    title: "Company record",
    body: "Legal name, organisation form, address, status and registration information in one verified block.",
    preview: (
      <div>
        <MiniRow label="Legal name" value="DIPS AS" strong />
        <MiniRow label="Organisation form" value="AS" />
        <MiniRow label="Status" value="Active" strong />
        <MiniRow label="Registered" value="04 Nov 1997" />
      </div>
    ),
  },
  {
    icon: <BarChart3 size={16} />,
    title: "Financials",
    body: "Revenue, profit, assets and equity with the reporting period each figure belongs to.",
    preview: (
      <div>
        <MiniRow label="Revenue 2025" value="NOK 790.4M" strong />
        <MiniRow label="Operating profit" value="NOK 89.3M" />
        <MiniRow label="Assets" value="NOK 1.0B" />
        <MiniRow label="Period" value="01.01 – 31.12.2025" />
      </div>
    ),
  },
  {
    icon: <Users size={16} />,
    title: "People & locations",
    body: "Registered roles, management, board, office locations and subunits.",
    preview: (
      <div>
        <MiniRow label="CEO" value="Ingrid Hagen" strong />
        <MiniRow label="Chair of board" value="Marius Berge" />
        <MiniRow label="Head office" value="Bodø" />
        <MiniRow label="Locations" value="4" />
      </div>
    ),
  },
  {
    icon: <Globe2 size={16} />,
    title: "Website & presence",
    body: "Official domain, description, products and services as published by the company.",
    preview: (
      <div>
        <MiniRow label="Domain" value="dips.com" strong />
        <MiniRow label="Domain status" value="Verified" />
        <MiniRow label="Products" value="4 listed" />
        <MiniRow label="Last checked" value="22 Sep 2026" />
      </div>
    ),
  },
  {
    icon: <Briefcase size={16} />,
    title: "Hiring & activity",
    body: "Open roles, recent postings, announcements and other public activity.",
    preview: (
      <div>
        <MiniRow label="Open positions" value="12" strong />
        <MiniRow label="Recent postings" value="8" />
        <MiniRow label="Hiring locations" value="4" />
        <MiniRow label="Last posting" value="3 days ago" />
      </div>
    ),
  },
  {
    icon: <History size={16} />,
    title: "History",
    body: "Previous values, new values, change dates and the source behind each change.",
    preview: (
      <div>
        <MiniRow label="Revenue (previous)" value="NOK 712M" />
        <MiniRow label="Revenue (current)" value="NOK 790M" strong />
        <MiniRow label="Changed" value="18 Aug 2026" />
        <MiniRow label="Source" value="Annual statement" />
      </div>
    ),
  },
];

export function FeatureSection() {
  return (
    <Section className="py-20 sm:py-24" id="features">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <SectionIntro
          eyebrow="Capabilities"
          title="Everything you need to understand a company."
          description="One record per organisation number, assembled from the public material a research team would otherwise collect by hand."
        />
        <DemoBadge />
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title} interactive rail className="flex flex-col p-5">
            <div className="flex items-center gap-3">
              <IconTile tone="accent" size="sm">
                {feature.icon}
              </IconTile>
              <h3 className="text-[14.5px] font-semibold tracking-[-0.015em]">{feature.title}</h3>
            </div>
            <p className="mt-3.5 text-[13.5px] leading-[1.65] text-[var(--sp-text-muted)]">{feature.body}</p>
            <div className="mt-5 rounded-[11px] border border-[var(--sp-border)] bg-[var(--sp-surface-2)]/55 px-3.5 py-2">
              {feature.preview}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

/* --------------------------------------------------- Workspace showcase */

const SHOWCASE_ROWS = [
  { name: "DIPS AS", org: "979 543 883", city: "Bodø", revenue: "NOK 790.4M", evidence: 94 },
  { name: "Kahoot! AS", org: "996 343 005", city: "Oslo", revenue: "NOK 1.9B", evidence: 91 },
  { name: "Oda AS", org: "912 285 519", city: "Oslo", revenue: "NOK 3.1B", evidence: 88 },
  { name: "Aker Solutions ASA", org: "986 102 551", city: "Lysaker", revenue: "NOK 48.5B", evidence: 96 },
  { name: "Mowi ASA", org: "964 118 191", city: "Bergen", revenue: "NOK 55.8B", evidence: 95 },
];

export function WorkspaceShowcase() {
  return (
    <Section className="py-20 sm:py-24">
      <SectionIntro
        align="center"
        eyebrow="The workspace"
        title="Dense where it matters, quiet everywhere else."
        description="A research surface designed for reading: tabular figures, restrained colour, and a source attached to every row."
      />

      <div className="relative mt-12">
        <div className="sp-spotlight pointer-events-none absolute -inset-x-10 -top-16 bottom-0" aria-hidden />
        <Card elevated className="relative overflow-hidden p-0">
          <div className="flex items-center justify-between gap-4 border-b border-[var(--sp-border)] bg-[var(--sp-surface-2)]/60 px-4 py-2.5">
            <div className="flex items-center gap-2 text-[12px] text-[var(--sp-text-muted)]">
              <span className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-[var(--sp-accent)] text-[9.5px] font-bold text-white">
                NR
              </span>
              Nordic Research · Companies
            </div>
            <DemoBadge />
          </div>

          <div className="grid lg:grid-cols-[180px_1fr]">
            <div className="hidden border-r border-[var(--sp-border)] p-3 lg:block">
              {[
                { label: "Overview", active: false },
                { label: "Search", active: false },
                { label: "Companies", active: true },
                { label: "Compare", active: false },
                { label: "Activity", active: false },
                { label: "Sources", active: false },
                { label: "History", active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "relative mb-0.5 rounded-[8px] px-2.5 py-[7px] text-[12.5px] font-medium",
                    item.active
                      ? "bg-[var(--sp-surface-3)] text-[var(--sp-text)]"
                      : "text-[var(--sp-text-muted)]",
                  )}
                >
                  {item.active ? (
                    <span className="absolute left-0 top-1/2 h-3.5 w-[2.5px] -translate-y-1/2 rounded-r bg-[var(--sp-accent)]" />
                  ) : null}
                  {item.label}
                </div>
              ))}
            </div>

            <div className="sp-scroll overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--sp-border)]">
                    {["Company", "Organisation number", "Location", "Revenue (2025)", "Evidence"].map((head) => (
                      <th
                        key={head}
                        className="px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.09em] text-[var(--sp-text-subtle)]"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SHOWCASE_ROWS.map((row) => (
                    <tr
                      key={row.org}
                      className="border-b border-[var(--sp-border-soft)] transition-colors duration-150 last:border-b-0 hover:bg-[var(--sp-surface-2)]/70"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-6 w-6 items-center justify-center rounded-[7px] border border-[var(--sp-border)] bg-[var(--sp-surface-2)] text-[var(--sp-text-subtle)]">
                            <Building2 size={12} />
                          </span>
                          <span className="text-[13px] font-medium">{row.name}</span>
                        </div>
                      </td>
                      <td className="tnum px-4 py-3 text-[12.5px] text-[var(--sp-text-muted)]">{row.org}</td>
                      <td className="px-4 py-3 text-[12.5px] text-[var(--sp-text-muted)]">{row.city}</td>
                      <td className="tnum px-4 py-3 text-[12.5px] font-medium">{row.revenue}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-16 overflow-hidden rounded-full bg-[var(--sp-surface-3)]">
                            <span
                              className="block h-full rounded-full bg-[var(--sp-accent)]"
                              style={{ width: `${row.evidence}%` }}
                            />
                          </span>
                          <span className="tnum text-[12px] font-medium">{row.evidence}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------- Evidence chain */

export function EvidenceSection() {
  const chain = [
    { label: "Fact", value: "Revenue — NOK 790,400,865", icon: <BarChart3 size={14} /> },
    { label: "Source", value: "Annual financial statement", icon: <FileText size={14} /> },
    { label: "Date", value: "Reporting year 2025 · Retrieved 22 Aug 2026", icon: <CalendarClock size={14} /> },
    { label: "Evidence", value: "Page 4 — operating revenue line", icon: <ShieldCheck size={14} /> },
  ];

  return (
    <Section className="py-20 sm:py-24" id="evidence">
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.02fr] lg:gap-20">
        <div>
          <SectionIntro
            eyebrow="Evidence"
            title="Evidence should be inspectable."
            description="Every published fact should lead back to its supporting source. Signalpost connects company facts to their sources, dates and historical changes so every result can be inspected."
          />
          <ul className="mt-8 space-y-3.5">
            {[
              "Source URL, publication date and retrieval date on every fact",
              "Excerpt and page reference where the source provides one",
              "Ambiguous matches are labelled rather than silently merged",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-[13.5px] leading-[1.65] text-[var(--sp-text-muted)]">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-[var(--sp-accent)]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap gap-2.5">
            <Link href="/app/company/979543883?tab=sources" className={buttonClasses("primary", "md")}>
              View a source chain
              <ArrowUpRight size={15} />
            </Link>
            <Link href="/sources" className={buttonClasses("secondary", "md")}>
              How sources are handled
            </Link>
          </div>
        </div>

        <Card elevated className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--sp-border)] bg-[var(--sp-surface-2)]/50 px-5 py-3">
            <SectionLabel>Evidence chain</SectionLabel>
            <DemoBadge />
          </div>
          <ol className="p-5 sm:p-6">
            {chain.map((step, index) => (
              <li key={step.label} className="relative pl-9">
                <span className="absolute left-0 top-0.5 flex h-7 w-7 items-center justify-center rounded-[9px] border border-[var(--sp-border)] bg-gradient-to-b from-[var(--sp-surface)] to-[var(--sp-surface-2)] text-[var(--sp-accent)] shadow-[var(--sp-sheen)]">
                  {step.icon}
                </span>
                {index < chain.length - 1 ? (
                  <span
                    className="absolute bottom-0 left-[13px] top-8 w-px bg-gradient-to-b from-[var(--sp-border-strong)] to-[var(--sp-border)]"
                    aria-hidden
                  />
                ) : null}
                <div className="pb-7">
                  <div className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-[var(--sp-text-subtle)]">
                    {step.label}
                  </div>
                  <div className="tnum mt-1.5 text-[13.5px] font-medium text-[var(--sp-text)]">{step.value}</div>
                </div>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--sp-border)] bg-[var(--sp-surface-2)]/40 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <Badge tone="positive">Verified</Badge>
              <Badge tone="outline">w2.brreg.no</Badge>
            </div>
            <Link href="/app/company/979543883?tab=financials" className={buttonClasses("secondary", "sm")}>
              View source
              <ExternalLink size={13} />
            </Link>
          </div>
        </Card>
      </div>
    </Section>
  );
}

/* --------------------------------------------------------------- CTA band */

export function CtaSection() {
  return (
    <Section className="pb-24 pt-8">
      <Card elevated className="relative overflow-hidden">
        <div className="sp-grid-bg pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="relative flex flex-col items-start justify-between gap-7 p-8 sm:flex-row sm:items-center sm:p-11">
          <div className="max-w-xl">
            <h2 className="sp-display text-[25px] font-semibold leading-[1.15] sm:text-[29px]">
              Research without losing the evidence.
            </h2>
            <p className="mt-3 text-[14.5px] leading-[1.7] text-[var(--sp-text-muted)]">
              Open the demo workspace and inspect a full company profile — financials, people, locations, hiring and the
              source behind every fact.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2.5">
            <Link href="/app/search" className={buttonClasses("primary", "lg")}>
              Search a company
            </Link>
            <Link href="/app" className={buttonClasses("secondary", "lg")}>
              Explore demo
            </Link>
          </div>
        </div>
        <div className="relative flex flex-wrap items-center gap-x-7 gap-y-2 border-t border-[var(--sp-border)] bg-[var(--sp-surface-2)]/70 px-8 py-4 text-[12.5px] text-[var(--sp-text-muted)] sm:px-11">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={13} className="text-[var(--sp-text-subtle)]" /> Norwegian organisation numbers
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-[var(--sp-text-subtle)]" /> Permitted public sources only
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={13} className="text-[var(--sp-text-subtle)]" /> Change tracking from first lookup
          </span>
        </div>
      </Card>
    </Section>
  );
}
