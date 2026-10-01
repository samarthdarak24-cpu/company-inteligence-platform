import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCompanyBundle } from "@/lib/repo";
import { PageShell } from "@/components/app/page-shell";
import { Badge, Card, DemoBadge, SectionLabel, buttonClasses } from "@/components/ui/primitives";
import { PrintButton } from "./print-button";
import { formatDate, formatMoney, formatNumber, formatOrgNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Company report" };

export default async function ReportPage({ params }: { params: Promise<{ companyNumber: string }> }) {
  const { companyNumber } = await params;
  const org = companyNumber.replace(/\D/g, "");
  const bundle = await getCompanyBundle(org);
  if (!bundle) notFound();

  const { company } = bundle;
  const latest = bundle.financials[bundle.financials.length - 1];

  return (
    <PageShell className="max-w-[900px]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href={`/app/company/${org}`} className={buttonClasses("ghost", "sm")}>
          ← Back to profile
        </Link>
        <div className="flex items-center gap-2">
          <a href={`/api/export/${org}?format=json`} className={buttonClasses("secondary", "sm")}>
            Export JSON
          </a>
          <a href={`/api/export/${org}?format=csv`} className={buttonClasses("secondary", "sm")}>
            Export CSV
          </a>
          <PrintButton />
        </div>
      </div>

      <Card className="p-8 print:border-0 print:shadow-none">
        <header className="flex items-start justify-between gap-6 border-b border-[var(--sp-border)] pb-6">
          <div>
            <SectionLabel>Signalpost company report</SectionLabel>
            <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.03em]">{company.name}</h1>
            <p className="tnum mt-1 text-[13.5px] text-[var(--sp-text-muted)]">
              {formatOrgNumber(company.orgNumber)} · {company.legalForm} · {company.city}, {company.country}
            </p>
          </div>
          <div className="text-right">
            <DemoBadge />
            <p className="tnum mt-2 text-[12px] text-[var(--sp-text-subtle)]">Generated {formatDate(new Date())}</p>
          </div>
        </header>

        <section className="py-6">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-subtle)]">Key facts</h2>
          <dl className="mt-3 grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-3">
            {[
              ["Status", company.status],
              ["Sector", company.sector],
              ["Employees", formatNumber(company.employees)],
              ["Revenue (latest)", formatMoney(latest?.revenue ?? company.revenueLatest)],
              ["Founded", String(company.foundedYear)],
              ["Evidence coverage", `${Number(company.evidenceCoverage).toFixed(1)}%`],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11.5px] uppercase tracking-[0.06em] text-[var(--sp-text-subtle)]">{label}</dt>
                <dd className="tnum mt-0.5 text-[14px] font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[13px] leading-6 text-[var(--sp-text-muted)]">{company.description}</p>
        </section>

        <ReportTable
          title="Financials"
          head={["Year", "Revenue", "Operating profit", "Assets", "Equity", "Source"]}
          rows={[...bundle.financials].reverse().map((f) => [
            String(f.year),
            formatMoney(f.revenue),
            formatMoney(f.operatingProfit),
            formatMoney(f.assets),
            formatMoney(f.equity),
            `${f.sourceKey.replace(/-/g, " ")} · p. ${f.evidencePage}`,
          ])}
        />

        <ReportTable
          title="People"
          head={["Name", "Role", "Category", "Start date"]}
          rows={bundle.people.map((p) => [p.name, p.role, p.category, formatDate(p.startDate)])}
        />

        <ReportTable
          title="Locations"
          head={["Location", "Address", "Type", "Status"]}
          rows={bundle.locations.map((l) => [l.name, l.address, l.kind.replace("-", " "), l.status])}
        />

        <ReportTable
          title="Hiring"
          head={["Role", "Location", "Type", "Published"]}
          rows={bundle.jobs.map((j) => [j.title, j.location, j.employmentType, formatDate(j.postedAt)])}
        />

        <ReportTable
          title="Activity"
          head={["Date", "Event", "Description"]}
          rows={bundle.activity.map((a) => [formatDate(a.occurredAt), a.title, a.description])}
        />

        <ReportTable
          title="History"
          head={["Field", "Previous", "Current", "Changed"]}
          rows={bundle.history.map((h) => [h.field, h.previousValue, h.currentValue, formatDate(h.changedAt)])}
        />

        <ReportTable
          title="Sources"
          head={["Source", "Type", "Published", "Retrieved", "Status"]}
          rows={bundle.sources.map((s) => [
            `${s.title} (${s.domain})`,
            s.type,
            formatDate(s.publishedAt),
            formatDate(s.retrievedAt),
            s.status,
          ])}
        />

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--sp-border)] pt-5">
          <Badge tone="outline">Demonstration data — not a live verified result</Badge>
          <span className="text-[11.5px] text-[var(--sp-text-subtle)]">Signalpost · evidence-backed company intelligence</span>
        </footer>
      </Card>
    </PageShell>
  );
}

function ReportTable({ title, head, rows }: { title: string; head: string[]; rows: string[][] }) {
  return (
    <section className="border-t border-[var(--sp-border)] py-6">
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-subtle)]">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-2 text-[13px] text-[var(--sp-text-muted)]">Not available.</p>
      ) : (
        <div className="sp-scroll mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--sp-border)]">
                {head.map((cell) => (
                  <th key={cell} scope="col" className="py-2 pr-4 text-[11.5px] font-medium uppercase tracking-[0.06em] text-[var(--sp-text-subtle)]">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border-b border-[var(--sp-border)] last:border-b-0">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="tnum py-2 pr-4 text-[12.5px] text-[var(--sp-text)]">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
