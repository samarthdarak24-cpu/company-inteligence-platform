import Link from "next/link";
import { Logo } from "@/components/logo";

const GROUPS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/sources", label: "Sources" },
      { href: "/app", label: "Open dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/about#contact", label: "Contact" },
      { href: "/signup", label: "Get started" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/about#privacy", label: "Privacy" },
      { href: "/about#terms", label: "Terms" },
      { href: "/sources#permitted", label: "Permitted sources" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--sp-border)] bg-[var(--sp-surface)]">
      <div className="mx-auto max-w-[1180px] px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo size={26} />
              <span className="sp-display text-[15.5px] font-semibold">Signalpost</span>
            </div>
            <p className="mt-4 max-w-xs text-[13.5px] leading-[1.7] text-[var(--sp-text-muted)]">
              Evidence-backed company intelligence. Every fact stays connected to the source it came from.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-[8px] border border-[var(--sp-border)] bg-[var(--sp-surface-2)]/60 px-2.5 py-1.5 text-[11.5px] text-[var(--sp-text-subtle)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--sp-positive)]" aria-hidden />
              Demo environment · all data is demonstration data
            </div>
          </div>
          {GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-subtle)]">
                {group.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13.5px] text-[var(--sp-text-muted)] transition-colors duration-150 hover:text-[var(--sp-text)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-[var(--sp-border)] pt-7 text-[12.5px] text-[var(--sp-text-subtle)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Signalpost AS. Verified company intelligence, backed by evidence.</p>
          <p>Built for research teams in Norway.</p>
        </div>
      </div>

      <div
        className="pointer-events-none select-none px-5 pb-0 lg:px-8"
        aria-hidden
      >
        <div className="mx-auto max-w-[1180px]">
          <span className="sp-display block translate-y-[26%] bg-gradient-to-b from-[var(--sp-surface-3)] to-transparent bg-clip-text text-[clamp(60px,15vw,190px)] font-semibold leading-none text-transparent">
            Signalpost
          </span>
        </div>
      </div>
    </footer>
  );
}
