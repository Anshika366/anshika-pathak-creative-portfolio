import { createServerFn } from "@tanstack/react-start";

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type ContributionVisibility = "public" | "public-and-private";

export interface ContributionDay {
  date: string;
  count: number;
  level: ContributionLevel;
}

export interface GithubContributionsPayload {
  username: string;
  profileUrl: string;
  totalContributions: number;
  allTimeContributions: number;
  accountCreatedYear?: number;
  visibility?: ContributionVisibility;
  privateContributionsCount?: number;
  startDate: string;
  endDate: string;
  days: ContributionDay[];
  fetchedAt: string;
}

const GITHUB_USERNAME = "Anshika366";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
const GITHUB_TIMEZONE = "Asia/Kolkata";
const GITHUB_TZ_OFFSET = "+05:30";
const IST_OFFSET_MS = 330 * 60 * 1000;
const CACHE_TTL_MS = 2 * 60 * 1000; // 2-minute server-side cache

const PUBLIC_HTML_HEADERS = {
  Accept: "text/html,application/xhtml+xml",
  Cookie: `tz=${encodeURIComponent(GITHUB_TIMEZONE)}`,
  "User-Agent": "anshika-portfolio-app",
} as const;

type CacheEntry = {
  data: GithubContributionsPayload;
  expiresAt: number;
};

const contributionCache = new Map<string, CacheEntry>();

const GRAPHQL_LEVEL_MAP: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

/** Clears the in-memory contribution cache (primarily for deterministic tests). */
export function clearGithubContributionsCache(): void {
  contributionCache.clear();
}

/** Returns today's YYYY-MM-DD calendar date in Asia/Kolkata so IST midnight boundaries are respected. */
export function getLocalIsoDate(now = new Date(), timeZone = GITHUB_TIMEZONE): string {
  try {
    const formatted = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);
    if (/^\d{4}-\d{2}-\d{2}$/.test(formatted)) {
      return formatted;
    }
  } catch {
    // Fall back to fixed IST offset calculation below
  }
  return new Date(now.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}

/** Shifts a YYYY-MM-DD ISO date string by `deltaDays` in UTC calendar arithmetic. */
export function shiftIsoDays(isoDate: string, deltaDays: number): string {
  const [y = 1970, m = 1, d = 1] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + deltaDays)).toISOString().slice(0, 10);
}

function getServerGithubToken(): string | undefined {
  const raw = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env?.["GITHUB_TOKEN"];
  const trimmed = raw?.trim();
  return trimmed ? trimmed : undefined;
}

function parseTotalContributionsFromHtml(html: string): number | undefined {
  const headingMatch = html.match(
    /<[^>]*\bid="js-contribution-activity-description"[^>]*>([\s\S]*?)<\/h2>/i,
  );
  const rawText = (headingMatch?.[1] ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const countMatch =
    rawText.match(/([\d,]+)\s+contributions?/i) ??
    html.match(/id="js-contribution-activity-description"[^>]*>\s*([\d,]+)\s+contributions?/i);
  if (!countMatch?.[1]) return undefined;
  const parsed = Number(countMatch[1].replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** Parses GitHub's public contributions HTML fragment into typed daily entries. */
export function parseGithubContributionsHtml(
  html: string,
  username: string,
): GithubContributionsPayload {
  const tooltipById = new Map<string, string>();
  for (const m of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/gi)) {
    const attrPart = m[1] ?? "";
    const tipBody = m[2] ?? "";
    const forMatch = attrPart.match(/\bfor="([^"]+)"/);
    if (forMatch?.[1]) {
      tooltipById.set(forMatch[1], tipBody.replace(/\s+/g, " ").trim());
    }
  }

  const dayByDate = new Map<string, ContributionDay>();
  for (const m of html.matchAll(/<td\b([^>]*)>/gi)) {
    const attrs = m[1] ?? "";
    const dateM = attrs.match(/\bdata-date="(\d{4}-\d{2}-\d{2})"/);
    const levelM = attrs.match(/\bdata-level="([0-4])"/);
    const idM = attrs.match(/\bid="([^"]+)"/);
    const dateStr = dateM?.[1];
    const levelStr = levelM?.[1];
    if (!dateStr || !levelStr) continue;

    const id = idM?.[1] ?? "";
    const tipText = tooltipById.get(id) ?? "";
    const countM = tipText.match(/^([\d,]+)\s+contribution/i);
    const level = Number(levelStr) as ContributionLevel;
    const count = countM?.[1] ? Number(countM[1].replace(/,/g, "")) : 0;

    dayByDate.set(dateStr, { date: dateStr, count, level });
  }

  const days = Array.from(dayByDate.values()).sort((a, b) => a.date.localeCompare(b.date));
  const firstDay = days[0];
  const lastDay = days[days.length - 1];
  if (!firstDay || !lastDay) {
    throw new Error("Could not parse contribution days from GitHub response");
  }

  const summedCount = days.reduce((sum, day) => sum + day.count, 0);
  const parsedTotal = parseTotalContributionsFromHtml(html);
  const totalContributions = parsedTotal ?? summedCount;

  return {
    username,
    profileUrl: `https://github.com/${username}`,
    totalContributions,
    allTimeContributions: totalContributions,
    visibility: "public",
    startDate: firstDay.date,
    endDate: lastDay.date,
    days,
    fetchedAt: new Date().toISOString(),
  };
}

type GraphQLRepoContribution = {
  repository?: { isPrivate?: boolean };
  contributions?: { totalCount?: number };
};

type GraphQLCollectionYearSummary = {
  hasAnyRestrictedContributions?: boolean;
  restrictedContributionsCount?: number;
  commitContributionsByRepository?: GraphQLRepoContribution[];
  contributionCalendar?: {
    totalContributions: number;
  };
};

type GraphQLTrailingResponse = {
  user?: {
    createdAt?: string;
    contributionsCollection?: GraphQLCollectionYearSummary & {
      contributionCalendar?: {
        totalContributions: number;
        weeks: Array<{
          contributionDays: Array<{
            date: string;
            contributionCount: number;
            contributionLevel: string;
          }>;
        }>;
      };
    };
  };
};

async function postGithubGraphQL<T>(
  token: string,
  query: string,
  variables: Record<string, unknown>,
): Promise<{ data: T; oauthScopes: string }> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "anshika-portfolio-app",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL responded with status ${response.status}`);
  }

  const json = (await response.json()) as {
    data?: T;
    errors?: Array<{ message?: string }>;
  };

  if (json.errors?.length) {
    const firstMsg = json.errors[0]?.message ?? "Unknown GraphQL error";
    throw new Error(`GitHub GraphQL error: ${firstMsg}`);
  }

  if (!json.data) {
    throw new Error("GitHub GraphQL returned empty data payload");
  }

  return {
    data: json.data,
    oauthScopes: response.headers.get("x-oauth-scopes") ?? "",
  };
}

function countPrivateInCollection(collection: GraphQLCollectionYearSummary | undefined): number {
  if (!collection) return 0;
  const restricted = collection.restrictedContributionsCount ?? 0;
  const privateRepoCommits = (collection.commitContributionsByRepository ?? []).reduce(
    (sum, entry) => {
      return entry.repository?.isPrivate ? sum + (entry.contributions?.totalCount ?? 0) : sum;
    },
    0,
  );
  return restricted + privateRepoCommits;
}

async function fetchCompleteViaGraphQL(
  username: string,
  token: string,
  now = new Date(),
): Promise<GithubContributionsPayload> {
  const todayIso = getLocalIsoDate(now);
  const fromIso = shiftIsoDays(todayIso, -364); // 365 days inclusive — strictly within GitHub's 1-year GraphQL limit
  const endYear = Number(todayIso.slice(0, 4)) || now.getUTCFullYear();

  const trailingQuery = `
    query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        createdAt
        contributionsCollection(from: $from, to: $to) {
          hasAnyRestrictedContributions
          restrictedContributionsCount
          commitContributionsByRepository(maxRepositories: 100) {
            repository {
              isPrivate
            }
            contributions {
              totalCount
            }
          }
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  const { data: trailingData, oauthScopes } = await postGithubGraphQL<GraphQLTrailingResponse>(
    token,
    trailingQuery,
    {
      login: username,
      from: `${fromIso}T00:00:00${GITHUB_TZ_OFFSET}`,
      to: `${todayIso}T23:59:59${GITHUB_TZ_OFFSET}`,
    },
  );

  const userNode = trailingData.user;
  const trailingCollection = userNode?.contributionsCollection;
  const calendar = trailingCollection?.contributionCalendar;
  if (!calendar) {
    throw new Error("GitHub GraphQL returned empty contribution calendar");
  }

  const days: ContributionDay[] = calendar.weeks
    .flatMap((week) => week.contributionDays)
    .map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: GRAPHQL_LEVEL_MAP[day.contributionLevel] ?? 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const firstDay = days[0];
  const lastDay = days[days.length - 1];
  if (!firstDay || !lastDay) {
    throw new Error("No contribution days returned from GitHub GraphQL");
  }

  let accountCreatedYear: number | undefined;
  if (userNode?.createdAt) {
    const parsedCreatedYear = Number(getLocalIsoDate(new Date(userNode.createdAt)).slice(0, 4));
    if (
      Number.isFinite(parsedCreatedYear) &&
      parsedCreatedYear >= 2008 &&
      parsedCreatedYear <= endYear
    ) {
      accountCreatedYear = parsedCreatedYear;
    }
  }

  const startYear = accountCreatedYear ?? Math.max(2008, endYear - 1);
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  let allTimeContributions = calendar.totalContributions;
  let totalPrivateCount = countPrivateInCollection(trailingCollection);
  let hasAnyRestricted = Boolean(trailingCollection?.hasAnyRestrictedContributions);

  try {
    const yearAliases = years
      .map(
        (year) => `
          y${year}: contributionsCollection(
            from: "${year}-01-01T00:00:00${GITHUB_TZ_OFFSET}"
            to: "${year === endYear ? todayIso : `${year}-12-31`}T23:59:59${GITHUB_TZ_OFFSET}"
          ) {
            hasAnyRestrictedContributions
            restrictedContributionsCount
            commitContributionsByRepository(maxRepositories: 100) {
              repository {
                isPrivate
              }
              contributions {
                totalCount
              }
            }
            contributionCalendar {
              totalContributions
            }
          }
        `,
      )
      .join("\n");

    const yearlyQuery = `
      query($login: String!) {
        user(login: $login) {
          ${yearAliases}
        }
      }
    `;

    const { data: yearlyData } = await postGithubGraphQL<{
      user?: Record<string, GraphQLCollectionYearSummary | undefined>;
    }>(token, yearlyQuery, { login: username });

    const yearlyCollections = years.map((year) => yearlyData.user?.[`y${year}`]);
    const yearlyTotal = yearlyCollections.reduce(
      (sum, col) => sum + (col?.contributionCalendar?.totalContributions ?? 0),
      0,
    );
    const yearlyPrivate = yearlyCollections.reduce(
      (sum, col) => sum + countPrivateInCollection(col),
      0,
    );

    allTimeContributions = Math.max(yearlyTotal, calendar.totalContributions);
    totalPrivateCount = Math.max(yearlyPrivate, totalPrivateCount);
    hasAnyRestricted =
      hasAnyRestricted ||
      yearlyCollections.some((col) => Boolean(col?.hasAnyRestrictedContributions));
  } catch {
    // Non-fatal fallback: keep trailing total when yearly alias lookup fails
  }

  const scopeTokens = oauthScopes
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const hasRepoScope = scopeTokens.includes("repo");
  const includesPrivate = totalPrivateCount > 0 || (hasRepoScope && !hasAnyRestricted);

  return {
    username,
    profileUrl: `https://github.com/${username}`,
    totalContributions: calendar.totalContributions,
    allTimeContributions,
    ...(accountCreatedYear !== undefined ? { accountCreatedYear } : {}),
    visibility: includesPrivate ? "public-and-private" : "public",
    ...(totalPrivateCount > 0 ? { privateContributionsCount: totalPrivateCount } : {}),
    startDate: firstDay.date,
    endDate: lastDay.date,
    days,
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchViaPublicContributionsPage(
  username: string,
): Promise<GithubContributionsPayload> {
  const response = await fetch(
    `https://github.com/users/${encodeURIComponent(username)}/contributions`,
    {
      headers: PUBLIC_HTML_HEADERS,
    },
  );

  if (!response.ok) {
    throw new Error(`GitHub contributions page responded with status ${response.status}`);
  }

  const html = await response.text();
  return parseGithubContributionsHtml(html, username);
}

async function fetchPublicYearTotal(username: string, year: number): Promise<number> {
  const response = await fetch(
    `https://github.com/users/${encodeURIComponent(username)}/contributions?from=${year}-01-01&to=${year}-12-31`,
    { headers: PUBLIC_HTML_HEADERS },
  );
  if (!response.ok) return 0;
  const html = await response.text();
  return parseTotalContributionsFromHtml(html) ?? 0;
}

async function resolvePublicAllTimeContributions(
  username: string,
  endYear: number,
  trailingTotal: number,
  cachedCreatedYear?: number,
): Promise<{ allTimeContributions: number; accountCreatedYear?: number }> {
  let startYear = cachedCreatedYear;
  if (!startYear) {
    try {
      const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "anshika-portfolio-app",
        },
      });
      if (userRes.ok) {
        const userData = (await userRes.json()) as { created_at?: string };
        if (userData.created_at) {
          const parsedYear = Number(getLocalIsoDate(new Date(userData.created_at)).slice(0, 4));
          if (Number.isFinite(parsedYear) && parsedYear >= 2008 && parsedYear <= endYear) {
            startYear = parsedYear;
          }
        }
      }
    } catch {
      // Non-fatal fallback below
    }
  }

  const effectiveStartYear = startYear ?? Math.max(2008, endYear - 1);
  const years = Array.from(
    { length: endYear - effectiveStartYear + 1 },
    (_, i) => effectiveStartYear + i,
  );

  try {
    const counts = await Promise.all(years.map((y) => fetchPublicYearTotal(username, y)));
    const sum = counts.reduce((acc, n) => acc + n, 0);
    return {
      allTimeContributions: Math.max(sum, trailingTotal),
      ...(startYear !== undefined ? { accountCreatedYear: startYear } : {}),
    };
  } catch {
    return {
      allTimeContributions: trailingTotal,
      ...(startYear !== undefined ? { accountCreatedYear: startYear } : {}),
    };
  }
}

async function fetchCompleteViaPublicPage(
  username: string,
  cachedCreatedYear?: number,
  now = new Date(),
): Promise<GithubContributionsPayload> {
  const base = await fetchViaPublicContributionsPage(username);
  const currentLocalYear = Number(getLocalIsoDate(now).slice(0, 4)) || 2026;
  const endYear = Math.max(currentLocalYear, Number(base.endDate.slice(0, 4)) || 2026);
  const { allTimeContributions, accountCreatedYear } = await resolvePublicAllTimeContributions(
    username,
    endYear,
    base.totalContributions,
    cachedCreatedYear,
  );

  return {
    ...base,
    allTimeContributions,
    ...(accountCreatedYear !== undefined ? { accountCreatedYear } : {}),
    visibility: "public",
  };
}

/** Fetches and caches live GitHub contribution activity strictly on the server. */
export async function fetchGithubContributions(
  nowMs = Date.now(),
): Promise<GithubContributionsPayload> {
  const token = getServerGithubToken();
  const cacheKey = `${GITHUB_USERNAME}:${token ? "graphql" : "public"}`;
  const cached = contributionCache.get(cacheKey);
  if (cached && cached.expiresAt > nowMs) {
    return cached.data;
  }

  const now = new Date(nowMs);
  try {
    const fresh = token
      ? await fetchCompleteViaGraphQL(GITHUB_USERNAME, token, now).catch(() =>
          fetchCompleteViaPublicPage(GITHUB_USERNAME, cached?.data.accountCreatedYear, now),
        )
      : await fetchCompleteViaPublicPage(GITHUB_USERNAME, cached?.data.accountCreatedYear, now);

    contributionCache.set(cacheKey, {
      data: fresh,
      expiresAt: nowMs + CACHE_TTL_MS,
    });
    return fresh;
  } catch (error) {
    if (cached) {
      return cached.data;
    }
    throw new Error(
      error instanceof Error
        ? error.message
        : `Unable to load GitHub contributions for ${GITHUB_PROFILE_URL}`,
    );
  }
}

export const getGithubContributions = createServerFn({ method: "GET" }).handler(async () =>
  fetchGithubContributions(),
);
