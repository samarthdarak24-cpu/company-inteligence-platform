"use client";

import { motion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Quote,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { LineChart } from "@/components/ui/charts";
import { Badge } from "@/components/ui/primitives";

const TYPED = "979543883";

const CARDS = [
  { label: "Revenue", value: "NOK 790.4M", icon: <FileText size={13} /> },
  { label: "Employees", value: "1,000+", icon: <Users size={13} /> },
  { label: "Headquarters", value: "Bodø, Norway", icon: <MapPin size={13} /> },
  { label: "Latest update", value: "2 days ago", icon: <Clock3 size={13} /> },
];

const TIMELINE = [
  { date: "22 Sep", text: "New annual filing detected" },
  { date: "18 Sep", text: "New job posting detected" },
  { date: "12 Sep", text: "Management record changed" },
];

const TABS = ["Overview", "Financials", "People", "Sources"];

export function HeroPreview() {
  const [typed, setTyped] = useState("");
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setTyped(TYPED.slice(0, index));
      if (index >= TYPED.length) {
        window.clearInterval(interval);
        window.setTimeout(() => setResolved(true), 300);
      }
    }, 80);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* stacked paper edges behind the panel */}
      <div
        className="pointer-events-none absolute -inset-x-5 -top-4 bottom-8 -z-10 rounded-[22px] border border-[var(--sp-border)] bg-[var(--sp-surface)]/55"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -inset-x-2.5 -top-2 bottom-5 -z-10 rounded-[20px] border border-[var(--sp-border)] bg-[var(--sp-surface)]/80"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 0.84, 0.44, 1] }}
        className="overflow-hidden rounded-[18px] border border-[var(--sp-border)] bg-[var(--sp-surface)] shadow-[var(--sp-sheen),var(--sp-shadow-lg)]"
      >
        {/* chrome */}
        <div className="flex items-center justify-between border-b border-[var(--sp-border)] bg-[var(--sp-surface-2)]/70 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-[var(--sp-accent)] text-[9.5px] font-bold text-white">
              NR
            </span>
            <span className="text-[11.5px] font-medium text-[var(--sp-text-muted)]">Nordic Research</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-[7px] border border-dashed border-[var(--sp-border-strong)] px-1.5 py-[2px] text-[9.5px] font-semibold uppercase tracking-[0.1em] text-[var(--sp-text-subtle)]">
            Demo profile
          </span>
        </div>

        <div className="space-y-3.5 p-4 sm:p-5">
          {/* search */}
          <div className="flex items-center gap-2.5 rounded-[12px] border border-[var(--sp-border)] bg-[var(--sp-surface-2)]/60 px-3 py-2.5 shadow-[var(--sp-sheen)]">
            <Search size={15} className="shrink-0 text-[var(--sp-text-subtle)]" />
            <span className="tnum text-[13.5px] font-medium text-[var(--sp-text)]">
              {typed}
              {typed.length < TYPED.length ? (
                <span className="ml-0.5 inline-block h-4 w-[1.5px] translate-y-[3px] animate-pulse bg-[var(--sp-accent)]" />
              ) : null}
            </span>
            {typed.length === TYPED.length ? (
              <Badge tone="accent" className="ml-auto">
                Organisation number
              </Badge>
            ) : null}
          </div>

          {/* identity */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={resolved ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden rounded-[13px] border border-[var(--sp-border)]"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[var(--sp-border-soft)] bg-[var(--sp-surface-2)]/40 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[var(--sp-border)] bg-gradient-to-b from-[var(--sp-surface)] to-[var(--sp-surface-2)] text-[var(--sp-text-muted)] shadow-[var(--sp-sheen)]">
                  <Building2 size={16} />
                </span>
                <div>
                  <h3 className="sp-display text-[15.5px] font-semibold">DIPS AS</h3>
                  <p className="tnum mt-0.5 text-[12px] text-[var(--sp-text-muted)]">979 543 883 · AS · Bodø</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <Badge tone="positive" icon={<CheckCircle2 size={11} />}>
                  Active
                </Badge>
                <Badge tone="accent" icon={<ShieldCheck size={11} />}>
                  Verified
                </Badge>
              </div>
            </div>

            {/* tabs */}
            <div className="flex gap-1 border-b border-[var(--sp-border-soft)] px-3">
              {TABS.map((tab, index) => (
                <span
                  key={tab}
                  className={
                    index === 0
                      ? "relative px-2 py-2 text-[11.5px] font-medium text-[var(--sp-text)]"
                      : "px-2 py-2 text-[11.5px] font-medium text-[var(--sp-text-subtle)]"
                  }
                >
                  {tab}
                  {index === 0 ? (
                    <span className="absolute inset-x-1.5 bottom-0 h-[2px] rounded-t bg-[var(--sp-accent)]" />
                  ) : null}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2.5 p-3.5">
              {CARDS.map((card, index) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={resolved ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.24, delay: 0.1 + index * 0.06 }}
                  className="rounded-[10px] border border-[var(--sp-border)] bg-[var(--sp-surface)] px-3 py-2.5 shadow-[var(--sp-sheen)]"
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--sp-text-subtle)]">
                    {card.icon}
                    {card.label}
                  </div>
                  <div className="tnum mt-1.5 text-[14px] font-semibold tracking-[-0.015em]">{card.value}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* chart + evidence */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={resolved ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, delay: 0.32 }}
            className="grid gap-3.5 sm:grid-cols-[1.3fr_1fr]"
          >
            <div className="rounded-[13px] border border-[var(--sp-border)] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-medium text-[var(--sp-text-muted)]">Operating revenue</span>
                <span className="tnum text-[10.5px] uppercase tracking-[0.08em] text-[var(--sp-text-subtle)]">
                  NOK million
                </span>
              </div>
              {resolved ? (
                <LineChart
                  ariaLabel="Demo revenue trend for DIPS AS"
                  height={112}
                  data={[
                    { label: "2023", value: 658.2 },
                    { label: "2024", value: 712.1 },
                    { label: "2025", value: 790.4 },
                  ]}
                  formatValue={(v) => `NOK ${v.toFixed(1)}M`}
                />
              ) : (
                <div className="h-[112px]" />
              )}
            </div>

            <div className="space-y-3">
              <div className="rounded-[13px] border border-[var(--sp-border)] p-3.5">
                <div className="flex items-center justify-between text-[11.5px] text-[var(--sp-text-muted)]">
                  <span>Evidence coverage</span>
                  <span className="tnum font-semibold text-[var(--sp-text)]">94%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--sp-surface-3)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={resolved ? { width: "94%" } : {}}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                    className="h-full rounded-full bg-[var(--sp-accent)]"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[var(--sp-border-soft)] pt-2.5 text-[11.5px] text-[var(--sp-text-muted)]">
                  <span>Sources</span>
                  <span className="tnum font-semibold text-[var(--sp-text)]">18</span>
                </div>
              </div>

              <ul className="rounded-[13px] border border-[var(--sp-border)] px-3.5 py-2.5">
                {TIMELINE.map((item, index) => (
                  <motion.li
                    key={item.text}
                    initial={{ opacity: 0, x: -4 }}
                    animate={resolved ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.24, delay: 0.5 + index * 0.08 }}
                    className="flex items-start gap-2.5 py-[5px] text-[11.5px]"
                  >
                    <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--sp-accent)]" aria-hidden />
                    <span className="tnum w-[42px] shrink-0 text-[var(--sp-text-subtle)]">{item.date}</span>
                    <span className="truncate text-[var(--sp-text-muted)]">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* floating evidence chip */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.97 }}
        animate={resolved ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.34, delay: 0.75, ease: [0.16, 0.84, 0.44, 1] }}
        className="absolute -bottom-7 -left-2 hidden w-[272px] rounded-[13px] border border-[var(--sp-border)] bg-[var(--sp-surface)] p-3.5 shadow-[var(--sp-sheen),var(--sp-shadow-lg)] sm:block lg:-left-10"
      >
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] font-semibold uppercase tracking-[0.13em] text-[var(--sp-text-subtle)]">
            Evidence
          </span>
          <Badge tone="positive">Verified</Badge>
        </div>
        <p className="mt-2 flex gap-2 text-[11.5px] leading-[1.55] text-[var(--sp-text-muted)]">
          <Quote size={12} className="mt-0.5 shrink-0 text-[var(--sp-text-subtle)]" />
          Operating revenue for 2025 amounted to NOK 790 400 865.
        </p>
        <div className="mt-2.5 flex items-center justify-between border-t border-[var(--sp-border-soft)] pt-2 text-[10.5px] text-[var(--sp-text-subtle)]">
          <span>w2.brreg.no</span>
          <span className="tnum">Page 4</span>
        </div>
      </motion.div>
    </div>
  );
}
