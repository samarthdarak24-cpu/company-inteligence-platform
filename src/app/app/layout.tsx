import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/app/shell";

export const metadata: Metadata = {
  title: {
    default: "Workspace",
    template: "%s · Signalpost",
  },
  description: "Signalpost research workspace — evidence-backed Norwegian company intelligence.",
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
