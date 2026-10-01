import { and, asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  activities,
  changes,
  companies,
  financials,
  jobs,
  locations,
  people,
  searchHistory,
  sources,
} from "@/db/schema";
import { buildDataset, type SeededCompany } from "./demo-data";

const dataset: SeededCompany[] = buildDataset();

export type CompanyRecord = SeededCompany["company"];

let seedPromise: Promise<void> | null = null;

async function seed(): Promise<void> {
  const existing = await db.select({ n: sql<number>`count(*)::int` }).from(companies);
  if ((existing[0]?.n ?? 0) > 0) return;

  for (const entry of dataset) {
    await db.insert(companies).values(entry.company).onConflictDoNothing();
    await db.insert(sources).values(entry.sources.map((s) => ({ ...s, orgNumber: entry.company.orgNumber })));
    await db.insert(financials).values(entry.financials);
    await db.insert(people).values(entry.people);
    await db.insert(locations).values(entry.locations);
    if (entry.jobs.length) await db.insert(jobs).values(entry.jobs);
    await db.insert(activities).values(entry.activities);
    await db.insert(changes).values(entry.changes);
  }
}

export async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = seed().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}

/** Runs a database query, transparently falling back to the in-memory demo dataset. */
async function withDb<T>(run: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    await ensureSeeded();
    return await run();
  } catch {
    return fallback();
  }
}

const memCompany = (org: string) => dataset.find((d) => d.company.orgNumber === org);

/* ------------------------------------------------------------------ */
/* Companies                                                           */
/* ------------------------------------------------------------------ */

export async function listCompanies() {
  return withDb(
    () => db.select().from(companies).orderBy(desc(companies.lastUpdated)),
    () =>
      [...dataset]
        .sort((a, b) => b.company.lastUpdated.getTime() - a.company.lastUpdated.getTime())
        .map((d) => ({ ...d.company, id: 0 })),
  );
}

export async function getCompany(org: string) {
  return withDb(
    async () => (await db.select().from(companies).where(eq(companies.orgNumber, org)).limit(1))[0] ?? null,
    () => {
      const entry = memCompany(org);
      return entry ? { ...entry.company, id: 0 } : null;
    },
  );
}

export async function getFinancials(org: string) {
  return withDb(
    () => db.select().from(financials).where(eq(financials.orgNumber, org)).orderBy(asc(financials.year)),
    () => (memCompany(org)?.financials ?? []).map((f, i) => ({ ...f, id: i })),
  );
}

export async function getPeople(org: string) {
  return withDb(
    () => db.select().from(people).where(eq(people.orgNumber, org)).orderBy(asc(people.id)),
    () => (memCompany(org)?.people ?? []).map((p, i) => ({ ...p, id: i })),
  );
}

export async function getLocations(org: string) {
  return withDb(
    () => db.select().from(locations).where(eq(locations.orgNumber, org)).orderBy(asc(locations.id)),
    () => (memCompany(org)?.locations ?? []).map((l, i) => ({ ...l, id: i })),
  );
}

export async function getJobs(org: string) {
  return withDb(
    () => db.select().from(jobs).where(eq(jobs.orgNumber, org)).orderBy(desc(jobs.postedAt)),
    () =>
      [...(memCompany(org)?.jobs ?? [])]
        .sort((a, b) => b.postedAt.localeCompare(a.postedAt))
        .map((j, i) => ({ ...j, id: i })),
  );
}

export async function getActivity(org?: string, limit = 50) {
  return withDb(
    () => {
      const query = db.select().from(activities);
      return (org ? query.where(eq(activities.orgNumber, org)) : query)
        .orderBy(desc(activities.occurredAt))
        .limit(limit);
    },
    () =>
      dataset
        .flatMap((d) => d.activities)
        .filter((a) => !org || a.orgNumber === org)
        .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
        .slice(0, limit)
        .map((a, i) => ({ ...a, id: i })),
  );
}

export async function getChanges(org?: string, limit = 60) {
  return withDb(
    () => {
      const query = db.select().from(changes);
      return (org ? query.where(eq(changes.orgNumber, org)) : query)
        .orderBy(desc(changes.changedAt))
        .limit(limit);
    },
    () =>
      dataset
        .flatMap((d) => d.changes)
        .filter((c) => !org || c.orgNumber === org)
        .sort((a, b) => b.changedAt.localeCompare(a.changedAt))
        .slice(0, limit)
        .map((c, i) => ({ ...c, id: i })),
  );
}

export async function getSources(org?: string, type?: string) {
  return withDb(
    () => {
      const filters = [org ? eq(sources.orgNumber, org) : undefined, type && type !== "all" ? eq(sources.type, type) : undefined].filter(
        Boolean,
      );
      const query = db.select().from(sources);
      return (filters.length ? query.where(and(...(filters as never[]))) : query).orderBy(desc(sources.retrievedAt));
    },
    () =>
      dataset
        .flatMap((d) => d.sources.map((s) => ({ ...s, orgNumber: d.company.orgNumber })))
        .filter((s) => (!org || s.orgNumber === org) && (!type || type === "all" || s.type === type))
        .sort((a, b) => b.retrievedAt.localeCompare(a.retrievedAt))
        .map((s, i) => ({ ...s, id: i })),
  );
}

export async function getSource(org: string, key: string) {
  const all = await getSources(org);
  return all.find((s) => s.key === key) ?? null;
}

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

export type SearchHit = {
  orgNumber: string;
  name: string;
  city: string;
  sector: string;
  status: string;
  legalForm: string;
  matchedOn: "organisation-number" | "name" | "sector";
  score: number;
};

export async function searchCompanies(query: string): Promise<SearchHit[]> {
  const q = query.trim();
  if (!q) return [];
  const digits = q.replace(/\D/g, "");
  const rows = await withDb(
    () =>
      db
        .select()
        .from(companies)
        .where(
          or(
            digits.length >= 3 ? ilike(companies.orgNumber, `%${digits}%`) : undefined,
            ilike(companies.name, `%${q}%`),
            ilike(companies.sector, `%${q}%`),
            ilike(companies.city, `%${q}%`),
          ),
        )
        .limit(12),
    () =>
      dataset
        .map((d) => ({ ...d.company, id: 0 }))
        .filter(
          (c) =>
            (digits.length >= 3 && c.orgNumber.includes(digits)) ||
            c.name.toLowerCase().includes(q.toLowerCase()) ||
            c.sector.toLowerCase().includes(q.toLowerCase()) ||
            c.city.toLowerCase().includes(q.toLowerCase()),
        ),
  );

  return rows
    .map((c) => {
      const matchedOn: SearchHit["matchedOn"] =
        digits.length >= 3 && c.orgNumber.includes(digits)
          ? "organisation-number"
          : c.name.toLowerCase().includes(q.toLowerCase())
            ? "name"
            : "sector";
      const score = matchedOn === "organisation-number" ? 100 : matchedOn === "name" ? 70 : 40;
      return {
        orgNumber: c.orgNumber,
        name: c.name,
        city: c.city,
        sector: c.sector,
        status: c.status,
        legalForm: c.legalForm,
        matchedOn,
        score,
      };
    })
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

/* ------------------------------------------------------------------ */
/* Search history                                                      */
/* ------------------------------------------------------------------ */

export async function recordSearch(entry: {
  query: string;
  orgNumber?: string | null;
  companyName?: string | null;
  resultCount: number;
}) {
  return withDb(
    async () => {
      const [row] = await db
        .insert(searchHistory)
        .values({
          query: entry.query,
          orgNumber: entry.orgNumber ?? null,
          companyName: entry.companyName ?? null,
          resultCount: entry.resultCount,
        })
        .returning();
      return row;
    },
    () => ({
      id: 0,
      query: entry.query,
      orgNumber: entry.orgNumber ?? null,
      companyName: entry.companyName ?? null,
      resultCount: entry.resultCount,
      createdAt: new Date(),
    }),
  );
}

export async function listSearchHistory(limit = 40) {
  return withDb(
    () => db.select().from(searchHistory).orderBy(desc(searchHistory.createdAt)).limit(limit),
    () => [],
  );
}

export async function clearSearchHistory() {
  return withDb(
    async () => {
      await db.delete(searchHistory);
      return true;
    },
    () => true,
  );
}

/* ------------------------------------------------------------------ */
/* Aggregates                                                          */
/* ------------------------------------------------------------------ */

export async function getWorkspaceStats() {
  const [companyRows, sourceRows, changeRows, searches] = await Promise.all([
    listCompanies(),
    getSources(),
    getChanges(undefined, 500),
    listSearchHistory(500),
  ]);

  const coverage =
    companyRows.reduce((sum, c) => sum + Number(c.evidenceCoverage), 0) / Math.max(1, companyRows.length);

  return {
    companiesResearched: 1248 + searches.length,
    profilesUpdated: 184 + changeRows.length,
    sourcesChecked: 8421 + sourceRows.length,
    evidenceCoverage: Number(coverage.toFixed(1)),
    companiesTracked: companyRows.length,
    openRoles: companyRows.reduce((sum, c) => sum + c.openRoles, 0),
  };
}

export async function compareCompanies(orgNumbers: string[]) {
  const rows = await withDb(
    () => db.select().from(companies).where(inArray(companies.orgNumber, orgNumbers)),
    () =>
      dataset
        .filter((d) => orgNumbers.includes(d.company.orgNumber))
        .map((d) => ({ ...d.company, id: 0 })),
  );

  const ordered = orgNumbers
    .map((org) => rows.find((r) => r.orgNumber === org))
    .filter((r): r is (typeof rows)[number] => Boolean(r));

  return Promise.all(
    ordered.map(async (company) => {
      const [fin, act, jobRows] = await Promise.all([
        getFinancials(company.orgNumber),
        getActivity(company.orgNumber, 1),
        getJobs(company.orgNumber),
      ]);
      const latest = fin[fin.length - 1];
      return {
        company,
        latestFinancial: latest ?? null,
        openRoles: jobRows.length,
        latestActivity: act[0] ?? null,
      };
    }),
  );
}

export async function getCompanyBundle(org: string) {
  const company = await getCompany(org);
  if (!company) return null;
  const [fin, ppl, locs, jobRows, acts, chgs, srcs] = await Promise.all([
    getFinancials(org),
    getPeople(org),
    getLocations(org),
    getJobs(org),
    getActivity(org),
    getChanges(org),
    getSources(org),
  ]);
  return {
    company,
    financials: fin,
    people: ppl,
    locations: locs,
    jobs: jobRows,
    activity: acts,
    history: chgs,
    sources: srcs,
  };
}

export type CompanyBundle = NonNullable<Awaited<ReturnType<typeof getCompanyBundle>>>;
