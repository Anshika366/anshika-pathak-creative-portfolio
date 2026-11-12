import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { About, Projects, Skills, Education, Experience, Approach } from "@/components/portfolio/Sections";
import { GitHubActivity } from "@/components/portfolio/GitHubActivity";
import { Contact, Footer } from "@/components/portfolio/Contact";
import { getGithubContributions } from "@/lib/github-contributions";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    try {
      await Promise.race([
        context.queryClient.ensureQueryData({
          queryKey: ["github-contributions", "Anshika366"],
          queryFn: () => getGithubContributions(),
          staleTime: 10 * 60 * 1000,
        }),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);
    } catch {
      // Non-blocking: client useQuery handles fetch/retry gracefully
    }
  },
  head: () => ({
    meta: [
      { title: "Anshika Pathak — Full-Stack Developer & AI Enthusiast" },
      { name: "description", content: "Portfolio of Anshika Pathak: modern web apps, interactive interfaces and practical AI-powered tools." },
      { property: "og:title", content: "Anshika Pathak — Full-Stack Developer" },
      { property: "og:description", content: "Modern web apps, interactive interfaces and practical AI-powered tools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "preload", as: "image", href: "/images/portfolio-portrait.png" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-40" />
        <div className="absolute -top-40 right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[400px] w-[400px] rounded-full bg-accent/10 blur-[120px]" />
      </div>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Education />
        <Experience />
        <Approach />
        <GitHubActivity />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
