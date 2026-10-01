"use client";

import { useMemo, useState } from "react";
import {
  Briefcase,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Code2,
  ExternalLink,
  FileText,
  Globe2,
  HeartPulse,
  LineChart as LineChartIcon,
  MapPin,
  Megaphone,
  PenTool,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { LineChart } from "@/components/ui/charts";
import { Column, DataTable } from "@/components/ui/data-table";
import {
  Badge,
  Card,
  CardHeader,
  EmptyState,
  FieldRow,
  MetricCard,
  SectionLabel,
  StatusBadge,
  buttonClasses,
} from "@/components/ui/primitives";
import { Tooltip } from "@/components/ui/tooltip";
import { useEvidence } from "@/components/app/evidence-drawer";
import type { CompanyBundleDto, FinancialDto, JobDto, LocationDto, PersonDto, SourceDto } from "@/lib/client-api";
import { cn, formatDate, formatMoney, formatNumber, formatOrgNumber, percentChange, relativeTime } from "@/lib/utils";

export type TabKey =
  | "overview"
  | "financials"
  | "people"
  | "locations"
  | "website"
  | "hiring"
  | "activity"
  | "history"
  | "sources";

export const TAB_LIST: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "financials", label: "Financials" },
  { key: "people", label: "People" },
  { key: "locations", label: "Locations" },
  { key: "website", label: "Website" },
  { key: "hiring", label: "Hiring" },
  { key: "activity", label: "Activity" },
  { key: "history", label: "History" },
  { key: "sources", label: "Sources" },
];

function sourceFor(bundle: CompanyBundleDto, key: string): SourceDto | null {
  return bundle.sources.find((source) => source.key === key) ?? null;
}

function EvidenceLink({
  bundle,
  sourceKey,
  factLabel,
  factValue,
  label = "Evidence",
}: {
  bundle: CompanyBundleDto;
  sourceKey: string;
  factLabel?: string;
  factValue?: string;
  label?: string;
}) {
  const evidence = useEvidence();
  const source = sourceFor(bundle, sourceKey);
  return (
    <button
      type="button"
      onClick={() =>
        evidence.open({
          source,
          factLabel,
          factValue,
          companyName: bundle.company.name,
          orgNumber: bundle.company.orgNumber,
        })
      }
      className="inline-flex items-center gap-1 rounded text-[12px] font-medium text-[var(--sp-accent)] transition-opacity duration-150 hover:underline"
    >
      {label}
      <ExternalLink size={11} />
    </button>
  );
}

/* ---------------------------------------------------------------- Overview */

export function OverviewTab({ bundle }: { bundle: CompanyBundleDto }) {
  const { company } = bundle;
  const latest = bundle.financials[bundle.financials.length - 1];

  return (
    <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
      <div className="space-y-5">
        <Card>
          <CardHeader
            title="Company identity"
            icon={<Building2 size={15} />}
            action={<EvidenceLink bundle={bundle} sourceKey="registry-record" label="Registry source" />}
          />
          <div className="grid gap-x-10 p-5 sm:grid-cols-2">
            <dl>
              <FieldRow label="Legal name">{company.name}</FieldRow>
              <FieldRow label="Organisation number">
                <span className="tnum">{formatOrgNumber(company.orgNumber)}</span>
              </FieldRow>
              <FieldRow label="Organisation form">{company.legalForm}</FieldRow>
              <FieldRow label="Status">
                <StatusBadge status={company.status} />
              </FieldRow>
            </dl>
            <dl>
              <FieldRow label="Registered">{formatDate(company.registeredAt)}</FieldRow>
              <FieldRow label="Industry code">
                <span className="text-right text-[12.5px]">{company.naceCode}</span>
              </FieldRow>
              <FieldRow label="VAT registered">{company.vatRegistered ? "Yes" : "No"}</FieldRow>
              <FieldRow label="Business address">
                <span className="text-right text-[12.5px]">
                  {company.address}, {company.postalCode} {company.city}
                </span>
              </FieldRow>
            </dl>
          </div>
        </Card>

        <Card>
          <CardHeader title="Description" icon={<FileText size={15} />} action={<EvidenceLink bundle={bundle} sourceKey="company-website" />} />
          <div className="p-5">
            <p className="text-[13.5px] leading-6 text-[var(--sp-text-muted)]">{company.description}</p>
            {bundle.highlights.length ? (
              <ul className="mt-4 space-y-2">
                {bundle.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13px] leading-6 text-[var(--sp-text-muted)]">
                    <CheckCircle2 size={14} className="mt-1 shrink-0 text-[var(--sp-accent)]" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard
            label="Revenue"
            value={formatMoney(latest?.revenue ?? company.revenueLatest)}
            sublabel={latest ? `Reporting year ${latest.year}` : "Not available"}
            footer={<EvidenceLink bundle={bundle} sourceKey="annual-report-2025" factLabel="Operating revenue" factValue={formatMoney(latest?.revenue ?? 0)} />}
          />
          <MetricCard
            label="Employees"
            value={company.employeeLabel}
            sublabel={`${formatNumber(company.employees)} registered`}
            footer={<EvidenceLink bundle={bundle} sourceKey="registry-record" factLabel="Registered employees" factValue={formatNumber(company.employees)} />}
          />
          <MetricCard
            label="Open roles"
            value={`${bundle.jobs.length}`}
            sublabel="Detected on public listings"
            footer={<EvidenceLink bundle={bundle} sourceKey="careers-page" factLabel="Open positions" factValue={`${bundle.jobs.length}`} />}
          />
        </div>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader title="Current status" icon={<ShieldCheck size={15} />} />
          <div className="p-5">
            <dl>
              <FieldRow label="Identity">
                <Tooltip content="Organisation number matched against the official registry record: legal name, form, address and status.">
                  <span className="inline-flex cursor-help items-center gap-1 text-[var(--sp-positive)]">
                    <CheckCircle2 size={13} /> Identity verified
                  </span>
                </Tooltip>
              </FieldRow>
              <FieldRow label="Latest update">{relativeTime(company.lastUpdated)}</FieldRow>
              <FieldRow label="Sources checked">
                <span className="tnum">{bundle.sources.length}</span>
              </FieldRow>
              <FieldRow label="Recorded changes">
                <span className="tnum">{bundle.history.length}</span>
              </FieldRow>
            </dl>
            <div className="mt-4">
              <div className="flex items-center justify-between text-[12.5px] text-[var(--sp-text-muted)]">
                <span>Evidence coverage</span>
                <span className="tnum font-semibold text-[var(--sp-text)]">
                  {Number(company.evidenceCoverage).toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--sp-surface-3)]">
                <div
                  className="h-full rounded-full bg-[var(--sp-accent)] transition-[width] duration-500"
                  style={{ width: `${company.evidenceCoverage}%` }}
                />
              </div>
              <p className="mt-2 text-[11.5px] text-[var(--sp-text-subtle)]">
                Share of published facts in this profile that carry an attached source. Not a confidence score.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Key facts" icon={<LineChartIcon size={15} />} />
          <div className="p-5">
            <dl>
              <FieldRow label="Sector">{company.sector}</FieldRow>
              <FieldRow label="Head office">
                {company.city}, {company.country}
              </FieldRow>
              <FieldRow label="Founded">
                <span className="tnum">{company.foundedYear}</span>
              </FieldRow>
              <FieldRow label="Website">
                <a
                  href={`https://www.${company.website}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-[var(--sp-accent)] hover:underline"
                >
                  {company.website}
                  <ExternalLink size={11} />
                </a>
              </FieldRow>
            </dl>
          </div>
        </Card>

        <Card>
          <CardHeader title="Latest signals" icon={<Megaphone size={15} />} />
          <ul className="divide-y divide-[var(--sp-border)]">
            {bundle.activity.slice(0, 4).map((entry) => (
              <li key={entry.id} className="px-5 py-3">
                <div className="text-[13px] font-medium">{entry.title}</div>
                <div className="mt-0.5 text-[12px] text-[var(--sp-text-muted)]">{entry.description}</div>
                <div className="tnum mt-1 text-[11.5px] text-[var(--sp-text-subtle)]">{formatDate(entry.occurredAt)}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Financials */

export function FinancialsTab({ bundle }: { bundle: CompanyBundleDto }) {
  const financials = bundle.financials;
  const latest = financials[financials.length - 1];
  const previous = financials[financials.length - 2];

  if (!financials.length) {
    return (
      <Card>
        <EmptyState
          icon={<FileText size={20} />}
          title="No financial data"
          description="No published annual accounts were found for this organisation number in the permitted sources."
        />
      </Card>
    );
  }

  const columns: Column<FinancialDto>[] = [
    { key: "year", header: "Year", render: (row) => <span className="tnum font-medium">{row.year}</span> },
    { key: "revenue", header: "Revenue", align: "right", render: (row) => <span className="tnum">{formatMoney(row.revenue)}</span> },
    {
      key: "operating",
      header: "Operating profit",
      align: "right",
      render: (row) => <span className="tnum">{formatMoney(row.operatingProfit)}</span>,
    },
    { key: "assets", header: "Assets", align: "right", hideOn: "sm", render: (row) => <span className="tnum">{formatMoney(row.assets)}</span> },
    { key: "equity", header: "Equity", align: "right", hideOn: "sm", render: (row) => <span className="tnum">{formatMoney(row.equity)}</span> },
    {
      key: "period",
      header: "Reporting period",
      hideOn: "md",
      render: (row) => <span className="tnum text-[12px] text-[var(--sp-text-muted)]">{row.reportingPeriod}</span>,
    },
    {
      key: "evidence",
      header: "Evidence",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Badge tone="outline">Page {row.evidencePage}</Badge>
          <EvidenceLink
            bundle={bundle}
            sourceKey={row.sourceKey}
            factLabel={`Operating revenue ${row.year}`}
            factValue={formatMoney(row.revenue)}
            label="Source"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Revenue"
          value={formatMoney(latest.revenue)}
          delta={previous ? { value: percentChange(latest.revenue, previous.revenue) ?? 0 } : null}
          sublabel={`Reporting year ${latest.year}`}
        />
        <MetricCard
          label="Operating profit"
          value={formatMoney(latest.operatingProfit)}
          delta={previous ? { value: percentChange(latest.operatingProfit, previous.operatingProfit) ?? 0 } : null}
          sublabel="Before tax items"
        />
        <MetricCard label="Assets" value={formatMoney(latest.assets)} sublabel="Total reported assets" />
        <MetricCard label="Equity" value={formatMoney(latest.equity)} sublabel="Book equity" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Revenue" description="Operating revenue by reporting year." action={<Badge tone="outline">NOK</Badge>} />
          <div className="p-5">
            <LineChart
              ariaLabel="Operating revenue by year"
              data={financials.map((f) => ({ label: String(f.year), value: f.revenue / 1_000_000 }))}
              formatValue={(v) => `NOK ${v.toFixed(1)}M`}
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Operating profit" description="Operating profit by reporting year." action={<Badge tone="outline">NOK</Badge>} />
          <div className="p-5">
            <LineChart
              ariaLabel="Operating profit by year"
              accent="var(--sp-positive)"
              data={financials.map((f) => ({ label: String(f.year), value: f.operatingProfit / 1_000_000 }))}
              formatValue={(v) => `NOK ${v.toFixed(1)}M`}
            />
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader
          title="Financial table"
          description="Each row carries its source, reporting period and evidence reference."
          action={<Badge tone="outline">Demo figures</Badge>}
        />
        <DataTable columns={columns} rows={[...financials].reverse()} getKey={(row) => String(row.year)} dense />
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ People */

export function PeopleTab({ bundle }: { bundle: CompanyBundleDto }) {
  const [filter, setFilter] = useState<"all" | "management" | "board" | "other">("all");
  const people = useMemo(
    () => bundle.people.filter((person) => filter === "all" || person.category === filter),
    [bundle.people, filter],
  );

  const columns: Column<PersonDto>[] = [
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--sp-border)] bg-[var(--sp-surface-2)] text-[10.5px] font-semibold text-[var(--sp-text-muted)]">
            {row.name
              .split(" ")
              .slice(0, 2)
              .map((part) => part[0])
              .join("")}
          </span>
          <span className="truncate text-[13px] font-medium">{row.name}</span>
        </div>
      ),
    },
    { key: "role", header: "Role", render: (row) => <span className="text-[12.5px]">{row.role}</span> },
    {
      key: "category",
      header: "Category",
      hideOn: "sm",
      render: (row) => (
        <Badge tone="neutral" className="capitalize">
          {row.category}
        </Badge>
      ),
    },
    {
      key: "start",
      header: "Start date",
      hideOn: "sm",
      render: (row) => <span className="tnum text-[12.5px] text-[var(--sp-text-muted)]">{formatDate(row.startDate)}</span>,
    },
    {
      key: "verified",
      header: "Status",
      render: (row) =>
        row.verified ? (
          <Badge tone="positive">
            <CheckCircle2 size={11} /> Verified
          </Badge>
        ) : (
          <Badge tone="warning">Ambiguous</Badge>
        ),
    },
    {
      key: "source",
      header: "Source",
      align: "right",
      render: (row) => <EvidenceLink bundle={bundle} sourceKey={row.sourceKey} factLabel={row.role} factValue={row.name} label="View" />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-1.5">
        {(["all", "management", "board", "other"] as const).map((item) => (
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
            {item === "all" ? "All" : item === "other" ? "Other roles" : item}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <CardHeader title="Registered roles and key people" icon={<Users size={15} />} description="Roles published in the registry record and on the company website." />
        <DataTable
          columns={columns}
          rows={people}
          getKey={(row) => `${row.name}-${row.role}`}
          dense
          empty={
            <EmptyState
              icon={<Users size={20} />}
              title="No people available"
              description="No registered roles were found for this filter in the permitted sources."
            />
          }
          mobileCard={(row) => (
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-[13px] font-medium">{row.name}</span>
                {row.verified ? <Badge tone="positive">Verified</Badge> : <Badge tone="warning">Ambiguous</Badge>}
              </div>
              <div className="mt-1 text-[12.5px] text-[var(--sp-text-muted)]">{row.role}</div>
              <div className="tnum mt-1 text-[11.5px] text-[var(--sp-text-subtle)]">From {formatDate(row.startDate)}</div>
            </div>
          )}
        />
      </Card>
    </div>
  );
}

/* --------------------------------------------------------------- Locations */

export function LocationsTab({ bundle }: { bundle: CompanyBundleDto }) {
  const head = bundle.locations.find((l) => l.kind === "head-office") ?? bundle.locations[0];
  const others = bundle.locations.filter((l) => l !== head);

  const columns: Column<LocationDto>[] = [
    { key: "name", header: "Location", render: (row) => <span className="text-[13px] font-medium">{row.name}</span> },
    { key: "address", header: "Address", hideOn: "sm", render: (row) => <span className="text-[12.5px] text-[var(--sp-text-muted)]">{row.address}</span> },
    {
      key: "kind",
      header: "Type",
      render: (row) => (
        <Badge tone="neutral" className="capitalize">
          {row.kind.replace("-", " ")}
        </Badge>
      ),
    },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "source",
      header: "Source",
      align: "right",
      render: (row) => <EvidenceLink bundle={bundle} sourceKey={row.sourceKey} factLabel={row.name} factValue={row.address} label="View" />,
    },
  ];

  if (!bundle.locations.length) {
    return (
      <Card>
        <EmptyState icon={<MapPin size={20} />} title="No locations available" description="No addresses or subunits were found in the permitted sources." />
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <Card>
          <CardHeader title="Head office" icon={<MapPin size={15} />} action={<EvidenceLink bundle={bundle} sourceKey="registry-record" label="Registry" />} />
          <div className="p-5">
            <div className="text-[15px] font-semibold tracking-[-0.015em]">{head?.name}</div>
            <p className="mt-1 text-[13px] text-[var(--sp-text-muted)]">{head?.address}</p>
            <dl className="mt-4">
              <FieldRow label="Municipality">{bundle.company.municipality}</FieldRow>
              <FieldRow label="Country">{bundle.company.country}</FieldRow>
              <FieldRow label="People at site">
                <span className="tnum">{formatNumber(head?.employees ?? 0)}</span>
              </FieldRow>
            </dl>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader title="Location map" description="Schematic placement — no external mapping service is used in demo mode." />
          <div className="relative h-[260px] bg-[var(--sp-surface-2)]/60">
            <div className="sp-grid-bg absolute inset-0 opacity-80" aria-hidden />
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" role="img" aria-label="Schematic map of company locations">
              <path
                d="M52 6 L60 20 L58 34 L66 44 L62 58 L68 72 L58 86 L46 92 L38 80 L42 66 L34 54 L40 40 L36 24 L44 12 Z"
                fill="var(--sp-surface-3)"
                stroke="var(--sp-border-strong)"
                strokeWidth="0.6"
              />
              {bundle.locations.map((location, index) => {
                const lat = Number(location.lat);
                const lng = Number(location.lng);
                const x = Math.min(92, Math.max(8, ((lng - 4) / 28) * 100));
                const y = Math.min(92, Math.max(8, 100 - ((lat - 57) / 15) * 100));
                return (
                  <g key={location.id ?? index}>
                    <circle cx={x} cy={y} r="2.2" fill="var(--sp-accent)" />
                    <circle cx={x} cy={y} r="4.6" fill="none" stroke="var(--sp-accent)" strokeWidth="0.5" opacity="0.5" />
                    <text x={x + 6} y={y + 1.5} fontSize="3.1" fill="var(--sp-text-muted)">
                      {location.city}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader title="Locations and subunits" description={`${bundle.locations.length} registered places of business.`} />
        <DataTable
          columns={columns}
          rows={[head, ...others].filter(Boolean) as LocationDto[]}
          getKey={(row) => `${row.name}-${row.city}`}
          dense
          mobileCard={(row) => (
            <div>
              <div className="truncate text-[13px] font-medium">{row.name}</div>
              <div className="mt-1 text-[12px] text-[var(--sp-text-muted)]">{row.address}</div>
              <div className="mt-1.5 flex items-center gap-2">
                <Badge tone="neutral" className="capitalize">
                  {row.kind.replace("-", " ")}
                </Badge>
                <StatusBadge status={row.status} />
              </div>
            </div>
          )}
        />
      </Card>
    </div>
  );
}

/* ----------------------------------------------------------------- Website */

export function WebsiteTab({ bundle }: { bundle: CompanyBundleDto }) {
  const source = sourceFor(bundle, "company-website");
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-5">
        <Card>
          <CardHeader
            title="Official website"
            icon={<Globe2 size={15} />}
            action={
              <a href={`https://www.${bundle.company.website}`} target="_blank" rel="noreferrer noopener" className={buttonClasses("secondary", "sm")}>
                Open site <ExternalLink size={13} />
              </a>
            }
          />
          <div className="p-5">
            <dl>
              <FieldRow label="Official domain">{bundle.company.website}</FieldRow>
              <FieldRow label="Domain status">
                <Badge tone="positive">
                  <CheckCircle2 size={11} /> Verified domain
                </Badge>
              </FieldRow>
              <FieldRow label="Last checked">{formatDate(source?.retrievedAt)}</FieldRow>
              <FieldRow label="Linked from registry">Yes</FieldRow>
            </dl>
            <p className="mt-4 text-[13.5px] leading-6 text-[var(--sp-text-muted)]">{bundle.company.description}</p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Products and services" icon={<PenTool size={15} />} />
          <div className="flex flex-wrap gap-2 p-5">
            {bundle.products.length ? (
              bundle.products.map((product) => (
                <span
                  key={product}
                  className="rounded-lg border border-[var(--sp-border)] bg-[var(--sp-surface-2)]/60 px-2.5 py-1.5 text-[12.5px]"
                >
                  {product}
                </span>
              ))
            ) : (
              <span className="text-[13px] text-[var(--sp-text-muted)]">Not available</span>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Source preview" icon={<FileText size={15} />} action={<EvidenceLink bundle={bundle} sourceKey="company-website" label="Open evidence" />} />
        <div className="p-5">
          <SectionLabel>Important website sections</SectionLabel>
          <ul className="mt-2 space-y-1.5">
            {["Home", "About", "Products", "Careers", "Contact"].map((section) => (
              <li key={section} className="flex items-center justify-between rounded-lg border border-[var(--sp-border)] px-3 py-2 text-[12.5px]">
                {section}
                <Badge tone="outline">Checked</Badge>
              </li>
            ))}
          </ul>
          {source ? (
            <blockquote className="mt-4 rounded-xl border border-[var(--sp-border)] bg-[var(--sp-surface-2)]/50 p-3.5 text-[12.5px] leading-6 text-[var(--sp-text-muted)]">
              {source.excerpt}
            </blockquote>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ Hiring */

const JOB_ICON: Record<string, React.ReactNode> = {
  Engineering: <Code2 size={14} />,
  Leadership: <Users size={14} />,
  "Design & content": <PenTool size={14} />,
  Commercial: <Briefcase size={14} />,
  Operations: <Truck size={14} />,
};

export function HiringTab({ bundle }: { bundle: CompanyBundleDto }) {
  const jobs: JobDto[] = bundle.jobs;
  const locations = new Set(jobs.map((job) => job.location));
  const recent = jobs.filter((job) => {
    const posted = new Date(`${job.postedAt}T00:00:00Z`).getTime();
    return Date.now() - posted < 1000 * 60 * 60 * 24 * 45;
  });

  if (!jobs.length) {
    return (
      <Card>
        <EmptyState
          icon={<Briefcase size={20} />}
          title="No open positions"
          description="No vacancies were found on the company career page or in the public vacancy register at the last check."
        />
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Open positions" value={`${jobs.length}`} sublabel="Detected across permitted job sources" icon={<Briefcase size={15} />} />
        <MetricCard label="Recent postings" value={`${recent.length}`} sublabel="Published in the last 45 days" icon={<Clock3 size={15} />} />
        <MetricCard label="Locations" value={`${locations.size}`} sublabel="Distinct hiring locations" icon={<MapPin size={15} />} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job.id} interactive className="flex flex-col p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--sp-border)] bg-[var(--sp-surface-2)] text-[var(--sp-text-muted)]">
                  {JOB_ICON[job.category] ?? <HeartPulse size={14} />}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-[13.5px] font-semibold tracking-[-0.01em]">{job.title}</h3>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[12px] text-[var(--sp-text-muted)]">
                    <MapPin size={11} /> {job.location}
                  </p>
                </div>
              </div>
              <Badge tone="outline">{job.employmentType}</Badge>
            </div>
            <div className="tnum mt-3 flex items-center gap-1.5 text-[11.5px] text-[var(--sp-text-subtle)]">
              <CalendarClock size={12} /> Posted {relativeTime(job.postedAt)} · {formatDate(job.postedAt)}
            </div>
            <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--sp-border)] pt-3">
              <span className="truncate text-[11.5px] text-[var(--sp-text-subtle)]">{job.sourceKey.replace(/-/g, " ")}</span>
              <EvidenceLink bundle={bundle} sourceKey={job.sourceKey} factLabel={job.title} factValue={`${job.location} · ${formatDate(job.postedAt)}`} label="Open source" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Activity */

export function ActivityTab({ bundle }: { bundle: CompanyBundleDto }) {
  if (!bundle.activity.length) {
    return (
      <Card>
        <EmptyState icon={<Megaphone size={20} />} title="No public activity" description="No filings, postings or announcements were detected for this company." />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Chronological activity" description="Public signals detected for this organisation number." />
      <ol className="p-5">
        {bundle.activity.map((entry, index) => (
          <li key={entry.id} className="relative pl-9">
            <span className="absolute left-0 top-0.5 flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--sp-border)] bg-[var(--sp-surface-2)] text-[var(--sp-text-muted)]">
              <Clock3 size={14} />
            </span>
            {index < bundle.activity.length - 1 ? (
              <span className="absolute bottom-0 left-[13px] top-8 w-px bg-[var(--sp-border)]" aria-hidden />
            ) : null}
            <div className="pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="tnum text-[12px] text-[var(--sp-text-subtle)]">{formatDate(entry.occurredAt)}</span>
                <Badge tone="outline" className="capitalize">
                  {entry.type}
                </Badge>
              </div>
              <div className="mt-1 text-[13.5px] font-medium">{entry.title}</div>
              <p className="mt-0.5 text-[12.5px] leading-5 text-[var(--sp-text-muted)]">{entry.description}</p>
              <div className="mt-1.5">
                <EvidenceLink bundle={bundle} sourceKey={entry.sourceKey} factLabel={entry.title} factValue={formatDate(entry.occurredAt)} label="View evidence" />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

/* ----------------------------------------------------------------- History */

export function HistoryTab({ bundle }: { bundle: CompanyBundleDto }) {
  if (!bundle.history.length) {
    return (
      <Card>
        <EmptyState icon={<Clock3 size={20} />} title="No historical changes" description="Nothing has changed since this profile was first built." />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="What changed?" description="Previous and current values with the date each change was observed." />
      <ol className="space-y-3 p-5">
        {bundle.history.map((change) => (
          <li key={change.id} className="rounded-xl border border-[var(--sp-border)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[13.5px] font-semibold tracking-[-0.01em]">{change.field}</span>
                <Badge tone="outline">{change.area}</Badge>
              </div>
              <span className="tnum text-[12px] text-[var(--sp-text-subtle)]">Changed {formatDate(change.changedAt)}</span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div className="rounded-lg border border-[var(--sp-border)] bg-[var(--sp-surface-2)]/50 px-3 py-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-subtle)]">Previous</div>
                <div className="tnum mt-1 text-[13px] text-[var(--sp-text-muted)]">{change.previousValue}</div>
              </div>
              <span className="hidden text-[var(--sp-text-subtle)] sm:block" aria-hidden>
                →
              </span>
              <div className="rounded-lg border border-[var(--sp-accent-border)] bg-[var(--sp-accent-soft)]/60 px-3 py-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-accent)]">Current</div>
                <div className="tnum mt-1 text-[13px] font-medium">{change.currentValue}</div>
              </div>
            </div>
            <div className="mt-3">
              <EvidenceLink bundle={bundle} sourceKey={change.sourceKey} factLabel={change.field} factValue={change.currentValue} label="Source for change" />
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

/* ----------------------------------------------------------------- Sources */

export function SourcesTab({ bundle }: { bundle: CompanyBundleDto }) {
  const evidence = useEvidence();
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {bundle.sources.map((source) => (
        <Card key={source.key} interactive className="flex flex-col p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-[13.5px] font-semibold tracking-[-0.01em]">{source.title}</h3>
              <p className="truncate text-[11.5px] text-[var(--sp-text-subtle)]">{source.domain}</p>
            </div>
            <Badge tone={source.status === "verified" ? "positive" : source.status === "ambiguous" ? "warning" : "accent"}>
              {source.status === "verified" ? "Verified" : source.status === "ambiguous" ? "Ambiguous" : "Source-backed"}
            </Badge>
          </div>
          <p className="mt-3 line-clamp-3 text-[12.5px] leading-5 text-[var(--sp-text-muted)]">{source.excerpt}</p>
          <dl className="mt-3 space-y-1 text-[11.5px] text-[var(--sp-text-subtle)]">
            <div className="flex justify-between">
              <dt>Published</dt>
              <dd className="tnum">{formatDate(source.publishedAt)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Retrieved</dt>
              <dd className="tnum">{formatDate(source.retrievedAt)}</dd>
            </div>
          </dl>
          <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--sp-border)] pt-3">
            <Badge tone="neutral" className="capitalize">
              {source.type}
            </Badge>
            <button
              type="button"
              onClick={() => evidence.open({ source, companyName: bundle.company.name, orgNumber: bundle.company.orgNumber })}
              className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--sp-accent)] hover:underline"
            >
              Open evidence <ExternalLink size={11} />
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
