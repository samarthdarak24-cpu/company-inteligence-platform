import { NextResponse } from "next/server";
import { getActivity, getChanges, listCompanies } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const org = new URL(request.url).searchParams.get("org") ?? undefined;
  const [activity, changes, companies] = await Promise.all([
    getActivity(org, 80),
    getChanges(org, 80),
    listCompanies(),
  ]);
  const byOrg = new Map(companies.map((c) => [c.orgNumber, c.name]));

  return NextResponse.json({
    mode: "demo",
    activity: activity.map((a) => ({ ...a, companyName: byOrg.get(a.orgNumber) ?? a.orgNumber })),
    changes: changes.map((c) => ({ ...c, companyName: byOrg.get(c.orgNumber) ?? c.orgNumber })),
  });
}
