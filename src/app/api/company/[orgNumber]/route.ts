import { NextResponse } from "next/server";
import { getCompanyBundle } from "@/lib/repo";
import { highlightsFor, productsFor } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ orgNumber: string }> }) {
  const { orgNumber } = await params;
  const org = orgNumber.replace(/\D/g, "");
  const bundle = await getCompanyBundle(org);

  if (!bundle) {
    return NextResponse.json(
      {
        error: "not_found",
        message: "We could not verify enough permitted public evidence for this organisation number.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    mode: "demo",
    ...bundle,
    highlights: highlightsFor(org),
    products: productsFor(org),
  });
}
