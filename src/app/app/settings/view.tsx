"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Copy, Eye, EyeOff, KeyRound } from "lucide-react";
import { PageHeader, PageShell } from "@/components/app/page-shell";
import { Badge, Button, Card, CardHeader, FieldRow, MetricCard } from "@/components/ui/primitives";
import { ThemeToggle } from "@/components/theme-provider";
import { apiGet, queryKeys, API_BASE } from "@/lib/client-api";
import { cn, formatNumber } from "@/lib/utils";

const TABS = ["Profile", "Workspace", "Data", "Theme", "Notifications", "API", "Usage"] as const;
type Tab = (typeof TABS)[number];

const DEMO_KEY = "sp_live_7f3c9a2b4d8e1065_demo";

export function SettingsView() {
  const [tab, setTab] = useState<Tab>("Profile");
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [preferences, setPreferences] = useState({
    includeNews: true,
    includeJobs: true,
    markAmbiguous: true,
    weeklyDigest: true,
    changeAlerts: true,
    filingAlerts: false,
  });

  const { data } = useQuery({
    queryKey: queryKeys.stats,
    queryFn: () => apiGet<{ stats: { companiesResearched: number; sourcesChecked: number; evidenceCoverage: number } }>("/api/stats"),
  });

  return (
    <PageShell>
      <PageHeader eyebrow="System" title="Settings" description="Workspace configuration, data preferences, theme, API access and usage." />

      <div className="grid gap-5 lg:grid-cols-[200px_1fr]">
        <nav aria-label="Settings sections" className="lg:sticky lg:top-20 lg:self-start">
          <ul className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {TABS.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => setTab(item)}
                  aria-current={tab === item ? "true" : undefined}
                  className={cn(
                    "w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors duration-150",
                    tab === item
                      ? "bg-[var(--sp-surface-3)] text-[var(--sp-text)]"
                      : "text-[var(--sp-text-muted)] hover:bg-[var(--sp-surface-2)] hover:text-[var(--sp-text)]",
                  )}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 space-y-5">
          {tab === "Profile" ? (
            <Card>
              <CardHeader title="Profile" description="How you appear inside the workspace." />
              <div className="p-5">
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--sp-border)] bg-[var(--sp-surface-2)] text-[16px] font-semibold text-[var(--sp-text-muted)]">
                    AH
                  </span>
                  <div>
                    <div className="text-[15px] font-semibold tracking-[-0.015em]">Astrid Haugen</div>
                    <div className="text-[13px] text-[var(--sp-text-muted)]">analyst@demo.signalpost.no</div>
                  </div>
                </div>
                <dl className="mt-5">
                  <FieldRow label="Role">Senior analyst</FieldRow>
                  <FieldRow label="Workspace">Nordic Research</FieldRow>
                  <FieldRow label="Language">English (UK)</FieldRow>
                  <FieldRow label="Time zone">Europe/Oslo</FieldRow>
                </dl>
              </div>
            </Card>
          ) : null}

          {tab === "Workspace" ? (
            <Card>
              <CardHeader title="Workspace" description="Shared settings for everyone in Nordic Research." />
              <div className="p-5">
                <dl>
                  <FieldRow label="Workspace name">Nordic Research</FieldRow>
                  <FieldRow label="Plan">Demo</FieldRow>
                  <FieldRow label="Members">4</FieldRow>
                  <FieldRow label="Default market">Norway</FieldRow>
                  <FieldRow label="Retention">24 months of change history</FieldRow>
                </dl>
              </div>
            </Card>
          ) : null}

          {tab === "Data" ? (
            <Card>
              <CardHeader title="Data preferences" description="Which permitted source categories are included in a research run." />
              <div className="divide-y divide-[var(--sp-border)]">
                {[
                  { key: "includeNews" as const, title: "Include news sources", body: "Public announcements and trade press coverage." },
                  { key: "includeJobs" as const, title: "Include hiring sources", body: "Career pages and public vacancy registers." },
                  { key: "markAmbiguous" as const, title: "Mark name-only matches as ambiguous", body: "Never merge a record without an organisation number." },
                ].map((item) => (
                  <Toggle
                    key={item.key}
                    title={item.title}
                    body={item.body}
                    checked={preferences[item.key]}
                    onChange={(value) => setPreferences((prev) => ({ ...prev, [item.key]: value }))}
                  />
                ))}
              </div>
            </Card>
          ) : null}

          {tab === "Theme" ? (
            <Card>
              <CardHeader title="Theme" description="Your preference is stored in this browser." />
              <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <div className="text-[13.5px] font-medium">Interface theme</div>
                  <p className="mt-1 text-[12.5px] text-[var(--sp-text-muted)]">
                    Light, dark or follow the operating system.
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </Card>
          ) : null}

          {tab === "Notifications" ? (
            <Card>
              <CardHeader title="Notifications" description="When Signalpost should tell you something moved." />
              <div className="divide-y divide-[var(--sp-border)]">
                <Toggle
                  title="Weekly digest"
                  body="A Monday summary of changes across tracked companies."
                  checked={preferences.weeklyDigest}
                  onChange={(value) => setPreferences((prev) => ({ ...prev, weeklyDigest: value }))}
                />
                <Toggle
                  title="Change alerts"
                  body="Notify when a tracked value differs from the previous reading."
                  checked={preferences.changeAlerts}
                  onChange={(value) => setPreferences((prev) => ({ ...prev, changeAlerts: value }))}
                />
                <Toggle
                  title="New filing alerts"
                  body="Notify when new annual accounts are registered."
                  checked={preferences.filingAlerts}
                  onChange={(value) => setPreferences((prev) => ({ ...prev, filingAlerts: value }))}
                />
              </div>
            </Card>
          ) : null}

          {tab === "API" ? (
            <Card>
              <CardHeader
                title="API"
                description="The workspace API mirrors the data shown in the interface."
                action={<Badge tone="accent">v1</Badge>}
              />
              <div className="space-y-4 p-5">
                <div>
                  <div className="text-[12.5px] font-medium text-[var(--sp-text-muted)]">API endpoint</div>
                  <code className="mt-1.5 block overflow-x-auto rounded-lg border border-[var(--sp-border)] bg-[var(--sp-surface-2)]/60 px-3 py-2 text-[12.5px]">
                    {API_BASE || "https://app.signalpost.no"}/api/company/979543883
                  </code>
                </div>
                <div>
                  <div className="text-[12.5px] font-medium text-[var(--sp-text-muted)]">API key</div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <code className="tnum flex-1 overflow-x-auto rounded-lg border border-[var(--sp-border)] bg-[var(--sp-surface-2)]/60 px-3 py-2 text-[12.5px]">
                      {showKey ? DEMO_KEY : "•".repeat(DEMO_KEY.length)}
                    </code>
                    <Button variant="secondary" size="sm" onClick={() => setShowKey((v) => !v)}>
                      {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      {showKey ? "Hide" : "Reveal"}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard?.writeText(DEMO_KEY).then(() => {
                          setCopied(true);
                          window.setTimeout(() => setCopied(false), 1600);
                        });
                      }}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                </div>
                <dl>
                  <FieldRow label="Requests this month">12,480</FieldRow>
                  <FieldRow label="Daily request budget">2,000</FieldRow>
                  <FieldRow label="Rate limit">60 requests / minute</FieldRow>
                </dl>
                <p className="flex items-start gap-2 rounded-lg border border-dashed border-[var(--sp-border-strong)] px-3 py-2 text-[12px] text-[var(--sp-text-subtle)]">
                  <KeyRound size={14} className="mt-0.5 shrink-0" />
                  Demo key. Rotate keys from your workspace settings in a production deployment.
                </p>
              </div>
            </Card>
          ) : null}

          {tab === "Usage" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <MetricCard label="Companies researched" value={formatNumber(data?.stats.companiesResearched ?? 0)} sublabel="Lifetime workspace total" />
              <MetricCard label="Requests" value="12,480" sublabel="Current billing period" />
              <MetricCard label="Average response time" value="384 ms" sublabel="Across profile endpoints" />
              <MetricCard label="External API cost estimate" value="NOK 1,240" sublabel="Source retrieval, current month" />
              <Card className="p-5 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium">Daily request budget</span>
                  <span className="tnum text-[12.5px] text-[var(--sp-text-muted)]">1,284 / 2,000</span>
                </div>
                <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[var(--sp-surface-3)]">
                  <div className="h-full rounded-full bg-[var(--sp-accent)]" style={{ width: "64%" }} />
                </div>
                <p className="mt-2.5 text-[12px] text-[var(--sp-text-subtle)]">
                  Budgets protect against runaway source retrieval. Requests above the budget are queued to the next day.
                </p>
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}

function Toggle({
  title,
  body,
  checked,
  onChange,
}: {
  title: string;
  body: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-5 px-5 py-4">
      <div className="min-w-0">
        <div className="text-[13.5px] font-medium">{title}</div>
        <p className="mt-0.5 text-[12.5px] leading-5 text-[var(--sp-text-muted)]">{body}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-[var(--sp-accent)]" : "bg-[var(--sp-surface-3)]",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}
