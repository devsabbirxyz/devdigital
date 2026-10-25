import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Code2,
  Bot,
  ChevronDown,
  Clock,
  Wrench,
  X,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsAppButton from "@/components/site/WhatsAppButton";
import Seo from "@/components/Seo";
import Ring3DGallery, { RingItem } from "@/components/site/Ring3DGallery";
import { SERVICE_RING_DATA } from "@/lib/serviceRingData";
import { useServicesContent } from "@/lib/servicesStore";
import type { ServiceItem } from "@/data/services";
import ZigzagDeliverables from "@/components/sections/ZigzagDeliverables";
import ServicesHero from "@/components/sections/ServicesHero";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  (window as any).gsap = gsap;
  (window as any).ScrollTrigger = ScrollTrigger;
}

type Page = {
  slug: string;
  title: string;
  description: string;
  image_url: string | null;
  floating_icons: string[];
};

const SERVICE_TABS = [
  { slug: "digital-marketing", route: "/digitalmarketingservice", label: "Digital Marketing", icon: TrendingUp },
  { slug: "web-development", route: "/webdev", label: "Web Development", icon: Code2 },
  { slug: "ai-automation", route: "/aiautomation", label: "AI Automation", icon: Bot },
];

const SERVICE_PROCESS = [
  { step: "01", title: "Audit & Funnel Diagnostics", desc: "We evaluate past metrics, target audience demographics, competitor hooks, and conversion bottlenecks." },
  { step: "02", title: "Creative & System Blueprint", desc: "Develop high-converting architectures, direct-response copy, viral short-form briefs, and audience segmentation." },
  { step: "03", title: "Omnichannel Deployment", desc: "Deploy campaigns and code with strict benchmarks, sub-second latency, and predictive resource allocation." },
  { step: "04", title: "Optimization & Scale", desc: "Continuous A/B testing of winners, weekly transparent KPI reports, and aggressive ROI scaling." },
];

const SERVICE_FAQS = [
  { q: "How quickly do campaigns and websites launch?", a: "Most focused projects launch within 5 to 14 business days. Comprehensive enterprise platforms take 3 to 6 weeks with staged agile milestones." },
  { q: "How are results and ROI measured?", a: "Every deliverable connects to real-time analytics dashboards (GA4, Looker Studio, Triple Whale) with clear attribution and weekly transparent KPI updates." },
  { q: "Do you offer post-launch maintenance and support?", a: "Yes, we provide 24/7 uptime monitoring, security updates, speed maintenance, and continuous optimization retainers." },
  { q: "Can I customize the scope of any service?", a: "Absolutely. All packages can be tailored to match your exact growth goals, current tech stack, and budget." },
];

export default function ServicePage({ forcedSlug }: { forcedSlug?: string } = {}) {
  const params = useParams();
  const slug = forcedSlug ?? params.slug ?? "digital-marketing";
  const navigate = useNavigate();

  const [page, setPage] = useState<Page | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [detailItem, setDetailItem] = useState<ServiceItem | null>(null);

  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when switching service routes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as any });
  }, [slug]);

  // Load SEO / page meta from Supabase
  useEffect(() => {
    (async () => {
      const { data: p } = await supabase
        .from("service_pages")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      setPage((p as any) || null);
      if (p) {
        document.title = `${(p as any).title} — DevDigital`;
      }
    })();
  }, [slug]);

  const goBook = (itemName?: string) => {
    navigate("/#contact");
    setTimeout(() => {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 120);
  };

  const { services: dynamicServices } = useServicesContent();

  // Pick ONLY the active service section for this page!
  const currentSection = useMemo(() => {
    return (
      dynamicServices.find((s) => s.id === slug) ||
      dynamicServices.find((s) => s.id === "digital-marketing") ||
      dynamicServices[0]
    );
  }, [dynamicServices, slug]);

  // Ring items ONLY for the active service!
  const ringItems: RingItem[] = useMemo(() => {
    const baseItems = SERVICE_RING_DATA[slug] || SERVICE_RING_DATA["digital-marketing"] || [];
    const currentDynamicItems: RingItem[] = (currentSection?.items || []).map((it) => ({
      id: it.id,
      title: it.title,
      category: currentSection.subheading,
      image: it.image || baseItems[0]?.image || "",
      metric: it.details?.stats?.[0]
        ? `${it.details.stats[0].value}${it.details.stats[0].suffix} ${it.details.stats[0].label}`
        : "PREMIUM",
      description: it.short || it.details?.valueLine,
      price: it.details?.timeline ? it.details.timeline : undefined,
    }));

    const combined = [...currentDynamicItems, ...baseItems];
    const seen = new Set<string>();
    return combined.filter((item) => {
      const key = item.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [slug, currentSection]);

  // Accent styling based on service category
  const accentColor = currentSection?.accent || (slug === "web-development" ? "teal" : slug === "ai-automation" ? "purple" : "pink");
  const isPink = accentColor === "pink";
  const isTeal = accentColor === "teal";

  const glowBorder = isPink
    ? "border-pink-500/30 hover:border-pink-500/60 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]"
    : isTeal
    ? "border-teal-500/30 hover:border-teal-500/60 hover:shadow-[0_0_30px_rgba(20,184,166,0.3)]"
    : "border-purple-500/30 hover:border-purple-500/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]";

  const numBadge = isPink
    ? "bg-pink-500/20 text-pink-300 border-pink-500/40"
    : isTeal
    ? "bg-teal-500/20 text-teal-300 border-teal-500/40"
    : "bg-purple-500/20 text-purple-300 border-purple-500/40";

  const ctaBtn = isPink
    ? "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]"
    : isTeal
    ? "bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-[0_0_20px_rgba(20,184,166,0.4)]"
    : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]";

  const headingGradient = isPink
    ? "from-pink-400 via-rose-300 to-pink-500"
    : isTeal
    ? "from-teal-400 via-emerald-300 to-teal-500"
    : "from-purple-400 via-indigo-300 to-purple-500";

  const badgeCls = isPink
    ? "bg-pink-500/10 text-pink-400 border-pink-500/30"
    : isTeal
    ? "bg-teal-500/10 text-teal-400 border-teal-500/30"
    : "bg-purple-500/10 text-purple-400 border-purple-500/30";

  const ServiceIcon = slug === "web-development" ? Code2 : slug === "ai-automation" ? Bot : TrendingUp;

  // Kinetic typography strip per service
  const tickerContent = useMemo(() => {
    if (slug === "web-development") {
      return (
        <>
          <span className="text-gradient px-4">✦ WELCOME TO WEB DEVELOPMENT</span>
          <span className="text-white/30 px-3">✦</span>
          <span className="text-white px-4">WHAT I DO</span>
          <span className="text-white/30 px-3">✦</span>
          <span className="text-gradient px-4">FULL-STACK ARCHITECTURE</span>
          <span className="text-white/30 px-3">✦</span>
          <span className="text-white px-4">NEXT.JS & TYPESCRIPT</span>
          <span className="text-white/30 px-3">✦</span>
          <span className="text-gradient px-4">SUB-SECOND LATENCY</span>
          <span className="text-white/30 px-3">✦</span>
          <span className="text-white px-4">WORLD-CLASS UI/UX</span>
          <span className="text-white/30 px-3">✦</span>
          <span className="text-gradient px-4">ENTERPRISE SCALABILITY</span>
          <span className="text-white/30 px-3">✦</span>
        </>
      );
    }
    if (slug === "ai-automation") {
      return (
        <>
          <span className="text-gradient px-4">✦ WELCOME TO AI AUTOMATION</span>
          <span className="text-white/30 px-3">✦</span>
          <span className="text-white px-4">WHAT I DO</span>
          <span className="text-white/30 px-3">✦</span>
          <span className="text-gradient px-4">AUTONOMOUS 24/7 AGENTS</span>
          <span className="text-white/30 px-3">✦</span>
          <span className="text-white px-4">MAKE & ZAPIER WORKFLOWS</span>
          <span className="text-white/30 px-3">✦</span>
          <span className="text-gradient px-4">B2B LEAD ENGINES</span>
          <span className="text-white/30 px-3">✦</span>
          <span className="text-white px-4">ZERO HALLUCINATIONS</span>
          <span className="text-white/30 px-3">✦</span>
          <span className="text-gradient px-4">END-TO-END PIPELINES</span>
          <span className="text-white/30 px-3">✦</span>
        </>
      );
    }
    return (
      <>
        <span className="text-gradient px-4">✦ WELCOME TO DIGITAL MARKETING</span>
        <span className="text-white/30 px-3">✦</span>
        <span className="text-white px-4">WHAT I DO</span>
        <span className="text-white/30 px-3">✦</span>
        <span className="text-gradient px-4">ENGINEERED REVENUE</span>
        <span className="text-white/30 px-3">✦</span>
        <span className="text-white px-4">ORGANIC SERP DOMINANCE</span>
        <span className="text-white/30 px-3">✦</span>
        <span className="text-gradient px-4">HIGH-ROI PAID ACQUISITION</span>
        <span className="text-white/30 px-3">✦</span>
        <span className="text-white px-4">CONVERSION FUNNELS</span>
        <span className="text-white/30 px-3">✦</span>
      </>
    );
  }, [slug]);

  // SCROLLTRIGGER INITIALIZATION & SCRUB BINDINGS
  useEffect(() => {
    // Check dev-only debug flag: ?debug=1
    const isDebug =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("debug") === "1";

    if (isDebug) {
      ScrollTrigger.defaults({ markers: true });
    } else {
      ScrollTrigger.defaults({ markers: false });
    }

    const ctx = gsap.context(() => {
      // 1. HERO 3D RING MID-SCROLL SCRUB
      gsap.to("#hero-ring-inner", {
        scale: 0.93,
        opacity: 0.65,
        y: 45,
        ease: "none",
        scrollTrigger: {
          id: "hero-scrub",
          trigger: "#hero-ring-section",
          start: "top top",
          end: "bottom top",
          scrub: 1,
          markers: isDebug,
        },
      });

      // 2. "WELCOME" STRIP HORIZONTAL TICKER SCRUB
      gsap.fromTo(
        "#welcome-strip-track",
        { xPercent: 10 },
        {
          xPercent: -35,
          ease: "none",
          scrollTrigger: {
            id: "welcome-strip-scrub",
            trigger: "#welcome-strip-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            markers: isDebug,
          },
        }
      );

      // 3. SERVICE DELIVERABLES SECTION SCRUB TIMELINE
      const serviceTl = gsap.timeline({
        scrollTrigger: {
          id: "service-scrub-timeline",
          trigger: "#section-service-deliverables",
          start: "top 85%",
          end: "top 45%",
          scrub: 1,
          markers: isDebug,
        },
      });

      serviceTl.fromTo(".service-intro", { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.5 }, 0);

      // 4. PROCESS CARDS BOTTOM SCRUB
      gsap.fromTo(
        ".process-step-card",
        { opacity: 0.25, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          ease: "none",
          scrollTrigger: {
            id: "process-bottom-scrub",
            trigger: "#process-section",
            start: "top 80%",
            end: "bottom 40%",
            scrub: 1,
            markers: isDebug,
          },
        }
      );
    }, mainContainerRef);

    // Refresh ScrollTrigger to calculate accurate start/ends
    ScrollTrigger.refresh();

    // Clean up all triggers and timelines on unmount or slug change
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [slug]);

  // Section description
  const sectionDesc = useMemo(() => {
    if (slug === "web-development") {
      return "Fast, resilient, conversion-focused websites and SaaS architectures built to make your business look world-class.";
    }
    if (slug === "ai-automation") {
      return "Autonomous chatbots, intelligent workflow pipelines, and predictive CRM automation that eliminate repetitive labor and drive conversions.";
    }
    return "Engineered systems designed to generate measurable revenue, dominate organic rankings, and scale your brand seamlessly.";
  }, [slug]);

  const heroSubheading = useMemo(() => {
    if (page?.description) return page.description;
    if (slug === "web-development") {
      return "High-performance websites, headless architectures, and scalable full-stack applications engineered for speed, conversions, and world-class design.";
    }
    if (slug === "ai-automation") {
      return "Deploy autonomous AI agents, intelligent multi-channel workflows, and predictive CRM pipelines that eliminate manual tasks and drive revenue 24/7.";
    }
    return "Dominate search rankings, acquire high-value customers with direct-response paid campaigns, and scale conversion funnels with proven data-driven execution.";
  }, [page, slug]);

  return (
    <main ref={mainContainerRef} className="min-h-screen bg-background text-foreground relative selection:bg-primary/20">
      {page && (
        <Seo
          path={`/services/${slug}`}
          defaultTitle={`${page.title} — DevDigital`}
          defaultDescription={page.description}
          defaultImage={page.image_url ?? undefined}
        />
      )}

      <Navbar />

      {/* CINEMATIC SERVICES HERO POSTER (DIRECTLY ABOVE 3D RING) */}
      <ServicesHero
        initialServiceId={
          slug === "web-development"
            ? "web"
            : slug === "ai-automation"
            ? "ai"
            : "marketing"
        }
        onServiceChange={(serviceId, isManual) => {
          if (isManual) {
            const routes: Record<string, string> = {
              marketing: "/digitalmarketingservice",
              web: "/webdev",
              ai: "/aiautomation",
            };
            const target = routes[serviceId];
            if (target && window.location.pathname !== target) {
              navigate(target);
            }
          }
        }}
      />

      {/* 1. HERO 3D RING GALLERY (DEDICATED TO THIS SERVICE ONLY) */}
      <div id="hero-ring-section" className="relative">
        <div id="hero-ring-inner" className="will-change-transform">
          <Ring3DGallery
            items={ringItems}
            headline={page?.title || currentSection?.subheading || "Service Showcase"}
            subheading={heroSubheading}
            categoryBadge={`PREMIUM ${(currentSection?.subheading || slug).toUpperCase()}`}
            onBookItem={(item) => goBook(item.title)}
          />
        </div>
      </div>

      {/* NAVIGATION TABS: SWITCH BETWEEN THE 3 DEDICATED SERVICE PAGES */}
      <section className="relative z-20 -mt-6 mb-12 px-4">
        <div className="container max-w-2xl mx-auto flex items-center justify-center gap-2 p-1.5 rounded-full glass-strong glow-border">
          {SERVICE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.slug === slug;
            return (
              <Link
                key={tab.slug}
                to={tab.route}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-primary text-white shadow-lg glow-border scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5 active:scale-95"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 2. "WELCOME" KINETIC TYPOGRAPHY STRIP */}
      <section
        id="welcome-strip-section"
        className="relative py-12 my-6 overflow-hidden border-y border-white/10 bg-black/40 backdrop-blur-md"
      >
        <div
          id="welcome-strip-track"
          className="flex whitespace-nowrap will-change-transform text-2xl sm:text-4xl md:text-5xl font-black font-display tracking-widest uppercase select-none"
        >
          {tickerContent}
        </div>
      </section>

      {/* 3. DEDICATED SERVICE DELIVERABLES SECTION (ZIGZAG ALTERNATING - NO VERTICAL LINE) */}
      <ZigzagDeliverables
        items={currentSection?.items || []}
        introTitle={currentSection?.introTitle}
        heading={currentSection?.heading || "WHAT I DO"}
        subheading={currentSection?.subheading}
        sectionDesc={sectionDesc}
        accentColor={accentColor}
        headingGradient={headingGradient}
        badgeCls={badgeCls}
        numBadge={numBadge}
        glowBorder={glowBorder}
        ctaBtn={ctaBtn}
        ServiceIcon={ServiceIcon}
        onSelectDetail={(item) => setDetailItem(item)}
      />

      {/* 4. PROVEN METHODOLOGY (BOTTOM SECTION) */}
      <section id="process-section" className="relative py-20 bg-muted/20 border-y border-border/40">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">
              Proven Methodology
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">
              How We <span className="text-gradient">Execute</span>
            </h2>
            <p className="text-muted-foreground text-base">
              A transparent, step-by-step workflow designed to take your idea from concept to market dominance.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICE_PROCESS.map((step, idx) => (
              <div
                key={idx}
                className="process-step-card will-change-transform relative glass-strong rounded-3xl p-6 sm:p-7 glow-border hover:-translate-y-1 transition-transform"
              >
                <div className="text-4xl font-display font-black text-primary/30 mb-4">{step.step}</div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="relative py-20">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">
              Common Inquiries
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {SERVICE_FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="glass-strong rounded-2xl overflow-hidden border border-white/10 transition-colors">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    <span className="text-base sm:text-lg">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="relative py-20">
        <div className="container max-w-5xl mx-auto">
          <div className="relative rounded-3xl p-8 sm:p-12 md:p-16 overflow-hidden glass-strong glow-border text-center shadow-2xl">
            <div className="max-w-2xl mx-auto">
              <span className="text-xs font-semibold tracking-[0.3em] text-primary uppercase mb-3 block">
                Ready to Grow?
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
                Let's Build Something <span className="text-gradient">Exceptional</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-8">
                Book a discovery conversation today. We'll audit your current growth metrics and prepare a customized roadmap.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => goBook()}
                  className="w-full sm:w-auto bg-gradient-primary text-white font-semibold py-3.5 px-8 rounded-full neon-glow hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  Schedule Free Audit <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="https://wa.me/8801700000000?text=Hi,%20I%20want%20to%20discuss%20a%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto glass hover:bg-white/10 font-medium py-3.5 px-8 rounded-full transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Direct WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />

      {/* INTERACTIVE FULL BREAKDOWN MODAL */}
      <AnimatePresence>
        {detailItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
              onClick={() => setDetailItem(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-strong rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setDetailItem(null)}
                className="absolute top-5 right-5 p-2 rounded-full glass hover:bg-white/10 transition-colors"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-start gap-4 mb-6 pr-10">
                <span className="text-sm font-mono font-bold px-3 py-1 rounded-xl border bg-primary/20 text-primary border-primary/40">
                  #{detailItem.number}
                </span>
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                    {detailItem.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{detailItem.short}</p>
                </div>
              </div>

              {/* Value Line Banner */}
              {detailItem.details?.valueLine && (
                <div className="mb-6 p-4 rounded-2xl glass border border-primary/20 bg-primary/5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary block mb-1">
                    Core Value Proposition
                  </span>
                  <p className="text-sm font-medium text-foreground">
                    "{detailItem.details.valueLine}"
                  </p>
                </div>
              )}

              {/* Stats & Timeline Bar */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {detailItem.details?.stats?.[0] && (
                  <div className="p-4 rounded-2xl glass border border-white/10">
                    <span className="text-xs text-muted-foreground block mb-1">Expected Impact</span>
                    <span className="text-2xl font-display font-extrabold text-gradient">
                      +{detailItem.details.stats[0].value}
                      {detailItem.details.stats[0].suffix}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">{detailItem.details.stats[0].label}</p>
                  </div>
                )}
                {detailItem.details?.timeline && (
                  <div className="p-4 rounded-2xl glass border border-white/10">
                    <span className="text-xs text-muted-foreground block mb-1">Turnaround Timeline</span>
                    <span className="text-xl font-display font-bold text-foreground">
                      {detailItem.details.timeline.split(",")[0]}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">Fast, structured execution</p>
                  </div>
                )}
              </div>

              {/* Overview */}
              {detailItem.details?.overview && detailItem.details.overview.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-display text-base font-bold text-foreground mb-2">Executive Overview</h4>
                  <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                    {detailItem.details.overview.map((para, oIdx) => (
                      <p key={oIdx}>{para}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Deliverables Checklist */}
              {detailItem.details?.deliverables && detailItem.details.deliverables.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-display text-base font-bold text-foreground mb-3">Scope of Deliverables</h4>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {detailItem.details.deliverables.map((deliv, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2.5 p-3 rounded-xl glass border border-white/5 text-xs text-foreground/90">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Process Steps */}
              {detailItem.details?.process && detailItem.details.process.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-display text-base font-bold text-foreground mb-3">Execution Framework</h4>
                  <div className="space-y-2.5">
                    {detailItem.details.process.map((p, pIdx) => (
                      <div key={pIdx} className="p-3.5 rounded-xl glass border border-white/5 flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {pIdx + 1}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-foreground block">{p.step}</span>
                          <span className="text-xs text-muted-foreground mt-0.5 block">{p.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack / Tools */}
              {detailItem.details?.tools && detailItem.details.tools.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-display text-base font-bold text-foreground mb-2 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-primary" /> Tools & Platforms
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {detailItem.details.tools.map((tool, tIdx) => (
                      <span key={tIdx} className="text-xs font-mono font-medium px-3 py-1 rounded-lg glass border border-white/10 text-foreground">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ Accordion */}
              {detailItem.details?.faq && detailItem.details.faq.length > 0 && (
                <div className="mb-8">
                  <h4 className="font-display text-base font-bold text-foreground mb-3 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-primary" /> Frequently Asked Questions
                  </h4>
                  <div className="space-y-2">
                    {detailItem.details.faq.map((f, fIdx) => (
                      <div key={fIdx} className="p-3.5 rounded-xl glass border border-white/5">
                        <p className="text-xs font-bold text-foreground mb-1">Q: {f.q}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">A: {f.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer CTA */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Ready to scale your business with {detailItem.title}?
                </span>
                <a
                  href={detailItem.details?.cta?.href || "https://wa.me/8801700000000"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 bg-gradient-primary text-white neon-glow hover:scale-105 transition-transform"
                >
                  <MessageCircle className="w-4 h-4" />
                  {detailItem.details?.cta?.label || "Start this project"}
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}