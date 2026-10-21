import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { About, Projects, Skills, Experience, Approach } from "@/components/portfolio/Sections";
import { Contact, Footer } from "@/components/portfolio/Contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Anshika Pathak — Full-Stack Developer & AI Enthusiast" },
      { name: "description", content: "Portfolio of Anshika Pathak: modern web apps, interactive interfaces and practical AI-powered tools." },
      { property: "og:title", content: "Anshika Pathak — Full-Stack Developer" },
      { property: "og:description", content: "Modern web apps, interactive interfaces and practical AI-powered tools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
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
        <Experience />
        <Approach />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
