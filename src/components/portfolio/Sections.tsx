import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type RefObject } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Layers, Lightbulb, BookOpen, Github, ExternalLink, Calendar, MapPin, Clock, type LucideIcon } from "lucide-react";
import { projects, skillGroups, education, experience, type Project } from "@/data/portfolio";
import { Reveal, SafeLink, useReplayInView } from "./ui";

const aboutSection = "mx-auto max-w-7xl px-5 pt-24 pb-8 md:px-8 md:pt-32 md:pb-10 scroll-mt-16";
const workSection = "mx-auto max-w-7xl px-5 pt-8 pb-14 md:px-8 md:pt-12 md:pb-16 scroll-mt-16";
const skillsSection = "mx-auto max-w-7xl px-5 pt-14 pb-14 md:px-8 md:pt-20 md:pb-16 scroll-mt-16";
const educationSection = "mx-auto max-w-7xl px-5 pt-14 pb-14 md:px-8 md:pt-20 md:pb-16 scroll-mt-16";
const experienceSection = "mx-auto max-w-7xl px-5 pt-14 pb-14 md:px-8 md:pt-20 md:pb-16 scroll-mt-16";
const approachSection = "mx-auto max-w-7xl px-5 pt-14 pb-24 md:px-8 md:pt-20 md:pb-32 scroll-mt-16";

type HeadlineLine = { readonly text: string; readonly accent: boolean };

const aboutHeadlineLines: readonly HeadlineLine[] = [
  { text: "Developer by skill.", accent: false },
  { text: "Problem solver by mindset.", accent: true },
];

const workHeadlineLines: readonly HeadlineLine[] = [
  { text: "Projects that turn", accent: false },
  { text: "ideas into reality.", accent: true },
];

const skillsHeadlineLines: readonly HeadlineLine[] = [
  { text: "The tools behind", accent: false },
  { text: "the work.", accent: true },
];

const approachHeadlineLines: readonly HeadlineLine[] = [
  { text: "Good code solves", accent: false },
  { text: "real problems.", accent: true },
];

/** Renders multi-line headings word-by-word while keeping gradient alignment across accented lines. */
function renderStaggeredWordLines({
  lines,
  wordClassName,
  delayVar,
  staggerMs,
  startDelayMs = 0,
}: {
  lines: readonly HeadlineLine[];
  wordClassName: string;
  delayVar: "--about-delay" | "--work-delay";
  staggerMs: number;
  startDelayMs?: number;
}) {
  let wordIdx = 0;
  return lines.map((line, lineIdx) => {
    const words = line.text.split(" ");
    const totalLineChars = words.reduce((sum, w) => sum + w.length, 0);
    let charOffset = 0;

    return (
      <span key={line.text} className="block">
        {words.map((word, wIdx) => {
          const delayMs = startDelayMs + wordIdx++ * staggerMs;
          const startChar = charOffset;
          charOffset += word.length;
          const wordStyle: CSSProperties = line.accent
            ? ({
                [delayVar]: `${delayMs}ms`,
                backgroundImage: "var(--gradient-accent)",
                backgroundSize: `${((totalLineChars / Math.max(1, word.length)) * 100).toFixed(2)}% 100%`,
                backgroundPosition: `${((startChar / Math.max(1, totalLineChars - word.length)) * 100).toFixed(2)}% 0%`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              } as CSSProperties)
            : ({ [delayVar]: `${delayMs}ms` } as CSSProperties);

          return (
            <span key={`${lineIdx}-${wIdx}`}>
              <span className={`${wordClassName} inline-block`} style={wordStyle}>
                {word}
              </span>
              {wIdx < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </span>
    );
  });
}

/** Splits single-paragraph or heading copy into staggered word spans while preserving wrapping. */
function renderStaggeredWords(text: string, wordClassName: string, baseDelayMs: number, stepMs: number) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, idx) => (
          <span key={`${idx}-${word}`}>
            <span
              className={`${wordClassName} inline-block`}
              style={{ "--work-delay": `${baseDelayMs + idx * stepMs}ms` } as CSSProperties}
            >
              {word}
            </span>
            {idx < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </>
  );
}

const cardFallTimings = [
  { delayMs: 0, durationS: 0.28 },
  { delayMs: 40, durationS: 0.32 },
  { delayMs: 80, durationS: 0.35 },
] as const;

type AboutCardData = { t: string; d: string; i: LucideIcon };

function AboutCardGrid({
  cards,
  cardsInView,
  gridRef,
}: {
  cards: AboutCardData[];
  cardsInView: boolean;
  gridRef: RefObject<HTMLDivElement | null>;
}) {
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafTiltRef = useRef<number | null>(null);
  const [swapEnabled, setSwapEnabled] = useState(false);
  const [cardsLanded, setCardsLanded] = useState(false);
  const [activeHoverIdx, setActiveHoverIdx] = useState<number | null>(null);
  const [tilt, setTilt] = useState<{ rx: number; ry: number; mx: number; my: number }>({
    rx: 0,
    ry: 0,
    mx: 50,
    my: 30,
  });
  const [slotDeltas, setSlotDeltas] = useState<{ x: number; y: number }[]>([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);

  useEffect(() => {
    const check = () => {
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setSwapEnabled(fine && !reduced);
      setActiveHoverIdx(null);
      setTilt({ rx: 0, ry: 0, mx: 50, my: 30 });
    };
    check();
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("resize", check);
      if (rafTiltRef.current !== null) cancelAnimationFrame(rafTiltRef.current);
    };
  }, []);

  // Enable hover swap shortly after the quick card landing transition
  useEffect(() => {
    if (!cardsInView) {
      setCardsLanded(false);
      setActiveHoverIdx(null);
      setTilt({ rx: 0, ry: 0, mx: 50, my: 30 });
      return;
    }
    const timer = window.setTimeout(() => setCardsLanded(true), 380);
    return () => window.clearTimeout(timer);
  }, [cardsInView]);

  // Only Card 1 (0 <-> 1) and Card 2 (1 <-> 2) swap; Card 3 gets full hover glow without leaving its spot
  const partnerIdx = activeHoverIdx === 0 ? 1 : activeHoverIdx === 1 ? 2 : null;

  useEffect(() => {
    if (activeHoverIdx === null || partnerIdx === null) {
      setSlotDeltas([
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ]);
      return;
    }

    const rSrc = slotRefs.current[activeHoverIdx]?.getBoundingClientRect();
    const rDst = slotRefs.current[partnerIdx]?.getBoundingClientRect();
    if (!rSrc || !rDst) return;

    const dx = rDst.left - rSrc.left;
    const dy = rDst.top - rSrc.top;
    setSlotDeltas(
      cards.map((_, idx) => {
        if (idx === activeHoverIdx) return { x: dx, y: dy };
        if (idx === partnerIdx) return { x: -dx, y: -dy };
        return { x: 0, y: 0 };
      }),
    );
  }, [activeHoverIdx, partnerIdx, cards.length]);

  const handleSlotIntent = (slotIdx: number, e: PointerEvent<HTMLDivElement>) => {
    if (!swapEnabled || !cardsLanded || e.pointerType !== "mouse") return;

    const rect = e.currentTarget.getBoundingClientRect();
    const px = Math.max(0, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
    const py = Math.max(0, Math.min(1, (e.clientY - rect.top) / Math.max(1, rect.height)));
    const nx = (px - 0.5) * 2;
    const ny = (py - 0.5) * 2;

    if (rafTiltRef.current !== null) cancelAnimationFrame(rafTiltRef.current);
    rafTiltRef.current = requestAnimationFrame(() => {
      setTilt({
        rx: Number((-ny * 5.5).toFixed(2)),
        ry: Number((nx * 6.5).toFixed(2)),
        mx: Math.round(px * 100),
        my: Math.round(py * 100),
      });
    });

    // Prevent repeated swaps while cursor stays inside the current swap pair
    if (activeHoverIdx !== null && (slotIdx === activeHoverIdx || slotIdx === partnerIdx)) {
      return;
    }
    setActiveHoverIdx(slotIdx);
  };

  const resetHover = () => {
    if (rafTiltRef.current !== null) {
      cancelAnimationFrame(rafTiltRef.current);
      rafTiltRef.current = null;
    }
    setActiveHoverIdx(null);
    setTilt({ rx: 0, ry: 0, mx: 50, my: 30 });
  };

  return (
    <div
      ref={gridRef}
      className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3"
      onMouseLeave={resetHover}
    >
      {cards.map((card, i) => {
        const Icon = card.i;
        const timing = cardFallTimings[i] ?? cardFallTimings[0];
        const isPrimary = activeHoverIdx === i;
        const isPartner = partnerIdx === i;
        const isMoving = isPrimary || isPartner;
        const delta = slotDeltas[i] ?? { x: 0, y: 0 };
        const stackZ = isPrimary ? 30 : isPartner ? 20 : 10;

        // Smooth depth separation while exchanging positions so cards pass cleanly without collision
        const liftY = isPrimary ? -10 : isPartner ? 8 : 0;
        const swapScale = isPrimary ? 1.03 : isPartner ? 0.975 : 1;

        return (
          <div
            key={card.t}
            ref={(el) => {
              slotRefs.current[i] = el;
            }}
            onPointerEnter={(e) => handleSlotIntent(i, e)}
            onPointerMove={(e) => handleSlotIntent(i, e)}
            style={{ zIndex: stackZ }}
            className="about-card-slot relative h-full"
          >
            <div
              className="about-card-entrance h-full"
              style={
                {
                  "--about-delay": `${timing.delayMs}ms`,
                  "--card-duration": `${timing.durationS}s`,
                } as CSSProperties
              }
            >
              <motion.div
                className={`about-card-swap glass group/card relative h-full overflow-hidden rounded-2xl p-5 transition-[background-color,border-color,box-shadow] duration-500 ease-out xl:p-6 ${
                  isPrimary ? "is-card-active" : isPartner ? "is-card-partner" : ""
                }`}
                animate={
                  swapEnabled && cardsLanded
                    ? {
                        x: delta.x,
                        y: delta.y + liftY,
                        scale: swapScale,
                        rotateX: isPrimary ? tilt.rx : 0,
                        rotateY: isPrimary ? tilt.ry : 0,
                        transformPerspective: 900,
                      }
                    : { x: 0, y: 0, scale: 1, rotateX: 0, rotateY: 0, transformPerspective: 900 }
                }
                transition={{
                  x: { duration: 0.68, ease: [0.22, 1, 0.36, 1] },
                  y: { duration: 0.68, ease: [0.22, 1, 0.36, 1] },
                  scale: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
                  rotateX: { duration: 0.24, ease: "easeOut" },
                  rotateY: { duration: 0.24, ease: "easeOut" },
                }}
              >
                {/* Subtle orange landing glow that peaks right on impact and settles naturally */}
                <span
                  aria-hidden
                  className="about-card-landing-glow pointer-events-none absolute inset-0 rounded-2xl"
                />
                {/* Full-card inner orange ambient glass glow & illuminated edge sheen */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/35 transition-opacity duration-500 ease-out ${
                    isPrimary ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background: `radial-gradient(280px circle at ${isPrimary ? tilt.mx : 50}% ${isPrimary ? tilt.my : 30}%, rgba(255,90,48,0.22) 0%, rgba(229,57,53,0.10) 46%, rgba(255,77,45,0.03) 76%, transparent 92%)`,
                  }}
                />
                <div className="relative z-10">
                  <div className="relative mb-4 inline-flex">
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute -inset-2.5 rounded-xl bg-[radial-gradient(circle,rgba(255,95,48,0.65)_0%,transparent_72%)] blur-md transition-opacity duration-500 ease-out ${
                        isPrimary ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <Icon
                      className={`relative transition-all duration-500 ease-out ${
                        isPrimary
                          ? "-translate-y-0.5 scale-110 text-[#ff734f] drop-shadow-[0_0_10px_rgba(255,77,45,0.65)]"
                          : isMoving
                            ? "scale-95 text-primary"
                            : "text-primary"
                      }`}
                      size={22}
                    />
                  </div>
                  <h3
                    className={`mb-2 font-heading font-semibold transition-colors duration-500 ease-out ${
                      isPrimary ? "text-white" : "text-foreground"
                    }`}
                  >
                    {card.t}
                  </h3>
                  <p
                    className={`text-sm transition-colors duration-500 ease-out ${
                      isPrimary ? "text-zinc-200" : "text-muted-foreground"
                    }`}
                  >
                    {card.d}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function About() {
  const aboutRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [textInView, setTextInView] = useState(false);
  const [cardsInView, setCardsInView] = useState(false);

  const evaluateVisibility = useCallback(() => {
    const secEl = aboutRef.current;
    const contentEl = contentRef.current;
    const cardsEl = gridRef.current;
    if (!secEl || !contentEl || !cardsEl) return;

    const vh = window.innerHeight;
    const navBottom = 64;
    const secRect = secEl.getBoundingClientRect();
    const contentRect = contentEl.getBoundingClientRect();
    const cardsRect = cardsEl.getBoundingClientRect();

    // Reset only once the section completely leaves the visible area
    if (secRect.bottom <= navBottom || secRect.top >= vh) {
      setTextInView(false);
      setCardsInView(false);
      return;
    }

    if (contentRect.top <= vh && contentRect.bottom >= navBottom) {
      setTextInView(true);
    }

    if (cardsRect.top <= vh && cardsRect.bottom >= navBottom) {
      setTextInView(true);
      setCardsInView(true);
    }
  }, []);

  useEffect(() => {
    let rafId: number | null = null;
    const scheduleCheck = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        evaluateVisibility();
      });
    };

    evaluateVisibility();
    window.addEventListener("scroll", scheduleCheck, { passive: true });
    window.addEventListener("resize", scheduleCheck, { passive: true });

    const el = aboutRef.current;
    const obs = el
      ? new IntersectionObserver(scheduleCheck, { threshold: [0, 0.25, 0.5, 0.85, 1] })
      : null;
    if (el && obs) obs.observe(el);

    return () => {
      window.removeEventListener("scroll", scheduleCheck);
      window.removeEventListener("resize", scheduleCheck);
      obs?.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [evaluateVisibility]);

  const cards: AboutCardData[] = [
    { t: "What I Build", d: "Full-stack web apps — responsive interfaces, REST APIs and the databases behind them.", i: Layers },
    { t: "How I Think", d: "Requirements first, then the simplest maintainable solution that actually solves the problem.", i: Lightbulb },
    { t: "What I'm Learning", d: "AI-powered tooling: retrieval-augmented generation, vector databases and automation workflows.", i: BookOpen },
  ];

  const renderedHeadline = renderStaggeredWordLines({
    lines: aboutHeadlineLines,
    wordClassName: "about-word",
    delayVar: "--about-delay",
    staggerMs: 26,
  });

  return (
    <section
      ref={aboutRef}
      id="about"
      className={`${aboutSection} about-reveal-root ${textInView ? "is-inview" : ""} ${cardsInView ? "is-cards-inview" : ""}`}
    >
      <div ref={contentRef}>
        <div className="mb-12 md:mb-16">
          <p className="about-eyebrow mb-4 font-mono text-xs tracking-[0.3em] text-primary">
            01 / ABOUT ME
          </p>
          <h2 className="font-display text-[2.15rem] leading-[0.95] uppercase text-foreground sm:text-5xl md:text-7xl">
            <span className="sr-only">Developer by skill. Problem solver by mindset.</span>
            <span aria-hidden="true">{renderedHeadline}</span>
          </h2>
        </div>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-5 text-lg text-muted-foreground">
            <p className="about-copy" style={{ "--about-delay": "40ms" } as CSSProperties}>
              I'm a Full-Stack Developer who enjoys building web applications that are genuinely useful — the kind people open because they help, not because they have to.
            </p>
            <p className="about-copy" style={{ "--about-delay": "80ms" } as CSSProperties}>
              I've worked across frontend interfaces, backend APIs and databases, and I'm comfortable collaborating with others through Git-based workflows. I like learning new technologies and applying them to practical problems.
            </p>
            <a
              href="#experience"
              className="about-copy inline-block text-xs font-semibold tracking-widest text-primary transition-colors duration-200 hover:underline"
              style={{ "--about-delay": "120ms" } as CSSProperties}
            >
              MORE ABOUT ME ↗
            </a>
          </div>
          <AboutCardGrid cards={cards} cardsInView={cardsInView} gridRef={gridRef} />
        </div>
      </div>
    </section>
  );
}

function ProjectVisual({ p, eager = false }: { p: Project; eager?: boolean }) {
  if (p.image) {
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-4 pb-5 pt-11 sm:px-5 sm:pb-6 sm:pt-12">
        <span aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-75" />
        <span aria-hidden className="project-card-stage-glow pointer-events-none absolute inset-0" />
        <span aria-hidden className="project-card-stage-vignette pointer-events-none absolute inset-0" />
        <img
          src={p.image}
          alt={`${p.title} preview`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="project-card-media relative z-10 max-h-full max-w-full rounded-xl border border-white/12 object-contain shadow-[0_18px_40px_-14px_rgba(0,0,0,0.92),0_0_0_1px_rgba(255,255,255,0.06)]"
        />
      </div>
    );
  }
  const body = {
    web: <div className="space-y-2"><div className="h-3 w-1/3 rounded bg-primary/70" /><div className="h-16 rounded bg-foreground/10" /><div className="grid grid-cols-3 gap-2"><div className="h-10 rounded bg-foreground/10" /><div className="h-10 rounded bg-foreground/10" /><div className="h-10 rounded bg-foreground/10" /></div></div>,
    app: <div className="space-y-2">{["Goal: Finish DSA module", "Reflection: Week 3", "Progress 68%"].map((t) => <div key={t} className="flex items-center gap-2 rounded bg-foreground/10 px-3 py-2 text-[10px] text-muted-foreground"><span className="h-2 w-2 rounded-full bg-primary" />{t}</div>)}</div>,
    ai: <div className="space-y-2 text-[10px]"><div className="ml-auto w-2/3 rounded-lg bg-primary/30 px-3 py-2">Explain recursion from my notes?</div><div className="w-3/4 rounded-lg bg-foreground/10 px-3 py-2 text-muted-foreground">Based on your notes, recursion is…</div></div>,
    api: <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words font-mono text-[10px] leading-relaxed text-muted-foreground"><span className="text-primary">GET</span> /expenses?month=10{"\n"}{"{"}{"\n"}  "total": 1240.5,{"\n"}  "items": [ ... ]{"\n"}{"}"}</pre>,
  }[p.visual];
  return (
    <div className="project-card-media grid-bg flex h-full items-center justify-center p-8">
      <div className="glass w-full max-w-xs rounded-xl p-4">{body}</div>
    </div>
  );
}

function ProjectCard({ project: p, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);
  const interactiveRef = useRef(false);
  const inView = useReplayInView(cardRef, 0.12);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const updateInteractive = () => {
      const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      interactiveRef.current = canHover && !reduced;
      if (!interactiveRef.current && tiltRef.current) {
        tiltRef.current.style.setProperty("--tilt-rx", "0deg");
        tiltRef.current.style.setProperty("--tilt-ry", "0deg");
      }
    };
    updateInteractive();
    window.addEventListener("resize", updateInteractive);
    return () => {
      window.removeEventListener("resize", updateInteractive);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!interactiveRef.current || e.pointerType !== "mouse" || !tiltRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = Math.max(0, Math.min(1, (e.clientX - rect.left) / Math.max(1, rect.width)));
    const py = Math.max(0, Math.min(1, (e.clientY - rect.top) / Math.max(1, rect.height)));
    const rx = ((0.5 - py) * 6).toFixed(2);
    const ry = ((px - 0.5) * 6).toFixed(2);
    const spotX = `${(px * 100).toFixed(1)}%`;
    const spotY = `${(py * 100).toFixed(1)}%`;

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const target = tiltRef.current;
      if (!target) return;
      target.style.setProperty("--tilt-rx", `${rx}deg`);
      target.style.setProperty("--tilt-ry", `${ry}deg`);
      target.style.setProperty("--spot-x", spotX);
      target.style.setProperty("--spot-y", spotY);
    });
  };

  const resetCardTilt = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const target = tiltRef.current;
    if (!target) return;
    target.style.setProperty("--tilt-rx", "0deg");
    target.style.setProperty("--tilt-ry", "0deg");
  };

  const colDelayMs = (index % 2) * 30;
  const titleWordsCount = p.title.split(" ").length;
  const descWordsCount = p.description.split(" ").length;
  const descStartMs = colDelayMs + 25 + titleWordsCount * 14;
  const descEndMs = descStartMs + Math.min(descWordsCount * 6, 90);
  const techStartMs = descEndMs + 10;
  const techCount = p.techLogos ? p.techLogos.length : p.tech.length;
  const linksStartMs = techStartMs + Math.min(techCount * 12, 80);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetCardTilt}
      className={`project-card-shell relative h-full work-reveal-root ${inView ? "is-inview" : ""}`}
    >
      <motion.div
        className="h-full"
        initial={reduceMotion ? false : { opacity: 0.94, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.01 }}
        transition={{ duration: 0.24, delay: 0, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="project-card-lift relative h-full">
          <article
            ref={tiltRef}
            className="project-card-tilt group relative z-10 flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card"
          >
            <span aria-hidden className="project-card-spotlight pointer-events-none z-20" />
            <span aria-hidden className="project-card-sheen pointer-events-none z-20" />
            <div className="relative aspect-[16/10] shrink-0 overflow-hidden border-b border-border">
              <ProjectVisual p={p} eager={index < 2} />
              <span
                className="project-card-index work-chip absolute left-4 top-4 z-20 font-display text-3xl text-primary"
                style={{ "--work-delay": `${colDelayMs + 10}ms` } as CSSProperties}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              {p.status && (
                <span
                  className="work-chip absolute right-4 top-4 z-20 rounded-full border border-border bg-background/70 px-3 py-1 text-[10px] tracking-widest"
                  style={{ "--work-delay": `${colDelayMs + 20}ms` } as CSSProperties}
                >
                  {p.status.toUpperCase()}
                </span>
              )}
              <span aria-hidden className="project-card-divider pointer-events-none absolute inset-x-0 bottom-0 z-20 h-px" />
            </div>
            <div className="flex flex-1 flex-col p-6 md:p-8">
              <h3 className="project-card-title font-heading text-2xl font-bold tracking-[-0.015em] text-zinc-100 group-hover:text-white">
                {renderStaggeredWords(p.title, "work-word", colDelayMs + 15, 16)}
              </h3>
              <p className="mt-3 text-muted-foreground">
                {renderStaggeredWords(p.description, "work-word", descStartMs, 6)}
              </p>
              {p.techLogos ? (
                <ul className="mt-5 flex min-h-[26px] flex-wrap items-center gap-x-3 gap-y-1">
                  {p.techLogos.map(({ name, icon: Icon, color }, idx) => (
                    <li
                      key={name}
                      className="work-chip inline-flex items-center gap-1.5 py-0.5 text-[11px] font-medium text-zinc-300/90 transition-colors duration-300 group-hover:text-zinc-200 hover:!text-white"
                      style={{ "--work-delay": `${techStartMs + idx * 12}ms` } as CSSProperties}
                    >
                      <Icon size={13} style={{ color }} className="shrink-0" aria-hidden />
                      <span>{name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.tech.map((t, idx) => (
                    <li
                      key={t}
                      className="work-chip rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground"
                      style={{ "--work-delay": `${techStartMs + idx * 12}ms` } as CSSProperties}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-auto pt-6 flex flex-wrap gap-3">
                {p.links.map((l, idx) => (
                  <span
                    key={l.label}
                    className="work-chip inline-block"
                    style={{ "--work-delay": `${linksStartMs + idx * 20}ms` } as CSSProperties}
                  >
                    <SafeLink
                      url={l.url}
                      className="project-card-cta inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.025] px-4 py-2 text-[11px] font-semibold tracking-widest text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:!border-[rgba(255,140,70,0.6)] hover:!bg-[rgba(255,115,35,0.1)] hover:text-[#ff8a4c] hover:!shadow-[0_10px_24px_-10px_rgba(255,115,35,0.45),inset_0_1px_0_rgba(255,195,145,0.22)] active:scale-[0.99]"
                    >
                      {l.label.includes("Code") ? <Github size={13} aria-hidden /> : <ExternalLink size={13} aria-hidden />}
                      <span>{l.label.toUpperCase()}</span>
                      <span aria-hidden className="project-card-arrow inline-block">↗</span>
                    </SafeLink>
                  </span>
                ))}
              </div>
            </div>
          </article>
        </div>
      </motion.div>
    </div>
  );
}

export function Projects() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useReplayInView(headRef, 0.15);

  const renderedWorkHeading = renderStaggeredWordLines({
    lines: workHeadlineLines,
    wordClassName: "work-word",
    delayVar: "--work-delay",
    staggerMs: 26,
    startDelayMs: 10,
  });

  return (
    <section id="work" className={workSection}>
      <div ref={headRef} className={`mb-12 md:mb-16 work-reveal-root ${headInView ? "is-inview" : ""}`}>
        <p className="work-eyebrow mb-4 font-mono text-xs tracking-[0.3em] text-primary">
          02 / SELECTED WORK
        </p>
        <h2 className="font-display text-[2.15rem] leading-[0.95] uppercase text-foreground sm:text-5xl md:text-7xl">
          <span className="sr-only">Projects that turn ideas into reality.</span>
          <span aria-hidden="true">{renderedWorkHeading}</span>
        </h2>
      </div>
      <div className="grid gap-6 md:auto-rows-fr md:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={p.title} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}

export function Skills() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useReplayInView(headRef, 0.15);

  const renderedSkillsHeading = renderStaggeredWordLines({
    lines: skillsHeadlineLines,
    wordClassName: "work-word",
    delayVar: "--work-delay",
    staggerMs: 26,
    startDelayMs: 10,
  });

  return (
    <section id="skills" className={skillsSection}>
      <div ref={headRef} className={`mb-12 md:mb-16 work-reveal-root ${headInView ? "is-inview" : ""}`}>
        <p className="work-eyebrow mb-4 font-mono text-xs tracking-[0.3em] text-primary">
          03 / TECHNICAL SKILLS
        </p>
        <h2 className="font-display text-[2.15rem] leading-[0.95] uppercase text-foreground sm:text-5xl md:text-7xl">
          <span className="sr-only">The tools behind the work.</span>
          <span aria-hidden="true">{renderedSkillsHeading}</span>
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g, i) => (
          <Reveal key={g.title} delay={i * 0.05} className="h-full">
            <div className="skills-card-shell relative h-full">
              <article className="skills-card relative z-10 flex h-full flex-col rounded-2xl border border-white/[0.09] bg-[#131317]/75 p-6 backdrop-blur-xl">
                <h4 className="mb-5 font-mono text-xs tracking-[0.18em] text-primary">{g.title.toUpperCase()}</h4>
                <ul className="flex flex-wrap gap-2">
                  {g.items.map(({ name, icon: Icon, color }) => (
                    <li
                      key={name}
                      className="group/pill inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[13px] font-medium text-zinc-200 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[rgba(255,140,70,0.48)] hover:bg-white/[0.06] hover:text-white"
                    >
                      {Icon && (
                        <Icon
                          size={15}
                          style={{ color }}
                          aria-hidden
                          className="shrink-0 transition-transform duration-300 group-hover/pill:scale-110"
                        />
                      )}
                      <span>{name}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function StaggeredSectionHead({
  label,
  plainText,
  accentText,
  className = "mb-12 md:mb-16",
}: {
  label: string;
  plainText: string;
  accentText: string;
  className?: string;
}) {
  const headRef = useRef<HTMLDivElement>(null);
  const inView = useReplayInView(headRef, 0.15);
  const plainWords = plainText.split(" ").filter(Boolean);
  const accentWords = accentText.split(" ").filter(Boolean);
  const totalAccentChars = accentWords.reduce((sum, w) => sum + w.length, 0);
  let wordIdx = 0;
  let accentCharOffset = 0;

  return (
    <div ref={headRef} className={`${className} work-reveal-root ${inView ? "is-inview" : ""}`}>
      <p className="work-eyebrow mb-4 font-mono text-xs tracking-[0.3em] text-primary">
        {label}
      </p>
      <h2 className="font-display text-[2.15rem] leading-[0.95] uppercase text-foreground sm:text-5xl md:text-7xl">
        <span className="sr-only">{`${plainText} ${accentText}`}</span>
        <span aria-hidden="true">
          {plainWords.map((word, idx) => (
            <span key={`p-${idx}`}>
              <span
                className="work-word inline-block"
                style={{ "--work-delay": `${10 + wordIdx++ * 26}ms` } as CSSProperties}
              >
                {word}
              </span>{" "}
            </span>
          ))}
          {accentWords.map((word, idx) => {
            const startChar = accentCharOffset;
            accentCharOffset += word.length;
            const delayMs = 10 + wordIdx++ * 26;
            const denom = Math.max(1, totalAccentChars - word.length);
            const style: CSSProperties =
              accentWords.length === 1
                ? ({ "--work-delay": `${delayMs}ms` } as CSSProperties)
                : ({
                    "--work-delay": `${delayMs}ms`,
                    backgroundImage: "var(--gradient-accent)",
                    backgroundSize: `${((totalAccentChars / Math.max(1, word.length)) * 100).toFixed(2)}% 100%`,
                    backgroundPosition: `${((startChar / denom) * 100).toFixed(2)}% 0%`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  } as CSSProperties);

            return (
              <span key={`a-${idx}`}>
                <span
                  className={`work-word inline-block ${accentWords.length === 1 ? "text-gradient-accent" : ""}`}
                  style={style}
                >
                  {word}
                </span>
                {idx < accentWords.length - 1 ? " " : ""}
              </span>
            );
          })}
        </span>
      </h2>
    </div>
  );
}

export function Education() {
  return (
    <section id="education" className={educationSection}>
      <StaggeredSectionHead label="04 / EDUCATION" plainText="Academic" accentText="foundation." />

      <div className="grid gap-6">
        {education.map((ed, i) => {
          const BadgeIcon = ed.icon;
          return (
            <Reveal key={`${ed.degree}-${i}`} delay={i * 0.08}>
              <div className="edu-card-shell relative">
                <article className="edu-card group relative z-10 overflow-hidden rounded-3xl border border-white/[0.09] bg-[#131317]/80 p-6 backdrop-blur-xl md:p-8">
                  <span aria-hidden className="edu-card-sheen pointer-events-none z-20" />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(229,57,53,0.65)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-primary/30 bg-primary/15 text-primary shadow-[0_0_24px_-6px_rgba(255,115,35,0.45),inset_0_1px_0_rgba(255,190,145,0.2)] transition-all duration-300 group-hover:scale-105 group-hover:border-primary/55 group-hover:shadow-[0_0_28px_-4px_rgba(255,115,35,0.65)]">
                        <BadgeIcon size={21} aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] tracking-widest text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar size={12} className="text-primary/80" aria-hidden />
                            {ed.dates.toUpperCase()}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={12} className="text-primary/80" aria-hidden />
                            {ed.location.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="mt-2 font-heading text-xl font-bold tracking-[-0.015em] text-zinc-100 transition-colors duration-300 group-hover:text-white sm:text-2xl">
                          {ed.degree}
                        </h3>
                        <p className="mt-0.5 text-sm font-medium text-primary sm:text-base">{ed.institution}</p>
                      </div>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[10px] tracking-[0.2em] text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(255,115,35,0.9)]" aria-hidden />
                      {ed.badge.toUpperCase()}
                    </span>
                  </div>

                  <div aria-hidden className="my-5 h-px w-full bg-gradient-to-r from-white/10 via-white/[0.04] to-transparent" />

                  <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {ed.description}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {ed.highlights.map(({ label, icon: HighlightIcon, color }) => (
                      <li
                        key={label}
                        className="group/pill inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-xs font-medium text-zinc-200 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[rgba(229,57,53,0.58)] hover:bg-white/[0.06] hover:text-white"
                      >
                        <HighlightIcon
                          size={14}
                          style={{ color }}
                          aria-hidden
                          className="shrink-0 transition-transform duration-300 group-hover/pill:scale-110"
                        />
                        <span>{label}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section id="experience" className={experienceSection}>
      <StaggeredSectionHead label="05 / EXPERIENCE" plainText="My journey" accentText="so far." />
      <ol className="relative ml-2 border-l border-white/15 pl-5 sm:ml-3 sm:pl-8">
        {experience.map((e, i) => (
          <Reveal key={`${e.org}-${i}`} delay={i * 0.08} className="relative mb-10 last:mb-0">
            <span
              aria-hidden
              className="absolute -left-[27px] top-8 h-3.5 w-3.5 rounded-full bg-gradient-accent ring-4 ring-[#121215] shadow-[0_0_18px_rgba(229,57,53,0.85)] sm:-left-[39px]"
            />
            <div className="exp-card-shell relative">
              <article className="exp-card group relative z-10 overflow-hidden rounded-3xl border border-white/[0.09] bg-[#131317]/80 p-6 backdrop-blur-xl md:p-8">
                <span aria-hidden className="edu-card-sheen pointer-events-none z-20" />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(229,57,53,0.65)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] tracking-widest text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={12} className="text-primary/80" aria-hidden />
                        {e.dates.toUpperCase()}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={12} className="text-primary/80" aria-hidden />
                        {e.duration.toUpperCase()}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={12} className="text-primary/80" aria-hidden />
                        {e.location.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-4">
                      <img
                        src={e.logo}
                        alt={`${e.org} logo`}
                        className="h-12 w-12 shrink-0 object-contain drop-shadow-[0_4px_14px_rgba(255,215,90,0.3)] transition-transform duration-300 group-hover:scale-105 sm:h-[52px] sm:w-[52px]"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-heading text-xl font-bold leading-tight tracking-[-0.015em] text-zinc-100 transition-colors duration-300 group-hover:text-white sm:text-2xl">
                          {e.role}
                        </h3>
                        <p className="mt-1 text-sm font-medium leading-tight text-primary sm:text-base">{e.org}</p>
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[10px] tracking-[0.2em] text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(229,57,53,0.9)]" aria-hidden />
                    {e.badge.toUpperCase()}
                  </span>
                </div>

                <div aria-hidden className="my-5 h-px w-full bg-gradient-to-r from-white/10 via-white/[0.04] to-transparent" />

                <ul className="space-y-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {e.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {e.tech.map(({ name, icon: TechIcon, color }) => (
                    <li
                      key={name}
                      className="group/pill inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-xs font-medium text-zinc-200 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[rgba(229,57,53,0.58)] hover:bg-white/[0.06] hover:text-white"
                    >
                      <TechIcon
                        size={14}
                        style={{ color }}
                        aria-hidden
                        className="shrink-0 transition-transform duration-300 group-hover/pill:scale-110"
                      />
                      <span>{name}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

export function Approach() {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useReplayInView(headRef, 0.15);

  const renderedApproachHeading = renderStaggeredWordLines({
    lines: approachHeadlineLines,
    wordClassName: "work-word",
    delayVar: "--work-delay",
    staggerMs: 26,
    startDelayMs: 10,
  });

  const items = [
    ["Understand the Problem", "I focus on understanding the requirements before choosing a solution."],
    ["Build with Purpose", "I aim to create useful, maintainable, and user-friendly applications."],
    ["Learn and Improve", "I continuously improve my problem-solving skills and technical knowledge."],
  ];
  return (
    <section id="approach" className={approachSection}>
      <div ref={headRef} className={`mb-12 md:mb-16 work-reveal-root ${headInView ? "is-inview" : ""}`}>
        <p className="work-eyebrow mb-4 font-mono text-xs tracking-[0.3em] text-primary">
          HOW I WORK
        </p>
        <h2 className="font-display text-[2.15rem] leading-[0.95] uppercase text-foreground sm:text-5xl md:text-7xl">
          <span className="sr-only">Good code solves real problems.</span>
          <span aria-hidden="true">{renderedApproachHeading}</span>
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map(([t, d], i) => (
          <Reveal key={t} delay={i * 0.1}>
            <div className="group h-full rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-glow">
              <span className="font-display text-6xl text-primary/80 transition-colors group-hover:text-primary">0{i + 1}</span>
              <h3 className="mt-6 font-heading text-xl font-bold">{t}</h3>
              <p className="mt-3 text-muted-foreground">{d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
