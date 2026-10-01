import type { Metadata } from "next";
import { Suspense } from "react";
import { CompanyView } from "./view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ companyNumber: string }>;
}): Promise<Metadata> {
  const { companyNumber } = await params;
  return { title: `Company ${companyNumber}` };
}

export default async function CompanyPage({ params }: { params: Promise<{ companyNumber: string }> }) {
  const { companyNumber } = await params;
  return (
    <Suspense fallback={null}>
      <CompanyView orgNumber={companyNumber.replace(/\D/g, "")} />
    </Suspense>
  );
}
