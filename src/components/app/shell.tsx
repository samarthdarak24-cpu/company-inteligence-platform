"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  Bell,
  Building2,
  ChevronsLeft,
  ChevronsRight,
  CircleHelp,
  FileText,
  GitCompare,
  History,
  LayoutGrid,
  Menu,
  PanelLeft,
  Search,
  Settings,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Badge, DemoBadge, Kbd } from "@/components/ui/primitives";
import { ThemeToggle } from "@/components/theme-provider";
import { CommandMenu } from "./command-menu";
import { EvidenceProvider } from "./evidence-drawer";
import { cn } from "@/lib/utils";

const NAV_GROUPS: { label: string; items: { href: string; label: string; icon: ReactNode }[] }[] = [
  {
    label: "Main",
    items: [
      { href: "/app", label: "Overview", icon: <LayoutGrid size={16} /> },
      { href: "/app/search", label: "Search", icon: <Search size={16} /> },
      { href: "/app/companies", label: "Companies", icon: <Building2 size={16} /> },
      { href: "/app/compare", label: "Compare", icon: <GitCompare size={16} /> },
      { href: "/app/activity", label: "Activity", icon: <Activity size={16} /> },
    ],
  },
  {
    label: "Research",
    items: [
      { href: "/app/sources", label: "Sources", icon: <FileText size={16} /> },
      { href: "/app/history", label: "History", icon: <History size={16} /> },
    ],
  },
  {
    label: "System",
    items: [{ href: "/app/settings", label: "Settings", icon: <Settings size={16} /> }],
  },
];

const TITLES: Record<string, string> = {
  "/app": "Overview",
  "/app/search": "Search",
  "/app/companies": "Companies",
  "/app/compare": "Compare",
  "/app/activity": "Activity",
  "/app/sources": "Sources",
  "/app/history": "History",
  "/app/settings": "Settings",
};

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex h-14 items-center gap-2.5 border-b border-[var(--sp-border)] px-4",
          collapsed && "justify-center px-2",
        )}
      >
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Signalpost home">
          <span className="transition-transform duration-250 group-hover:scale-[1.04]">
            <Logo size={24} />
          </span>
          {!collapsed ? (
            <span className="sp-display text-[14.5px] font-semibold">Signalpost</span>
          ) : null}
        </Link>
      </div>

      {!collapsed ? (
        <div className="px-3 pt-3">
          <button
            type="button"
            className="group flex w-full items-center justify-between rounded-[10px] border border-[var(--sp-border)] bg-gradient-to-b from-[var(--sp-surface)] to-[var(--sp-surface-2)] px-2.5 py-2 text-left shadow-[var(--sp-sheen)] transition-all duration-200 hover:border-[var(--sp-border-strong)] hover:shadow-[var(--sp-sheen),0_2px_8px_-4px_rgba(20,22,28,0.2)]"
            aria-label="Switch workspace"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[var(--sp-accent)] text-[11px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                NR
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[12.5px] font-semibold">Nordic Research</span>
                <span className="block truncate text-[10.5px] text-[var(--sp-text-subtle)]">Team workspace</span>
              </span>
            </span>
            <PanelLeft
              size={13}
              className="shrink-0 text-[var(--sp-text-subtle)] transition-colors duration-200 group-hover:text-[var(--sp-text-muted)]"
            />
          </button>
        </div>
      ) : null}

      <nav aria-label="Workspace" className="sp-scroll flex-1 overflow-y-auto px-3 py-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed ? (
              <div className="px-2.5 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--sp-text-subtle)]">
                {group.label}
              </div>
            ) : (
              <div className="mx-auto mb-2 h-px w-6 bg-[var(--sp-border)]" aria-hidden />
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-[9px] px-2.5 py-[7px] text-[13px] font-medium transition-all duration-200",
                        collapsed && "justify-center px-0",
                        active
                          ? "bg-[var(--sp-surface-3)] text-[var(--sp-text)] shadow-[var(--sp-sheen)]"
                          : "text-[var(--sp-text-muted)] hover:bg-[var(--sp-surface-2)] hover:text-[var(--sp-text)]",
                      )}
                    >
                      {active ? (
                        <span
                          className="absolute left-0 top-1/2 h-4 w-[2.5px] -translate-y-1/2 rounded-r bg-[var(--sp-accent)]"
                          aria-hidden
                        />
                      ) : null}
                      <span
                        className={cn(
                          "transition-colors duration-200",
                          active
                            ? "text-[var(--sp-accent)]"
                            : "text-[var(--sp-text-subtle)] group-hover:text-[var(--sp-text-muted)]",
                        )}
                      >
                        {item.icon}
                      </span>
                      {!collapsed ? item.label : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--sp-border)] p-3">
        {!collapsed ? (
          <Link
            href="/how-it-works"
            className="mb-2 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-[var(--sp-text-muted)] transition-colors duration-150 hover:bg-[var(--sp-surface-2)] hover:text-[var(--sp-text)]"
          >
            <CircleHelp size={16} className="text-[var(--sp-text-subtle)]" />
            Help &amp; process
          </Link>
        ) : null}
        <div className={cn("flex items-center gap-2.5 rounded-lg px-1.5 py-1.5", collapsed && "justify-center")}>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--sp-border)] bg-[var(--sp-surface-2)] text-[11px] font-semibold text-[var(--sp-text-muted)]">
            AH
          </span>
          {!collapsed ? (
            <div className="min-w-0">
              <div className="truncate text-[12.5px] font-medium">Astrid Haugen</div>
              <div className="truncate text-[11px] text-[var(--sp-text-subtle)]">Nordic Research</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("signalpost-sidebar");
    if (stored === "collapsed") setCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("signalpost-sidebar", collapsed ? "collapsed" : "expanded");
  }, [collapsed]);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((v) => !v);
      }
      if (event.key === "/" && !["INPUT", "TEXTAREA"].includes((event.target as HTMLElement)?.tagName)) {
        event.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const title = TITLES[pathname] ?? (pathname.startsWith("/app/company") ? "Company profile" : "Workspace");

  return (
    <EvidenceProvider>
      <div className="flex min-h-screen bg-[var(--sp-bg)]">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            "sticky top-0 z-30 hidden h-screen shrink-0 border-r border-[var(--sp-border)] bg-[var(--sp-surface)] transition-[width] duration-250 ease-out lg:block",
            collapsed ? "w-[68px]" : "w-[252px]",
          )}
        >
          <SidebarContent collapsed={collapsed} />
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="absolute -right-3 top-[70px] hidden h-6 w-6 items-center justify-center rounded-full border border-[var(--sp-border)] bg-[var(--sp-surface)] text-[var(--sp-text-subtle)] shadow-[var(--sp-shadow)] transition-colors duration-150 hover:text-[var(--sp-text)] lg:flex"
          >
            {collapsed ? <ChevronsRight size={13} /> : <ChevronsLeft size={13} />}
          </button>
        </aside>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen ? (
            <div className="fixed inset-0 z-[60] lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-0 bg-[rgba(16,18,24,0.4)]"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.24, ease: [0.22, 0.61, 0.36, 1] }}
                className="absolute inset-y-0 left-0 w-[268px] border-r border-[var(--sp-border)] bg-[var(--sp-surface)]"
                role="dialog"
                aria-modal="true"
                aria-label="Workspace navigation"
              >
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation"
                  className="absolute right-2 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--sp-text-muted)]"
                >
                  <X size={16} />
                </button>
                <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-[var(--sp-border)] bg-[color-mix(in_srgb,var(--sp-bg)_92%,transparent)] backdrop-blur-md">
            <div className="flex h-14 items-center gap-3 px-4 sm:px-5">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--sp-border)] text-[var(--sp-text-muted)] lg:hidden"
              >
                <Menu size={17} />
              </button>

              <div className="flex min-w-0 items-center gap-2">
                <h1 className="truncate text-[14px] font-semibold tracking-[-0.01em]">{title}</h1>
                <DemoBadge className="hidden sm:inline-flex" />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCommandOpen(true)}
                  className="group hidden h-9 items-center gap-2 rounded-[10px] border border-[var(--sp-border)] bg-[var(--sp-surface)] px-2.5 text-[13px] text-[var(--sp-text-subtle)] shadow-[var(--sp-sheen)] transition-all duration-200 hover:border-[var(--sp-border-strong)] hover:text-[var(--sp-text-muted)] md:flex"
                  aria-label="Search company"
                >
                  <Search size={15} className="transition-colors duration-200 group-hover:text-[var(--sp-accent)]" />
                  <span className="pr-12">Search company…</span>
                  <Kbd>⌘K</Kbd>
                </button>
                <button
                  type="button"
                  onClick={() => setCommandOpen(true)}
                  aria-label="Open command menu"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--sp-border)] text-[var(--sp-text-muted)] transition-colors duration-150 hover:text-[var(--sp-text)] md:hidden"
                >
                  <Search size={16} />
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen((v) => !v)}
                    aria-label="Notifications"
                    aria-expanded={notificationsOpen}
                    className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--sp-border)] text-[var(--sp-text-muted)] transition-colors duration-150 hover:text-[var(--sp-text)]"
                  >
                    <Bell size={16} />
                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--sp-accent)]" aria-hidden />
                  </button>
                  {notificationsOpen ? (
                    <div
                      className="absolute right-0 top-11 z-50 w-[300px] overflow-hidden rounded-xl border border-[var(--sp-border)] bg-[var(--sp-surface)] shadow-[var(--sp-shadow-md)]"
                      role="menu"
                    >
                      <div className="flex items-center justify-between border-b border-[var(--sp-border)] px-3.5 py-2.5">
                        <span className="text-[12.5px] font-semibold">Notifications</span>
                        <Badge tone="accent">3 new</Badge>
                      </div>
                      <ul className="divide-y divide-[var(--sp-border)]">
                        {[
                          { title: "New annual filing detected", meta: "DIPS AS · 2 days ago" },
                          { title: "Director appointed", meta: "Oda AS · 4 days ago" },
                          { title: "New vacancy detected", meta: "Kahoot! AS · 5 days ago" },
                        ].map((item) => (
                          <li key={item.title} className="px-3.5 py-2.5">
                            <div className="text-[12.5px] font-medium">{item.title}</div>
                            <div className="text-[11.5px] text-[var(--sp-text-subtle)]">{item.meta}</div>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/app/activity"
                        className="block border-t border-[var(--sp-border)] px-3.5 py-2.5 text-[12.5px] font-medium text-[var(--sp-accent)]"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        View all activity
                      </Link>
                    </div>
                  ) : null}
                </div>

                <div className="hidden sm:block">
                  <ThemeToggle compact />
                </div>

                <Link
                  href="/app/settings"
                  aria-label="Profile and settings"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--sp-border)] bg-[var(--sp-surface-2)] text-[11.5px] font-semibold text-[var(--sp-text-muted)] transition-colors duration-150 hover:text-[var(--sp-text)]"
                >
                  AH
                </Link>
              </div>
            </div>
          </header>

          <main id="main" className="min-w-0 flex-1">
            {children}
          </main>
        </div>
      </div>

      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
    </EvidenceProvider>
  );
}
