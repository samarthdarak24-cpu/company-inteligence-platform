/**
 * Signalpost demo dataset.
 *
 * Every record in this file is DEMO DATA used to exercise the product surface.
 * Figures are plausible approximations for well known Norwegian companies and
 * must never be presented as live, verified registry results.
 */

/** Demo "today" — anchored to the date the dataset is generated so freshness stays realistic. */
export const DEMO_TODAY = new Date().toISOString().slice(0, 10);

type Seeded = () => number;

function mulberry32(seed: number): Seeded {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: Seeded, items: readonly T[]): T {
  return items[Math.floor(rand() * items.length) % items.length];
}

function daysBefore(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

const FIRST_NAMES = [
  "Ingrid", "Marius", "Kristin", "Håkon", "Silje", "Jonas", "Anette", "Bjørn",
  "Mette", "Eirik", "Camilla", "Sondre", "Hanne", "Trygve", "Linnea", "Audun",
  "Maren", "Fredrik", "Tone", "Vegard", "Synne", "Lars", "Kjersti", "Tormod",
] as const;

const LAST_NAMES = [
  "Hagen", "Bakken", "Nordby", "Solberg", "Lindgren", "Berge", "Haugen", "Dahl",
  "Strand", "Moen", "Kristiansen", "Rønning", "Ødegård", "Fjeld", "Aune", "Vik",
  "Lunde", "Sæther", "Bråten", "Myklebust",
] as const;

function personName(rand: Seeded): string {
  return `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_NAMES)}`;
}

export type SourceSeed = {
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
};

export type CompanySeed = {
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
  employees: number;
  employeeLabel: string;
  foundedYear: number;
  registeredAt: string;
  revenue: [number, number, number]; // 2023, 2024, 2025
  margin: number;
  evidenceCoverage: number;
  sourceCount: number;
  lastUpdatedDaysAgo: number;
  jobTitles: readonly string[];
  cities: readonly string[];
  highlights: readonly string[];
  products: readonly string[];
};

const BASE: CompanySeed[] = [
  {
    orgNumber: "979543883",
    name: "DIPS AS",
    legalForm: "AS",
    status: "Active",
    sector: "Health information systems",
    naceCode: "62.010 Computer programming activities",
    description:
      "DIPS AS develops electronic patient record and clinical workflow systems used by Norwegian hospitals and regional health authorities. The company delivers journal systems, clinical process support and integration platforms for specialist healthcare.",
    website: "dips.com",
    address: "Dronningens gate 15",
    postalCode: "8006",
    city: "Bodø",
    municipality: "Bodø",
    employees: 1040,
    employeeLabel: "1,000+",
    foundedYear: 1997,
    registeredAt: "1997-11-04",
    revenue: [658_200_000, 712_050_000, 790_400_865],
    margin: 0.113,
    evidenceCoverage: 94,
    sourceCount: 18,
    lastUpdatedDaysAgo: 2,
    jobTitles: [
      "Senior Software Engineer",
      "Product Manager",
      "Clinical Solution Architect",
      "Integration Engineer",
      "QA Engineer",
      "Customer Success Manager",
      "Security Engineer",
      "Technical Writer",
      "Interaction Designer",
      "Data Engineer",
      "Scrum Master",
      "Implementation Consultant",
    ],
    cities: ["Bodø", "Oslo", "Trondheim", "Tromsø"],
    highlights: [
      "Supplier of electronic patient records to four regional health authorities",
      "Operates development hubs in Bodø, Oslo and Trondheim",
      "Majority owned by Cerner/Oracle Health since 2021",
    ],
    products: ["DIPS Arena", "DIPS Classic", "DIPS Interactor", "DIPS Front"],
  },
  {
    orgNumber: "996343005",
    name: "Kahoot! AS",
    legalForm: "AS",
    status: "Active",
    sector: "Learning platforms",
    naceCode: "62.010 Computer programming activities",
    description:
      "Kahoot! AS operates a game-based learning platform used in schools, higher education and corporate training. The company sells subscriptions to teachers, schools, districts and enterprises worldwide.",
    website: "kahoot.com",
    address: "Fridtjof Nansens plass 7",
    postalCode: "0160",
    city: "Oslo",
    municipality: "Oslo",
    employees: 540,
    employeeLabel: "500+",
    foundedYear: 2012,
    registeredAt: "2012-03-14",
    revenue: [1_452_000_000, 1_690_400_000, 1_852_600_000],
    margin: 0.094,
    evidenceCoverage: 91,
    sourceCount: 16,
    lastUpdatedDaysAgo: 4,
    jobTitles: [
      "Senior Frontend Engineer",
      "Growth Marketing Manager",
      "Learning Designer",
      "Backend Engineer",
      "Data Analyst",
      "Enterprise Account Executive",
      "Engineering Manager",
      "Content Producer",
    ],
    cities: ["Oslo", "London", "Austin", "Copenhagen"],
    highlights: [
      "Platform used across K-12, higher education and workplace learning",
      "Taken private by a Goldman Sachs-led consortium in 2023",
      "Product family includes Kahoot!, Drops and Clever",
    ],
    products: ["Kahoot! 360", "Kahoot! EDU", "Drops", "Clever"],
  },
  {
    orgNumber: "912285519",
    name: "Oda AS",
    legalForm: "AS",
    status: "Active",
    sector: "Online grocery retail",
    naceCode: "47.911 Retail sale via mail order houses",
    description:
      "Oda AS runs an online grocery retailer serving Norwegian households from automated fulfilment centres. The company operates its own logistics fleet and a proprietary warehouse software stack.",
    website: "oda.com",
    address: "Brynsengveien 10",
    postalCode: "0667",
    city: "Oslo",
    municipality: "Oslo",
    employees: 820,
    employeeLabel: "800+",
    foundedYear: 2013,
    registeredAt: "2013-06-21",
    revenue: [2_784_000_000, 2_960_500_000, 3_118_700_000],
    margin: -0.041,
    evidenceCoverage: 88,
    sourceCount: 14,
    lastUpdatedDaysAgo: 6,
    jobTitles: [
      "Warehouse Operations Lead",
      "Software Engineer, Logistics",
      "Category Manager",
      "Delivery Driver",
      "Supply Chain Analyst",
      "Site Reliability Engineer",
    ],
    cities: ["Oslo", "Lørenskog", "Bergen", "Trondheim"],
    highlights: [
      "Automated fulfilment centre at Lørenskog",
      "Operates own last-mile delivery fleet",
      "Backed by Kinnevik and SoftBank Vision Fund",
    ],
    products: ["Oda grocery app", "Oda Business", "Oda fulfilment platform"],
  },
  {
    orgNumber: "986102551",
    name: "Aker Solutions ASA",
    legalForm: "ASA",
    status: "Active",
    sector: "Energy engineering services",
    naceCode: "71.121 Engineering activities",
    description:
      "Aker Solutions ASA delivers engineering, procurement and construction services for offshore oil, gas and renewable energy projects, including subsea production systems and electrification of offshore installations.",
    website: "akersolutions.com",
    address: "Oksenøyveien 8",
    postalCode: "1366",
    city: "Lysaker",
    municipality: "Bærum",
    employees: 11200,
    employeeLabel: "11,000+",
    foundedYear: 2004,
    registeredAt: "2004-04-01",
    revenue: [45_300_000_000, 47_120_000_000, 48_540_000_000],
    margin: 0.052,
    evidenceCoverage: 96,
    sourceCount: 24,
    lastUpdatedDaysAgo: 1,
    jobTitles: [
      "Subsea Project Engineer",
      "Electrical Discipline Lead",
      "Procurement Specialist",
      "HSE Advisor",
      "Structural Engineer",
      "Commissioning Manager",
      "Cost Controller",
    ],
    cities: ["Lysaker", "Stavanger", "Bergen", "Tranby", "Egersund"],
    highlights: [
      "Listed on Oslo Børs under ticker AKSO",
      "Delivers subsea production systems and offshore electrification",
      "Yards and engineering centres across western Norway",
    ],
    products: ["Subsea production systems", "Offshore wind foundations", "Electrification packages"],
  },
  {
    orgNumber: "925067304",
    name: "AutoStore Holdings Ltd.",
    legalForm: "Foreign enterprise (NUF)",
    status: "Active",
    sector: "Warehouse automation",
    naceCode: "28.220 Manufacture of lifting and handling equipment",
    description:
      "AutoStore supplies cube-based automated storage and retrieval systems to retail, industrial and third-party logistics customers, delivered through a global partner network.",
    website: "autostoresystem.com",
    address: "Stokkastrandvegen 85",
    postalCode: "5578",
    city: "Nedre Vats",
    municipality: "Vindafjord",
    employees: 1150,
    employeeLabel: "1,000+",
    foundedYear: 1996,
    registeredAt: "2020-04-24",
    revenue: [6_020_000_000, 5_740_000_000, 6_318_000_000],
    margin: 0.181,
    evidenceCoverage: 90,
    sourceCount: 15,
    lastUpdatedDaysAgo: 3,
    jobTitles: [
      "Mechanical Design Engineer",
      "Robotics Software Engineer",
      "Partner Solutions Manager",
      "Production Technician",
      "Field Service Engineer",
      "Embedded Systems Engineer",
    ],
    cities: ["Nedre Vats", "Oslo", "Koblenz", "Pennsylvania"],
    highlights: [
      "Cube storage robotics shipped through certified integration partners",
      "Listed on Oslo Børs under ticker AUTO",
      "Manufacturing in Nedre Vats and Koszalin",
    ],
    products: ["R5 Pro robot", "B1 robot", "Router", "Pio"],
  },
  {
    orgNumber: "933739384",
    name: "Schibsted ASA",
    legalForm: "ASA",
    status: "Active",
    sector: "Media and marketplaces",
    naceCode: "58.130 Publishing of newspapers",
    description:
      "Schibsted ASA is a Nordic media house publishing national newspapers and operating digital marketplaces, price comparison services and distribution businesses.",
    website: "schibsted.com",
    address: "Akersgata 55",
    postalCode: "0180",
    city: "Oslo",
    municipality: "Oslo",
    employees: 5400,
    employeeLabel: "5,000+",
    foundedYear: 1839,
    registeredAt: "1992-01-02",
    revenue: [8_640_000_000, 8_920_000_000, 9_146_000_000],
    margin: 0.112,
    evidenceCoverage: 93,
    sourceCount: 21,
    lastUpdatedDaysAgo: 5,
    jobTitles: [
      "Investigative Journalist",
      "Product Designer",
      "Data Platform Engineer",
      "Advertising Operations Manager",
      "Editor",
      "Machine Learning Engineer",
    ],
    cities: ["Oslo", "Stockholm", "Bergen", "Helsinki"],
    highlights: [
      "Publishes VG, Aftenposten, Bergens Tidende and Stavanger Aftenblad",
      "Operates Nordic marketplaces and price comparison services",
      "Listed on Oslo Børs under ticker SCHA",
    ],
    products: ["VG", "Aftenposten", "Bergens Tidende", "Podme"],
  },
  {
    orgNumber: "915186751",
    name: "Tietoevry Norway AS",
    legalForm: "AS",
    status: "Active",
    sector: "IT services and consulting",
    naceCode: "62.020 Computer consultancy activities",
    description:
      "Tietoevry Norway AS delivers software development, cloud operations and industry platforms to Norwegian public sector, banking, health and energy customers.",
    website: "tietoevry.com",
    address: "Sandakerveien 140",
    postalCode: "0484",
    city: "Oslo",
    municipality: "Oslo",
    employees: 3100,
    employeeLabel: "3,000+",
    foundedYear: 1968,
    registeredAt: "2015-04-13",
    revenue: [4_060_000_000, 4_180_000_000, 4_244_000_000],
    margin: 0.068,
    evidenceCoverage: 89,
    sourceCount: 17,
    lastUpdatedDaysAgo: 8,
    jobTitles: [
      "Cloud Architect",
      "Java Developer",
      "Public Sector Consultant",
      "Service Delivery Manager",
      "Information Security Analyst",
      "Test Automation Engineer",
    ],
    cities: ["Oslo", "Stavanger", "Trondheim", "Bergen"],
    highlights: [
      "Part of the Nordic Tietoevry group",
      "Operates managed cloud and banking platforms in Norway",
      "Framework agreements across Norwegian public sector",
    ],
    products: ["Tietoevry Banking", "Tietoevry Care", "Managed cloud services"],
  },
  {
    orgNumber: "987326991",
    name: "Visma Norge AS",
    legalForm: "AS",
    status: "Active",
    sector: "Business software",
    naceCode: "58.290 Other software publishing",
    description:
      "Visma Norge AS supplies accounting, payroll, HR and procurement software to Norwegian small and medium businesses, accountants and public sector organisations.",
    website: "visma.no",
    address: "Karenslyst allé 56",
    postalCode: "0277",
    city: "Oslo",
    municipality: "Oslo",
    employees: 2450,
    employeeLabel: "2,000+",
    foundedYear: 1996,
    registeredAt: "2004-09-30",
    revenue: [5_110_000_000, 5_390_000_000, 5_648_000_000],
    margin: 0.164,
    evidenceCoverage: 92,
    sourceCount: 19,
    lastUpdatedDaysAgo: 7,
    jobTitles: [
      "Full Stack Engineer",
      "Payroll Domain Expert",
      "Customer Support Specialist",
      "Product Owner",
      "Platform Engineer",
      "Partner Manager",
    ],
    cities: ["Oslo", "Bergen", "Trondheim", "Kristiansand"],
    highlights: [
      "Serves accountants, SMBs and public sector in Norway",
      "Part of the Visma group with operations across Europe",
      "Cloud-first product portfolio",
    ],
    products: ["Visma eAccounting", "Visma.net", "Visma Lønn", "Visma Enterprise"],
  },
  {
    orgNumber: "938110917",
    name: "Hexagon Composites ASA",
    legalForm: "ASA",
    status: "Active",
    sector: "Composite pressure cylinders",
    naceCode: "22.210 Manufacture of plastic plates and sheets",
    description:
      "Hexagon Composites ASA manufactures composite pressure cylinders and gas transport systems for hydrogen, compressed natural gas and industrial applications.",
    website: "hexagongroup.com",
    address: "Korsegata 4B",
    postalCode: "6002",
    city: "Ålesund",
    municipality: "Ålesund",
    employees: 1680,
    employeeLabel: "1,500+",
    foundedYear: 1963,
    registeredAt: "1986-05-20",
    revenue: [4_320_000_000, 4_510_000_000, 4_712_000_000],
    margin: 0.037,
    evidenceCoverage: 87,
    sourceCount: 13,
    lastUpdatedDaysAgo: 11,
    jobTitles: [
      "Composite Process Engineer",
      "Hydrogen Systems Engineer",
      "Production Planner",
      "Quality Inspector",
      "Sales Engineer",
    ],
    cities: ["Ålesund", "Raufoss", "Lincoln", "Kassel"],
    highlights: [
      "Cylinders for hydrogen mobility and gas distribution",
      "Listed on Oslo Børs under ticker HEX",
      "Production sites in Norway, Germany and the United States",
    ],
    products: ["Hexagon Purus cylinders", "TITAN modules", "Hexagon Agility systems"],
  },
  {
    orgNumber: "964118191",
    name: "Mowi ASA",
    legalForm: "ASA",
    status: "Active",
    sector: "Seafood and aquaculture",
    naceCode: "03.211 Marine aquaculture",
    description:
      "Mowi ASA farms, processes and sells Atlantic salmon from sites in Norway, Scotland, Chile, Ireland, the Faroe Islands and Canada, supplying retail and food-service customers globally.",
    website: "mowi.com",
    address: "Sandviksbodene 77A",
    postalCode: "5035",
    city: "Bergen",
    municipality: "Bergen",
    employees: 11800,
    employeeLabel: "11,000+",
    foundedYear: 1964,
    registeredAt: "1992-05-11",
    revenue: [52_100_000_000, 54_260_000_000, 55_812_000_000],
    margin: 0.098,
    evidenceCoverage: 95,
    sourceCount: 22,
    lastUpdatedDaysAgo: 9,
    jobTitles: [
      "Site Manager, Aquaculture",
      "Fish Health Biologist",
      "Processing Operator",
      "Sustainability Analyst",
      "Maintenance Technician",
      "Logistics Coordinator",
    ],
    cities: ["Bergen", "Ålesund", "Bodø", "Edinburgh"],
    highlights: [
      "One of the world's largest producers of Atlantic salmon",
      "Listed on Oslo Børs under ticker MOWI",
      "Operations across Norway, Scotland, Chile, Ireland and Canada",
    ],
    products: ["Fresh whole salmon", "Mowi Pure", "Value-added seafood"],
  },
];

export type SeededCompany = {
  company: {
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
    lastUpdated: Date;
    identityVerified: boolean;
  };
  sources: SourceSeed[];
  financials: {
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
  }[];
  people: {
    orgNumber: string;
    name: string;
    role: string;
    category: string;
    startDate: string;
    verified: boolean;
    sourceKey: string;
    evidenceExcerpt: string;
  }[];
  locations: {
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
  }[];
  jobs: {
    orgNumber: string;
    title: string;
    location: string;
    category: string;
    employmentType: string;
    postedAt: string;
    sourceKey: string;
    url: string;
  }[];
  activities: {
    orgNumber: string;
    occurredAt: string;
    type: string;
    title: string;
    description: string;
    sourceKey: string;
  }[];
  changes: {
    orgNumber: string;
    field: string;
    area: string;
    previousValue: string;
    currentValue: string;
    changedAt: string;
    sourceKey: string;
  }[];
};

const CITY_COORDS: Record<string, [number, number]> = {
  Bodø: [67.2804, 14.4049],
  Oslo: [59.9139, 10.7522],
  Trondheim: [63.4305, 10.3951],
  Tromsø: [69.6492, 18.9553],
  Bergen: [60.3913, 5.3221],
  Lysaker: [59.9127, 10.6361],
  Stavanger: [58.969, 5.7331],
  Ålesund: [62.4722, 6.1549],
  "Nedre Vats": [59.4337, 5.7729],
  Lørenskog: [59.9276, 10.9565],
  Kristiansand: [58.1467, 7.9956],
  Raufoss: [60.7254, 10.6141],
  Egersund: [58.4515, 5.9986],
  Tranby: [59.8322, 10.2401],
};

function coordsFor(city: string): [string, string] {
  const c = CITY_COORDS[city] ?? [59.9139, 10.7522];
  return [c[0].toFixed(4), c[1].toFixed(4)];
}

function nok(value: number): string {
  return new Intl.NumberFormat("nb-NO").format(value).replace(/\u00a0/g, " ");
}

function buildSources(base: CompanySeed, retrieved: string): SourceSeed[] {
  const latestRevenue = base.revenue[2];
  return [
    {
      key: "registry-record",
      title: `Register of Business Enterprises — ${base.name}`,
      domain: "data.brreg.no",
      url: `https://data.brreg.no/enhetsregisteret/oppslag/enheter/${base.orgNumber}`,
      type: "official",
      status: "verified",
      publishedAt: daysBefore(retrieved, 36),
      retrievedAt: retrieved,
      excerpt: `Organisation number ${base.orgNumber} — ${base.name}, ${base.legalForm}. Registered business address ${base.address}, ${base.postalCode} ${base.city}. Industry code ${base.naceCode}.`,
      page: "Record",
    },
    {
      key: "annual-report-2025",
      title: "Annual financial statement 2025",
      domain: "w2.brreg.no",
      url: `https://w2.brreg.no/kunngjoring/regnskap.jsp?orgnr=${base.orgNumber}&year=2025`,
      type: "financial",
      status: "verified",
      publishedAt: daysBefore(retrieved, 37),
      retrievedAt: retrieved,
      excerpt: `Operating revenue for the financial year 2025 amounted to NOK ${nok(latestRevenue)}, compared with NOK ${nok(base.revenue[1])} in the preceding year.`,
      page: "4",
    },
    {
      key: "annual-report-2024",
      title: "Annual financial statement 2024",
      domain: "w2.brreg.no",
      url: `https://w2.brreg.no/kunngjoring/regnskap.jsp?orgnr=${base.orgNumber}&year=2024`,
      type: "financial",
      status: "verified",
      publishedAt: daysBefore(retrieved, 402),
      retrievedAt: retrieved,
      excerpt: `Operating revenue for the financial year 2024 amounted to NOK ${nok(base.revenue[1])}.`,
      page: "4",
    },
    {
      key: "company-website",
      title: `${base.name} — official website`,
      domain: base.website,
      url: `https://www.${base.website}`,
      type: "official",
      status: "verified",
      publishedAt: daysBefore(retrieved, 14),
      retrievedAt: retrieved,
      excerpt: `${base.description.slice(0, 180)}…`,
      page: "Home",
    },
    {
      key: "careers-page",
      title: `${base.name} — open positions`,
      domain: base.website,
      url: `https://www.${base.website}/careers`,
      type: "jobs",
      status: "source-backed",
      publishedAt: daysBefore(retrieved, 3),
      retrievedAt: retrieved,
      excerpt: `Open positions listed on the company careers page across ${base.cities.slice(0, 3).join(", ")}.`,
      page: "Careers",
    },
    {
      key: "public-job-register",
      title: "Public job vacancy register",
      domain: "arbeidsplassen.nav.no",
      url: `https://arbeidsplassen.nav.no/stillinger?q=${encodeURIComponent(base.name)}`,
      type: "jobs",
      status: "source-backed",
      publishedAt: daysBefore(retrieved, 5),
      retrievedAt: retrieved,
      excerpt: `Vacancy listings published by ${base.name} in the national job register.`,
      page: "Results",
    },
    {
      key: "press-release",
      title: `${base.name} publishes quarterly update`,
      domain: "newsweb.oslobors.no",
      url: `https://newsweb.oslobors.no/search?issuer=${encodeURIComponent(base.name)}`,
      type: "news",
      status: "source-backed",
      publishedAt: daysBefore(retrieved, 19),
      retrievedAt: retrieved,
      excerpt: `${base.name} reported continued activity in ${base.sector.toLowerCase()} and confirmed its reporting calendar for the next period.`,
      page: "1",
    },
    {
      key: "news-coverage",
      title: `Trade press coverage — ${base.sector}`,
      domain: "e24.no",
      url: `https://e24.no/search?q=${encodeURIComponent(base.name)}`,
      type: "news",
      status: "ambiguous",
      publishedAt: daysBefore(retrieved, 28),
      retrievedAt: retrieved,
      excerpt: `Coverage mentioning ${base.name} in the context of ${base.sector.toLowerCase()}. Company identity matched on name only — organisation number not stated in the article.`,
      page: "1",
    },
    {
      key: "announcement-register",
      title: "Announcement register",
      domain: "w2.brreg.no",
      url: `https://w2.brreg.no/kunngjoring/sok.jsp?orgnr=${base.orgNumber}`,
      type: "official",
      status: "verified",
      publishedAt: daysBefore(retrieved, 44),
      retrievedAt: retrieved,
      excerpt: `Announcements registered for organisation number ${base.orgNumber}, including changes to roles and submitted annual accounts.`,
      page: "Results",
    },
  ];
}

export function buildDataset(): SeededCompany[] {
  return BASE.map((base) => {
    const rand = mulberry32(Number(base.orgNumber.slice(0, 8)));
    const retrieved = daysBefore(DEMO_TODAY, base.lastUpdatedDaysAgo);
    const sources = buildSources(base, retrieved);

    const financials = [2023, 2024, 2025].map((year, i) => {
      const revenue = base.revenue[i];
      const operatingProfit = Math.round(revenue * (base.margin - 0.012 * (2 - i)));
      const netProfit = Math.round(operatingProfit * 0.76);
      const assets = Math.round(revenue * (1.12 + 0.05 * i));
      const equity = Math.round(assets * (0.38 + 0.02 * i));
      return {
        orgNumber: base.orgNumber,
        year,
        revenue,
        operatingProfit,
        netProfit,
        assets,
        equity,
        currency: "NOK",
        reportingPeriod: `01.01.${year} – 31.12.${year}`,
        sourceKey: year === 2025 ? "annual-report-2025" : "annual-report-2024",
        evidencePage: year === 2025 ? "4" : "6",
        evidenceExcerpt: `Operating revenue ${nok(revenue)} and operating profit ${nok(operatingProfit)} for the financial year ${year}.`,
      };
    });

    const managementRoles = [
      "Chief Executive Officer",
      "Chief Financial Officer",
      "Chief Technology Officer",
      "Chief Operating Officer",
      "Chief People Officer",
    ];
    const boardRoles = ["Chair of the board", "Board member", "Board member", "Deputy board member"];
    const otherRoles = ["Signatory", "Statutory auditor", "Accountant"];

    const peopleRows = [
      ...managementRoles.map((role, i) => ({
        orgNumber: base.orgNumber,
        name: personName(rand),
        role,
        category: "management",
        startDate: daysBefore(retrieved, 400 + i * 230),
        verified: true,
        sourceKey: i < 2 ? "registry-record" : "company-website",
        evidenceExcerpt: `${role} listed for ${base.name} in the ${i < 2 ? "official registry record" : "company leadership page"}.`,
      })),
      ...boardRoles.map((role, i) => ({
        orgNumber: base.orgNumber,
        name: personName(rand),
        role,
        category: "board",
        startDate: daysBefore(retrieved, 320 + i * 180),
        verified: true,
        sourceKey: "registry-record",
        evidenceExcerpt: `${role} registered for organisation number ${base.orgNumber}.`,
      })),
      ...otherRoles.map((role, i) => ({
        orgNumber: base.orgNumber,
        name: i === 1 ? `${pick(rand, LAST_NAMES)} Revisjon AS` : personName(rand),
        role,
        category: "other",
        startDate: daysBefore(retrieved, 700 + i * 120),
        verified: i !== 2,
        sourceKey: "announcement-register",
        evidenceExcerpt: `${role} recorded in the announcement register.`,
      })),
    ];

    const locationRows = base.cities.map((city, i) => {
      const [lat, lng] = coordsFor(i === 0 ? base.city : city);
      return {
        orgNumber: base.orgNumber,
        name: i === 0 ? `${base.name} — head office` : `${base.name} — ${city}`,
        address: i === 0 ? `${base.address}, ${base.postalCode} ${base.city}` : `${pick(rand, ["Storgata", "Havnegata", "Industriveien", "Kongens gate"])} ${2 + Math.floor(rand() * 60)}, ${city}`,
        city: i === 0 ? base.city : city,
        kind: i === 0 ? "head-office" : i === 1 ? "office" : i === 2 ? "subunit" : "site",
        status: "Active",
        employees: Math.max(8, Math.round((base.employees / (i + 1.6)) * (0.5 + rand() * 0.4))),
        lat,
        lng,
        sourceKey: i === 0 ? "registry-record" : "company-website",
      };
    });

    const jobCount = Math.min(base.jobTitles.length, 5 + Math.floor(rand() * 7));
    const jobRows = Array.from({ length: jobCount }, (_, i) => {
      const title = base.jobTitles[i % base.jobTitles.length];
      const category = /engineer|developer|architect|robotics|software|platform|data|security|test/i.test(title)
        ? "Engineering"
        : /manager|owner|lead|director|scrum/i.test(title)
          ? "Leadership"
          : /design|content|writer|journalist|editor/i.test(title)
            ? "Design & content"
            : /sales|account|growth|partner|marketing|customer/i.test(title)
              ? "Commercial"
              : "Operations";
      return {
        orgNumber: base.orgNumber,
        title,
        location: base.cities[i % base.cities.length],
        category,
        employmentType: rand() > 0.85 ? "Fixed term" : "Permanent",
        postedAt: daysBefore(retrieved, 1 + i * 3 + Math.floor(rand() * 3)),
        sourceKey: i % 2 === 0 ? "careers-page" : "public-job-register",
        url: `https://www.${base.website}/careers/${title.toLowerCase().replace(/[^a-z]+/g, "-")}`,
      };
    });

    const activityRows = [
      {
        orgNumber: base.orgNumber,
        occurredAt: daysBefore(retrieved, 2),
        type: "filing",
        title: "New annual filing detected",
        description: `Annual accounts for 2025 registered for organisation number ${base.orgNumber}.`,
        sourceKey: "annual-report-2025",
      },
      {
        orgNumber: base.orgNumber,
        occurredAt: daysBefore(retrieved, 6),
        type: "hiring",
        title: "New job posting detected",
        description: `${jobRows[0]?.title ?? "New role"} published for ${jobRows[0]?.location ?? base.city}.`,
        sourceKey: "careers-page",
      },
      {
        orgNumber: base.orgNumber,
        occurredAt: daysBefore(retrieved, 12),
        type: "people",
        title: "Management record changed",
        description: `A change to registered roles was recorded for ${base.name}.`,
        sourceKey: "announcement-register",
      },
      {
        orgNumber: base.orgNumber,
        occurredAt: daysBefore(retrieved, 20),
        type: "news",
        title: "New company announcement found",
        description: `${base.name} published a public update covering operations and reporting.`,
        sourceKey: "press-release",
      },
      {
        orgNumber: base.orgNumber,
        occurredAt: daysBefore(retrieved, 31),
        type: "website",
        title: "Website content updated",
        description: `Product and service descriptions changed on ${base.website}.`,
        sourceKey: "company-website",
      },
      {
        orgNumber: base.orgNumber,
        occurredAt: daysBefore(retrieved, 46),
        type: "registry",
        title: "Registry record re-checked",
        description: `Identity and address confirmed against the official register.`,
        sourceKey: "registry-record",
      },
    ];

    const prevDirector = personName(rand);
    const changeRows = [
      {
        orgNumber: base.orgNumber,
        field: "Operating revenue",
        area: "Financials",
        previousValue: `NOK ${nok(base.revenue[1])}`,
        currentValue: `NOK ${nok(base.revenue[2])}`,
        changedAt: daysBefore(retrieved, 4),
        sourceKey: "annual-report-2025",
      },
      {
        orgNumber: base.orgNumber,
        field: "Chief Executive Officer",
        area: "People",
        previousValue: prevDirector,
        currentValue: peopleRows[0].name,
        changedAt: daysBefore(retrieved, 11),
        sourceKey: "registry-record",
      },
      {
        orgNumber: base.orgNumber,
        field: "Open positions",
        area: "Hiring",
        previousValue: `${Math.max(0, jobRows.length - 3)}`,
        currentValue: `${jobRows.length}`,
        changedAt: daysBefore(retrieved, 7),
        sourceKey: "careers-page",
      },
      {
        orgNumber: base.orgNumber,
        field: "Business address",
        area: "Locations",
        previousValue: `${pick(rand, ["Storgata 11", "Havnegata 4", "Sjøgata 21"])}, ${base.postalCode} ${base.city}`,
        currentValue: `${base.address}, ${base.postalCode} ${base.city}`,
        changedAt: daysBefore(retrieved, 54),
        sourceKey: "registry-record",
      },
      {
        orgNumber: base.orgNumber,
        field: "Registered employees",
        area: "Company record",
        previousValue: `${Math.round(base.employees * 0.94)}`,
        currentValue: `${base.employees}`,
        changedAt: daysBefore(retrieved, 68),
        sourceKey: "registry-record",
      },
    ];

    return {
      company: {
        orgNumber: base.orgNumber,
        name: base.name,
        legalForm: base.legalForm,
        status: base.status,
        sector: base.sector,
        naceCode: base.naceCode,
        description: base.description,
        website: base.website,
        address: base.address,
        postalCode: base.postalCode,
        city: base.city,
        municipality: base.municipality,
        country: "Norway",
        employees: base.employees,
        employeeLabel: base.employeeLabel,
        foundedYear: base.foundedYear,
        registeredAt: base.registeredAt,
        vatRegistered: true,
        revenueLatest: base.revenue[2],
        evidenceCoverage: base.evidenceCoverage.toFixed(1),
        sourceCount: base.sourceCount,
        openRoles: jobRows.length,
        lastUpdated: new Date(`${retrieved}T08:${(10 + base.lastUpdatedDaysAgo).toString().padStart(2, "0")}:00Z`),
        identityVerified: true,
      },
      sources,
      financials,
      people: peopleRows,
      locations: locationRows,
      jobs: jobRows,
      activities: activityRows,
      changes: changeRows,
    };
  });
}

export const COMPANY_META = BASE.map((b) => ({
  orgNumber: b.orgNumber,
  name: b.name,
  city: b.city,
  sector: b.sector,
  highlights: b.highlights,
  products: b.products,
}));

export function highlightsFor(orgNumber: string): string[] {
  return [...(COMPANY_META.find((c) => c.orgNumber === orgNumber)?.highlights ?? [])];
}

export function productsFor(orgNumber: string): string[] {
  return [...(COMPANY_META.find((c) => c.orgNumber === orgNumber)?.products ?? [])];
}
