import { Layers, Lightbulb, BookOpen, Github, ExternalLink } from "lucide-react";
import { projects, skillGroups, experience, type Project } from "@/data/portfolio";
import { Reveal, SectionHead, SafeLink } from "./ui";

const section = "mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32 scroll-mt-16";

export function About() {
  const cards = [
    { t: "What I Build", d: "Full-stack web apps — responsive interfaces, REST APIs and the databases behind them.", i: Layers },
    { t: "How I Think", d: "Requirements first, then the simplest maintainable solution that actually solves the problem.", i: Lightbulb },
    { t: "What I'm Learning", d: "AI-powered tooling: retrieval-augmented generation, vector databases and automation workflows.", i: BookOpen },
  ];
  return (
    <section id="about" className={section}>
      <SectionHead label="01 / ABOUT ME" title={<>Developer by skill.<br /><span className="text-gradient-accent">Problem solver by mindset.</span></>} />
      <Reveal className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5 text-lg text-muted-foreground">
          <p>I'm a Full-Stack Developer who enjoys building web applications that are genuinely useful — the kind people open because they help, not because they have to.</p>
          <p>I've worked across frontend interfaces, backend APIs and databases, and I'm comfortable collaborating with others through Git-based workflows. I like learning new technologies and applying them to practical problems.</p>
          <a href="#experience" className="inline-block text-xs font-semibold tracking-widest text-primary hover:underline">MORE ABOUT ME ↗</a>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {cards.map(({ t, d, i: Icon }) => (
            <div key={t} className="glass rounded-2xl p-6 transition-colors hover:border-primary/50">
              <Icon className="mb-4 text-primary" size={22} />
              <h3 className="mb-2 font-heading font-semibold">{t}</h3>
              <p className="text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function ProjectVisual({ p }: { p: Project }) {
  if (p.image) return <img src={p.image} alt={`${p.title} preview`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />;
  const body = {
    web: <div className="space-y-2"><div className="h-3 w-1/3 rounded bg-primary/70" /><div className="h-16 rounded bg-foreground/10" /><div className="grid grid-cols-3 gap-2"><div className="h-10 rounded bg-foreground/10" /><div className="h-10 rounded bg-foreground/10" /><div className="h-10 rounded bg-foreground/10" /></div></div>,
    app: <div className="space-y-2">{["Goal: Finish DSA module", "Reflection: Week 3", "Progress 68%"].map((t) => <div key={t} className="flex items-center gap-2 rounded bg-foreground/10 px-3 py-2 text-[10px] text-muted-foreground"><span className="h-2 w-2 rounded-full bg-primary" />{t}</div>)}</div>,
    ai: <div className="space-y-2 text-[10px]"><div className="ml-auto w-2/3 rounded-lg bg-primary/30 px-3 py-2">Explain recursion from my notes?</div><div className="w-3/4 rounded-lg bg-foreground/10 px-3 py-2 text-muted-foreground">Based on your notes, recursion is…</div></div>,
    api: <pre className="font-mono text-[10px] leading-relaxed text-muted-foreground"><span className="text-primary">GET</span> /expenses?month=10{"\n"}{"{"}{"\n"}  "total": 1240.5,{"\n"}  "items": [ ... ]{"\n"}{"}"}</pre>,
  }[p.visual];
  return (
    <div className="grid-bg flex h-full items-center justify-center p-8 transition-transform duration-700 group-hover:scale-105">
      <div className="glass w-full max-w-xs rounded-xl p-4">{body}</div>
    </div>
  );
}

export function Projects() {
  return (
    <section id="work" className={section}>
      <SectionHead label="02 / SELECTED WORK" title={<>Projects that turn<br /><span className="text-gradient-accent">ideas into reality.</span></>} />
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={(i % 2) * 0.1}>
            <article className="group h-full overflow-hidden rounded-3xl border border-border bg-card transition-shadow hover:border-primary/50 hover:shadow-glow">
              <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
                <ProjectVisual p={p} />
                <span className="absolute left-4 top-4 font-display text-3xl text-primary">{String(i + 1).padStart(2, "0")}</span>
                {p.status && <span className="absolute right-4 top-4 rounded-full border border-border bg-background/70 px-3 py-1 text-[10px] tracking-widest">{p.status.toUpperCase()}</span>}
              </div>
              <div className="p-6 md:p-8">
                <h3 className="font-heading text-2xl font-bold">{p.title}</h3>
                <p className="mt-3 text-muted-foreground">{p.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">{p.tech.map((t) => <li key={t} className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground">{t}</li>)}</ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  {p.links.map((l) => (
                    <SafeLink key={l.label} url={l.url} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[11px] font-semibold tracking-widest transition-colors hover:border-primary hover:text-primary">
                      {l.label.includes("Code") ? <Github size={13} /> : <ExternalLink size={13} />}{l.label.toUpperCase()} ↗
                    </SafeLink>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills" className={section}>
      <SectionHead label="03 / TECHNICAL SKILLS" title={<>The tools behind<br /><span className="text-gradient-accent">the work.</span></>} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g, i) => (
          <Reveal key={g.title} delay={i * 0.05}>
            <div className="glass h-full rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-primary/50">
              <h3 className="mb-5 font-mono text-xs tracking-[0.25em] text-primary">{g.title.toUpperCase()}</h3>
              <ul className="flex flex-wrap gap-2">
                {g.items.map(({ name, icon: Icon }) => (
                  <li key={name} className="flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm transition-colors hover:border-primary hover:text-primary">
                    {Icon && <Icon size={14} aria-hidden />}{name}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section id="experience" className={section}>
      <SectionHead label="04 / EXPERIENCE" title={<>My journey <span className="text-gradient-accent">so far.</span></>} />
      <ol className="relative ml-3 border-l border-border">
        {experience.map((e, i) => (
          <Reveal key={i} className="relative mb-12 pl-8 last:mb-0">
            <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-primary shadow-glow" />
            <p className="font-mono text-xs tracking-widest text-muted-foreground">{e.dates}</p>
            <h3 className="mt-2 font-heading text-2xl font-bold">{e.role}</h3>
            <p className="text-primary">{e.org}</p>
            <p className="mt-3 max-w-2xl text-muted-foreground">{e.description}</p>
            <ul className="mt-4 flex flex-wrap gap-2">{e.tech.map((t) => <li key={t} className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground">{t}</li>)}</ul>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

export function Approach() {
  const items = [
    ["Understand the Problem", "I focus on understanding the requirements before choosing a solution."],
    ["Build with Purpose", "I aim to create useful, maintainable, and user-friendly applications."],
    ["Learn and Improve", "I continuously improve my problem-solving skills and technical knowledge."],
  ];
  return (
    <section className={section}>
      <SectionHead label="HOW I WORK" title={<>Good code solves<br /><span className="text-gradient-accent">real problems.</span></>} />
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
