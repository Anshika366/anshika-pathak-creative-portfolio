import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { profile } from "@/data/portfolio";

const links = ["about", "work", "skills", "experience", "contact"];

export function Navbar() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8" aria-label="Main">
        <a href="#top" className="flex items-center gap-3" aria-label="Back to top">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-primary/50 bg-primary/10 font-display text-lg text-primary">{profile.initials}</span>
          <span className="hidden font-heading text-sm font-semibold tracking-wide sm:block">{profile.name}</span>
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l}>
              <a href={`#${l}`} className={`relative text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:text-primary ${active === l ? "text-primary" : "text-muted-foreground"}`}>
                {l}
                {active === l && <span className="absolute -bottom-2 left-0 h-px w-full bg-primary" />}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <a href="#contact" className="hidden rounded-full bg-gradient-accent px-5 py-2 text-xs font-semibold tracking-wider text-primary-foreground shadow-glow transition-transform hover:scale-105 sm:inline-block">LET'S CONNECT ↗</a>
          <button onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary md:hidden">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      {open && (
        <ul className="border-t border-border px-5 py-4 md:hidden">
          {links.map((l) => (
            <li key={l}><a onClick={() => setOpen(false)} href={`#${l}`} className={`block py-3 text-sm uppercase tracking-[0.2em] ${active === l ? "text-primary" : "text-muted-foreground"}`}>{l}</a></li>
          ))}
          <li><a onClick={() => setOpen(false)} href="#contact" className="mt-2 block rounded-full bg-gradient-accent py-3 text-center text-xs font-semibold text-primary-foreground">LET'S CONNECT ↗</a></li>
        </ul>
      )}
    </header>
  );
}
