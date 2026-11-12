import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Github, RefreshCw, AlertCircle } from "lucide-react";
import {
  getGithubContributions,
  type ContributionDay,
  type ContributionLevel,
} from "@/lib/github-contributions";
import { AnimatedSectionHead, Reveal } from "./ui";

const GITHUB_PROFILE_URL = "https://github.com/Anshika366";

const LEVEL_CLASSES: Record<ContributionLevel, string> = {
  0: "bg-[#1a1a21] border-white/[0.06]",
  1: "bg-[#0e4429] border-[#16603b]",
  2: "bg-[#006d32] border-[#0e8b46]",
  3: "bg-[#26a641] border-[#34c152]",
  4: "bg-[#39d353] border-[#5be773]",
};

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""] as const;

const UTC_DATE_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const UTC_MONTH_YEAR_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const UTC_MONTH_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

function parseIsoUtcDate(isoDate: string): Date {
  const [y = 1970, m = 1, d = 1] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function formatUtcDate(isoDate: string): string {
  return UTC_DATE_FMT.format(parseIsoUtcDate(isoDate));
}

function formatContributionPeriod(startIso: string, endIso: string): string {
  const start = UTC_MONTH_YEAR_FMT.format(parseIsoUtcDate(startIso));
  const end = UTC_MONTH_YEAR_FMT.format(parseIsoUtcDate(endIso));
  return `${start} — ${end}`;
}

function buildCalendarWeeks(days: ContributionDay[]) {
  const firstDay = days[0];
  if (!firstDay) {
    return {
      weeks: [] as Array<Array<ContributionDay | null>>,
      monthLabels: [] as Array<{ colIdx: number; label: string }>,
    };
  }

  const leadingEmptyCount = parseIsoUtcDate(firstDay.date).getUTCDay();

  const slots: Array<ContributionDay | null> = [
    ...Array.from({ length: leadingEmptyCount }, () => null),
    ...days,
  ];

  const weeks: Array<Array<ContributionDay | null>> = [];
  for (let i = 0; i < slots.length; i += 7) {
    const col = slots.slice(i, i + 7);
    while (col.length < 7) col.push(null);
    weeks.push(col);
  }

  const monthLabels: Array<{ colIdx: number; label: string }> = [];
  let lastMonthKey = "";
  let lastLabeledCol = -4;

  weeks.forEach((week, colIdx) => {
    const anchorDay =
      week.find((d): d is ContributionDay => d !== null && Number(d.date.slice(8, 10)) <= 7) ??
      week.find((d): d is ContributionDay => d !== null);
    if (!anchorDay) return;

    const monthKey = anchorDay.date.slice(0, 7);
    if (monthKey === lastMonthKey) return;
    lastMonthKey = monthKey;

    if (colIdx - lastLabeledCol >= 3) {
      monthLabels.push({
        colIdx,
        label: UTC_MONTH_FMT.format(parseIsoUtcDate(anchorDay.date)),
      });
      lastLabeledCol = colIdx;
    }
  });

  return { weeks, monthLabels };
}

type HoveredCell = {
  day: ContributionDay;
  leftPx: number;
  topPx: number;
  placeBelow: boolean;
};

export function GitHubActivity() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [hoveredCell, setHoveredCell] = useState<HoveredCell | null>(null);

  const { data, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: ["github-contributions", "Anshika366"],
    queryFn: () => getGithubContributions(),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const { weeks, monthLabels } = useMemo(() => buildCalendarWeeks(data?.days ?? []), [data?.days]);

  const monthLabelByCol = useMemo(
    () => new Map(monthLabels.map((item) => [item.colIdx, item.label])),
    [monthLabels],
  );

  // On narrower screens where the grid scrolls horizontally, start at the latest months.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (el.scrollWidth > el.clientWidth) {
      el.scrollLeft = el.scrollWidth - el.clientWidth;
    }
  }, [data?.endDate]);

  const showCellTooltip = (el: HTMLElement, day: ContributionDay) => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const cellRect = el.getBoundingClientRect();

    const safeMargin = Math.min(110, containerRect.width / 2);
    const rawCenterX = cellRect.left - containerRect.left + cellRect.width / 2;
    const clampedX = Math.max(safeMargin, Math.min(containerRect.width - safeMargin, rawCenterX));
    const cellTop = cellRect.top - containerRect.top;
    const placeBelow = cellTop < 46;
    const topPx = placeBelow ? cellTop + cellRect.height + 8 : cellTop - 8;

    setHoveredCell({ day, leftPx: clampedX, topPx, placeBelow });
  };

  return (
    <section
      id="github-activity"
      className="mx-auto max-w-7xl scroll-mt-16 px-5 pt-0 pb-2 md:px-8 md:pt-0 md:pb-4"
    >
      <AnimatedSectionHead
        label="OPEN SOURCE & CONSISTENCY"
        lines={[{ text: "GITHUB" }, { text: "ACTIVITY.", accent: true }]}
        inline
        className="mb-10 md:mb-12"
      />

      <Reveal delay={0.08}>
        <div className="github-card-shell relative">
          <div className="github-card group relative z-10 overflow-hidden rounded-3xl border border-white/[0.09] bg-[#131317]/80 p-4 backdrop-blur-xl sm:p-7 md:p-8">
            <span aria-hidden className="edu-card-sheen pointer-events-none z-20" />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(229,57,53,0.72)] to-transparent opacity-45 transition-opacity duration-500 group-hover:opacity-100"
            />

            {/* Header strip: contribution total + period + profile CTA */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {data ? (
                  <>
                    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                      <span className="font-heading text-2xl font-bold tabular-nums tracking-tight text-white sm:text-3xl">
                        {(data.allTimeContributions ?? data.totalContributions).toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground sm:text-base">
                        {data.visibility === "public"
                          ? "public total contributions"
                          : "total contributions"}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[11px] tracking-[0.18em] text-muted-foreground/85 uppercase">
                      {data.allTimeContributions &&
                      data.allTimeContributions !== data.totalContributions
                        ? `${data.totalContributions.toLocaleString()}${data.visibility === "public" ? " public" : ""} in the last year · `
                        : ""}
                      {data.visibility === "public-and-private" && data.privateContributionsCount
                        ? `${data.privateContributionsCount.toLocaleString()} private · `
                        : ""}
                      {formatContributionPeriod(data.startDate, data.endDate)} · @{data.username}
                      {data.visibility === "public" ? " · Public visibility" : ""}
                    </p>
                  </>
                ) : isPending ? (
                  <div className="space-y-2">
                    <div className="h-7 w-56 animate-pulse rounded-lg bg-white/[0.06]" />
                    <div className="h-3.5 w-44 animate-pulse rounded bg-white/[0.04]" />
                  </div>
                ) : (
                  <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
                    GITHUB CONTRIBUTIONS · @{GITHUB_PROFILE_URL.split("/").pop()}
                  </p>
                )}
              </div>

              <a
                href={data?.profileUrl ?? GITHUB_PROFILE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-[11px] font-semibold tracking-widest text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[rgba(229,57,53,0.72)] hover:bg-[rgba(229,57,53,0.1)] hover:text-[#ff6b57]"
              >
                <Github size={14} aria-hidden />
                <span>VIEW GITHUB PROFILE</span>
                <ExternalLink size={12} aria-hidden />
              </a>
            </div>

            {/* Contribution calendar area */}
            {isPending ? (
              <div
                aria-busy="true"
                aria-label="Loading GitHub contribution heatmap"
                className="rounded-2xl border border-white/[0.06] bg-[#0c0c10]/70 p-4 sm:p-5"
              >
                <div className="grid grid-cols-12 gap-1.5 sm:gap-2">
                  {Array.from({ length: 84 }).map((_, idx) => (
                    <span
                      key={idx}
                      className="aspect-square animate-pulse rounded-[3px] bg-white/[0.05]"
                    />
                  ))}
                </div>
              </div>
            ) : isError || !data ? (
              <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#0c0c10]/75 p-5 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="text-sm font-medium text-zinc-100">
                      Live GitHub contribution data is temporarily unavailable.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Please try refreshing or visit the GitHub profile directly.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold tracking-widest text-zinc-100 transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
                >
                  <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} aria-hidden />
                  <span>{isFetching ? "RETRYING" : "RETRY"}</span>
                </button>
              </div>
            ) : (
              <div ref={containerRef} className="relative">
                {/* Floating hover/focus tooltip */}
                {hoveredCell && (
                  <div
                    role="tooltip"
                    style={{
                      left: `${hoveredCell.leftPx}px`,
                      top: `${hoveredCell.topPx}px`,
                    }}
                    className={`pointer-events-none absolute z-30 max-w-[calc(100%-8px)] -translate-x-1/2 whitespace-normal rounded-lg border border-white/15 bg-[#09090c]/95 px-3 py-1.5 text-center text-xs shadow-[0_12px_30px_rgba(0,0,0,0.85)] backdrop-blur-md sm:whitespace-nowrap ${
                      hoveredCell.placeBelow ? "" : "-translate-y-full"
                    }`}
                  >
                    <span className="font-semibold text-white">
                      {hoveredCell.day.count === 0
                        ? "No contributions"
                        : `${hoveredCell.day.count} contribution${hoveredCell.day.count === 1 ? "" : "s"}`}
                    </span>{" "}
                    <span className="text-zinc-400">on {formatUtcDate(hoveredCell.day.date)}</span>
                  </div>
                )}

                <div
                  className="rounded-2xl border border-white/[0.06] bg-[#0b0b0f]/75 p-4 sm:p-5"
                  onMouseLeave={() => setHoveredCell(null)}
                >
                  <div ref={scrollerRef} className="overflow-x-auto no-scrollbar pb-1">
                    <div
                      className="min-w-[680px] lg:min-w-0"
                      style={{ "--weeks-count": weeks.length } as CSSProperties}
                    >
                      {/* Month header row aligned directly over the week columns */}
                      <div className="mb-2 flex items-center gap-2.5">
                        <span aria-hidden className="w-7 shrink-0" />
                        <div className="grid flex-1 grid-cols-[repeat(var(--weeks-count),minmax(0,1fr))] gap-[3px]">
                          {weeks.map((_, colIdx) => {
                            const label = monthLabelByCol.get(colIdx);
                            return (
                              <span
                                key={colIdx}
                                className="relative h-4 font-mono text-[10px] tracking-wider text-muted-foreground/85"
                              >
                                {label && (
                                  <span className="absolute left-0 top-0 whitespace-nowrap">
                                    {label}
                                  </span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Weekday labels column + 53x7 squares grid */}
                      <div className="flex items-stretch gap-2.5">
                        <div
                          aria-hidden
                          className="grid w-7 shrink-0 grid-rows-7 gap-[3px] font-mono text-[10px] text-muted-foreground/75"
                        >
                          {WEEKDAY_LABELS.map((dayLabel, rowIdx) => (
                            <span key={rowIdx} className="flex items-center leading-none">
                              {dayLabel}
                            </span>
                          ))}
                        </div>

                        <div
                          role="grid"
                          aria-label={`GitHub contributions calendar for ${data.username}`}
                          className="grid flex-1 grid-cols-[repeat(var(--weeks-count),minmax(0,1fr))] gap-[3px]"
                        >
                          {weeks.map((week, colIdx) => (
                            <div
                              key={colIdx}
                              role="rowgroup"
                              className="grid grid-rows-7 gap-[3px]"
                            >
                              {week.map((day, rowIdx) =>
                                day ? (
                                  <button
                                    key={day.date}
                                    type="button"
                                    role="gridcell"
                                    aria-label={`${day.count === 0 ? "No contributions" : `${day.count} contribution${day.count === 1 ? "" : "s"}`} on ${formatUtcDate(day.date)}`}
                                    onMouseEnter={(ev) => showCellTooltip(ev.currentTarget, day)}
                                    onFocus={(ev) => showCellTooltip(ev.currentTarget, day)}
                                    onBlur={() => setHoveredCell(null)}
                                    onClick={(ev) => showCellTooltip(ev.currentTarget, day)}
                                    className={`aspect-square w-full rounded-[3px] border transition-transform duration-150 focus:outline-none focus:ring-1 focus:ring-white/80 hover:scale-125 hover:ring-1 hover:ring-white/75 ${LEVEL_CLASSES[day.level]}`}
                                  />
                                ) : (
                                  <span
                                    key={`empty-${colIdx}-${rowIdx}`}
                                    aria-hidden
                                    className="aspect-square w-full"
                                  />
                                ),
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer bar: Live status & Less — More legend */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-2 font-mono tracking-wider">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-[#39d353] shadow-[0_0_8px_rgba(57,211,83,0.75)]"
                      aria-hidden
                    />
                    {data.visibility === "public"
                      ? "PUBLIC DATA VIA GITHUB (PRIVATE HIDDEN)"
                      : data.visibility === "public-and-private"
                        ? "LIVE DATA VIA GITHUB (PUBLIC & PRIVATE)"
                        : "LIVE DATA VIA GITHUB"}
                  </span>

                  <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider">
                    <span className="mr-1 text-muted-foreground/85">Less</span>
                    {([0, 1, 2, 3, 4] as const).map((lvl) => (
                      <span
                        key={lvl}
                        aria-hidden
                        className={`h-3 w-3 rounded-[3px] border ${LEVEL_CLASSES[lvl]}`}
                      />
                    ))}
                    <span className="ml-1 text-muted-foreground/85">More</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
