<div align="center">

# ✨ Anshika Pathak — Developer Portfolio

**Full-Stack Developer & AI Enthusiast**

A dark-themed, responsive developer portfolio built with **React**, **TypeScript**, **TanStack Start**, **Tailwind CSS v4**, and **Framer Motion** — featuring interactive 3D project cards, live GitHub contribution heatmap, direct inbox contact delivery, and smooth scroll-triggered animations.

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TanStack Start](https://img.shields.io/badge/TanStack_Start-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/start)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

[🌐 GitHub Profile](https://github.com/Anshika366) · [💼 LinkedIn](https://www.linkedin.com/in/anshikapathakdev/) · [✉️ Contact](mailto:anshikapathak25@navgurukul.org)

</div>

---

## 🎯 Key Features

- **⚡ Hero & Animated Metrics Bar:** Staggered character-by-character display typography (`Anton` + `Space Grotesk`), interactive desktop portrait parallax with glowing orange-red halo ring, floating role pills, animated stat counters, and an infinite tech stack marquee.
- **🃏 Interactive Section Animations:** Replay-on-scroll word-by-word heading reveals (`work-reveal-root`), interactive card-swap grid in **About Me**, 3D tilt & sheen spotlight effects on **Selected Work** cards, and `prefers-reduced-motion` compliance throughout.
- **📊 Live GitHub Contribution Heatmap (`Anshika366`):**
  - Powered by a TanStack Start server function (`createServerFn`) with 15-minute server caching (`src/lib/github-contributions.ts`) and `@tanstack/react-query` client polling.
  - Displays all-time total contributions (`2025–2026`), trailing 12-month calendar count, month/weekday labels, 5-level GitHub green intensity scale, `"Less — More"` legend, hover/focus/tap date tooltips, loading skeleton, and retry state.
- **✉️ Contact Form with Direct Inbox Delivery:**
  - Client-side **Zod** validation (`name`, `email`, `subject`, `message`), red border hover focus on the glass form card, and live inbox delivery via **FormSubmit** AJAX (plus optional **EmailJS** env support) with a 10-second auto-dismiss confirmation banner.
- **📱 Responsive Across Every Screen Size:** Crafted to scale cleanly from `320 px` phones up through tablets (`640 px–1023 px`), laptops, and ultra-wide desktops with `overflow-x-clip` sticky nav safety, responsive hamburger drawer, and zero horizontal overflow.

---

## 🧭 Portfolio Sections

| # | Section | Highlights |
| :-: | :--- | :--- |
| 🔝 | **Hero (`#top`)** | Animated headline, portrait halo lighting, floating badges, downloadable `/resume.pdf`, stats bar, and tech marquee |
| 01 | **About Me (`#about`)** | Intro narrative + 3D interactive card-swap summary cards (*What I Build*, *How I Think*, *What I'm Learning*) |
| 02 | **Selected Work (`#work`)** | 4 project cards with 3D hover tilt, visual previews, color-coded tech chips, live demos, and source links |
| 03 | **Technical Skills (`#skills`)** | 6 grouped cards covering Frontend, Backend, Databases, Tools & Platforms, AI/ML, and CS fundamentals |
| 04 | **Education (`#education`)** | Academic degree & Software Development Diploma cards with red hover outlines and skill tags |
| 05 | **Experience (`#experience`)** | Timeline entry for the 3-month **Web Development Intern** role at **Honeybee Digital** |
| 💡 | **Approach (`#approach`)** | Engineering workflow principles (*Understand the Problem*, *Build with Purpose*, *Learn and Improve*) |
| 📈 | **GitHub Activity (`#github-activity`)** | Live `Anshika366` GitHub contribution heatmap + all-time total counter |
| 06 | **Contact & Footer (`#contact`)** | Direct email/social sidebar, validated contact form, and 3-column obsidian footer with quick navigation |

---

## 🛠️ Featured Projects

| Project | Summary | Tech Stack | Links |
| :--- | :--- | :--- | :--- |
| **💸 ExpenseFlow** | Full-stack personal expense manager with wallet tracking, category budgets, and spending analytics | React.js, Python, FastAPI, MongoDB, Tailwind CSS, JWT, REST API, Docker | [Live](https://expenseflow-flax.vercel.app/) · [Code](https://github.com/Anshika366/expenseflow) |
| **🛍️ NexusStore** | E-commerce storefront & protected admin portal with cart, wishlist, inventory, and order management | React.js, JavaScript, Vite, React Router, TanStack Query, Axios, REST API | [Live](https://nexus-ecommerce-admin-portal-zeta.vercel.app/) · [Code](https://github.com/Anshika366/Nexus-ecommerce-admin-portal) |
| **🎙️ VoxSales AI** | Multilingual AI voice sales agent handling calls, objection handling, lead qualification, and logging | React.js, JavaScript, Node.js, Gemini API, Web Speech API, Tailwind CSS | [Live](https://voxsales-ai.vercel.app/) · [Code](https://github.com/Anshika366/voxsales-ai) |
| **🛡️ RakshaX** | Safety-focused PWA sending emergency SOS alerts with live GPS coordinates via SMS, WhatsApp, voice & email | React.js, TypeScript, Node.js, Express.js, Supabase PostgreSQL, Twilio, SendGrid, Leaflet | [Code](https://github.com/Anshika366/RakshaX) |

---

## 🧰 Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Framework & Routing** | React 19, TypeScript, Vite 8, TanStack Start, TanStack Router, TanStack Query |
| **Styling & Motion** | Tailwind CSS v4, Framer Motion, CSS Grid/Glassmorphism, Anton / Space Grotesk / Inter fonts |
| **Icons & UI** | Lucide React, React Icons, Radix UI primitives |
| **Validation & Mail** | Zod, FormSubmit AJAX (default zero-config inbox delivery), optional EmailJS |
| **Testing & Tooling** | Vitest, React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`), ESLint, Prettier |
| **Build & Runtime** | Nitro (`cloudflare-module` preset by default; auto-detects Vercel / Netlify in CI) |

---

## 📁 Project Structure

```text
anshika-pathak-creative-portfolio/
├── public/
│   ├── images/                     # Portrait, internship emblem & project preview visuals
│   ├── favicon.svg
│   └── resume.pdf                  # Downloadable resume linked from Hero CTA
├── src/
│   ├── components/
│   │   ├── portfolio/
│   │   │   ├── Navbar.tsx          # Sticky navigation bar + responsive mobile drawer
│   │   │   ├── Hero.tsx            # Headline reveal, portrait halo, stats bar & tech marquee
│   │   │   ├── Sections.tsx        # About, Projects, Skills, Education, Experience & Approach
│   │   │   ├── GitHubActivity.tsx  # Live GitHub contribution calendar & interactive tooltips
│   │   │   ├── Contact.tsx         # Contact form, FormSubmit/EmailJS mail & obsidian Footer
│   │   │   └── ui.tsx              # Shared Reveal, SafeLink & AnimatedSectionHead helpers
│   │   └── ui/                     # Reusable Shadcn / Radix UI primitives
│   ├── data/
│   │   └── portfolio.ts            # Personal profile, stats, projects, skills, education & experience
│   ├── lib/
│   │   └── github-contributions.ts # Server function & HTML/GraphQL GitHub activity parser + cache
│   ├── routes/
│   │   ├── __root.tsx              # Root shell, head meta tags, fonts & React Query provider
│   │   └── index.tsx               # Main landing page assembling all sections
│   ├── test/
│   │   ├── app-routing.test.tsx    # Route matching test
│   │   ├── contact-form.test.tsx   # Confirmation banner 10s auto-dismiss & Footer links test
│   │   └── responsive-audit.test.tsx # Section rendering & responsive markup checks
│   ├── router.tsx
│   ├── server.ts
│   └── styles.css                  # Theme tokens, glassmorphism cards & reduced-motion styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** `v18+` (recommended `v20+` or `v22+`)
- **npm** (comes with Node.js)

### Local Installation & Development

```bash
# 1. Clone the repository
git clone https://github.com/Anshika366/anshika-pathak-creative-portfolio.git
cd anshika-pathak-creative-portfolio

# 2. Install dependencies
npm install

# 3. Start the local dev server (http://localhost:8080)
npm run dev
```

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite + TanStack Start SSR dev server |
| `npm run build` | Builds client, SSR & Nitro production bundles (`.output/`) |
| `npm run preview` | Previews the built production output locally |
| `npm test` | Runs Vitest suite (`src/test/`) |
| `npm run lint` | Runs ESLint across the repository |
| `npm run format` | Formats files using Prettier |

---

## ⚙️ Optional Environment Variables

Everything works out of the box without any `.env` file. You can optionally configure:

- **GitHub API (Server-side only — never prefix with `VITE_`):**
  - `GITHUB_TOKEN`: Personal Access Token used on the server for GitHub GraphQL queries (falls back automatically to cached public contribution fetching if omitted).
- **EmailJS (Optional client override):**
  - `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`: When set, sends contact form submissions through EmailJS instead of FormSubmit.

---

## 🌐 Deployment

Because the live GitHub Activity calendar uses a TanStack Start server function (`createServerFn`), deploy to a platform with serverless/SSR support (**Cloudflare Workers**, **Vercel**, or **Netlify**):

### Option 1: Cloudflare Workers (Preconfigured)
```bash
npm run build
npx wrangler login
npx nitro deploy --prebuilt
```
*(Or connect the GitHub repository in Cloudflare Dashboard with build command `npm run build` and deploy command `npx nitro deploy --prebuilt`.)*

### Option 2: Vercel / Netlify
1. Import **`Anshika366/anshika-pathak-creative-portfolio`** (`main` branch) in Vercel or Netlify.
2. Keep build command as **`npm run build`** (Nitro automatically detects the CI platform).
3. On first live submission from your deployed URL, click **"Activate Form"** in the confirmation email sent by FormSubmit to activate inbox delivery for that domain.

---

<div align="center">

Built with care by **[Anshika Pathak](https://github.com/Anshika366)** · [LinkedIn](https://www.linkedin.com/in/anshikapathakdev/) · [Email](mailto:anshikapathak25@navgurukul.org)

</div>
