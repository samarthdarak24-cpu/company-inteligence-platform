import { NextResponse } from "next/server";
import {
  getActivity,
  getChanges,
  getCompany,
  getFinancials,
  getJobs,
  getLocations,
  getPeople,
  getSources,
} from "@/lib/repo";

export const dynamic = "force-dynamic";

const SECTIONS = ["financials", "people", "locations", "jobs", "activity", "history", "sources"] as const;
type Section = (typeof SECTIONS)[number];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orgNumber: string; section: string }> },
) {
  const { orgNumber, section } = await params;
  const org = orgNumber.replace(/\D/g, "");

  if (!SECTIONS.includes(section as Section)) {
    return NextResponse.json({ error: "unknown_section", section }, { status: 404 });
  }

  const company = await getCompany(org);
  if (!company) {
    return NextResponse.json({ error: "not_found", message: "Unknown organisation number." }, { status: 404 });
  }

  const type = new URL(request.url).searchParams.get("type") ?? undefined;

  const data =
    section === "financials"
      ? await getFinancials(org)
      : section === "people"
        ? await getPeople(org)
        : section === "locations"
          ? await getLocations(org)
          : section === "jobs"
            ? await getJobs(org)
            : section === "activity"
              ? await getActivity(org)
              : section === "history"
                ? await getChanges(org)
                : await getSources(org, type);

  return NextResponse.json({ mode: "demo", orgNumber: org, section, count: data.length, data });
}
