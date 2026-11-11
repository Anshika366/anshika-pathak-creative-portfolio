import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/github-contributions", () => ({
  getGithubContributions: vi.fn().mockResolvedValue({
    username: "Anshika366",
    profileUrl: "https://github.com/Anshika366",
    totalContributions: 251,
    allTimeContributions: 252,
    startDate: "2025-11-09",
    endDate: "2026-11-11",
    days: [
      { date: "2025-11-09", count: 0, level: 0 },
      { date: "2025-12-11", count: 3, level: 2 },
      { date: "2026-10-22", count: 6, level: 4 },
    ],
    fetchedAt: "2026-11-11T10:00:00.000Z",
  }),
}));

import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { About, Approach, Education, Experience, Projects, Skills } from "@/components/portfolio/Sections";
import { GitHubActivity } from "@/components/portfolio/GitHubActivity";
import { Contact, Footer } from "@/components/portfolio/Contact";

describe("Full portfolio responsive markup & interactions", () => {
  beforeEach(() => {
    globalThis.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders Navbar mobile menu toggle and all portfolio sections cleanly without missing landmarks", async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <div className="relative min-h-screen overflow-x-clip">
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
      </QueryClientProvider>,
    );

    // Mobile drawer opens and exposes links + CTA
    const menuBtn = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(menuBtn);
    expect(screen.getByRole("button", { name: /close menu/i })).toHaveAttribute("aria-expanded", "true");

    // GitHub Activity loads mocked payload cleanly and preserves horizontal scroller inside card
    expect(await screen.findByText("252")).toBeInTheDocument();
    expect(screen.getByText(/total contributions/i)).toBeInTheDocument();
    expect(container.querySelector("#github-activity .overflow-x-auto")).toBeInTheDocument();

    // Experience timeline uses responsive small-phone gutter and Footer keeps responsive breakpoints
    expect(container.querySelector("#experience ol")?.className).toContain("ml-2");
    expect(container.querySelector("#experience ol")?.className).toContain("sm:ml-3");
    expect(container.querySelector("footer .grid")?.className).toContain("sm:grid-cols-2");
    expect(container.querySelector("footer .grid")?.className).toContain("lg:grid-cols-[1.25fr_1fr_auto]");

    // Every rendered image has descriptive alt text
    const imgs = Array.from(container.querySelectorAll("img"));
    for (const img of imgs) {
      expect(img.getAttribute("alt")?.trim().length).toBeGreaterThan(0);
    }
  });
});

