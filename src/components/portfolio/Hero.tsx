import { motion, useReducedMotion } from "framer-motion";
import { Code2, Brain, Puzzle, User, Folder, Briefcase, Sparkles, ChevronDown } from "lucide-react";
import { profile, stats, techStrip } from "@/data/portfolio";

const floatCards = [
  { label: "FULL-STACK DEVELOPER", icon: Code2, pos: "left-0 top-[12%]", d: 0 },
  { label: "AI ENTHUSIAST", icon: Brain, pos: "right-0 top-[38%]", d: 1.2 },
  { label: "PROBLEM SOLVER", icon: Puzzle, pos: "left-[6%] bottom-[8%]", d: 2.4 },
];
const statIcons = { folder: Folder, briefcase: Briefcase, code: Code2, sparkles: Sparkles };

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-12 pt-12 md:px-8 lg:grid-cols-[1.15fr_1fr] lg:pt-20">
        <motion.div initial={reduce ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="mb-6 flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-primary">
            <span className="h-px w-8 bg-primary" />FULL-STACK DEVELOPER & AI ENTHUSIAST
          </p>
          <h1 className="font-display text-[13vw] leading-[0.9] uppercase sm:text-7xl lg:text-[4.4rem] xl:text-[5.2rem]">
            Building digital<br />experiences that<br /><span className="text-gradient-accent">create real impact.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
            I build modern web applications, interactive interfaces, and practical AI-powered tools that solve real-world problems.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#work" className="rounded-full bg-gradient-accent px-7 py-4 text-xs font-semibold tracking-widest text-primary-foreground shadow-glow transition-transform hover:scale-105">VIEW MY WORK ↗</a>
            <a href={profile.resumeUrl} download className="rounded-full border border-border px-7 py-4 text-xs font-semibold tracking-widest transition-colors hover:border-primary hover:text-primary">DOWNLOAD RESUME ↓</a>
          </div>
        </motion.div>

        <div className="relative mx-auto aspect-square w-full max-w-[480px]">
          <div className="absolute inset-[10%] rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute inset-[8%] rounded-full border-2 border-primary shadow-glow" />
          <div className="absolute inset-[14%] overflow-hidden rounded-full border border-border bg-gradient-to-b from-secondary to-background">
            {profile.portrait ? (
              <img src={profile.portrait} alt={`Portrait of ${profile.name}`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                <span className="font-display text-7xl text-foreground/90">{profile.initials}</span>
                <User size={20} />
                <span className="font-mono text-[10px] tracking-[0.25em]">YOUR PORTRAIT HERE</span>
              </div>
            )}
          </div>
          {floatCards.map(({ label, icon: Icon, pos, d }) => (
            <motion.div key={label} className={`glass absolute ${pos} flex items-center gap-2 rounded-xl px-3 py-2 sm:px-4 sm:py-3`}
              animate={reduce ? undefined : { y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, delay: d, ease: "easeInOut" }}>
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/15 text-primary"><Icon size={15} /></span>
              <span className="text-[10px] font-semibold tracking-widest sm:text-xs">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <a href="#about" className="mx-auto mb-10 hidden w-fit flex-col items-center gap-1 text-[10px] tracking-[0.3em] text-muted-foreground hover:text-primary md:flex">
        SCROLL <ChevronDown size={16} className="motion-safe:animate-bounce" />
      </a>

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-card/60 lg:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = statIcons[s.icon];
            return (
              <div key={s.label} className={`flex items-center gap-4 p-5 md:p-6 ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""} border-border`}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15 text-primary"><Icon size={18} /></span>
                <div className="min-w-0">
                  <p className="truncate font-heading text-lg font-bold md:text-2xl">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center gap-6 border-y border-border py-6">
          <p className="shrink-0 font-mono text-[10px] tracking-[0.3em] text-muted-foreground">TECH I WORK WITH</p>
          <ul className="no-scrollbar flex gap-6 overflow-x-auto">
            {techStrip.map(({ name, icon: Icon }) => (
              <li key={name} className="group flex shrink-0 items-center gap-2 text-muted-foreground transition-all hover:-translate-y-0.5 hover:text-primary">
                <Icon size={18} aria-hidden /><span className="text-xs">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
