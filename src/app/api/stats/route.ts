import { NextResponse } from "next/server";
import { getChanges, getWorkspaceStats, listCompanies } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function GET() {
  const [stats, companies, changes] = await Promise.all([
    getWorkspaceStats(),
    listCompanies(),
    getChanges(undefined, 12),
  ]);

  const byOrg = new Map(companies.map((c) => [c.orgNumber, c.name]));

  return NextResponse.json({
    mode: "demo",
    stats,
    recent: companies.slice(0, 6),
    changes: changes.map((c) => ({ ...c, companyName: byOrg.get(c.orgNumber) ?? c.orgNumber })),
  });
}
