import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatOrgNumber(org: string): string {
  const digits = org.replace(/\D/g, "");
  return digits.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
}

export function isOrgNumber(value: string): boolean {
  return /^\d{9}$/.test(value.replace(/\D/g, ""));
}

const nf = new Intl.NumberFormat("en-GB");

export function formatNumber(value: number): string {
  return nf.format(value);
}

export function formatCurrencyFull(value: number, currency = "NOK"): string {
  return `${currency} ${nf.format(Math.round(value))}`;
}

/** Compact money: NOK 790.4M */
export function formatMoney(value: number, currency = "NOK"): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}${currency} ${(abs / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${sign}${currency} ${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}${currency} ${(abs / 1_000).toFixed(0)}K`;
  return `${sign}${currency} ${nf.format(abs)}`;
}

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value.length <= 10 ? `${value}T00:00:00Z` : value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return dateFmt.format(date);
}

export function relativeTime(value: string | Date | null | undefined, now = new Date()): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value.length <= 10 ? `${value}T00:00:00Z` : value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  const diff = now.getTime() - date.getTime();
  const minutes = Math.round(diff / 60000);
  if (Math.abs(minutes) < 60) return minutes <= 1 ? "just now" : `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 31) return days === 1 ? "yesterday" : `${days} days ago`;
  const months = Math.round(days / 30);
  if (Math.abs(months) < 12) return `${months} mo ago`;
  return `${Math.round(months / 12)} y ago`;
}

export function percentChange(current: number, previous: number): number | null {
  if (!previous) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
