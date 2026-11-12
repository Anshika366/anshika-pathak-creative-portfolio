import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({ label, title }: { label: string; title: ReactNode }) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <p className="mb-4 font-mono text-xs tracking-[0.3em] text-primary">{label}</p>
      <h2 className="font-display text-[2.15rem] leading-[0.95] uppercase text-foreground sm:text-5xl md:text-7xl">{title}</h2>
    </Reveal>
  );
}

/** Triggers on viewport entry and silently resets once completely outside the viewport. */
export function useReplayInView<T extends HTMLElement>(ref: RefObject<T | null>, minRatio = 0.15) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (!entry.isIntersecting) {
          setInView(false);
        } else if (entry.intersectionRatio >= minRatio || entry.boundingClientRect.height < window.innerHeight * 0.2) {
          setInView(true);
        }
      },
      { threshold: [0, minRatio] },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, minRatio]);

  return inView;
}

export type AnimatedHeadSegment = { readonly text: string; readonly accent?: boolean };

/** Renders section headings with the site's staggered word-by-word scroll reveal. */
export function AnimatedSectionHead({
  label,
  lines,
  inline = false,
  className = "mb-12 md:mb-16",
}: {
  label: string;
  lines: readonly AnimatedHeadSegment[];
  inline?: boolean;
  className?: string;
}) {
  const headRef = useRef<HTMLDivElement>(null);
  const inView = useReplayInView(headRef, 0.15);
  const fullText = lines.map((l) => l.text.trim()).filter(Boolean).join(" ");
  let wordIdx = 0;

  return (
    <div ref={headRef} className={`${className} work-reveal-root ${inView ? "is-inview" : ""}`}>
      <p className="work-eyebrow mb-4 font-mono text-xs tracking-[0.3em] text-primary">{label}</p>
      <h2 className="font-display text-[2.15rem] leading-[0.95] uppercase text-foreground sm:text-5xl md:text-7xl">
        <span className="sr-only">{fullText}</span>
        <span aria-hidden="true">
          {lines.map((segment, segIdx) => {
            const words = segment.text.split(" ").filter(Boolean);
            const totalChars = words.reduce((sum, w) => sum + w.length, 0);
            let charOffset = 0;

            const renderedWords = words.map((word, wIdx) => {
              const delayMs = 40 + wordIdx++ * 65;
              const startChar = charOffset;
              charOffset += word.length;
              const useSplitGradient = Boolean(segment.accent && words.length > 1);
              const style: CSSProperties = useSplitGradient
                ? ({
                    "--work-delay": `${delayMs}ms`,
                    backgroundImage: "var(--gradient-accent)",
                    backgroundSize: `${((totalChars / Math.max(1, word.length)) * 100).toFixed(2)}% 100%`,
                    backgroundPosition: `${((startChar / Math.max(1, totalChars - word.length)) * 100).toFixed(2)}% 0%`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  } as CSSProperties)
                : ({ "--work-delay": `${delayMs}ms` } as CSSProperties);

              return (
                <span key={`${segIdx}-${wIdx}`}>
                  <span
                    className={`work-word inline-block ${segment.accent && !useSplitGradient ? "text-gradient-accent" : ""}`}
                    style={style}
                  >
                    {word}
                  </span>
                  {wIdx < words.length - 1 ? " " : ""}
                </span>
              );
            });

            if (inline) {
              return (
                <span key={segIdx}>
                  {renderedWords}
                  {segIdx < lines.length - 1 ? " " : ""}
                </span>
              );
            }

            return (
              <span key={segIdx} className="block">
                {renderedWords}
              </span>
            );
          })}
        </span>
      </h2>
    </div>
  );
}

export function SafeLink({ url, children, className }: { url: string; children: ReactNode; className?: string }) {
  if (!url)
    return (
      <span title="Link coming soon" aria-disabled="true" className={`${className} cursor-not-allowed opacity-50`}>
        {children}
      </span>
    );
  return (
    <a href={url} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  );
}
