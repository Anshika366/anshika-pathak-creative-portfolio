import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearGithubContributionsCache,
  fetchGithubContributions,
  getLocalIsoDate,
  parseGithubContributionsHtml,
  shiftIsoDays,
  type GithubContributionsPayload,
} from "@/lib/github-contributions";
import { GitHubActivity } from "@/components/portfolio/GitHubActivity";

const mockGetGithubContributions = vi.fn<() => Promise<GithubContributionsPayload>>();

vi.mock("@/lib/github-contributions", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/github-contributions")>();
  return {
    ...actual,
    getGithubContributions: () => mockGetGithubContributions(),
  };
});

describe("GitHub contributions parsing, timezone helpers, and visibility display", () => {
  beforeEach(() => {
    clearGithubContributionsCache();
    mockGetGithubContributions.mockReset();
    globalThis.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("computes Asia/Kolkata dates accurately across UTC midnight boundaries", () => {
    // 2026-11-11 20:00:00 UTC is already 2026-11-12 01:30:00 IST (+05:30)
    const utcLateNight = new Date("2026-11-11T20:00:00.000Z");
    expect(getLocalIsoDate(utcLateNight)).toBe("2026-11-12");
    expect(shiftIsoDays("2026-11-12", -364)).toBe("2025-11-13");
  });

  it("parses GitHub HTML contribution cells chronologically including November 2026 dates and comma totals", () => {
    const html = `
      <h2 tabindex="-1" id="js-contribution-activity-description" class="f4 text-normal mb-2">
        1,024 contributions in the last year
      </h2>
      <table>
        <tbody>
          <tr>
            <td data-date="2026-11-12" id="cell-nov-12" data-level="3"><span></span></td>
            <td data-date="2026-11-01" id="cell-nov-1" data-level="1"></td>
            <td data-date="2025-11-10" id="cell-nov-10-prev" data-level="0"></td>
          </tr>
        </tbody>
      </table>
      <tool-tip for="cell-nov-12">1,000 contributions on November 12th.</tool-tip>
      <tool-tip for="cell-nov-1">24 contributions on November 1st.</tool-tip>
      <tool-tip for="cell-nov-10-prev">No contributions on November 10th.</tool-tip>
    `;

    const parsed = parseGithubContributionsHtml(html, "Anshika366");
    expect(parsed.totalContributions).toBe(1024);
    expect(parsed.visibility).toBe("public");
    expect(parsed.startDate).toBe("2025-11-10");
    expect(parsed.endDate).toBe("2026-11-12");
    expect(parsed.days).toEqual([
      { date: "2025-11-10", count: 0, level: 0 },
      { date: "2026-11-01", count: 24, level: 1 },
      { date: "2026-11-12", count: 1000, level: 3 },
    ]);
  });

  it("distinguishes public-only data without fabricating missing private contributions", async () => {
    mockGetGithubContributions.mockResolvedValue({
      username: "Anshika366",
      profileUrl: "https://github.com/Anshika366",
      totalContributions: 251,
      allTimeContributions: 252,
      visibility: "public",
      startDate: "2025-11-09",
      endDate: "2026-11-12",
      days: [
        { date: "2025-11-09", count: 0, level: 0 },
        { date: "2026-11-12", count: 0, level: 0 },
      ],
      fetchedAt: "2026-11-12T05:30:00.000Z",
    });

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={queryClient}>
        <GitHubActivity />
      </QueryClientProvider>,
    );

    expect(await screen.findByText("252")).toBeInTheDocument();
    expect(screen.getByText(/public total contributions/i)).toBeInTheDocument();
    expect(screen.getByText(/PUBLIC DATA VIA GITHUB \(PRIVATE HIDDEN\)/i)).toBeInTheDocument();
    expect(
      screen.getByRole("gridcell", { name: /No contributions on Nov 12, 2026/i }),
    ).toBeInTheDocument();
  });

  it("displays public and private totals including November 2026 contributions when authenticated data includes private repos", async () => {
    mockGetGithubContributions.mockResolvedValue({
      username: "Anshika366",
      profileUrl: "https://github.com/Anshika366",
      totalContributions: 294,
      allTimeContributions: 295,
      visibility: "public-and-private",
      privateContributionsCount: 43,
      startDate: "2025-11-13",
      endDate: "2026-11-12",
      days: [
        { date: "2025-11-13", count: 0, level: 0 },
        { date: "2026-11-11", count: 5, level: 3 },
        { date: "2026-11-12", count: 2, level: 2 },
      ],
      fetchedAt: "2026-11-12T05:30:00.000Z",
    });

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={queryClient}>
        <GitHubActivity />
      </QueryClientProvider>,
    );

    expect(await screen.findByText("295")).toBeInTheDocument();
    expect(screen.getByText(/43 private/i)).toBeInTheDocument();
    expect(screen.getByText(/LIVE DATA VIA GITHUB \(PUBLIC & PRIVATE\)/i)).toBeInTheDocument();
    expect(
      screen.getByRole("gridcell", { name: /5 contributions on Nov 11, 2026/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("gridcell", { name: /2 contributions on Nov 12, 2026/i }),
    ).toBeInTheDocument();
  });

  it("queries GraphQL for trailing and multi-year private+public totals when GITHUB_TOKEN is configured", async () => {
    vi.stubEnv("GITHUB_TOKEN", "ghp_test_token");

    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (_input, init) => {
      const bodyStr = String(init?.body ?? "");
      if (bodyStr.includes("weeks {")) {
        expect(bodyStr).toContain("2025-11-13T00:00:00+05:30");
        expect(bodyStr).toContain("2026-11-12T23:59:59+05:30");
        return new Response(
          JSON.stringify({
            data: {
              user: {
                createdAt: "2025-08-29T09:42:27Z",
                contributionsCollection: {
                  hasAnyRestrictedContributions: false,
                  restrictedContributionsCount: 0,
                  commitContributionsByRepository: [
                    { repository: { isPrivate: true }, contributions: { totalCount: 43 } },
                    { repository: { isPrivate: false }, contributions: { totalCount: 251 } },
                  ],
                  contributionCalendar: {
                    totalContributions: 294,
                    weeks: [
                      {
                        contributionDays: [
                          { date: "2025-11-13", contributionCount: 0, contributionLevel: "NONE" },
                          {
                            date: "2026-11-11",
                            contributionCount: 15,
                            contributionLevel: "THIRD_QUARTILE",
                          },
                          {
                            date: "2026-11-12",
                            contributionCount: 28,
                            contributionLevel: "FOURTH_QUARTILE",
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", "x-oauth-scopes": "read:user, repo" },
          },
        );
      }

      // Yearly alias query (2025 + 2026)
      expect(bodyStr).toContain("y2025:");
      expect(bodyStr).toContain("y2026:");
      return new Response(
        JSON.stringify({
          data: {
            user: {
              y2025: {
                hasAnyRestrictedContributions: false,
                restrictedContributionsCount: 0,
                commitContributionsByRepository: [],
                contributionCalendar: { totalContributions: 4 },
              },
              y2026: {
                hasAnyRestrictedContributions: false,
                restrictedContributionsCount: 0,
                commitContributionsByRepository: [
                  { repository: { isPrivate: true }, contributions: { totalCount: 43 } },
                ],
                contributionCalendar: { totalContributions: 291 },
              },
            },
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    });

    const result = await fetchGithubContributions(Date.parse("2026-11-12T06:00:00.000Z"));
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.totalContributions).toBe(294);
    expect(result.allTimeContributions).toBe(295);
    expect(result.visibility).toBe("public-and-private");
    expect(result.privateContributionsCount).toBe(43);
    expect(result.endDate).toBe("2026-11-12");

    vi.unstubAllEnvs();
  });
});
