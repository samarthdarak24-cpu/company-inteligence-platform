import {
  bigint,
  boolean,
  date,
  index,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  orgNumber: text("org_number").notNull().unique(),
  name: text("name").notNull(),
  legalForm: text("legal_form").notNull(),
  status: text("status").notNull(),
  sector: text("sector").notNull(),
  naceCode: text("nace_code").notNull(),
  description: text("description").notNull(),
  website: text("website").notNull(),
  address: text("address").notNull(),
  postalCode: text("postal_code").notNull(),
  city: text("city").notNull(),
  municipality: text("municipality").notNull(),
  country: text("country").notNull().default("Norway"),
  employees: integer("employees").notNull(),
  employeeLabel: text("employee_label").notNull(),
  foundedYear: integer("founded_year").notNull(),
  registeredAt: date("registered_at").notNull(),
  vatRegistered: boolean("vat_registered").notNull().default(true),
  revenueLatest: bigint("revenue_latest", { mode: "number" }).notNull(),
  evidenceCoverage: numeric("evidence_coverage", { precision: 5, scale: 1 }).notNull(),
  sourceCount: integer("source_count").notNull(),
  openRoles: integer("open_roles").notNull(),
  lastUpdated: timestamp("last_updated", { withTimezone: true }).notNull(),
  identityVerified: boolean("identity_verified").notNull().default(true),
});

export const financials = pgTable(
  "financials",
  {
    id: serial("id").primaryKey(),
    orgNumber: text("org_number").notNull(),
    year: integer("year").notNull(),
    revenue: bigint("revenue", { mode: "number" }).notNull(),
    operatingProfit: bigint("operating_profit", { mode: "number" }).notNull(),
    netProfit: bigint("net_profit", { mode: "number" }).notNull(),
    assets: bigint("assets", { mode: "number" }).notNull(),
    equity: bigint("equity", { mode: "number" }).notNull(),
    currency: text("currency").notNull().default("NOK"),
    reportingPeriod: text("reporting_period").notNull(),
    sourceKey: text("source_key").notNull(),
    evidencePage: text("evidence_page").notNull(),
    evidenceExcerpt: text("evidence_excerpt").notNull(),
  },
  (t) => [index("financials_org_idx").on(t.orgNumber)],
);

export const people = pgTable(
  "people",
  {
    id: serial("id").primaryKey(),
    orgNumber: text("org_number").notNull(),
    name: text("name").notNull(),
    role: text("role").notNull(),
    category: text("category").notNull(), // management | board | other
    startDate: date("start_date").notNull(),
    verified: boolean("verified").notNull().default(true),
    sourceKey: text("source_key").notNull(),
    evidenceExcerpt: text("evidence_excerpt").notNull(),
  },
  (t) => [index("people_org_idx").on(t.orgNumber)],
);

export const locations = pgTable(
  "locations",
  {
    id: serial("id").primaryKey(),
    orgNumber: text("org_number").notNull(),
    name: text("name").notNull(),
    address: text("address").notNull(),
    city: text("city").notNull(),
    kind: text("kind").notNull(), // head-office | office | subunit | warehouse
    status: text("status").notNull(),
    employees: integer("employees").notNull(),
    lat: numeric("lat", { precision: 8, scale: 4 }).notNull(),
    lng: numeric("lng", { precision: 8, scale: 4 }).notNull(),
    sourceKey: text("source_key").notNull(),
  },
  (t) => [index("locations_org_idx").on(t.orgNumber)],
);

export const jobs = pgTable(
  "jobs",
  {
    id: serial("id").primaryKey(),
    orgNumber: text("org_number").notNull(),
    title: text("title").notNull(),
    location: text("location").notNull(),
    category: text("category").notNull(),
    employmentType: text("employment_type").notNull(),
    postedAt: date("posted_at").notNull(),
    sourceKey: text("source_key").notNull(),
    url: text("url").notNull(),
  },
  (t) => [index("jobs_org_idx").on(t.orgNumber)],
);

export const activities = pgTable(
  "activities",
  {
    id: serial("id").primaryKey(),
    orgNumber: text("org_number").notNull(),
    occurredAt: date("occurred_at").notNull(),
    type: text("type").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    sourceKey: text("source_key").notNull(),
  },
  (t) => [index("activities_org_idx").on(t.orgNumber)],
);

export const changes = pgTable(
  "changes",
  {
    id: serial("id").primaryKey(),
    orgNumber: text("org_number").notNull(),
    field: text("field").notNull(),
    area: text("area").notNull(),
    previousValue: text("previous_value").notNull(),
    currentValue: text("current_value").notNull(),
    changedAt: date("changed_at").notNull(),
    sourceKey: text("source_key").notNull(),
  },
  (t) => [index("changes_org_idx").on(t.orgNumber)],
);

export const sources = pgTable(
  "sources",
  {
    id: serial("id").primaryKey(),
    orgNumber: text("org_number").notNull(),
    key: text("key").notNull(),
    title: text("title").notNull(),
    domain: text("domain").notNull(),
    url: text("url").notNull(),
    type: text("type").notNull(), // official | financial | jobs | news | other
    status: text("status").notNull(), // verified | source-backed | ambiguous
    publishedAt: date("published_at").notNull(),
    retrievedAt: date("retrieved_at").notNull(),
    excerpt: text("excerpt").notNull(),
    page: text("page").notNull(),
  },
  (t) => [index("sources_org_idx").on(t.orgNumber), index("sources_key_idx").on(t.key)],
);

export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  orgNumber: text("org_number"),
  companyName: text("company_name"),
  resultCount: integer("result_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Company = typeof companies.$inferSelect;
export type Financial = typeof financials.$inferSelect;
export type Person = typeof people.$inferSelect;
export type LocationRow = typeof locations.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type ChangeRow = typeof changes.$inferSelect;
export type SourceRow = typeof sources.$inferSelect;
export type SearchHistoryRow = typeof searchHistory.$inferSelect;
