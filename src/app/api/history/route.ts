import { NextResponse } from "next/server";
import { clearSearchHistory, getChanges, listCompanies, listSearchHistory } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function GET() {
  const [searches, changes, companies] = await Promise.all([
    listSearchHistory(40),
    getChanges(undefined, 40),
    listCompanies(),
  ]);
  const byOrg = new Map(companies.map((c) => [c.orgNumber, c.name]));

  return NextResponse.json({
    mode: "demo",
    searches,
    changes: changes.map((c) => ({ ...c, companyName: byOrg.get(c.orgNumber) ?? c.orgNumber })),
  });
}

export async function DELETE() {
  await clearSearchHistory();
  return NextResponse.json({ ok: true });
}
