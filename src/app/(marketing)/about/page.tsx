import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { CtaSection, Section, SectionIntro } from "@/components/marketing/sections";
import { Card, buttonClasses } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "About",
  description: "Signalpost builds evidence-backed company intelligence for analysts, investors, researchers and journalists.",
};

const PRINCIPLES = [
  {
    title: "Identity before information",
    body: "Nothing is attached to a company until the organisation number resolves to an official record. Name-only matches stay labelled.",
  },
  {
    title: "Evidence over assertion",
    body: "A fact without a source is not a fact. Every value carries its source, dates and the passage it came from.",
  },
  {
    title: "Freshness is a property",
    body: "Retrieval dates are shown as prominently as values, so you always know how old a picture is.",
  },
  {
    title: "No invented certainty",
    body: "We do not publish confidence scores the system cannot actually compute, and we mark unavailable data as unavailable.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Section className="pt-16">
        <SectionIntro
          eyebrow="About"
          title="Company research that can be checked."
          description="Signalpost is built for analysts, investors, researchers, journalists and business teams who need to understand a Norwegian company quickly — and need to show where each fact came from."
        />
      </Section>

      <Section className="py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((item) => (
            <Card key={item.title} interactive className="p-5">
              <h3 className="text-[14.5px] font-semibold tracking-[-0.01em]">{item.title}</h3>
              <p className="mt-2 text-[13.5px] leading-6 text-[var(--sp-text-muted)]">{item.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="contact" className="pb-12">
        <Card className="flex flex-col items-start justify-between gap-5 p-7 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-[19px] font-semibold tracking-[-0.02em]">Talk to the team</h2>
            <p className="mt-1.5 text-[13.5px] leading-6 text-[var(--sp-text-muted)]">
              Questions about coverage, sources or running Signalpost against your own watchlist?
            </p>
          </div>
          <a href="mailto:hello@signalpost.no" className={buttonClasses("primary", "md")}>
            <Mail size={15} />
            hello@signalpost.no
          </a>
        </Card>
      </Section>

      <Section id="privacy" className="pb-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-[15px] font-semibold tracking-[-0.015em]">Privacy</h2>
            <p className="mt-2 text-[13.5px] leading-6 text-[var(--sp-text-muted)]">
              Signalpost processes information that is published for public access. Personal data appears only where a
              person holds a publicly registered company role. Search history is stored per workspace and can be cleared
              at any time from{" "}
              <Link href="/app/history" className="text-[var(--sp-accent)] underline underline-offset-2">
                History
              </Link>
              .
            </p>
          </Card>
          <Card id="terms" className="p-6">
            <h2 className="text-[15px] font-semibold tracking-[-0.015em]">Terms</h2>
            <p className="mt-2 text-[13.5px] leading-6 text-[var(--sp-text-muted)]">
              This environment is a demonstration. All company figures, people and activity shown are demonstration data
              and must not be used as a live verified result or as a basis for a transaction decision.
            </p>
          </Card>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
