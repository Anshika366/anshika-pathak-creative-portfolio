import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({ label, title }: { label: string; title: ReactNode }) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <p className="mb-4 font-mono text-xs tracking-[0.3em] text-primary">{label}</p>
      <h2 className="font-display text-4xl leading-[0.95] uppercase text-foreground sm:text-5xl md:text-7xl">{title}</h2>
    </Reveal>
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
