import Link from "next/link";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import { HeroPreview } from "@/components/marketing/hero-preview";
import {
  CtaSection,
  EvidenceSection,
  FeatureSection,
  ProcessSection,
  Section,
  SectionDivider,
  TrustSection,
  WorkspaceShowcase,
} from "@/components/marketing/sections";
import { Eyebrow, buttonClasses } from "@/components/ui/primitives";

const SOURCE_RAIL = [
  "data.brreg.no",
  "w2.brreg.no",
  "arbeidsplassen.nav.no",
  "newsweb.oslobors.no",
  "company websites",
];

const HERO_STATS = [
  { label: "Profile sections", value: "9" },
  { label: "Source types tracked", value: "5" },
  { label: "Demo companies", value: "10" },
];

export default function HomePage() {
  return (
    <>
      <div className="relative isolate overflow-hidden">
        <div className="sp-grid-bg pointer-events-none absolute inset-x-0 top-0 h-[640px]" aria-hidden />
        <div className="sp-spotlight pointer-events-none absolute inset-x-0 top-0 h-[560px]" aria-hidden />

        <Section className="relative pb-16 pt-12 sm:pt-18 lg:pt-20">
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.04fr)] lg:gap-16">
            <div className="sp-rise">
              <Eyebrow>Norwegian company intelligence</Eyebrow>

              <h1 className="sp-display mt-6 text-[42px] font-semibold leading-[1.02] sm:text-[58px]">
                Know the company
                <br className="hidden sm:block" /> behind the{" "}
                <span className="relative whitespace-nowrap">
                  number.
                  <svg
                    className="absolute -bottom-1.5 left-0 h-2.5 w-full text-[var(--sp-accent)]"
                    viewBox="0 0 200 10"
                    preserveAspectRatio="none"
                    aria-hidden
                  >
                    <path
                      d="M2 7.5C40 3 90 2.2 198 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      opacity="0.42"
                    />
                  </svg>
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-[16.5px] leading-[1.68] text-[var(--sp-text-muted)]">
                Search a Norwegian organisation number and build a current, evidence-backed company profile from
                permitted public sources.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/app/search" className={buttonClasses("primary", "lg")}>
                  <Search size={16} />
                  Search a company
                </Link>
                <Link href="/app" className={buttonClasses("secondary", "lg")}>
                  Explore demo
                  <ArrowRight size={15} />
                </Link>
              </div>

              <div className="mt-10">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--sp-text-subtle)]">
                  <ShieldCheck size={13} />
                  Reads permitted public sources
                </div>
                <div className="sp-fade-x mt-3 flex flex-wrap gap-1.5">
                  {SOURCE_RAIL.map((domain) => (
                    <span
                      key={domain}
                      className="rounded-[7px] border border-[var(--sp-border)] bg-[var(--sp-surface)] px-2 py-1 text-[11.5px] text-[var(--sp-text-muted)] shadow-[var(--sp-sheen)]"
                    >
                      {domain}
                    </span>
                  ))}
                </div>
              </div>

              <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-[var(--sp-border)] pt-7">
                {HERO_STATS.map((stat) => (
                  <div key={stat.label}>
                    <dd className="tnum sp-display text-[24px] font-semibold leading-none">{stat.value}</dd>
                    <dt className="mt-2 text-[11.5px] leading-4 text-[var(--sp-text-subtle)]">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative lg:pl-2">
              <HeroPreview />
            </div>
          </div>
        </Section>
      </div>

      <SectionDivider label="Evidence first" />
      <TrustSection />
      <WorkspaceShowcase />
      <ProcessSection />
      <FeatureSection />
      <EvidenceSection />
      <CtaSection />
    </>
  );
}
