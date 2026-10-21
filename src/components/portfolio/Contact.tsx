import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Mail, Linkedin, Github, MapPin, Loader2, ArrowUp } from "lucide-react";
import { profile } from "@/data/portfolio";
import { SectionHead, Reveal, SafeLink } from "./ui";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  subject: z.string().trim().min(1, "Please add a subject").max(150),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(2000),
});
type Fields = z.infer<typeof schema>;

// EmailJS public config (safe for the browser). Set these in your environment to enable sending.
const EJ = {
  service: import.meta.env["VITE_EMAILJS_SERVICE_ID"] as string | undefined,
  template: import.meta.env["VITE_EMAILJS_TEMPLATE_ID"] as string | undefined,
  key: import.meta.env["VITE_EMAILJS_PUBLIC_KEY"] as string | undefined,
};
const configured = !!(EJ.service && EJ.template && EJ.key);

export function Contact() {
  const [values, setValues] = useState<Fields>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "unconfigured">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const r = schema.safeParse(values);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrors({});
    if (!configured) { setStatus("unconfigured"); return; }
    setStatus("loading");
    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service_id: EJ.service, template_id: EJ.template, user_id: EJ.key, template_params: r.data }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setValues({ name: "", email: "", subject: "", message: "" });
    } catch { setStatus("error"); }
  }

  const field = (k: keyof Fields, label: string, type = "text") => (
    <div>
      <label htmlFor={k} className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground">{label}</label>
      {k === "message" ? (
        <textarea id={k} rows={5} value={values[k]} onChange={(e) => setValues({ ...values, [k]: e.target.value })} aria-invalid={!!errors[k]} className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 outline-none focus:border-primary" />
      ) : (
        <input id={k} type={type} value={values[k]} onChange={(e) => setValues({ ...values, [k]: e.target.value })} aria-invalid={!!errors[k]} className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 outline-none focus:border-primary" />
      )}
      {errors[k] && <p role="alert" className="mt-1 text-xs text-destructive">{errors[k]}</p>}
    </div>
  );

  const socials = [
    { icon: Mail, label: profile.email || "[YOUR EMAIL]", url: profile.email ? `mailto:${profile.email}` : "" },
    { icon: Linkedin, label: "LinkedIn", url: profile.linkedin },
    { icon: Github, label: "GitHub", url: profile.github },
  ];

  return (
    <section id="contact" className="mx-auto max-w-7xl scroll-mt-16 px-5 py-24 md:px-8 md:py-32">
      <SectionHead label="05 / CONTACT" title={<>Let's build<br /><span className="text-gradient-accent">something great.</span></>} />
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <p className="text-lg text-muted-foreground">Have an interesting opportunity or project in mind? Let's connect and make it happen.</p>
          <ul className="mt-8 space-y-4">
            {socials.map(({ icon: Icon, label, url }) => (
              <li key={label}><SafeLink url={url} className="flex items-center gap-3 transition-colors hover:text-primary"><span className="grid h-10 w-10 place-items-center rounded-full border border-border text-primary"><Icon size={16} /></span>{label}</SafeLink></li>
            ))}
            <li className="flex items-center gap-3 text-muted-foreground"><span className="grid h-10 w-10 place-items-center rounded-full border border-border text-primary"><MapPin size={16} /></span>{profile.location}</li>
          </ul>
        </Reveal>
        <Reveal>
          <form onSubmit={submit} noValidate className="glass space-y-5 rounded-3xl p-6 md:p-8">
            <div className="grid gap-5 sm:grid-cols-2">{field("name", "NAME")}{field("email", "EMAIL", "email")}</div>
            {field("subject", "SUBJECT")}
            {field("message", "MESSAGE")}
            <button disabled={status === "loading"} className="inline-flex items-center gap-2 rounded-full bg-gradient-accent px-7 py-4 text-xs font-semibold tracking-widest text-primary-foreground shadow-glow transition-transform hover:scale-105 disabled:opacity-60">
              {status === "loading" && <Loader2 size={14} className="animate-spin" />}SEND MESSAGE ↗
            </button>
            <div aria-live="polite" className="text-sm">
              {status === "success" && <p className="text-primary">Thanks! Your message was sent.</p>}
              {status === "error" && <p className="text-destructive">Something went wrong sending your message. Please try again or email directly.</p>}
              {status === "unconfigured" && <p className="text-muted-foreground">The contact form isn't connected to an email service yet, so your message was not sent. Please use the links on the left for now.</p>}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-10 md:flex-row md:px-8">
        <div className="text-center md:text-left">
          <p className="font-heading font-semibold">{profile.name}</p>
          <p className="text-sm text-muted-foreground">Building useful things for the web.</p>
        </div>
        <div className="flex gap-3">
          <SafeLink url={profile.github} className="grid h-10 w-10 place-items-center rounded-full border border-border hover:text-primary"><Github size={16} /></SafeLink>
          <SafeLink url={profile.linkedin} className="grid h-10 w-10 place-items-center rounded-full border border-border hover:text-primary"><Linkedin size={16} /></SafeLink>
          <SafeLink url={profile.email ? `mailto:${profile.email}` : ""} className="grid h-10 w-10 place-items-center rounded-full border border-border hover:text-primary"><Mail size={16} /></SafeLink>
        </div>
        <div className="flex items-center gap-4 text-[10px] tracking-[0.25em] text-muted-foreground">
          <span>© {new Date().getFullYear()} · DESIGNED & BUILT WITH CARE</span>
          <a href="#top" aria-label="Back to top" className="grid h-10 w-10 place-items-center rounded-full border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"><ArrowUp size={16} /></a>
        </div>
      </div>
    </footer>
  );
}
