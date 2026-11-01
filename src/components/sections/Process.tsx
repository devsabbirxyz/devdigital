import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  TrendingUp,
  Code2,
  Bot,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Activity,
  Terminal,
  ShieldCheck,
  Check,
  X,
  Workflow,
  MessageCircle,
  Database,
  Globe,
  Flame,
  Clock,
  Play,
  RotateCcw,
} from "lucide-react";
import HolographicCard from "@/components/ui/HolographicCard";
import { openAiTerminal } from "@/components/site/AiTerminal";
import { openBookingModal } from "@/components/site/BookingModal";
import { scrollToSection } from "@/lib/scroll";
import SectionWatermark from "@/components/ui/SectionWatermark";

export interface TechLogoBadge {
  name: string;
  badge: string;
  dotColor: string;
}

export interface PillarData {
  id: "pillar-1" | "pillar-2" | "pillar-3";
  stepNumber: string;
  pillarTag: string;
  category: "Digital Marketing" | "Web Development" | "AI Automation";
  icon: any;
  accentColor: string;
  glowColor: string;
  techLogos: TechLogoBadge[];
  devdigital: {
    title: string;
    tagline: string;
    highlightTag: string;
    badge: string;
    metricLabel: string;
    metricValue: string;
    statusText: string;
    deliverables: string[];
    circuitFlow: string;
    telemetryLogs: { time: string; level: "info" | "success" | "warn"; tag: string; msg: string }[];
  };
  traditional: {
    title: string;
    tagline: string;
    highlightTag: string;
    badge: string;
    metricLabel: string;
    metricValue: string;
    statusText: string;
    leakages: string[];
    circuitFlow: string;
    telemetryLogs: { time: string; level: "error" | "warn"; tag: string; msg: string }[];
  };
}

const PILLARS: PillarData[] = [
  {
    id: "pillar-1",
    stepNumber: "01",
    pillarTag: "PILLAR 1 • TRAFFIC ACQUISITION",
    category: "Digital Marketing",
    icon: TrendingUp,
    accentColor: "from-amber-500 to-orange-500",
    glowColor: "rgba(245, 158, 11, 0.4)",
    techLogos: [
      { name: "Meta Ads (FB/IG)", badge: "border-blue-500/40 bg-blue-500/10 text-blue-300", dotColor: "bg-blue-400" },
      { name: "Google Ads (P-Max)", badge: "border-amber-500/40 bg-amber-500/10 text-amber-300", dotColor: "bg-amber-400" },
      { name: "Server CAPI (99% Match)", badge: "border-purple-500/40 bg-purple-500/10 text-purple-300", dotColor: "bg-purple-400" },
      { name: "GA4 Analytics", badge: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300", dotColor: "bg-emerald-400" },
    ],
    devdigital: {
      title: "Meta & Google Ads Scaling Engine",
      tagline: "High-intent buyer traffic acquisition with conversion API resilience and zero ad budget waste.",
      highlightTag: "Eliminating bot clicks and scaling verified high-intent buyers",
      badge: "border-amber-500/40 bg-amber-500/10 text-amber-300",
      metricLabel: "Verified ROAS Surge",
      metricValue: "3.5x — 6.2x",
      statusText: "● 100% Verified CAPI Stream",
      circuitFlow: "Ad Click Ingested ➔ Bot Filtered ➔ Server-Side CAPI Authenticated",
      deliverables: [
        "Server-Side Meta Conversions API (CAPI) with 95%+ event match quality (Zero iOS cookie loss)",
        "Negative keyword & audience clusters eliminating 35-50% wasteful bot clicks",
        "Direct-response psychological creative hooks & continuous multi-variant testing",
        "Advantage+ shopping funnels with localized Bangladesh & global retargeting",
      ],
      telemetryLogs: [
        { time: "00:00.12", level: "info", tag: "INGEST", msg: "Advantage+ ASC campaign scaled ($25K+ monthly target)" },
        { time: "00:00.28", level: "success", tag: "CAPI_MATCH", msg: "Server-side event match quality: 9.8 / 10 (Zero cookie loss)" },
        { time: "00:00.45", level: "success", tag: "ROAS_SURGE", msg: "Blended acquisition CPA dropped -58% (High-intent buyer pool)" },
      ],
    },
    traditional: {
      title: "Broken & Leaky Ad Funnels",
      tagline: "Running ads without server-side tracking, burning budget on irrelevant clicks and fake leads.",
      highlightTag: "Wasted ad budget on broad, non-converting traffic & high CPA",
      badge: "border-rose-500/40 bg-rose-500/10 text-rose-300",
      metricLabel: "Ad Budget Wasted",
      metricValue: "-42% Loss",
      statusText: "⚠ Severe Data Leakage",
      circuitFlow: "Browser Click ➔ 40% Blocked by AdBlock ➔ Untracked Ad Spend",
      leakages: [
        "35-50% ad budget wasted on broad audiences and bot clicks",
        "iOS 14.5+ tracking loss with up to 40% unrecorded purchase events",
        "Fatigued, repetitive creatives without psychological hook testing",
        "Zero server-side Meta Conversions API — relying on outdated browser cookies",
      ],
      telemetryLogs: [
        { time: "00:00.12", level: "error", tag: "TRACKING_FAIL", msg: "Browser pixel blocked by iOS Private Relay & AdBlockers" },
        { time: "00:00.32", level: "warn", tag: "BOT_TRAFFIC", msg: "38% clicks from non-converting irrelevant keywords" },
        { time: "00:00.65", level: "error", tag: "BUDGET_BURN", msg: "CPM spiked +65% with zero sales attribution" },
      ],
    },
  },
  {
    id: "pillar-2",
    stepNumber: "02",
    pillarTag: "PILLAR 2 • CONVERSION SURFACE",
    category: "Web Development",
    icon: Code2,
    accentColor: "from-purple-500 to-cyan-500",
    glowColor: "rgba(168, 85, 247, 0.4)",
    techLogos: [
      { name: "Next.js 15 & React", badge: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300", dotColor: "bg-cyan-400" },
      { name: "TypeScript", badge: "border-blue-500/40 bg-blue-500/10 text-blue-300", dotColor: "bg-blue-400" },
      { name: "Tailwind CSS", badge: "border-sky-500/40 bg-sky-500/10 text-sky-300", dotColor: "bg-sky-400" },
      { name: "Supabase & Postgres", badge: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300", dotColor: "bg-emerald-400" },
    ],
    devdigital: {
      title: "Next.js 15 Sub-Second Web Engine",
      tagline: "Ultra-fast headless architecture converting cold ad traffic into paying customers before bounce.",
      highlightTag: "Sub-second load times engineered to maximize mobile checkout",
      badge: "border-purple-500/40 bg-purple-500/10 text-purple-300",
      metricLabel: "Lighthouse & Load Speed",
      metricValue: "99/100 • 0.4s",
      statusText: "● Ultra-Fast Edge CDN",
      circuitFlow: "Traffic Received ➔ 0.4s Sub-Second Hydration ➔ 1-Click Checkout",
      deliverables: [
        "Next.js 15 App Router with sub-40ms Edge CDN global delivery (Zero layout shift)",
        "100% custom TypeScript codebase — zero bloated plugins or slow builders",
        "High-converting mobile visual hierarchy & frictionless 1-click cart drawer",
        "Instant payment gateway & seamless bKash / Nagad / Stripe checkout integration",
      ],
      telemetryLogs: [
        { time: "00:00.48", level: "info", tag: "EDGE_CDN", msg: "Regional edge node cache hit (LCP: 0.38s, CLS: 0.00)" },
        { time: "00:00.62", level: "success", tag: "LIGHTHOUSE", msg: "Google Mobile Performance: 99 / 100 (Passes Core Web Vitals)" },
        { time: "00:00.85", level: "success", tag: "CHECKOUT", msg: "+48% mobile checkout completion rate with 0-lag instant cart" },
      ],
    },
    traditional: {
      title: "Slow WordPress / Heavy Store",
      tagline: "4.5+ second load times causing over half of mobile visitors to abandon before viewing a product.",
      highlightTag: "Slow page loads causing 53%+ of mobile visitors to bounce",
      badge: "border-rose-500/40 bg-rose-500/10 text-rose-300",
      metricLabel: "Mobile Visitor Bounce",
      metricValue: "53% Bounce",
      statusText: "⚠ Extreme Cart Abandonment",
      circuitFlow: "User Waits 4.8s ➔ Lag & Plugin Sprawl ➔ 53% Bounce & Abandon",
      leakages: [
        "53% mobile users abandon site if loading takes longer than 3 seconds",
        "Bloated multi-plugin architecture slowing database queries to a crawl",
        "Failing Google Core Web Vitals — punished by lower search and ad ranking",
        "Friction-heavy checkout forms causing massive cart abandonment",
      ],
      telemetryLogs: [
        { time: "00:03.45", level: "warn", tag: "LAG_DETECTED", msg: "Page load delayed 4.8s due to 48 unminified plugins" },
        { time: "00:04.10", level: "error", tag: "BOUNCE_SURGE", msg: "53.4% of paid ad traffic abandoned prior to First Contentful Paint" },
        { time: "00:05.20", level: "error", tag: "CART_DROP", msg: "Slow payment gateway redirect caused checkout drop-off" },
      ],
    },
  },
  {
    id: "pillar-3",
    stepNumber: "03",
    pillarTag: "PILLAR 3 • RETENTION & SCALE",
    category: "AI Automation",
    icon: Bot,
    accentColor: "from-cyan-500 to-emerald-500",
    glowColor: "rgba(6, 182, 212, 0.4)",
    techLogos: [
      { name: "OpenAI GPT-4o", badge: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300", dotColor: "bg-emerald-400" },
      { name: "Make.com & n8n", badge: "border-purple-500/40 bg-purple-500/10 text-purple-300", dotColor: "bg-purple-400" },
      { name: "WhatsApp Cloud API", badge: "border-green-500/40 bg-green-500/10 text-green-300", dotColor: "bg-green-400" },
      { name: "Automated CRM Sync", badge: "border-amber-500/40 bg-amber-500/10 text-amber-300", dotColor: "bg-amber-400" },
    ],
    devdigital: {
      title: "24/7 Autonomous AI & Make.com Webhooks",
      tagline: "Zero-latency lead triage, WhatsApp sales dispatch, and automated CRM pipeline in under 15 seconds.",
      highlightTag: "Automated WhatsApp replies & real-time CRM lead routing in <15s",
      badge: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
      metricLabel: "Instant Lead Sync",
      metricValue: "< 15s • 0 Drop",
      statusText: "● 24/7 Autonomous Pipeline",
      circuitFlow: "Checkout or Form ➔ Webhook Trigger ➔ AI Qualification ➔ WhatsApp Ping",
      deliverables: [
        "Zero-latency Make.com & n8n webhook pipelines syncing Ads, CRM, and WhatsApp",
        "Autonomous dual-language (Bangla & English) GPT-4o customer support & lead qualifier",
        "Instant WhatsApp Business API notifications sent within 15 seconds to customer & owner",
        "Automated customer onboarding, order tracking (Steadfast/Pathao), and invoice dispatch",
      ],
      telemetryLogs: [
        { time: "00:01.05", level: "info", tag: "WEBHOOK", msg: "Lead submitted via ad form captured in Make.com pipeline" },
        { time: "00:01.18", level: "success", tag: "CRM_SYNC", msg: "HubSpot CRM & Slack notification pushed in 3.8 seconds" },
        { time: "00:01.32", level: "success", tag: "WHATSAPP_AI", msg: "Personalized WhatsApp welcome & qualification dispatched in 12.4s" },
      ],
    },
    traditional: {
      title: "Manual Inquiries & 4-Hour Delays",
      tagline: "Manual lead spreadsheets and delayed replies cause 60% of interested buyers to buy elsewhere.",
      highlightTag: "Delayed replies causing 60% of interested buyers to go to competitors",
      badge: "border-rose-500/40 bg-rose-500/10 text-rose-300",
      metricLabel: "Average Delay",
      metricValue: "4h+ Delay",
      statusText: "⚠ Cold Leads & Missed Revenue",
      circuitFlow: "Lead Waits in Inbox ➔ Manual Excel Copy ➔ Cold Lead Bought Elsewhere",
      leakages: [
        "Average 3 to 5-hour response delay when customers message on WhatsApp/Facebook",
        "60% of interested buyers buy from the competitor who responds first",
        "Leads manually copied into spreadsheets with human errors and lost contacts",
        "Sales team exhausted handling repetitive queries instead of closing deals",
      ],
      telemetryLogs: [
        { time: "01:45:00", level: "warn", tag: "LEAD_WAITING", msg: "Lead submitted form — waiting for human sales rep to open sheet" },
        { time: "04:12:00", level: "error", tag: "LEAD_LOST", msg: "Customer replied: 'Already purchased from competitor'" },
        { time: "05:00:00", level: "error", tag: "REVENUE_MISSED", msg: "Manual follow-up failed — high acquisition cost wasted" },
      ],
    },
  },
];

export default function Process() {
  const [circuitMode, setCircuitMode] = useState<"devdigital" | "traditional">("devdigital");
  const [activeNodeId, setActiveNodeId] = useState<"pillar-1" | "pillar-2" | "pillar-3">("pillar-1");
  const [activeTab, setActiveTab] = useState<"deliverables" | "telemetry" | "architecture">("deliverables");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const activePillar = PILLARS.find((p) => p.id === activeNodeId) || PILLARS[0];
  const activeContent = circuitMode === "devdigital" ? activePillar.devdigital : activePillar.traditional;

  // Auto-play through pillars every 5 seconds if enabled
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveNodeId((prev) => {
        if (prev === "pillar-1") return "pillar-2";
        if (prev === "pillar-2") return "pillar-3";
        return "pillar-1";
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  return (
    <section id="process" className="relative py-12 sm:py-16 md:py-28 overflow-hidden bg-[#0A0C11] content-auto isolate">
      {/* Background ambient lighting & Watermark */}
      <SectionWatermark text="CIRCUIT" glowColor={circuitMode === "devdigital" ? "cyan" : "rose"} />

      {/* Subtle Ambient Radial Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[160px] transition-all duration-700 ${
            circuitMode === "devdigital" ? "bg-[#0099FF]/20" : "bg-rose-500/20"
          }`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full blur-[140px] transition-all duration-700 ${
            circuitMode === "devdigital" ? "bg-[#38BDF8]/15" : "bg-amber-500/15"
          }`}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-cyan-400 uppercase bg-cyan-500/10 border border-cyan-500/30 mb-3 sm:mb-4 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Cpu className="h-3.5 w-3.5 animate-pulse text-cyan-400" />
            <span>NEURAL ECOSYSTEM ARCHITECTURE</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            The Full-Funnel <span className="text-gradient">Growth Circuit</span>
          </h2>

          <p className="text-muted-foreground text-xs sm:text-base mt-2 sm:mt-3 leading-relaxed">
            Traffic without a high-speed web engine is wasted ad budget. A website without autonomous AI creates human bottlenecks. 
            Here is how all 3 pillars interconnect into an unstoppable growth machine.
          </p>

          {/* Interactive Mode Switcher: DevDigital vs Traditional Setup */}
          <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6">
            <div className="p-1 rounded-full glass-strong border border-white/15 flex items-center shadow-lg">
              <button
                type="button"
                onClick={() => setCircuitMode("devdigital")}
                className={`px-3.5 sm:px-5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  circuitMode === "devdigital"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-neon"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-cyan-200" />
                <span>DevDigital Neural Engine</span>
              </button>

              <button
                type="button"
                onClick={() => setCircuitMode("traditional")}
                className={`px-3.5 sm:px-5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  circuitMode === "traditional"
                    ? "bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)]"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                <X className="w-3.5 h-3.5 text-rose-300" />
                <span>Traditional Bottlenecks</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* ------------------------------------------------------------- */}
        {/* INTERACTIVE NEURAL PIPELINE VISUAL CONNECTOR BAR (DESKTOP) */}
        {/* ------------------------------------------------------------- */}
        <div className="hidden lg:flex items-center justify-between max-w-5xl mx-auto mb-6 px-8 py-3 rounded-2xl glass border border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-xs font-bold text-amber-300">01. Ads & CAPI Acquisition</span>
          </div>

          <div className="flex-1 mx-4 relative h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
              className="w-16 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="font-mono text-xs font-bold text-purple-300">02. Next.js 0.4s Conversion</span>
          </div>

          <div className="flex-1 mx-4 relative h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "linear", delay: 0.7 }}
              className="w-16 h-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs font-bold text-emerald-300">03. 24/7 AI Retention & Sync</span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 1. INTERACTIVE 3-NODE PIPELINE GRID (With Brand Tech Badges) */}
        {/* ------------------------------------------------------------- */}
        <div className="relative max-w-6xl mx-auto mb-8 sm:mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-7">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              const isSelected = activeNodeId === pillar.id;
              const content = circuitMode === "devdigital" ? pillar.devdigital : pillar.traditional;

              return (
                <div
                  key={pillar.id}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setActiveNodeId(pillar.id);
                  }}
                  className="cursor-pointer"
                >
                  <HolographicCard
                    className={`h-full p-4 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl border transition-all duration-500 ${
                      isSelected
                        ? circuitMode === "devdigital"
                          ? "border-primary shadow-[0_0_45px_rgba(0,153,255,0.4)] scale-[1.02]"
                          : "border-rose-500 shadow-[0_0_45px_rgba(244,63,94,0.45)] scale-[1.02]"
                        : "border-white/10 glass-strong hover:border-white/30"
                    }`}
                    tiltStrength={6}
                    enableBorderBeam={isSelected}
                    enableGlare={true}
                  >
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        {/* Top Node Pill + Step Number */}
                        <div className="flex items-center justify-between mb-3.5 sm:mb-5">
                          <span
                            className={`text-[9px] sm:text-[10px] font-mono font-bold tracking-wider px-2.5 py-0.5 sm:py-1 rounded-full border ${content.badge}`}
                          >
                            STEP {pillar.stepNumber} &bull; {pillar.category}
                          </span>
                          <span className="font-display font-black text-2xl sm:text-3xl text-white/15 group-hover:text-white/30 transition-colors font-mono">
                            {pillar.stepNumber}
                          </span>
                        </div>

                        {/* Node Icon & Pillar Header */}
                        <div className="flex items-center gap-3 sm:gap-3.5 mb-3 sm:mb-4">
                          <div
                            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 transition-transform group-hover:scale-110 border ${
                              circuitMode === "devdigital"
                                ? "bg-primary/20 border-primary/40 text-cyan-300"
                                : "bg-rose-500/20 border-rose-500/40 text-rose-300"
                            }`}
                          >
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider block">
                              {pillar.pillarTag.split("•")[1]?.trim() || pillar.category}
                            </span>
                            <h3 className="font-display text-base sm:text-lg font-bold text-foreground leading-snug">
                              {content.title}
                            </h3>
                          </div>
                        </div>

                        {/* Summary callout chip */}
                        <div
                          className={`mb-3 px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium border leading-relaxed ${
                            circuitMode === "devdigital"
                              ? "bg-primary/10 border-primary/20 text-cyan-200"
                              : "bg-rose-500/10 border-rose-500/20 text-rose-200"
                          }`}
                        >
                          <span className="font-semibold block mb-0.5">
                            {circuitMode === "devdigital" ? "✓ devdigital Advantage:" : "⚠ Traditional Bottleneck:"}
                          </span>
                          <span>{content.highlightTag}</span>
                        </div>

                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
                          {content.tagline}
                        </p>

                        {/* ADVANCED TECH LOGO BADGES (Visual Platforms for Each Pillar) */}
                        <div className="pt-2 pb-3 mb-2 border-t border-white/5">
                          <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/70 mb-2">
                            Engineered With:
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {pillar.techLogos.map((tech, tIdx) => (
                              <span
                                key={tIdx}
                                className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${tech.badge}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${tech.dotColor}`} />
                                <span>{tech.name}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Metric Pill */}
                      <div className="pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-between">
                        <div>
                          <div className="text-[9px] sm:text-[10px] font-mono text-muted-foreground uppercase">
                            {content.metricLabel}
                          </div>
                          <div
                            className={`font-display text-base sm:text-lg font-extrabold font-mono ${
                              circuitMode === "devdigital" ? "text-primary" : "text-rose-400"
                            }`}
                          >
                            {content.metricValue}
                          </div>
                        </div>
                        <div
                          className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
                            isSelected
                              ? circuitMode === "devdigital"
                                ? "text-cyan-400"
                                : "text-rose-400"
                              : "text-muted-foreground"
                          }`}
                        >
                          <span>{isSelected ? "Active Stage" : "Inspect"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </HolographicCard>
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. DEEP TELEMETRY & ARCHITECTURE INSPECTOR */}
        {/* ------------------------------------------------------------- */}
        <motion.div
          key={`${activePillar.id}-${circuitMode}`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-6xl mx-auto rounded-2xl sm:rounded-3xl glass-strong border border-white/15 p-4 sm:p-7 md:p-9 relative overflow-hidden shadow-2xl mb-8 bg-[#0C0F17]/95"
        >
          {/* Subtle colored accent glow inside inspector */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] opacity-20 -z-10 ${
              circuitMode === "devdigital" ? "bg-primary" : "bg-rose-500"
            }`}
          />

          {/* Inspector Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 mb-5 sm:mb-7 pb-4 sm:pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`text-[10px] sm:text-[11px] font-mono font-bold px-2.5 sm:px-3 py-0.5 rounded-full border ${activeContent.badge}`}>
                  STAGE {activePillar.stepNumber} &bull; {activePillar.category.toUpperCase()}
                </span>
                <span
                  className={`text-xs font-semibold flex items-center gap-1 font-mono ${
                    circuitMode === "devdigital" ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>{activeContent.statusText}</span>
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground">
                {activeContent.title}
              </h3>
              <p className="text-xs sm:text-sm text-cyan-300 font-mono mt-1">
                ⚡ Data Route: {activeContent.circuitFlow}
              </p>
            </div>

            {/* Quick Trigger CTA & Simulator */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => openAiTerminal(`/simulate-${activePillar.id}`)}
                className="w-full sm:w-auto justify-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
              >
                <Terminal className="w-3.5 h-3.5 shrink-0" />
                <span>Simulate in AI Co-Pilot</span>
              </button>

              <button
                type="button"
                onClick={() => openBookingModal(`Deploy ${activePillar.category} Architecture`)}
                className="w-full sm:w-auto justify-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-full bg-gradient-primary text-white font-semibold text-xs flex items-center gap-2 shadow-neon hover:scale-105 transition-all"
              >
                <span>Deploy This System</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </div>

          {/* Sub-tabs: Deliverables vs Live Telemetry Stream */}
          <div className="flex items-center gap-2 mb-5 border-b border-white/10 pb-3 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab("deliverables")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "deliverables"
                  ? "bg-white/15 text-white border border-white/20 shadow-sm"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span>
                {circuitMode === "devdigital" ? "Architectural Deliverables" : "Critical Bottlenecks & Leakage"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("telemetry")}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 font-mono ${
                activeTab === "telemetry"
                  ? "bg-primary/20 text-cyan-300 border border-primary/40 shadow-neon"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Telemetry Stream</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </button>
          </div>

          {/* Tab 1: Deliverables / Leakages Checklist Grid */}
          {activeTab === "deliverables" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid sm:grid-cols-2 gap-3.5"
            >
              {circuitMode === "devdigital"
                ? activePillar.devdigital.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:border-primary/30 transition-all group"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                        {item}
                      </span>
                    </div>
                  ))
                : activePillar.traditional.leakages.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 hover:border-rose-500/40 transition-all"
                    >
                      <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 border border-rose-500/30">
                        <X className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm text-rose-200/90 leading-relaxed font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
            </motion.div>
          )}

          {/* Tab 2: Live Cyber Telemetry Logs Console */}
          {activeTab === "telemetry" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl bg-[#090C13] border border-white/10 p-4 font-mono text-xs shadow-inner"
            >
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[11px] text-zinc-400">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-zinc-300 font-semibold ml-2">neural-telemetry.log</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SIMULATION ACTIVE</span>
                </div>
              </div>

              {/* Log Messages */}
              <div className="space-y-2">
                {activeContent.telemetryLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs">
                    <span className="text-zinc-500 shrink-0">[{log.time}]</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase shrink-0 ${
                        log.level === "success"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                          : log.level === "error"
                          ? "bg-rose-950 text-rose-400 border border-rose-500/30"
                          : log.level === "warn"
                          ? "bg-amber-950 text-amber-400 border border-amber-500/30"
                          : "bg-blue-950 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {log.tag}
                    </span>
                    <span className="text-zinc-200 leading-relaxed">{log.msg}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
