import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { profile } from "@/data/portfolio";

const links = ["about", "work", "skills", "education", "experience", "contact"];

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
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5 md:px-6 lg:px-8" aria-label="Main">
        <a href="#top" className="flex shrink-0 items-center gap-2.5 lg:gap-3" aria-label="Back to top">
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-primary/50 bg-primary/10 font-display text-xl text-primary">{profile.initials}</span>
          <span className="hidden whitespace-nowrap font-heading text-sm font-semibold tracking-wide sm:block">{profile.name}</span>
        </a>
        <ul className="hidden items-center gap-3 md:flex lg:gap-7 xl:gap-8">
          {links.map((l) => (
            <li key={l}>
              <a href={`#${l}`} className={`relative whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.08em] transition-colors duration-200 hover:text-primary lg:text-xs lg:tracking-[0.2em] ${active === l ? "text-primary" : "text-muted-foreground"}`}>
                {l}
                {active === l && <span className="absolute -bottom-2 left-0 h-px w-full bg-primary" />}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex shrink-0 items-center gap-3">
          <a href="#contact" className="hidden whitespace-nowrap rounded-full bg-gradient-accent px-3.5 py-2 text-[10.5px] font-semibold tracking-wider text-primary-foreground shadow-glow transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_0_44px_-4px_color-mix(in_oklab,var(--primary)_78%,transparent)] active:scale-[0.99] sm:inline-block lg:px-5 lg:text-xs">LET'S CONNECT ↗</a>
          <button onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors duration-200 hover:border-primary hover:text-primary md:hidden">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      {open && (
        <ul className="border-t border-border px-5 py-4 md:hidden">
          {links.map((l) => (
            <li key={l}><a onClick={() => setOpen(false)} href={`#${l}`} className={`block py-3 text-sm uppercase tracking-[0.2em] ${active === l ? "text-primary" : "text-muted-foreground"}`}>{l}</a></li>
          ))}
          <li><a onClick={() => setOpen(false)} href="#contact" className="mt-2 block rounded-full bg-gradient-accent py-3 text-center text-xs font-semibold text-primary-foreground transition-all duration-300 hover:shadow-glow">LET'S CONNECT ↗</a></li>
        </ul>
      )}
    </header>
  );
}
