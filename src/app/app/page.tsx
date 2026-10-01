import type { Metadata } from "next";
import { OverviewView } from "./view";

export const metadata: Metadata = { title: "Overview" };

export default function AppOverviewPage() {
  return <OverviewView />;
}
