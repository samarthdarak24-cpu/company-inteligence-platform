"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CalendarClock, CheckCircle2, Copy, ExternalLink, FileText, Globe2, Quote, ShieldCheck } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { Badge, Button, DemoBadge, SectionLabel, buttonClasses } from "@/components/ui/primitives";
import type { SourceDto } from "@/lib/client-api";
import { formatDate, formatOrgNumber } from "@/lib/utils";

export type EvidencePayload = {
  factLabel?: string;
  factValue?: string;
  companyName?: string;
  orgNumber?: string;
  source: SourceDto | null;
};

const EvidenceContext = createContext<{ open: (payload: EvidencePayload) => void }>({ open: () => {} });

export function useEvidence() {
  return useContext(EvidenceContext);
}

export function EvidenceProvider({ children }: { children: ReactNode }) {
  const [payload, setPayload] = useState<EvidencePayload | null>(null);
  const [copied, setCopied] = useState(false);

  const open = useCallback((next: EvidencePayload) => {
    setPayload(next);
    setCopied(false);
  }, []);

  const value = useMemo(() => ({ open }), [open]);
  const source = payload?.source ?? null;

  return (
    <EvidenceContext.Provider value={value}>
      {children}
      <Drawer
        open={Boolean(payload)}
        onClose={() => setPayload(null)}
        eyebrow="Evidence"
        title={payload?.factLabel ?? source?.title ?? "Source detail"}
        footer={
          source ? (
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-[12px] text-[var(--sp-text-subtle)]">{source.domain}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard?.writeText(source.url).then(
                      () => setCopied(true),
                      () => setCopied(false),
                    );
                  }}
                >
                  <Copy size={14} />
                  {copied ? "Copied" : "Copy URL"}
                </Button>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={buttonClasses("primary", "sm")}
                >
                  Open source
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ) : null
        }
      >
        {!source ? (
          <div className="py-10 text-center">
            <p className="text-[13.5px] text-[var(--sp-text-muted)]">
              No source is attached to this fact yet. It is shown as unavailable rather than inferred.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {payload?.factValue ? (
              <section>
                <SectionLabel>Fact</SectionLabel>
                <div className="mt-2 rounded-xl border border-[var(--sp-border)] bg-[var(--sp-surface-2)]/60 p-4">
                  <div className="text-[12.5px] text-[var(--sp-text-muted)]">{payload.factLabel}</div>
                  <div className="tnum mt-1 text-[19px] font-semibold tracking-[-0.02em]">{payload.factValue}</div>
                  {payload.companyName ? (
                    <div className="tnum mt-2 text-[12px] text-[var(--sp-text-subtle)]">
                      {payload.companyName}
                      {payload.orgNumber ? ` · ${formatOrgNumber(payload.orgNumber)}` : ""}
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}

            <section>
              <SectionLabel>Source</SectionLabel>
              <div className="mt-2 flex items-start gap-3 rounded-xl border border-[var(--sp-border)] p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--sp-border)] bg-[var(--sp-surface-2)] text-[var(--sp-text-muted)]">
                  {source.type === "official" ? (
                    <ShieldCheck size={16} />
                  ) : source.type === "financial" ? (
                    <FileText size={16} />
                  ) : (
                    <Globe2 size={16} />
                  )}
                </span>
                <div className="min-w-0">
                  <div className="text-[13.5px] font-medium leading-5">{source.title}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge tone="outline">{source.domain}</Badge>
                    <Badge tone="neutral" className="capitalize">
                      {source.type}
                    </Badge>
                    <Badge tone={source.status === "verified" ? "positive" : source.status === "ambiguous" ? "warning" : "accent"}>
                      {source.status === "verified" ? (
                        <>
                          <CheckCircle2 size={11} /> Verified
                        </>
                      ) : source.status === "ambiguous" ? (
                        "Ambiguous"
                      ) : (
                        "Source-backed"
                      )}
                    </Badge>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[var(--sp-border)] p-3.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.09em] text-[var(--sp-text-subtle)]">
                  <CalendarClock size={12} /> Published
                </div>
                <div className="tnum mt-1.5 text-[13.5px] font-medium">{formatDate(source.publishedAt)}</div>
              </div>
              <div className="rounded-xl border border-[var(--sp-border)] p-3.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.09em] text-[var(--sp-text-subtle)]">
                  <CalendarClock size={12} /> Retrieved
                </div>
                <div className="tnum mt-1.5 text-[13.5px] font-medium">{formatDate(source.retrievedAt)}</div>
              </div>
            </section>

            <section>
              <SectionLabel>Evidence</SectionLabel>
              <blockquote className="mt-2 rounded-xl border border-[var(--sp-border)] bg-[var(--sp-surface-2)]/50 p-4">
                <Quote size={14} className="mb-2 text-[var(--sp-text-subtle)]" />
                <p className="text-[13.5px] leading-6 text-[var(--sp-text)]">{source.excerpt}</p>
              </blockquote>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge tone="neutral">Page {source.page}</Badge>
                <Badge tone="outline">Status: {source.status}</Badge>
                <DemoBadge />
              </div>
            </section>

            <section>
              <SectionLabel>Source URL</SectionLabel>
              <p className="tnum mt-2 break-all rounded-lg border border-[var(--sp-border)] bg-[var(--sp-surface-2)]/50 p-3 text-[12px] text-[var(--sp-text-muted)]">
                {source.url}
              </p>
            </section>
          </div>
        )}
      </Drawer>
    </EvidenceContext.Provider>
  );
}
