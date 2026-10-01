"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { buttonClasses } from "@/components/ui/primitives";
import { ThemeToggle } from "@/components/theme-provider";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/features", label: "Product" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/sources", label: "Sources" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-250",
        scrolled
          ? "border-[var(--sp-border)] bg-[color-mix(in_srgb,var(--sp-bg)_82%,transparent)] shadow-[0_1px_0_rgba(20,22,28,0.02)] backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-6 px-5 lg:px-8">
        <div className="flex items-center gap-9">
          <Link href="/" className="group flex items-center gap-2.5 rounded-md" aria-label="Signalpost home">
            <span className="transition-transform duration-250 group-hover:scale-[1.05]">
              <Logo size={26} />
            </span>
            <span className="sp-display text-[15.5px] font-semibold text-[var(--sp-text)]">Signalpost</span>
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn(
                  "relative rounded-[9px] px-3 py-1.5 text-[13.5px] font-medium transition-colors duration-200",
                  pathname === item.href
                    ? "text-[var(--sp-text)]"
                    : "text-[var(--sp-text-muted)] hover:bg-[var(--sp-surface-2)] hover:text-[var(--sp-text)]",
                )}
              >
                {item.label}
                {pathname === item.href ? (
                  <span
                    className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-[var(--sp-accent)]"
                    aria-hidden
                  />
                ) : null}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          <ThemeToggle compact />
          <Link href="/login" className={buttonClasses("ghost", "sm")}>
            Sign in
          </Link>
          <Link href="/signup" className={buttonClasses("primary", "sm")}>
            Get started
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--sp-border)] text-[var(--sp-text-muted)] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={17} /> : <Menu size={17} />}
        </button>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-[var(--sp-border)] bg-[var(--sp-surface)] px-5 py-4 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-2 py-2 text-sm font-medium text-[var(--sp-text)] hover:bg-[var(--sp-surface-2)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex items-center gap-2">
            <Link href="/login" className={buttonClasses("secondary", "md", "flex-1")}>
              Sign in
            </Link>
            <Link href="/signup" className={buttonClasses("primary", "md", "flex-1")}>
              Get started
            </Link>
          </div>
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </div>
      ) : null}
    </header>
  );
}
