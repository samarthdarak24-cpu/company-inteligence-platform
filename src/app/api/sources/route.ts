import { NextResponse } from "next/server";
import { getSources, listCompanies } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type") ?? undefined;
  const org = url.searchParams.get("org") ?? undefined;
  const [sources, companies] = await Promise.all([getSources(org, type), listCompanies()]);
  const byOrg = new Map(companies.map((c) => [c.orgNumber, c.name]));

  return NextResponse.json({
    mode: "demo",
    count: sources.length,
    sources: sources.map((s) => ({ ...s, companyName: byOrg.get(s.orgNumber) ?? s.orgNumber })),
  });
}
