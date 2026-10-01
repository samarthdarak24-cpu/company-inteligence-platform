import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-6 sm:py-8", className)}>{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <div className="mb-2 flex items-center gap-2">
            <span className="h-3 w-[2px] rounded-full bg-[var(--sp-accent)]" aria-hidden />
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-[var(--sp-text-subtle)]">
              {eyebrow}
            </span>
          </div>
        ) : null}
        <h2 className="sp-display text-[23px] font-semibold leading-[1.15] sm:text-[27px]">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-[13.5px] leading-[1.65] text-[var(--sp-text-muted)]">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
