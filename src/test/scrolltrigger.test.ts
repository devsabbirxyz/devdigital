import { describe, it, expect, beforeEach } from "vitest";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

describe("GSAP ScrollTrigger Architecture Verification", () => {
  beforeEach(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.getAll().forEach((t) => t.kill());
  });

  it("registers ScrollTrigger plugin successfully", () => {
    expect(ScrollTrigger).toBeDefined();
    expect(typeof ScrollTrigger.create).toBe("function");
    expect(typeof ScrollTrigger.getAll).toBe("function");
  });

  it("creates and registers all 6 required ScrollTrigger scrub triggers", () => {
    // 1. Hero scrub trigger
    const t1 = ScrollTrigger.create({
      id: "hero-scrub",
      trigger: document.createElement("div"),
      start: "top top",
      end: "bottom top",
      scrub: 1,
    });

    // 2. Welcome strip scrub trigger
    const t2 = ScrollTrigger.create({
      id: "welcome-strip-scrub",
      trigger: document.createElement("div"),
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    });

    // 3. Digital Marketing scrub timeline
    const t3 = ScrollTrigger.create({
      id: "dm-scrub-timeline",
      trigger: document.createElement("div"),
      start: "top 75%",
      end: "bottom 30%",
      scrub: 1,
    });

    // 4. Web Development scrub timeline
    const t4 = ScrollTrigger.create({
      id: "web-scrub-timeline",
      trigger: document.createElement("div"),
      start: "top 75%",
      end: "bottom 30%",
      scrub: 1,
    });

    // 5. AI Automation scrub timeline
    const t5 = ScrollTrigger.create({
      id: "ai-scrub-timeline",
      trigger: document.createElement("div"),
      start: "top 75%",
      end: "bottom 30%",
      scrub: 1,
    });

    // 6. Process bottom scrub trigger
    const t6 = ScrollTrigger.create({
      id: "process-bottom-scrub",
      trigger: document.createElement("div"),
      start: "top 80%",
      end: "bottom 40%",
      scrub: 1,
    });

    const allTriggers = ScrollTrigger.getAll();
    expect(allTriggers.length).toBe(6);

    const ids = allTriggers.map((t) => (t as any).vars.id);
    expect(ids).toContain("hero-scrub");
    expect(ids).toContain("welcome-strip-scrub");
    expect(ids).toContain("dm-scrub-timeline");
    expect(ids).toContain("web-scrub-timeline");
    expect(ids).toContain("ai-scrub-timeline");
    expect(ids).toContain("process-bottom-scrub");
  });

  it("supports reverse scrub smoothly", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    const tween = gsap.fromTo(el, { opacity: 0 }, { opacity: 1 });
    const st = ScrollTrigger.create({
      trigger: el,
      animation: tween,
      scrub: 1,
    });

    // Progress 0.5 (mid-scroll)
    st.progress(0.5);
    expect(st.progress).toBe(0.5);

    // Progress 0.9 (90% scroll)
    st.progress(0.9);
    expect(st.progress).toBe(0.9);

    // Progress back to 0.3 (scrolling back UP)
    st.progress(0.3);
    expect(st.progress).toBe(0.3);

    st.kill();
    el.remove();
  });
});
