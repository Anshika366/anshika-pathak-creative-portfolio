import { useEffect, useRef, useState, type MouseEvent } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Code2, Brain, Puzzle, User, Folder, Cpu, Sparkles, ArrowUpRight } from "lucide-react";
import { profile, stats, techStrip } from "@/data/portfolio";

const floatCards = [
  {
    label: "FULL-STACK DEVELOPER",
    icon: Code2,
    pos: "left-0 top-[54%] max-w-[120px] sm:-left-10 sm:top-[23%] sm:max-w-[162px] lg:-left-16 lg:top-[22%] lg:max-w-[168px]",
    duration: "5.4s",
    delay: "0s",
  },
  {
    label: "AI ENTHUSIAST",
    icon: Brain,
    pos: "right-0 top-[34%] max-w-[126px] sm:-right-10 sm:top-[35%] sm:max-w-none lg:-right-14 lg:top-[34%] xl:-right-16",
    duration: "6.2s",
    delay: "0.8s",
  },
  {
    label: "PROBLEM SOLVER",
    icon: Puzzle,
    pos: "right-0 bottom-[7%] max-w-[132px] sm:-right-8 sm:bottom-[13%] sm:max-w-none lg:-right-10 lg:bottom-[13%] xl:-right-12",
    duration: "4.8s",
    delay: "1.5s",
  },
];
const statIcons = { folder: Folder, cpu: Cpu, code: Code2, sparkles: Sparkles };

function TechMarqueeStrip() {
  return (
    <div className="relative mt-14 w-full overflow-hidden border-y border-white/10 bg-[#0c0c0f]/45 backdrop-blur-sm sm:mt-16">

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(255,77,45,0.22)_0%,rgba(255,95,45,0.58)_50%,rgba(255,77,45,0.22)_100%)] shadow-[0_0_14px_rgba(255,77,45,0.35)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,rgba(255,77,45,0.16)_0%,rgba(255,77,45,0.42)_50%,rgba(255,77,45,0.16)_100%)] shadow-[0_0_12px_rgba(255,77,45,0.25)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,77,45,0.09)_0%,transparent_65%),radial-gradient(ellipse_at_50%_100%,rgba(255,77,45,0.06)_0%,transparent_65%)]"
      />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center">

        <div className="flex shrink-0 items-center gap-2.5 border-b border-white/10 py-3 pr-5 sm:border-b-0 sm:border-r sm:py-5 sm:pr-6">
          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_rgba(255,77,45,0.95)]" />
          <p className="whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.26em] text-zinc-200">
            TECH I WORK WITH
          </p>
        </div>


        <div className="min-w-0 flex-1 py-4 sm:py-5 sm:pl-6">
          <div
            className="tech-marquee-viewport min-w-0 w-full overflow-hidden py-1"
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, black 12px, black calc(100% - 12px), transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12px, black calc(100% - 12px), transparent 100%)",
            }}
          >
            <div className="tech-marquee-track flex w-max items-center">
              {[0, 1].map((copyIdx) => (
                <ul
                  key={copyIdx}
                  aria-hidden={copyIdx === 1 || undefined}
                  className={`no-scrollbar flex shrink-0 items-center gap-8 pr-8 sm:gap-10 sm:pr-10 ${copyIdx === 1 ? "tech-marquee-duplicate" : ""}`}
                >
                  {techStrip.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li
                        key={`${copyIdx}-${item.name}`}
                        className="group relative flex shrink-0 items-center gap-2.5 py-0.5 transition-transform duration-300 ease-out hover:-translate-y-0.5"
                      >
                        <span
                          aria-hidden
                          className="pointer-events-none absolute -inset-x-2.5 -inset-y-1.5 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
                          style={{
                            background: `radial-gradient(circle, ${item.color}30 0%, rgba(255,77,45,0.18) 60%, transparent 82%)`,
                          }}
                        />
                        <Icon
                          size={20}
                          className="relative z-10 shrink-0 transition-transform duration-300 group-hover:scale-110"
                          style={{ color: item.color }}
                          aria-hidden
                        />
                        <span className="relative z-10 whitespace-nowrap text-[13px] font-medium tracking-wide text-zinc-300 transition-colors duration-300 group-hover:text-white">
                          {item.name}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const headlineLines = [
  { text: "Turning Ideas", accent: false },
  { text: "Into Intelligent", accent: false },
  { text: "Digital Experiences.", accent: true },
] as const;

function AnimatedStatValue({ value, active, delay, reduce }: { value: string; active: boolean; delay: number; reduce: boolean | null }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : null;
  const suffix = match ? match[2] : "";
  const [count, setCount] = useState(target ?? 0);

  useEffect(() => {
    if (target === null || reduce || !active) return;
    const controls = animate(0, target, {
      duration: 0.48,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setCount(Math.round(latest)),
    });
    return () => controls.stop();
  }, [active, delay, reduce, target]);

  if (target === null || reduce) return <>{value}</>;
  return <>{`${count}${suffix}`}</>;
}

export function Hero() {
  const reduce = useReducedMotion();
  const [parallaxEnabled, setParallaxEnabled] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsInView, setStatsInView] = useState(true);


  useEffect(() => {
    const el = statsRef.current;
    if (!el || reduce) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setStatsInView((prev) => {
            if (!prev && entry.isIntersecting && entry.intersectionRatio >= 0.05) return true;
            if (prev && !entry.isIntersecting) return false;
            return prev;
          });
        }
      },
      { threshold: [0, 0.05] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduce]);

  // Precompute continuous non-space character indices for crisp immediate display with subtle motion
  let charCounter = 0;
  const renderedHeadline = headlineLines.map((line, lineIdx) => {
    const lineNonSpaceChars = line.text.replace(/\s+/g, "").length;
    let lineCharIdx = 0;
    const words = line.text.split(" ");
    return (
      <span key={line.text} className="block">
        {words.map((word, wIdx) => (
          <span key={`${lineIdx}-${wIdx}`} className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, cIdx) => {
              const globalIdx = charCounter++;
              const posInLine = lineCharIdx++;
              const accentGradientStyle = line.accent
                ? {
                  backgroundSize: `${lineNonSpaceChars * 100}% 100%`,
                  backgroundPosition: `${(posInLine / Math.max(1, lineNonSpaceChars - 1)) * 100}% 0%`,
                }
                : undefined;
              return (
                <motion.span
                  key={`${lineIdx}-${wIdx}-${cIdx}`}
                  {...(accentGradientStyle ? { style: accentGradientStyle } : {})}
                  className={`inline-block ${line.accent ? "text-gradient-accent" : ""}`}
                  initial={reduce ? false : { y: 6 }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: reduce ? 0 : 0.22,
                    delay: reduce ? 0 : Math.min(globalIdx * 0.004, 0.14),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {ch}
                </motion.span>
              );
            })}
            {wIdx < words.length - 1 ? "\u00A0" : ""}
          </span>
        ))}
      </span>
    );
  });

  // Subtle mouse-based depth values (desktop fine pointer only)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 90, damping: 22, mass: 0.6 });
  const smoothY = useSpring(rawY, { stiffness: 90, damping: 22, mass: 0.6 });

  const ambientX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const ambientY = useTransform(smoothY, [-1, 1], [-8, 8]);
  const haloX = useTransform(smoothX, [-1, 1], [-6, 6]);
  const haloY = useTransform(smoothY, [-1, 1], [-5, 5]);
  const portraitX = useTransform(smoothX, [-1, 1], [4, -4]);
  const portraitY = useTransform(smoothY, [-1, 1], [2, 0]);
  const cardX = useTransform(smoothX, [-1, 1], [6, -6]);
  const cardY = useTransform(smoothY, [-1, 1], [4, -4]);

  useEffect(() => {
    const check = () => {
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      setParallaxEnabled(!reduce && finePointer && window.innerWidth >= 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [reduce]);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!parallaxEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    rawX.set(Math.max(-1, Math.min(1, nx)));
    rawY.set(Math.max(-1, Math.min(1, ny)));
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const portraitSrc = profile.portrait || "/images/portfolio-portrait.png";
  return (
    <section
      id="top"
      className="relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-end gap-8 px-5 pb-0 pt-10 md:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:pt-14">
        <div className="min-w-0 pb-4 lg:self-center lg:pb-14">
          <p className="mb-6 flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-primary">
            <span className="h-px w-8 bg-primary" />FULL-STACK DEVELOPER & AI ENTHUSIAST
          </p>
          <h1 className="font-display text-[clamp(2.45rem,11.6vw,4.5rem)] leading-[0.9] uppercase sm:text-7xl lg:text-[3.85rem] xl:text-[4.85rem] 2xl:text-[5.2rem]">
            <span className="sr-only">Turning Ideas Into Intelligent Digital Experiences.</span>
            <span aria-hidden="true">{renderedHeadline}</span>
          </h1>
          <motion.p
            className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg"
            initial={reduce ? false : { y: 6 }}
            animate={{ y: 0 }}
            transition={{ duration: reduce ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            I build modern web applications, intuitive user experiences, secure backend systems, and practical AI-powered tools that solve real-world problems.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-3 sm:gap-4"
            initial={reduce ? false : { y: 8 }}
            animate={{ y: 0 }}
            transition={{ duration: reduce ? 0 : 0.26, delay: reduce ? 0 : 0.04, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#work" className="rounded-full bg-gradient-accent px-5 py-3.5 text-center text-xs font-semibold tracking-widest text-primary-foreground shadow-glow transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_0_48px_-4px_color-mix(in_oklab,var(--primary)_78%,transparent)] active:scale-[0.99] sm:px-7 sm:py-4">VIEW MY WORK ↗</a>
            <a href={profile.resumeUrl} download className="rounded-full border border-border px-5 py-3.5 text-center text-xs font-semibold tracking-widest transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5 hover:text-primary hover:shadow-[0_0_24px_-8px_color-mix(in_oklab,var(--primary)_45%,transparent)] active:scale-[0.99] sm:px-7 sm:py-4">DOWNLOAD RESUME ↓</a>
          </motion.div>
        </div>

        <div className="relative mx-auto flex w-full min-w-0 max-w-[388px] items-end justify-center sm:max-w-[480px] lg:max-w-[545px] lg:-translate-x-4 xl:-translate-x-6">
          <div className="relative aspect-[871/1024] w-full">
            {/* Multi-layered ambient radial orange lighting around hair, shoulders, and backdrop */}
            <motion.div
              aria-hidden
              {...(parallaxEnabled ? { style: { x: ambientX, y: ambientY } } : {})}
              className="pointer-events-none absolute -inset-x-[18%] -top-[12%] bottom-0 z-0"
            >
              <div className="animate-halo-breathe absolute left-[52%] top-[41%] h-[88%] w-[94%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,82,42,0.44)_0%,rgba(229,57,53,0.20)_44%,transparent_72%)] blur-3xl" />
              <div className="animate-halo-breathe absolute left-[52%] top-[28%] h-[54%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,118,52,0.34)_0%,rgba(255,77,45,0.12)_48%,transparent_74%)] blur-2xl" />
              <div className="absolute left-[52%] top-[62%] h-[62%] w-[98%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,76,38,0.28)_0%,rgba(229,57,53,0.1)_45%,transparent_70%)] blur-3xl" />
            </motion.div>

            {/* Glowing orange-red circular halo ring behind the portrait */}
            <motion.div
              aria-hidden
              {...(parallaxEnabled ? { style: { x: haloX, y: haloY } } : {})}
              className="pointer-events-none absolute left-[52%] top-[41%] z-[2] aspect-square w-[76%] -translate-x-1/2 -translate-y-1/2"
            >
              {/* Subtle luminous radial glow inside the circle */}
              <div className="animate-halo-breathe absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,110,48,0.24)_0%,rgba(255,72,38,0.14)_56%,rgba(255,85,38,0.38)_88%,transparent_100%)] blur-xl" />
              {/* Wide outer/inner blurred orange-red breathing bloom */}
              <div className="animate-halo-breathe absolute -inset-1 rounded-full border-[14px] border-[#ff521c]/70 blur-[22px] shadow-[0_0_96px_28px_rgba(255,77,45,0.62),inset_0_0_54px_14px_rgba(255,82,36,0.4)]" />
              {/* Tight warm neon edge glow (stable ring) */}
              <div className="absolute inset-0 rounded-full border-[5px] border-[#ff8243]/85 blur-[5px]" />
              {/* Crisp bright circular core (stable) */}
              <svg
                viewBox="0 0 400 400"
                className="relative h-full w-full overflow-visible drop-shadow-[0_0_12px_rgba(255,115,50,1)] drop-shadow-[0_0_32px_rgba(255,77,45,0.88)]"
              >
                <defs>
                  <linearGradient id="hero-halo-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffb26b" />
                    <stop offset="45%" stopColor="#ff5a26" />
                    <stop offset="100%" stopColor="#e53935" />
                  </linearGradient>
                </defs>
                <circle
                  cx="200"
                  cy="200"
                  r="194"
                  fill="none"
                  stroke="url(#hero-halo-ring)"
                  strokeWidth="4.2"
                />
              </svg>
            </motion.div>

            {/* Portrait positioned in front of the glowing ring (unmodified PNG, no CSS filters) */}
            <motion.div
              {...(parallaxEnabled ? { style: { x: portraitX, y: portraitY } } : {})}
              className="relative z-10 h-full w-full origin-bottom"
            >
              {portraitSrc ? (
                <img
                  src={portraitSrc}
                  alt={`Portrait of ${profile.name}`}
                  decoding="async"
                  fetchPriority="high"
                  className="block h-full w-full select-none object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_96%,transparent_100%)]"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                  <span className="font-display text-7xl text-foreground/90">{profile.initials}</span>
                  <User size={20} />
                  <span className="font-mono text-[10px] tracking-[0.25em]">YOUR PORTRAIT HERE</span>
                </div>
              )}
            </motion.div>

            {/* Floating glassmorphism cards positioned cleanly outside the portrait */}
            {floatCards.map(({ label, icon: Icon, pos, duration, delay }) => (
              <motion.div
                key={label}
                {...(parallaxEnabled ? { style: { x: cardX, y: cardY } } : {})}
                className={`absolute ${pos} z-20`}
              >
                <div
                  style={{ animationDuration: duration, animationDelay: delay }}
                  className="glass animate-float-gentle flex items-center gap-2 rounded-xl border-white/15 bg-black/65 px-2.5 py-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.65),0_0_24px_-8px_rgba(255,77,45,0.3)] sm:gap-2.5 sm:px-3.5 sm:py-2.5"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg border border-primary/25 bg-primary/15 text-primary sm:h-7 sm:w-7">
                    <Icon size={14} />
                  </span>
                  <span className="text-[9px] leading-tight font-semibold tracking-wider sm:text-[11px] sm:tracking-widest">
                    {label}
                  </span>
                  <ArrowUpRight size={11} className="hidden shrink-0 text-primary/75 sm:block" aria-hidden />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-20 mx-auto max-w-7xl px-5 md:px-8">
        <div
          ref={statsRef}
          className="relative grid grid-cols-2 overflow-hidden rounded-2xl border border-white/12 bg-[#0d0d0f]/75 shadow-[0_20px_50px_rgba(0,0,0,0.65),0_0_40px_-14px_rgba(255,77,45,0.28)] backdrop-blur-xl lg:grid-cols-4"
        >
          {/* Subtle top warm hairline & ambient radial illumination */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_5%,rgba(255,95,45,0.5)_50%,transparent_95%)]" />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,77,45,0.12)_0%,transparent_70%)]" />
          {stats.map((s, i) => {
            const Icon = statIcons[s.icon];
            const itemDelay = reduce ? 0 : i * 0.04;
            const revealed = !!reduce || statsInView;
            const snapReset = !revealed || !!reduce;
            return (
              <div
                key={s.label}
                className={`group relative flex items-center gap-2.5 p-3.5 transition-colors duration-300 hover:bg-white/[0.025] sm:gap-4 sm:p-5 lg:p-6 ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""} border-white/10`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_50%,rgba(255,77,45,0.11)_0%,transparent_72%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <motion.div
                  initial={false}
                  animate={revealed ? { y: 0, scale: 1 } : { y: -6, scale: 0.96 }}
                  transition={{ duration: snapReset ? 0 : 0.25, delay: snapReset ? 0 : itemDelay, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 shrink-0"
                >
                  {/* Settling cinematic orange glow on entry */}
                  <motion.span
                    aria-hidden
                    initial={false}
                    animate={revealed ? { opacity: 0.25, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: snapReset ? 0 : 0.35, delay: snapReset ? 0 : itemDelay, ease: [0.22, 1, 0.36, 1] }}
                    className="pointer-events-none absolute -inset-1.5 rounded-2xl bg-[radial-gradient(circle,rgba(255,85,40,0.65)_0%,transparent_72%)] blur-md"
                  />
                  <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-[0_0_18px_-6px_rgba(255,77,45,0.55)] transition-all duration-300 ease-out lg:group-hover:-translate-y-1 lg:group-hover:scale-105 group-hover:border-primary/65 group-hover:bg-primary/15 group-hover:shadow-[0_0_26px_-3px_rgba(255,77,45,0.82)] sm:h-11 sm:w-11">
                    <Icon size={18} strokeWidth={1.8} aria-hidden />
                  </span>
                </motion.div>
                <motion.div
                  initial={false}
                  animate={revealed ? { y: 0 } : { y: 4 }}
                  transition={{ duration: snapReset ? 0 : 0.24, delay: snapReset ? 0 : itemDelay, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 min-w-0"
                >
                  <p className="font-heading text-sm font-bold tabular-nums tracking-tight text-foreground transition-colors duration-300 group-hover:text-white sm:text-xl lg:text-2xl">
                    <AnimatedStatValue value={s.value} active={revealed} delay={itemDelay + 0.06} reduce={reduce} />
                  </p>
                  <p className="mt-0.5 font-mono text-[9px] font-medium uppercase leading-snug tracking-[0.1em] text-muted-foreground sm:text-[10px] sm:tracking-[0.2em]">
                    {s.label}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>

        <TechMarqueeStrip />
      </div>
    </section>
  );
}
