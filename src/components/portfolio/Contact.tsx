import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { Mail, Linkedin, Github, MapPin, Loader2, ArrowUp, CheckCircle2, MailCheck, AlertCircle } from "lucide-react";
import { profile } from "@/data/portfolio";
import { AnimatedSectionHead, Reveal, SafeLink } from "./ui";

const DEFAULT_INBOX_EMAIL = "anshikapathak25@navgurukul.org";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  subject: z.string().trim().min(1, "Please add a subject").max(150),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(2000),
});
type Fields = z.infer<typeof schema>;

// Optional EmailJS public config. When absent, messages submit directly via FormSubmit to the inbox below.
const EJ = {
  service: import.meta.env["VITE_EMAILJS_SERVICE_ID"] as string | undefined,
  template: import.meta.env["VITE_EMAILJS_TEMPLATE_ID"] as string | undefined,
  key: import.meta.env["VITE_EMAILJS_PUBLIC_KEY"] as string | undefined,
};
const emailJsConfigured = !!(EJ.service && EJ.template && EJ.key);

async function sendViaEmailJs(data: Fields) {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EJ.service,
      template_id: EJ.template,
      user_id: EJ.key,
      template_params: data,
    }),
  });
  if (!res.ok) {
    throw new Error("Email delivery failed");
  }
}

async function sendViaFormSubmit(recipientEmail: string, data: Fields): Promise<"sent" | "activation"> {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      _subject: `Portfolio Message: ${data.subject}`,
      _replyto: data.email,
      _template: "table",
      ...(typeof window !== "undefined" ? { _url: window.location.href } : {}),
    }),
  });

  const payload = (await res.json().catch(() => null)) as { success?: boolean | string; message?: string } | null;
  const msgLower = payload?.message?.toLowerCase() ?? "";

  if (msgLower.includes("activate")) {
    return "activation";
  }

  if (!res.ok || payload?.success === false || payload?.success === "false") {
    throw new Error(payload?.message || "Unable to send message right now");
  }

  return "sent";
}

export function Contact() {
  const recipientEmail = profile.email || DEFAULT_INBOX_EMAIL;
  const [values, setValues] = useState<Fields>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "activation" | "error">("idle");
  const [submittedName, setSubmittedName] = useState("");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (status !== "success") return;
    const timer = window.setTimeout(() => {
      setStatus("idle");
      setSubmittedName("");
    }, 10_000);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const r = schema.safeParse(values);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrors({});
    setErrorText("");
    setSubmittedName(r.data.name);
    setStatus("loading");

    try {
      if (emailJsConfigured) {
        await sendViaEmailJs(r.data);
        setStatus("success");
        setValues({ name: "", email: "", subject: "", message: "" });
        return;
      }

      const outcome = await sendViaFormSubmit(recipientEmail, r.data);
      if (outcome === "activation") {
        setStatus("activation");
        return;
      }

      setStatus("success");
      setValues({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : "");
      setStatus("error");
    }
  }

  const field = (k: keyof Fields, label: string, type = "text") => {
    const onChange = (value: string) => {
      setValues((prev) => ({ ...prev, [k]: value }));
      if (status !== "idle") setStatus("idle");
    };
    const commonProps = {
      id: k,
      name: k,
      value: values[k],
      "aria-invalid": !!errors[k],
      className: "w-full rounded-xl border border-border bg-background/60 px-4 py-3 outline-none focus:border-primary",
    };
    return (
      <div>
        <label htmlFor={k} className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground">{label}</label>
        {k === "message" ? (
          <textarea {...commonProps} rows={5} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input {...commonProps} type={type} onChange={(e) => onChange(e.target.value)} />
        )}
        {errors[k] && <p role="alert" className="mt-1 text-xs text-destructive">{errors[k]}</p>}
      </div>
    );
  };

  const socials = [
    { icon: Mail, label: recipientEmail, url: `mailto:${recipientEmail}` },
    { icon: Linkedin, label: "LinkedIn", url: profile.linkedin },
    { icon: Github, label: "GitHub", url: profile.github },
  ];

  return (
    <section id="contact" className="mx-auto max-w-7xl scroll-mt-16 px-5 py-24 md:px-8 md:py-32">
      <AnimatedSectionHead
        label="06 / CONTACT"
        lines={[
          { text: "Let's build" },
          { text: "something great.", accent: true },
        ]}
      />
      <div className="grid gap-10 md:gap-12 lg:grid-cols-[1fr_1.3fr]">
        <Reveal className="min-w-0">
          <p className="text-base text-muted-foreground sm:text-lg">Have an interesting opportunity or project in mind? Let's connect and make it happen.</p>
          <ul className="mt-8 space-y-4">
            {socials.map(({ icon: Icon, label, url }) => (
              <li key={label}>
                <SafeLink url={url} className="flex min-w-0 items-center gap-3 transition-colors duration-200 hover:text-primary">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-primary">
                    <Icon size={16} />
                  </span>
                  <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{label}</span>
                </SafeLink>
              </li>
            ))}
            <li className="flex min-w-0 items-center gap-3 text-muted-foreground">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-primary">
                <MapPin size={16} />
              </span>
              <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{profile.location}</span>
            </li>
          </ul>
        </Reveal>
        <Reveal delay={0.08} className="min-w-0">
          <form
            onSubmit={submit}
            noValidate
            className="glass space-y-5 rounded-3xl p-5 transition-colors duration-300 hover:border-[rgba(229,57,53,0.72)] sm:p-6 md:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">{field("name", "NAME")}{field("email", "EMAIL", "email")}</div>
            {field("subject", "SUBJECT")}
            {field("message", "MESSAGE")}
            <button disabled={status === "loading"} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-accent px-7 py-4 text-xs font-semibold tracking-widest text-primary-foreground shadow-glow transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_0_48px_-4px_color-mix(in_oklab,var(--primary)_78%,transparent)] active:scale-[0.99] disabled:opacity-60 sm:w-auto">
              {status === "loading" && <Loader2 size={14} className="animate-spin" />}
              {status === "loading" ? "SENDING..." : "SEND MESSAGE ↗"}
            </button>
            <div aria-live="polite" className="text-sm">
              {status === "success" && (
                <div
                  role="status"
                  className="flex items-start gap-3 rounded-2xl border border-[#39d353]/35 bg-[#39d353]/[0.08] px-4 py-3.5 text-zinc-100"
                >
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#39d353]" aria-hidden />
                  <div className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                    <p className="font-medium text-white">
                      Thanks{submittedName ? `, ${submittedName}` : ""}! Your message has been sent.
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      It has been delivered to my inbox ({recipientEmail}). I will get back to you soon.
                    </p>
                  </div>
                </div>
              )}
              {status === "activation" && (
                <div
                  role="status"
                  className="flex items-start gap-3 rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3.5 text-zinc-100"
                >
                  <MailCheck size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden />
                  <div className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                    <p className="font-medium text-white">
                      One-time inbox activation sent to {recipientEmail}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Open that email (check Spam too) and click &ldquo;Activate Form&rdquo; once — then click Send Message again and every message will go directly to your inbox.
                    </p>
                  </div>
                </div>
              )}
              {status === "error" && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3.5 text-zinc-100"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0 text-destructive" aria-hidden />
                  <div className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                    <p className="font-medium text-white">Message could not be delivered right now.</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {errorText || `Please try again or email directly at ${recipientEmail}.`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

const FOOTER_NAV = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Experience", href: "#experience" },
  { label: "GitHub", href: "#github-activity" },
  { label: "Contact", href: "#contact" },
] as const;

export function Footer() {
  const emailAddress = profile.email || DEFAULT_INBOX_EMAIL;
  const githubUrl = profile.github || "https://github.com/Anshika366";

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[#0c0c0f]/80 backdrop-blur-xl">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(229,57,53,0.65)] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-1/4 -top-24 h-44 rounded-full bg-[rgba(229,57,53,0.08)] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 pt-12 pb-6 md:px-8 md:pt-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_auto] lg:items-start">
          {/* Brand summary */}
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <a href="#top" className="inline-flex items-center gap-3 group" aria-label="Back to top">
              <span className="grid h-10 w-10 place-items-center rounded-lg border border-primary/50 bg-primary/10 font-display text-xl text-primary transition-colors duration-300 group-hover:border-[rgba(229,57,53,0.85)]">
                {profile.initials}
              </span>
              <div>
                <p className="font-heading text-base font-bold tracking-tight text-white">{profile.name}</p>
                <p className="text-xs text-muted-foreground">{profile.role}</p>
              </div>
            </a>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Building modern full-stack web applications, intuitive interfaces, and practical AI-driven tools.
            </p>

            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[10px] tracking-[0.2em] text-zinc-300">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(229,57,53,0.9)]" aria-hidden />
              OPEN TO OPPORTUNITIES
            </span>
          </div>

          {/* Section navigation */}
          <nav aria-label="Footer navigation">
            <p className="mb-3.5 font-mono text-[10px] tracking-[0.25em] text-primary uppercase">Navigation</p>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-sm text-muted-foreground">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-block transition-colors duration-200 hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Direct contact & socials */}
          <div className="min-w-0">
            <p className="mb-3.5 font-mono text-[10px] tracking-[0.25em] text-primary uppercase">Connect</p>
            <a
              href={`mailto:${emailAddress}`}
              className="block text-sm font-medium text-zinc-200 transition-colors duration-200 hover:text-primary [overflow-wrap:anywhere]"
            >
              {emailAddress}
            </a>
            <div className="mt-4 flex items-center gap-2.5">
              {[
                { label: "GitHub profile", url: githubUrl, icon: Github },
                { label: "LinkedIn profile", url: profile.linkedin, icon: Linkedin },
                { label: "Send email", url: `mailto:${emailAddress}`, icon: Mail },
              ].map(({ label, url, icon: SocialIcon }) => (
                <SafeLink
                  key={label}
                  url={url}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/[0.03] text-zinc-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(229,57,53,0.72)] hover:text-white"
                >
                  <SocialIcon size={16} aria-hidden />
                  <span className="sr-only">{label}</span>
                </SafeLink>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          aria-hidden
          className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-center font-mono text-[10px] tracking-[0.22em] text-muted-foreground sm:flex-row sm:text-left">
          <span>© {new Date().getFullYear()} {profile.name.toUpperCase()} · DESIGNED &amp; BUILT WITH CARE</span>
          <a
            href="#top"
            aria-label="Back to top"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-[10px] font-semibold tracking-[0.22em] text-zinc-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(229,57,53,0.72)] hover:bg-[rgba(229,57,53,0.1)] hover:text-white"
          >
            <span>BACK TO TOP</span>
            <ArrowUp size={13} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
