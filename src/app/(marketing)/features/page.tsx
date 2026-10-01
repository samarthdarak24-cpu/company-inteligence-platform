import type { Metadata } from "next";
import {
  CtaSection,
  EvidenceSection,
  FeatureSection,
  Section,
  SectionDivider,
  SectionIntro,
  TrustSection,
  WorkspaceShowcase,
} from "@/components/marketing/sections";
import { Card } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Product",
  description: "Company records, financials, people, locations, presence, hiring, activity and history — all evidence-backed.",
};

const SURFACES = [
  {
    title: "Research workspace",
    body: "A dense, keyboard-first workspace: search, company list, comparison, activity feed, sources and history in one shell.",
  },
  {
    title: "Evidence drawer",
    body: "Open any fact to see the source, publication date, retrieval date, excerpt, page reference and verification status.",
  },
  {
    title: "Change tracking",
    body: "Previous and current values stored side by side with the date the change was observed.",
  },
  {
    title: "Export",
    body: "Download a profile as JSON, export financials as CSV, or open a structured report layout for sharing.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Section className="pb-6 pt-20">
        <SectionIntro
          eyebrow="Product"
          title="A research workspace, not a chat window."
          description="Signalpost is organised the way an analyst works: one record per organisation number, a clear source trail, and a history of what changed."
        />
      </Section>
      <WorkspaceShowcase />
      <SectionDivider label="Capabilities" />
      <FeatureSection />
      <Section className="pb-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {SURFACES.map((item) => (
            <Card key={item.title} interactive rail className="p-6">
              <h3 className="text-[15px] font-semibold tracking-[-0.015em]">{item.title}</h3>
              <p className="mt-2.5 text-[13.5px] leading-[1.65] text-[var(--sp-text-muted)]">{item.body}</p>
            </Card>
          ))}
        </div>
      </Section>
      <TrustSection />
      <EvidenceSection />
      <CtaSection />
    </>
  );
}
