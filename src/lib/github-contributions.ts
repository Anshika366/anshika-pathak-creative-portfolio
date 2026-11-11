import { createServerFn } from "@tanstack/react-start";

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

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
  startDate: string;
  endDate: string;
  days: ContributionDay[];
  fetchedAt: string;
}

const GITHUB_USERNAME = "Anshika366";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15-minute server-side cache

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

/** Parses GitHub's public contributions HTML fragment into typed daily entries. */
export function parseGithubContributionsHtml(html: string, username: string): GithubContributionsPayload {
  const totalMatch = html.match(/id="js-contribution-activity-description"[^>]*>\s*([\d,]+)\s+contributions?/i);

  const tooltipById = new Map<string, string>();
  for (const m of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/gi)) {
    const attrPart = m[1] ?? "";
    const tipBody = m[2] ?? "";
    const forMatch = attrPart.match(/\bfor="([^"]+)"/);
    if (forMatch?.[1]) {
      tooltipById.set(forMatch[1], tipBody.replace(/\s+/g, " ").trim());
    }
  }

  const days: ContributionDay[] = [];
  for (const m of html.matchAll(/<td\b([^>]*)>\s*<\/td>/gi)) {
    const attrs = m[1] ?? "";
    const dateM = attrs.match(/\bdata-date="(\d{4}-\d{2}-\d{2})"/);
    const levelM = attrs.match(/\bdata-level="([0-4])"/);
    const idM = attrs.match(/\bid="([^"]+)"/);
    const dateStr = dateM?.[1];
    const levelStr = levelM?.[1];
    if (!dateStr || !levelStr) continue;

    const id = idM?.[1] ?? "";
    const tipText = tooltipById.get(id) ?? "";
    const countM = tipText.match(/^(\d+)\s+contribution/i);
    const level = Number(levelStr) as ContributionLevel;
    const count = countM?.[1] ? Number(countM[1]) : 0;

    days.push({ date: dateStr, count, level });
  }

  if (days.length === 0) {
    throw new Error("Could not parse contribution days from GitHub response");
  }

  days.sort((a, b) => a.date.localeCompare(b.date));
  const firstDay = days[0];
  const lastDay = days[days.length - 1];
  if (!firstDay || !lastDay) {
    throw new Error("Could not parse contribution days from GitHub response");
  }

  const summedCount = days.reduce((sum, day) => sum + day.count, 0);
  const totalText = totalMatch?.[1];
  const totalContributions = totalText ? Number(totalText.replace(/,/g, "")) : summedCount;

  return {
    username,
    profileUrl: `https://github.com/${username}`,
    totalContributions,
    allTimeContributions: totalContributions,
    startDate: firstDay.date,
    endDate: lastDay.date,
    days,
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchViaGraphQL(username: string, token: string): Promise<GithubContributionsPayload> {
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
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

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "anshika-portfolio-app",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL responded with status ${response.status}`);
  }

  const json = (await response.json()) as {
    data?: {
      user?: {
        contributionsCollection?: {
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
  };

  const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
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

  return {
    username,
    profileUrl: `https://github.com/${username}`,
    totalContributions: calendar.totalContributions,
    allTimeContributions: calendar.totalContributions,
    startDate: firstDay.date,
    endDate: lastDay.date,
    days,
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchViaPublicContributionsPage(username: string): Promise<GithubContributionsPayload> {
  const response = await fetch(`https://github.com/users/${encodeURIComponent(username)}/contributions`, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "anshika-portfolio-app",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub contributions page responded with status ${response.status}`);
  }

  const html = await response.text();
  return parseGithubContributionsHtml(html, username);
}

async function fetchYearTotal(username: string, year: number): Promise<number> {
  const response = await fetch(
    `https://github.com/users/${encodeURIComponent(username)}/contributions?from=${year}-01-01&to=${year}-12-31`,
    {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "anshika-portfolio-app",
      },
    },
  );
  if (!response.ok) return 0;
  const html = await response.text();
  const match = html.match(/id="js-contribution-activity-description"[^>]*>\s*([\d,]+)\s+contributions?/i);
  return match?.[1] ? Number(match[1].replace(/,/g, "")) : 0;
}

async function resolveAllTimeContributions(
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
          const parsedYear = new Date(userData.created_at).getUTCFullYear();
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
  const years = Array.from({ length: endYear - effectiveStartYear + 1 }, (_, i) => effectiveStartYear + i);

  try {
    const counts = await Promise.all(years.map((y) => fetchYearTotal(username, y)));
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

/** Fetches and caches live GitHub contribution activity strictly on the server. */
export const getGithubContributions = createServerFn({ method: "GET" }).handler(async () => {
  const now = Date.now();
  const cached = contributionCache.get(GITHUB_USERNAME);
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const token = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.["GITHUB_TOKEN"];

  try {
    const base = token
      ? await fetchViaGraphQL(GITHUB_USERNAME, token).catch(() => fetchViaPublicContributionsPage(GITHUB_USERNAME))
      : await fetchViaPublicContributionsPage(GITHUB_USERNAME);

    const endYear = Math.max(new Date().getUTCFullYear(), Number(base.endDate.slice(0, 4)) || 2026);
    const { allTimeContributions, accountCreatedYear } = await resolveAllTimeContributions(
      GITHUB_USERNAME,
      endYear,
      base.totalContributions,
      cached?.data.accountCreatedYear,
    );

    const fresh: GithubContributionsPayload = {
      ...base,
      allTimeContributions,
      ...(accountCreatedYear !== undefined ? { accountCreatedYear } : {}),
    };

    contributionCache.set(GITHUB_USERNAME, {
      data: fresh,
      expiresAt: now + CACHE_TTL_MS,
    });
    return fresh;
  } catch (error) {
    if (cached) {
      return cached.data;
    }
    throw new Error(
      error instanceof Error ? error.message : `Unable to load GitHub contributions for ${GITHUB_PROFILE_URL}`,
    );
  }
});
