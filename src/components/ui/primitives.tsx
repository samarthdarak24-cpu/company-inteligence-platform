import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- Button */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "subtle" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: [
    "bg-[var(--sp-accent)] text-[var(--sp-accent-contrast)] border border-[var(--sp-accent)]",
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(20,22,28,0.16)]",
    "hover:bg-[var(--sp-accent-hover)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_4px_12px_-4px_rgba(43,67,191,0.5)]",
    "active:translate-y-px active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.18)]",
  ].join(" "),
  secondary: [
    "bg-[var(--sp-surface)] text-[var(--sp-text)] border border-[var(--sp-border)]",
    "shadow-[var(--sp-sheen),0_1px_2px_rgba(20,22,28,0.04)]",
    "hover:border-[var(--sp-border-strong)] hover:bg-[var(--sp-surface-2)]",
    "active:translate-y-px",
  ].join(" "),
  ghost:
    "bg-transparent text-[var(--sp-text-muted)] border border-transparent hover:bg-[var(--sp-surface-2)] hover:text-[var(--sp-text)]",
  subtle:
    "bg-[var(--sp-surface-2)] text-[var(--sp-text)] border border-transparent hover:bg-[var(--sp-surface-3)] active:translate-y-px",
  danger: "bg-[var(--sp-danger-soft)] text-[var(--sp-danger)] border border-transparent hover:brightness-[0.97]",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-2.5 text-[12.5px] gap-1.5 rounded-[9px]",
  md: "h-9 px-3.5 text-[13.5px] gap-2 rounded-[10px]",
  lg: "h-11 px-5 text-[14.5px] gap-2 rounded-[12px]",
};

export function buttonClasses(variant: ButtonVariant = "secondary", size: ButtonSize = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center font-medium whitespace-nowrap select-none",
    "transition-[background-color,border-color,color,transform,box-shadow,opacity] duration-200 ease-out",
    "disabled:opacity-45 disabled:pointer-events-none",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

export function Button({
  variant = "secondary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button className={buttonClasses(variant, size, className)} {...props} />;
}

export function IconButton({
  label,
  className,
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; size?: "sm" | "md" }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center rounded-[9px] border border-transparent text-[var(--sp-text-muted)]",
        "transition-[background-color,color,transform] duration-200 hover:bg-[var(--sp-surface-2)] hover:text-[var(--sp-text)] active:scale-[0.96]",
        size === "sm" ? "h-7 w-7" : "h-8 w-8",
        className,
      )}
      {...props}
    />
  );
}

/* ----------------------------------------------------------------- Badge */

export type BadgeTone = "neutral" | "accent" | "positive" | "warning" | "danger" | "outline";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-[var(--sp-surface-2)] text-[var(--sp-text-muted)] border-[var(--sp-border-soft)]",
  accent: "bg-[var(--sp-accent-soft)] text-[var(--sp-accent)] border-[var(--sp-accent-border)]",
  positive: "bg-[var(--sp-positive-soft)] text-[var(--sp-positive)] border-transparent",
  warning: "bg-[var(--sp-warning-soft)] text-[var(--sp-warning)] border-transparent",
  danger: "bg-[var(--sp-danger-soft)] text-[var(--sp-danger)] border-transparent",
  outline: "bg-transparent text-[var(--sp-text-muted)] border-[var(--sp-border)]",
};

export function Badge({
  tone = "neutral",
  className,
  children,
  icon,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[7px] border px-1.5 py-[2px] text-[11px] font-medium leading-[18px] tracking-[0.005em]",
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

const STATUS_TONES: Record<string, BadgeTone> = {
  active: "positive",
  verified: "positive",
  "source-backed": "accent",
  "recently checked": "accent",
  historical: "neutral",
  ambiguous: "warning",
  "not available": "neutral",
  dissolved: "danger",
  inactive: "danger",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = STATUS_TONES[status.toLowerCase()] ?? "neutral";
  const dot =
    tone === "positive"
      ? "bg-[var(--sp-positive)]"
      : tone === "warning"
        ? "bg-[var(--sp-warning)]"
        : tone === "danger"
          ? "bg-[var(--sp-danger)]"
          : tone === "accent"
            ? "bg-[var(--sp-accent)]"
            : "bg-[var(--sp-text-subtle)]";
  return (
    <Badge tone={tone} className={cn("capitalize", className)}>
      <span className="relative mr-0.5 flex h-1.5 w-1.5 items-center justify-center" aria-hidden>
        <span className={cn("absolute inline-block h-1.5 w-1.5 rounded-full", dot)} />
        {tone === "positive" ? (
          <span className={cn("sp-pulse-ring absolute inline-block h-1.5 w-1.5 rounded-full", dot)} />
        ) : null}
      </span>
      {status}
    </Badge>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[7px] border border-dashed border-[var(--sp-border-strong)] px-1.5 py-[2px] text-[10px] font-semibold uppercase leading-[18px] tracking-[0.09em] text-[var(--sp-text-subtle)]",
        className,
      )}
    >
      <span className="inline-block h-1 w-1 rounded-full bg-[var(--sp-text-subtle)]" aria-hidden />
      Demo data
    </span>
  );
}

/* ------------------------------------------------------------------ Card */

export function Card({
  className,
  interactive,
  elevated,
  rail,
  ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean; elevated?: boolean; rail?: boolean }) {
  return (
    <div
      className={cn(
        "relative rounded-[16px] border border-[var(--sp-border)] bg-[var(--sp-surface)]",
        elevated ? "shadow-[var(--sp-sheen),var(--sp-shadow-md)]" : "shadow-[var(--sp-sheen),var(--sp-shadow)]",
        rail && "sp-rail overflow-hidden",
        interactive &&
          "transition-[border-color,box-shadow,transform] duration-250 ease-out hover:-translate-y-[2px] hover:border-[var(--sp-border-strong)] hover:shadow-[var(--sp-sheen),var(--sp-shadow-md)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  description,
  action,
  className,
  icon,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-[var(--sp-border)] px-5 py-3.5",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-2.5">
        {icon ? (
          <span className="mt-[1px] flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] border border-[var(--sp-border)] bg-[var(--sp-surface-2)] text-[var(--sp-text-muted)]">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <h3 className="truncate text-[13.5px] font-semibold tracking-[-0.012em] text-[var(--sp-text)]">{title}</h3>
          {description ? (
            <p className="mt-0.5 text-[12.5px] leading-5 text-[var(--sp-text-muted)]">{description}</p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------ IconTile */

export function IconTile({
  children,
  size = "md",
  tone = "default",
  className,
}: {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  tone?: "default" | "accent";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-[10px] border",
        "bg-gradient-to-b from-[var(--sp-surface)] to-[var(--sp-surface-2)]",
        "shadow-[var(--sp-sheen)]",
        tone === "accent"
          ? "border-[var(--sp-accent-border)] text-[var(--sp-accent)]"
          : "border-[var(--sp-border)] text-[var(--sp-text-muted)]",
        size === "sm" ? "h-7 w-7" : size === "lg" ? "h-10 w-10 rounded-[12px]" : "h-9 w-9",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------ MetricCard */

export function MetricCard({
  label,
  value,
  sublabel,
  delta,
  icon,
  footer,
  visual,
  className,
}: {
  label: string;
  value: ReactNode;
  sublabel?: ReactNode;
  delta?: { value: number; suffix?: string } | null;
  icon?: ReactNode;
  footer?: ReactNode;
  visual?: ReactNode;
  className?: string;
}) {
  return (
    <Card rail className={cn("group p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.085em] text-[var(--sp-text-subtle)]">
          {label}
        </span>
        {icon ? (
          <span className="text-[var(--sp-text-subtle)] transition-colors duration-200 group-hover:text-[var(--sp-accent)]">
            {icon}
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="tnum sp-display text-[27px] font-semibold leading-none text-[var(--sp-text)]">{value}</span>
          {delta ? (
            <span
              className={cn(
                "tnum inline-flex items-center rounded-[6px] px-1 py-[1px] text-[11.5px] font-medium",
                delta.value >= 0
                  ? "bg-[var(--sp-positive-soft)] text-[var(--sp-positive)]"
                  : "bg-[var(--sp-danger-soft)] text-[var(--sp-danger)]",
              )}
            >
              {delta.value >= 0 ? "↑" : "↓"} {Math.abs(delta.value).toFixed(1)}
              {delta.suffix ?? "%"}
            </span>
          ) : null}
        </div>
        {visual ? <div className="shrink-0 opacity-70 transition-opacity duration-200 group-hover:opacity-100">{visual}</div> : null}
      </div>
      {sublabel ? <p className="mt-2 text-[12.5px] leading-5 text-[var(--sp-text-muted)]">{sublabel}</p> : null}
      {footer ? <div className="mt-3 border-t border-[var(--sp-border)] pt-3">{footer}</div> : null}
    </Card>
  );
}

/* ------------------------------------------------------------ EmptyState */

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative flex flex-col items-center justify-center px-6 py-16 text-center", className)}>
      <div className="sp-dot-bg pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_40%_50%_at_50%_42%,#000,transparent)]" aria-hidden />
      <div className="relative mb-5">
        <span className="absolute -inset-5 rounded-[22px] border border-dashed border-[var(--sp-border)]" aria-hidden />
        <span className="absolute -inset-2.5 rounded-[18px] border border-[var(--sp-border-soft)] bg-[var(--sp-surface)]" aria-hidden />
        <span className="relative flex h-12 w-12 items-center justify-center rounded-[13px] border border-[var(--sp-border)] bg-gradient-to-b from-[var(--sp-surface)] to-[var(--sp-surface-2)] text-[var(--sp-text-subtle)] shadow-[var(--sp-sheen)]">
          {icon}
        </span>
      </div>
      <h3 className="relative text-[14.5px] font-semibold tracking-[-0.015em] text-[var(--sp-text)]">{title}</h3>
      <p className="relative mt-1.5 max-w-sm text-[13px] leading-6 text-[var(--sp-text-muted)]">{description}</p>
      {action ? <div className="relative mt-5">{action}</div> : null}
    </div>
  );
}

/* --------------------------------------------------------------- Skeleton */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("sp-skeleton rounded-[6px]", className)} aria-hidden />;
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-3", i === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- Misc  */

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[5px] border border-[var(--sp-border)] bg-[var(--sp-surface-2)] px-1 font-sans text-[10px] font-semibold text-[var(--sp-text-subtle)] shadow-[var(--sp-sheen)]">
      {children}
    </kbd>
  );
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "text-[10.5px] font-semibold uppercase tracking-[0.13em] text-[var(--sp-text-subtle)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[var(--sp-border)] bg-[var(--sp-surface)] py-1 pl-2 pr-3 text-[11px] font-semibold uppercase tracking-[0.11em] text-[var(--sp-text-muted)] shadow-[var(--sp-sheen)]",
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5 items-center justify-center" aria-hidden>
        <span className="absolute h-1.5 w-1.5 rounded-full bg-[var(--sp-accent)]" />
        <span className="sp-pulse-ring absolute h-1.5 w-1.5 rounded-full bg-[var(--sp-accent)]" />
      </span>
      {children}
    </span>
  );
}

export function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="group flex items-start justify-between gap-6 border-b border-[var(--sp-border-soft)] py-2.5 last:border-b-0">
      <dt className="shrink-0 text-[12.5px] text-[var(--sp-text-muted)]">{label}</dt>
      <dd className="min-w-0 text-right text-[13px] font-medium text-[var(--sp-text)]">{children}</dd>
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-[10px] border border-[var(--sp-border)] bg-[var(--sp-surface-2)]/70 p-[3px]",
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-[7px] px-2.5 py-1 text-[12.5px] font-medium transition-all duration-200",
            value === option.value
              ? "bg-[var(--sp-surface)] text-[var(--sp-text)] shadow-[var(--sp-sheen),0_1px_2px_rgba(20,22,28,0.06)]"
              : "text-[var(--sp-text-muted)] hover:text-[var(--sp-text)]",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
