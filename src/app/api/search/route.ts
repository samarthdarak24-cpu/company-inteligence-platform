import { NextResponse } from "next/server";
import { listSearchHistory, recordSearch, searchCompanies } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") ?? "";
  const [companies, recent] = await Promise.all([searchCompanies(q), listSearchHistory(8)]);
  return NextResponse.json({
    mode: "demo",
    query: q,
    companies,
    recent: recent.map((r) => ({
      id: r.id,
      query: r.query,
      orgNumber: r.orgNumber,
      companyName: r.companyName,
      createdAt: r.createdAt,
    })),
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { query?: string };
  const query = (body.query ?? "").trim();
  if (!query) {
    return NextResponse.json({ error: "invalid_query", message: "A search query is required." }, { status: 400 });
  }

  const results = await searchCompanies(query);
  const top = results[0];
  await recordSearch({
    query,
    orgNumber: top?.orgNumber ?? null,
    companyName: top?.name ?? null,
    resultCount: results.length,
  });

  return NextResponse.json({ mode: "demo", query, results });
}
