import { NextResponse } from "next/server";
import { listCompanies } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function GET() {
  const companies = await listCompanies();
  return NextResponse.json({ mode: "demo", count: companies.length, companies });
}
