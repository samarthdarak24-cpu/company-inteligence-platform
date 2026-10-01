"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Drawer({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  width = "max-w-[460px]",
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  eyebrow?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => panelRef.current?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[70]" role="presentation">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-[rgba(16,18,24,0.34)] backdrop-blur-[1px]"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === "string" ? title : "Details"}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.22, 0.61, 0.36, 1], duration: 0.26 }}
            className={cn(
              "absolute inset-y-0 right-0 flex w-full flex-col border-l border-[var(--sp-border)] bg-[var(--sp-surface)] shadow-[var(--sp-shadow-lg)] outline-none sm:w-[92vw] sm:rounded-l-[18px]",
              width,
            )}
          >
            <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[var(--sp-border)] bg-[var(--sp-surface-2)]/60 px-5 py-4 backdrop-blur-sm sm:rounded-tl-[18px]">
              <div className="min-w-0">
                {eyebrow ? (
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--sp-text-subtle)]">
                    {eyebrow}
                  </div>
                ) : null}
                <h2 className="truncate text-[15px] font-semibold tracking-[-0.01em] text-[var(--sp-text)]">{title}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="-mr-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--sp-text-muted)] transition-colors duration-150 hover:bg-[var(--sp-surface-2)] hover:text-[var(--sp-text)]"
              >
                <X size={16} />
              </button>
            </header>
            <div className="sp-scroll flex-1 overflow-y-auto px-5 py-5">{children}</div>
            {footer ? (
              <footer className="border-t border-[var(--sp-border)] bg-[var(--sp-surface)] px-5 py-3.5">{footer}</footer>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
