import { NextResponse } from "next/server";
import { compareCompanies } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const orgs = (new URL(request.url).searchParams.get("orgs") ?? "")
    .split(",")
    .map((o) => o.replace(/\D/g, ""))
    .filter(Boolean)
    .slice(0, 4);

  if (orgs.length === 0) {
    return NextResponse.json({ mode: "demo", companies: [] });
  }

  const companies = await compareCompanies(orgs);
  return NextResponse.json({ mode: "demo", companies });
}
