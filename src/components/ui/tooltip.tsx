"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Tooltip({
  content,
  children,
  side = "top",
  className,
}: {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={open ? id : undefined} className="inline-flex">
        {children}
      </span>
      <span
        role="tooltip"
        id={id}
        className={cn(
          "pointer-events-none absolute left-1/2 z-50 w-max max-w-[260px] -translate-x-1/2 rounded-lg border border-[var(--sp-border)] bg-[var(--sp-surface)] px-2.5 py-1.5 text-[12px] leading-5 text-[var(--sp-text)] shadow-[var(--sp-shadow-md)] transition-all duration-150",
          side === "top" ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]",
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-0.5 opacity-0",
        )}
      >
        {content}
      </span>
    </span>
  );
}
