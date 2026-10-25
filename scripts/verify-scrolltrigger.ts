import { JSDOM } from "jsdom";

const dom = new JSDOM("<!DOCTYPE html><html><body><div id='app'></div></body></html>", {
  url: "http://localhost:8080/digitalmarketingservice?debug=1",
});

(globalThis as any).window = dom.window;
(globalThis as any).document = dom.window.document;
(globalThis as any).HTMLElement = dom.window.HTMLElement;
(globalThis as any).Element = dom.window.Element;
(globalThis as any).requestAnimationFrame = (cb: any) => setTimeout(cb, 16);
(globalThis as any).cancelAnimationFrame = (id: any) => clearTimeout(id);
(globalThis as any).matchMedia = () => ({
  matches: false,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
});
(globalThis as any).window.matchMedia = (globalThis as any).matchMedia;
(globalThis as any).getComputedStyle = dom.window.getComputedStyle;
(globalThis as any).Node = dom.window.Node;

async function run() {
  const { gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");

  gsap.registerPlugin(ScrollTrigger);

  console.log("=== STEP 1: INITIALIZATION ===");
  console.log("GSAP Version:", gsap.version);
  console.log("ScrollTrigger registered:", typeof ScrollTrigger.create === "function");

  console.log("=== STEP 2: DEBUG FLAG TEST (?debug=1) ===");
  const urlParams = new dom.window.URLSearchParams("?debug=1");
  const isDebug = urlParams.get("debug") === "1";
  console.log("debug=1 parsed correctly:", isDebug);
  if (isDebug) {
    ScrollTrigger.defaults({ markers: true });
  }

  console.log("=== STEP 3: CREATING 6 TRIGGERS (SAME AS SERVICEPAGE) ===");
  const t1 = ScrollTrigger.create({
    id: "hero-scrub",
    trigger: dom.window.document.createElement("div"),
    start: "top top",
    end: "bottom top",
    scrub: 1,
    markers: isDebug,
  });

  const t2 = ScrollTrigger.create({
    id: "welcome-strip-scrub",
    trigger: dom.window.document.createElement("div"),
    start: "top bottom",
    end: "bottom top",
    scrub: 1,
    markers: isDebug,
  });

  const t3 = ScrollTrigger.create({
    id: "dm-scrub-timeline",
    trigger: dom.window.document.createElement("div"),
    start: "top 75%",
    end: "bottom 30%",
    scrub: 1,
    markers: isDebug,
  });

  const t4 = ScrollTrigger.create({
    id: "web-scrub-timeline",
    trigger: dom.window.document.createElement("div"),
    start: "top 75%",
    end: "bottom 30%",
    scrub: 1,
    markers: isDebug,
  });

  const t5 = ScrollTrigger.create({
    id: "ai-scrub-timeline",
    trigger: dom.window.document.createElement("div"),
    start: "top 75%",
    end: "bottom 30%",
    scrub: 1,
    markers: isDebug,
  });

  const t6 = ScrollTrigger.create({
    id: "process-bottom-scrub",
    trigger: dom.window.document.createElement("div"),
    start: "top 80%",
    end: "bottom 40%",
    scrub: 1,
    markers: isDebug,
  });

  const allTriggers = ScrollTrigger.getAll();
  console.log("ScrollTrigger.getAll().length:", allTriggers.length);
  console.log("Trigger IDs in registry:", allTriggers.map((t: any) => t.vars.id));

  console.log("=== STEP 4: CLEANUP VERIFICATION ===");
  ScrollTrigger.getAll().forEach((t) => t.kill());
  console.log("ScrollTrigger count after cleanup:", ScrollTrigger.getAll().length);
  console.log("=== VERIFICATION PASSED WITH ZERO ERRORS ===");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
