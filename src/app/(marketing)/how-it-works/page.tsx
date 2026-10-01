import type { Metadata } from "next";
import { CtaSection, ProcessSection, Section, SectionIntro } from "@/components/marketing/sections";
import { Card, SectionLabel } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "How it works",
  description: "From organisation number to a current, evidence-backed company profile in six steps.",
};

const RESEARCH_STEPS = [
  { title: "Identity resolved", detail: "Official registry record", sources: 3 },
  { title: "Official company record checked", detail: "Legal name, form, address, status", sources: 2 },
  { title: "Financial information checked", detail: "Published annual accounts", sources: 2 },
  { title: "People and locations checked", detail: "Registered roles and units", sources: 3 },
  { title: "Website researched", detail: "Official domain and descriptions", sources: 2 },
  { title: "Hiring activity checked", detail: "Career pages and vacancy registers", sources: 2 },
  { title: "Public signals checked", detail: "Announcements and press material", sources: 3 },
  { title: "Evidence verified", detail: "Facts matched to passages", sources: 1 },
];

export default function HowItWorksPage() {
  return (
    <>
      <Section className="pb-2 pt-16">
        <SectionIntro
          eyebrow="Process"
          title="A research process you can follow step by step."
          description="Signalpost shows what it checked, in what order, and how many sources supported each stage."
        />
      </Section>
      <ProcessSection compact />
      <Section className="pb-16">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <SectionLabel>Research run — structure</SectionLabel>
            <span className="text-[12px] text-[var(--sp-text-subtle)]">8 stages</span>
          </div>
          <ol className="mt-5 divide-y divide-[var(--sp-border)]">
            {RESEARCH_STEPS.map((step, index) => (
              <li key={step.title} className="flex items-center justify-between gap-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="tnum w-6 shrink-0 text-[12px] text-[var(--sp-text-subtle)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[13.5px] font-medium">{step.title}</div>
                    <div className="truncate text-[12.5px] text-[var(--sp-text-muted)]">{step.detail}</div>
                  </div>
                </div>
                <span className="tnum shrink-0 text-[12px] text-[var(--sp-text-subtle)]">{step.sources} sources</span>
              </li>
            ))}
          </ol>
        </Card>
      </Section>
      <CtaSection />
    </>
  );
}
