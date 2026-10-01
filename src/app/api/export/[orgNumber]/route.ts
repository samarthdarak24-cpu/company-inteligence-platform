import { NextResponse } from "next/server";
import { getCompanyBundle } from "@/lib/repo";

export const dynamic = "force-dynamic";

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown) => {
    const text = value === null || value === undefined ? "" : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [headers.join(","), ...rows.map((row) => headers.map((h) => escape(row[h])).join(","))].join("\n");
}

export async function GET(request: Request, { params }: { params: Promise<{ orgNumber: string }> }) {
  const { orgNumber } = await params;
  const org = orgNumber.replace(/\D/g, "");
  const format = (new URL(request.url).searchParams.get("format") ?? "json").toLowerCase();
  const bundle = await getCompanyBundle(org);

  if (!bundle) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const filenameBase = `signalpost-demo-${org}`;

  if (format === "csv") {
    const rows = bundle.financials.map((f) => ({
      organisation_number: org,
      company: bundle.company.name,
      year: f.year,
      revenue: f.revenue,
      operating_profit: f.operatingProfit,
      net_profit: f.netProfit,
      assets: f.assets,
      equity: f.equity,
      currency: f.currency,
      reporting_period: f.reportingPeriod,
      source: f.sourceKey,
      evidence_page: f.evidencePage,
    }));
    return new NextResponse(toCsv(rows), {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="${filenameBase}-financials.csv"`,
      },
    });
  }

  return new NextResponse(JSON.stringify({ mode: "demo", generatedAt: new Date().toISOString(), ...bundle }, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="${filenameBase}.json"`,
    },
  });
}
