import type { Metadata } from "next";
import { CtaSection, EvidenceSection, Section, SectionIntro } from "@/components/marketing/sections";
import { Badge, Card, SectionLabel } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Sources",
  description: "Which public source categories Signalpost reads, and how evidence is recorded.",
};

const CATEGORIES = [
  {
    type: "Official",
    examples: "Register of Business Enterprises, announcement register",
    use: "Identity, legal form, address, registered roles, status",
  },
  {
    type: "Financial",
    examples: "Published annual accounts and financial statements",
    use: "Revenue, operating profit, assets, equity, reporting period",
  },
  {
    type: "Website",
    examples: "Official company domain and public pages",
    use: "Description, products, services, locations, leadership",
  },
  {
    type: "Jobs",
    examples: "Company career pages and public vacancy registers",
    use: "Open roles, hiring locations, publication dates",
  },
  {
    type: "News",
    examples: "Public announcements and trade press",
    use: "Public signals, reported events, context",
  },
];

export default function SourcesPage() {
  return (
    <>
      <Section className="pt-16">
        <SectionIntro
          eyebrow="Sources"
          title="Permitted public sources, recorded in full."
          description="Signalpost only reads material that is published for public access. Each retrieval keeps the URL, publication date, retrieval date and the passage the fact came from."
        />
      </Section>

      <Section id="permitted" className="py-12">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--sp-border)] px-5 py-4">
            <SectionLabel>Source categories</SectionLabel>
            <Badge tone="outline">5 categories</Badge>
          </div>
          <div className="sp-scroll overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-[var(--sp-border)] text-[11.5px] uppercase tracking-[0.07em] text-[var(--sp-text-subtle)]">
                  <th scope="col" className="px-5 py-2.5 font-medium">Type</th>
                  <th scope="col" className="px-5 py-2.5 font-medium">Typical material</th>
                  <th scope="col" className="px-5 py-2.5 font-medium">Used for</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map((row) => (
                  <tr key={row.type} className="border-b border-[var(--sp-border)] last:border-b-0">
                    <td className="px-5 py-3.5 text-[13px] font-medium">{row.type}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[var(--sp-text-muted)]">{row.examples}</td>
                    <td className="px-5 py-3.5 text-[13px] text-[var(--sp-text-muted)]">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "What we record",
              body: "Source title, domain, URL, publication date, retrieval date, excerpt and page or field reference.",
            },
            {
              title: "What we label",
              body: "Matches made on company name alone are marked ambiguous until an organisation number confirms them.",
            },
            {
              title: "What we avoid",
              body: "No scraped private data, no paywalled content and no invented confidence scores.",
            },
          ].map((item) => (
            <Card key={item.title} className="p-5">
              <h3 className="text-[14px] font-semibold tracking-[-0.01em]">{item.title}</h3>
              <p className="mt-2 text-[13.5px] leading-6 text-[var(--sp-text-muted)]">{item.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <EvidenceSection />
      <CtaSection />
    </>
  );
}
