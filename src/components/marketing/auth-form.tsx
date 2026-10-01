"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { Button, Card, SectionLabel } from "@/components/ui/primitives";
import { Logo } from "@/components/logo";

const BULLETS = [
  "Organisation-number-first company matching",
  "Every fact linked to its supporting source",
  "Change history from your first lookup",
];

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState(mode === "login" ? "analyst@demo.signalpost.no" : "");
  const [password, setPassword] = useState(mode === "login" ? "demo-workspace" : "");
  const [workspace, setWorkspace] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!email.includes("@")) {
      setError("Enter a valid work email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setPending(true);
    window.setTimeout(() => router.push("/app"), 650);
  }

  return (
    <div className="relative isolate mx-auto grid w-full max-w-[1100px] gap-10 px-5 py-16 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-16 lg:px-8 lg:py-24">
      <div className="sp-grid-bg pointer-events-none absolute inset-x-0 -top-16 h-[480px] -z-10" aria-hidden />
      <div className="hidden lg:block">
        <Logo size={30} />
        <h1 className="sp-display mt-7 text-[36px] font-semibold leading-[1.06]">
          {mode === "login" ? "Welcome back to your research workspace." : "Start researching with evidence attached."}
        </h1>
        <p className="mt-5 max-w-md text-[15px] leading-[1.7] text-[var(--sp-text-muted)]">
          Signalpost keeps company facts, their sources and their history in one place, so a profile can always be
          checked rather than trusted blindly.
        </p>
        <ul className="mt-9 space-y-3.5">
          {BULLETS.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[13.5px] leading-6 text-[var(--sp-text-muted)]">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[var(--sp-accent)]" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-10 max-w-sm rounded-[14px] border border-[var(--sp-border)] bg-[var(--sp-surface)] p-4 shadow-[var(--sp-sheen),var(--sp-shadow)]">
          <div className="flex items-center justify-between text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--sp-text-subtle)]">
            Evidence
            <span className="rounded-[6px] bg-[var(--sp-positive-soft)] px-1.5 py-[2px] text-[10px] text-[var(--sp-positive)]">
              Verified
            </span>
          </div>
          <p className="mt-2.5 text-[12.5px] leading-[1.6] text-[var(--sp-text-muted)]">
            “Operating revenue for the financial year 2025 amounted to NOK 790 400 865.”
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-[var(--sp-border-soft)] pt-2.5 text-[11px] text-[var(--sp-text-subtle)]">
            <span>Annual financial statement</span>
            <span className="tnum">Page 4</span>
          </div>
        </div>

        <div className="mt-8 inline-flex items-center gap-2 rounded-[9px] border border-dashed border-[var(--sp-border-strong)] px-3 py-2 text-[12px] text-[var(--sp-text-subtle)]">
          <ShieldCheck size={14} />
          Demo environment — any credentials open the demo workspace.
        </div>
      </div>

      <Card elevated className="h-fit p-6 sm:p-7">
        <SectionLabel>{mode === "login" ? "Sign in" : "Create workspace"}</SectionLabel>
        <h2 className="mt-2.5 text-[21px] font-semibold tracking-[-0.02em]">
          {mode === "login" ? "Sign in to Signalpost" : "Get started with Signalpost"}
        </h2>
        <p className="mt-1.5 text-[13.5px] leading-6 text-[var(--sp-text-muted)]">
          {mode === "login"
            ? "Use the pre-filled demo credentials or any email to continue."
            : "No card required. The demo workspace is seeded with Norwegian demo companies."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          {mode === "signup" ? (
            <Field label="Workspace name" htmlFor="workspace">
              <input
                id="workspace"
                name="workspace"
                value={workspace}
                onChange={(event) => setWorkspace(event.target.value)}
                placeholder="Nordic Research Desk"
                className="h-10 w-full rounded-lg border border-[var(--sp-border)] bg-[var(--sp-surface)] px-3 text-[13.5px] outline-none transition-colors duration-150 placeholder:text-[var(--sp-text-subtle)] focus:border-[var(--sp-accent)]"
              />
            </Field>
          ) : null}

          <Field label="Work email" htmlFor="email">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.no"
              className="h-10 w-full rounded-lg border border-[var(--sp-border)] bg-[var(--sp-surface)] px-3 text-[13.5px] outline-none transition-colors duration-150 placeholder:text-[var(--sp-text-subtle)] focus:border-[var(--sp-accent)]"
            />
          </Field>

          <Field label="Password" htmlFor="password">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="h-10 w-full rounded-lg border border-[var(--sp-border)] bg-[var(--sp-surface)] px-3 text-[13.5px] outline-none transition-colors duration-150 placeholder:text-[var(--sp-text-subtle)] focus:border-[var(--sp-accent)]"
            />
          </Field>

          {error ? (
            <p role="alert" className="rounded-lg bg-[var(--sp-danger-soft)] px-3 py-2 text-[12.5px] text-[var(--sp-danger)]">
              {error}
            </p>
          ) : null}

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
            {pending ? <Loader2 size={16} className="animate-spin" /> : null}
            {mode === "login" ? "Sign in" : "Create workspace"}
            {!pending ? <ArrowRight size={15} /> : null}
          </Button>
        </form>

        <p className="mt-5 text-center text-[13px] text-[var(--sp-text-muted)]">
          {mode === "login" ? (
            <>
              New to Signalpost?{" "}
              <Link href="/signup" className="font-medium text-[var(--sp-accent)] underline underline-offset-2">
                Create a workspace
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-[var(--sp-accent)] underline underline-offset-2">
                Sign in
              </Link>
            </>
          )}
        </p>
      </Card>
    </div>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[12.5px] font-medium text-[var(--sp-text-muted)]">
        {label}
      </label>
      {children}
    </div>
  );
}
