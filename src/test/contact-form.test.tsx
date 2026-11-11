import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Contact, Footer } from "@/components/portfolio/Contact";

describe("Contact confirmation auto-dismiss and Footer social links", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    globalThis.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("shows confirmation after sending and hides it automatically after 10 seconds", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: "true", message: "The form was submitted successfully." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    render(<Contact />);

    fireEvent.change(screen.getByLabelText("NAME"), { target: { value: "Anshika Pathak" } });
    fireEvent.change(screen.getByLabelText("EMAIL"), { target: { value: "anshika@example.com" } });
    fireEvent.change(screen.getByLabelText("SUBJECT"), { target: { value: "Role Inquiry" } });
    fireEvent.change(screen.getByLabelText("MESSAGE"), {
      target: { value: "Hello! Interested in discussing a project opportunity." },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    });

    expect(screen.getByRole("status")).toHaveTextContent("Thanks, Anshika Pathak! Your message has been sent.");

    act(() => {
      vi.advanceTimersByTime(9999);
    });
    expect(screen.getByRole("status")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders the LinkedIn, GitHub, and email links in Footer", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link").map((el) => el.getAttribute("href"));
    expect(links).toContain("https://www.linkedin.com/in/anshikapathakdev/");
    expect(links).toContain("https://github.com/Anshika366");
    expect(links).toContain("mailto:anshikapathak25@navgurukul.org");
  });
});

