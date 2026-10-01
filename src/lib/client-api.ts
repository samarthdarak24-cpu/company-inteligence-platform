"use client";

/**
 * Thin client-side API layer. The base URL is configurable so the frontend can
 * be pointed at a separately deployed Signalpost backend.
 */
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { headers: { accept: "application/json" } });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new ApiError(body.message ?? "Company information couldn't be completed.", response.status);
  }
  return (await response.json()) as T;
}

export async function apiPost<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new ApiError(body.message ?? "Request could not be completed.", response.status);
  }
  return (await response.json()) as T;
}

export async function apiDelete<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { method: "DELETE" });
  if (!response.ok) throw new ApiError("Request could not be completed.", response.status);
  return (await response.json()) as T;
}

/* Shared response shapes ------------------------------------------------ */

export type CompanyDto = {
  orgNumber: string;
  name: string;
  legalForm: string;
  status: string;
  sector: string;
  naceCode: string;
  description: string;
  website: string;
  address: string;
  postalCode: string;
  city: string;
  municipality: string;
  country: string;
  employees: number;
  employeeLabel: string;
  foundedYear: number;
  registeredAt: string;
  vatRegistered: boolean;
  revenueLatest: number;
  evidenceCoverage: string;
  sourceCount: number;
  openRoles: number;
  lastUpdated: string;
  identityVerified: boolean;
};

export type FinancialDto = {
  id: number;
  orgNumber: string;
  year: number;
  revenue: number;
  operatingProfit: number;
  netProfit: number;
  assets: number;
  equity: number;
  currency: string;
  reportingPeriod: string;
  sourceKey: string;
  evidencePage: string;
  evidenceExcerpt: string;
};

export type PersonDto = {
  id: number;
  orgNumber: string;
  name: string;
  role: string;
  category: string;
  startDate: string;
  verified: boolean;
  sourceKey: string;
  evidenceExcerpt: string;
};

export type LocationDto = {
  id: number;
  orgNumber: string;
  name: string;
  address: string;
  city: string;
  kind: string;
  status: string;
  employees: number;
  lat: string;
  lng: string;
  sourceKey: string;
};

export type JobDto = {
  id: number;
  orgNumber: string;
  title: string;
  location: string;
  category: string;
  employmentType: string;
  postedAt: string;
  sourceKey: string;
  url: string;
};

export type ActivityDto = {
  id: number;
  orgNumber: string;
  occurredAt: string;
  type: string;
  title: string;
  description: string;
  sourceKey: string;
  companyName?: string;
};

export type ChangeDto = {
  id: number;
  orgNumber: string;
  field: string;
  area: string;
  previousValue: string;
  currentValue: string;
  changedAt: string;
  sourceKey: string;
  companyName?: string;
};

export type SourceDto = {
  id: number;
  orgNumber: string;
  key: string;
  title: string;
  domain: string;
  url: string;
  type: "official" | "financial" | "jobs" | "news" | "other";
  status: "verified" | "source-backed" | "ambiguous";
  publishedAt: string;
  retrievedAt: string;
  excerpt: string;
  page: string;
  companyName?: string;
};

export type CompanyBundleDto = {
  mode: string;
  company: CompanyDto;
  financials: FinancialDto[];
  people: PersonDto[];
  locations: LocationDto[];
  jobs: JobDto[];
  activity: ActivityDto[];
  history: ChangeDto[];
  sources: SourceDto[];
  highlights: string[];
  products: string[];
};

export type SearchHitDto = {
  orgNumber: string;
  name: string;
  city: string;
  sector: string;
  status: string;
  legalForm: string;
  matchedOn: "organisation-number" | "name" | "sector";
  score: number;
};

export const queryKeys = {
  stats: ["stats"] as const,
  companies: ["companies"] as const,
  company: (org: string) => ["company", org] as const,
  search: (q: string) => ["search", q] as const,
  activity: ["activity"] as const,
  sources: (type: string) => ["sources", type] as const,
  history: ["history"] as const,
  compare: (orgs: string[]) => ["compare", orgs.join(",")] as const,
};
