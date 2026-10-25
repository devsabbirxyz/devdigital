import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Lock,
  Play,
  Pause,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Bot,
  Zap,
  Globe,
  Clock,
  ShieldCheck,
  Workflow,
  BarChart3,
  Flame,
  Check,
} from "lucide-react";
import { scrollToSection } from "@/lib/scroll";
import SectionWatermark from "@/components/ui/SectionWatermark";

import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";
import hero1 from "@/assets/hero-1.jpg";
import hero5 from "@/assets/hero-5.jpg";

interface TabPillar {
  id: "webdev" | "ai" | "marketing";
  tabLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  domain: string;
  before: {
    title: string;
    sub: string;
    image: string;
    badges: string[];
    speedMetric: string;
    description: string;
    painPoints: string[];
  };
  after: {
    title: string;
    sub: string;
    image: string;
    badges: string[];
    speedMetric: string;
    description: string;
    gains: string[];
  };
  bento: {
    challenge: string;
    solution: string;
    stack: string[];
    metrics: { label: string; value: string; delta: string; highlight?: boolean }[];
  };
}

const PILLARS: TabPillar[] = [
  // -------------------------------------------------------------
  // 1. WEB DEVELOPMENT PILLAR
  // -------------------------------------------------------------
  {
    id: "webdev",
    tabLabel: "🌐 Web Development (UI/UX & Speed)",
    icon: Globe,
    domain: "apex-modern.web.app",
    before: {
      title: "Outdated WordPress & Bloated Theme",
      sub: "Sluggish, generic, high-bounce template",
      image: p3,
      badges: [
        "⏳ 6.4s Load Time",
        "📉 1.1% Conversion Rate",
        "📱 Broken Mobile UX",
        "❌ Generic Template",
      ],
      speedMetric: "6.4s Load • 32 Lighthouse",
      description: "Over 30 unoptimized plugins, heavy render-blocking assets, and zero mobile responsiveness caused 64% of visitors to abandon.",
      painPoints: [
        "Heavy scripts slowing Time to First Byte (TTFB)",
        "Cluttered navigation with no clear CTA hierarchy",
        "Cart abandonment on mobile exceeding 60%",
      ],
    },
    after: {
      title: "Next.js 15 + Edge CDN & Tailwind UI",
      sub: "Sub-second, high-converting digital storefront",
      image: p1,
      badges: [
        "⚡ 0.6s Load Time (99 Lighthouse)",
        "🚀 4.8% Conversion Rate (+336%)",
        "💎 Custom High-Converting UI",
      ],
      speedMetric: "0.6s Load • 99 Lighthouse",
      description: "Engineered with headless Next.js 15, edge-cached serverless APIs, frictionless 2-step checkout, and bespoke glassmorphic UI.",
      gains: [
        "Sub-second load worldwide on Cloudflare Edge",
        "Pixel-perfect responsive layout for all viewports",
        "Conversion rate increased from 1.1% to 4.8%",
      ],
    },
    bento: {
      challenge:
        "The legacy store took 6.4 seconds to load on mobile. Clunky layout and unresponsive product pages triggered a 60%+ bounce rate before users even reached checkout.",
      solution:
        "Rebuilt from the ground up using Next.js 15 with automated AVIF image pipelines, frictionless 2-step checkout, and edge CDN deployments with 99 Core Web Vitals.",
      stack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Stripe Edge API"],
      metrics: [
        { label: "Conversion Lift", value: "+336%", delta: "1.1% ➔ 4.8%", highlight: true },
        { label: "Page Load Speed", value: "0.6s", delta: "-5.8s Reduction" },
        { label: "Mobile Bounce Rate", value: "-52%", delta: "64% ➔ 12%" },
      ],
    },
  },

  // -------------------------------------------------------------
  // 2. AI AUTOMATION PILLAR
  // -------------------------------------------------------------
  {
    id: "ai",
    tabLabel: "🤖 AI Automations (Workflows & Agents)",
    icon: Bot,
    domain: "agentic-ops.devdigital.ai",
    before: {
      title: "The Manual Grind",
      sub: "Disconnected spreadsheets & delayed responses",
      image: hero5,
      badges: [
        "⏱️ 4+ Hours Response Time",
        "💸 35% Leads Lost",
        "😓 40 hrs/week Manual Data Entry",
      ],
      speedMetric: "4+ Hours Avg Response • Manual Triage",
      description: "Sales reps wasted half their week manually copying leads from email to Excel, responding hours too late when intent had cooled down.",
      painPoints: [
        "Unanswered weekend & night-time inquiries",
        "Copy-paste errors across disparate spreadsheets",
        "Zero automated follow-up or calendar booking",
      ],
    },
    after: {
      title: "24/7 Autonomous AI System",
      sub: "Instant qualification, CRM sync & auto-booking",
      image: hero1,
      badges: [
        "⚡ 8-Second AI Response",
        "🤖 100% Automated Lead Qualification",
        "⏳ 35+ Hours Saved Weekly",
      ],
      speedMetric: "8-Second AI Response • 100% Autonomous",
      description: "Multi-channel AI agent mesh connects Webhook ➔ AI Qualification ➔ CRM Sync ➔ WhatsApp/Email Follow-up ➔ Calendar Booking in 8 seconds.",
      gains: [
        "24/7 instant replies under 10 seconds via WhatsApp",
        "Zero manual spreadsheet data entry required",
        "Automated booking directly into Google/Outlook Calendar",
      ],
    },
    bento: {
      challenge:
        "The sales team was losing over 35% of qualified buyer leads because manual intake took hours. Night-time and weekend inquiries sat untouched until the next business day.",
      solution:
        "Engineered an autonomous n8n & OpenAI agent workflow that ingests form and WhatsApp leads, scores budget and readiness, and books sales calls in real time.",
      stack: ["OpenAI GPT-4", "n8n Workflows", "WhatsApp Cloud API", "Supabase CRM"],
      metrics: [
        { label: "Avg. Response Time", value: "8s", delta: "From 4.2 Hours", highlight: true },
        { label: "Weekly Admin Saved", value: "35+ hrs", delta: "Zero copy-paste" },
        { label: "Captured Leads", value: "100%", delta: "35% reduction in leaks" },
      ],
    },
  },

  // -------------------------------------------------------------
  // 3. DIGITAL MARKETING PILLAR
  // -------------------------------------------------------------
  {
    id: "marketing",
    tabLabel: "📈 Digital Marketing (Funnels & ROAS)",
    icon: BarChart3,
    domain: "growth-engine.analytics.io",
    before: {
      title: "Wasted Ad Spend",
      sub: "Flatlining analytics & untracked leaky funnels",
      image: p4,
      badges: [
        "📉 0.9x ROAS",
        "🕳️ High Drop-off Rate",
        "❓ Zero Attribution Tracking",
      ],
      speedMetric: "0.9x ROAS • Bleeding Ad Budget",
      description: "Generic ad campaigns sent untargeted traffic to slow landing pages with no Server-Side Tracking (CAPI), resulting in lost budget.",
      painPoints: [
        "iOS 14.5+ tracking loss hiding 40% of conversion data",
        "Weak value hooks causing immediate drop-offs",
        "Ad spend failing to cover basic customer acquisition costs",
      ],
    },
    after: {
      title: "Predictable Revenue Funnel",
      sub: "Steep upward ROAS & omni-channel conversion",
      image: p2,
      badges: [
        "📈 5.4x Average ROAS",
        "🎯 -62% Cost Per Acquisition (CPA)",
        "🔥 Automated Omni-Channel Retargeting",
      ],
      speedMetric: "5.4x Average ROAS • Server-Side Tracking",
      description: "Engineered full-funnel paid search & Meta Ads architecture with Server-Side Meta CAPI, dynamic creative testing, and automated retargeting.",
      gains: [
        "100% server-side pixel tracking & attribution clarity",
        "CAC dropped by 62% while scaling budget 4X",
        "Automated multi-stage retargeting capturing high-LTV buyers",
      ],
    },
    bento: {
      challenge:
        "Unoptimized ads and zero conversion API tracking led to an unprofitable 0.9x ROAS, high drop-off rates on uninspired landing pages, and burned marketing capital.",
      solution:
        "Deployed high-converting direct-response funnel architecture, Server-Side Meta Conversions API (CAPI), and hyper-segmented Google Search keyword clusters.",
      stack: ["Meta CAPI", "Google Search Ads", "GA4 Tracking", "Klaviyo Funnels"],
      metrics: [
        { label: "Average ROAS", value: "5.4x", delta: "From 0.9x Unprofitable", highlight: true },
        { label: "CPA Reduction", value: "-62%", delta: "Down to $16.40" },
        { label: "Total Revenue Lift", value: "+280%", delta: "Scaled profitably" },
      ],
    },
  },
];

export default function BeforeAfter() {
  const [activeTab, setActiveTab] = useState<TabPillar["id"]>("webdev");
  const [sliderPos, setSliderPos] = useState<number>(50); // 0 to 100 percentage
  const [isAutoScanning, setIsAutoScanning] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const scanDirection = useRef<number>(1);

  const activePillar = PILLARS.find((p) => p.id === activeTab) || PILLARS[0];

  // Auto-scan oscillation loop
  useEffect(() => {
    if (!isAutoScanning) return;
    const interval = setInterval(() => {
      setSliderPos((prev) => {
        let next = prev + scanDirection.current * 0.7;
        if (next >= 88) {
          scanDirection.current = -1;
          next = 88;
        } else if (next <= 12) {
          scanDirection.current = 1;
          next = 12;
        }
        return next;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [isAutoScanning]);

  // Smooth position updater with clamping
  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, x)));
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsAutoScanning(false);
    isDragging.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging.current) {
      updatePosition(e.clientX);
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <section id="results" className="relative py-24 sm:py-32 overflow-hidden bg-[#07090E] isolate">
      {/* Dynamic Background Atmosphere & Watermark */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.18),transparent_70%)]" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Background Watermark with Localized Hover Spotlight */}
      <SectionWatermark text="TRANSFORM" glowColor="purple" />

      <div className="container max-w-6xl px-4 sm:px-6 mx-auto relative z-10">
        {/* ================= 1. SECTION HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 shadow-[0_0_25px_rgba(99,102,241,0.25)] mb-5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>⚡ REAL CLIENT TRANSFORMATIONS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.12]"
          >
            Real Proven <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-emerald-400">
              Client Transformations
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-neutral-400 mt-4 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
          >
            Switch between the tabs or drag the interactive slider to see how I transform outdated websites, manual workflows, and stagnant traffic into scalable revenue machines.
          </motion.p>

          {/* ================= 2. INTERACTIVE CATEGORY TABS (3 Pillars) ================= */}
          <div className="flex justify-center mt-8 sm:mt-10">
            <div className="p-1.5 rounded-2xl bg-[#0F1420]/90 border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-center gap-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              {PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                const isActive = activeTab === pillar.id;
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(pillar.id);
                      setSliderPos(50);
                      setIsAutoScanning(false);
                    }}
                    className={`relative px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                      isActive ? "text-white shadow-lg" : "text-neutral-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePillarTab"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/25 via-purple-500/25 to-emerald-500/20 border border-indigo-400/50 shadow-[0_0_25px_rgba(99,102,241,0.35)]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <Icon className={`relative z-10 w-4 h-4 ${isActive ? "text-indigo-300" : "text-neutral-400"}`} />
                    <span className="relative z-10">{pillar.tabLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= 3. MAIN INTERACTIVE COMPARISON SLIDER ================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePillar.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl sm:rounded-3xl bg-[#0D111A]/95 border border-white/[0.12] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.7)] mb-8"
          >
            {/* macOS Chrome Header Bar */}
            <div className="px-4 sm:px-6 py-3 border-b border-white/[0.08] bg-[#07090E]/90 backdrop-blur-xl flex items-center justify-between gap-3 text-xs">
              {/* Traffic Light Dots */}
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>

              {/* URL Address Bar with Live Status */}
              <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl bg-black/70 border border-white/10 text-[11px] sm:text-xs font-mono text-neutral-400 max-w-xs sm:max-w-md w-full justify-between shadow-inner">
                <div className="flex items-center gap-2 truncate">
                  <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="text-white font-medium truncate">{activePillar.domain}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LIVE ACTIVE</span>
                </div>
              </div>

              {/* Controls: Auto-Scan & Quick Presets */}
              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setIsAutoScanning(!isAutoScanning)}
                  className={`px-3 py-1 rounded-lg text-[11px] flex items-center gap-1.5 border transition-all ${
                    isAutoScanning
                      ? "bg-indigo-500/25 text-indigo-300 border-indigo-400/60 shadow-[0_0_15px_rgba(99,102,241,0.35)] font-bold"
                      : "bg-white/5 text-neutral-400 border-white/10 hover:text-white"
                  }`}
                  title="Auto-scan before and after"
                >
                  {isAutoScanning ? <Pause className="w-3 h-3 text-indigo-400" /> : <Play className="w-3 h-3 text-indigo-400" />}
                  <span className="hidden md:inline">{isAutoScanning ? "Stop Scan" : "Auto-Scan"}</span>
                </button>

                <div className="hidden sm:flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAutoScanning(false);
                      setSliderPos(0);
                    }}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      sliderPos === 0 ? "bg-rose-500/20 text-rose-300 font-bold" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Before
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAutoScanning(false);
                      setSliderPos(50);
                    }}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      sliderPos === 50 ? "bg-indigo-500/25 text-indigo-300 font-bold" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    50/50
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAutoScanning(false);
                      setSliderPos(100);
                    }}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      sliderPos === 100 ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    After
                  </button>
                </div>
              </div>
            </div>

            {/* Split Screen Draggable Canvas */}
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/10] overflow-hidden select-none touch-none cursor-ew-resize bg-black/95 group"
            >
              {/* ================= LAYER 1: AFTER (Right Full Canvas) ================= */}
              <div className="absolute inset-0">
                <img
                  src={activePillar.after.image}
                  alt={activePillar.after.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090E]/80 via-transparent to-[#07090E]/30 pointer-events-none" />

                {/* Floating After Pillar Impact Badges (Cyber Emerald) */}
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex flex-col items-end gap-2 pointer-events-none max-w-[280px] sm:max-w-none">
                  <div className="px-3.5 py-1.5 rounded-xl bg-black/85 border border-emerald-400/60 backdrop-blur-xl text-[11px] sm:text-xs font-mono font-bold text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>AFTER: {activePillar.after.title}</span>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    {activePillar.after.badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-[10px] sm:text-[11px] font-mono font-semibold text-emerald-300 backdrop-blur-md shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ================= LAYER 2: BEFORE (Left Clipped Canvas) ================= */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <img
                  src={activePillar.before.image}
                  alt={activePillar.before.title}
                  className="w-full h-full object-cover grayscale-[60%] contrast-90 brightness-75"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />

                {/* Floating Before Pillar Pain-Point Badges (Crimson/Amber) */}
                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex flex-col items-start gap-2 pointer-events-none max-w-[280px] sm:max-w-none">
                  <div className="px-3.5 py-1.5 rounded-xl bg-black/85 border border-rose-500/60 backdrop-blur-xl text-[11px] sm:text-xs font-mono font-bold text-rose-300 shadow-[0_0_25px_rgba(239,68,68,0.35)] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>BEFORE: {activePillar.before.title}</span>
                  </div>

                  <div className="flex flex-col items-start gap-1.5">
                    {activePillar.before.badges.map((badge, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-500/40 text-[10px] sm:text-[11px] font-mono font-semibold text-rose-300 backdrop-blur-md shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Draggable Laser Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 pointer-events-none z-20"
                style={{
                  left: `${sliderPos}%`,
                  background: "linear-gradient(180deg, #6366f1 0%, #a855f7 50%, #10b981 100%)",
                  boxShadow: "0 0 20px rgba(99, 102, 241, 1), 0 0 40px rgba(16, 185, 129, 0.7)",
                }}
              >
                {/* Center Grab Handle Orb */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-0 h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-black/95 border-2 border-indigo-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.85)] group-hover:scale-110 transition-transform">
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-tight text-indigo-300">
                    ◀ ▶
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Slider Status Bar */}
            <div className="px-4 sm:px-6 py-2.5 bg-[#07090E]/95 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Drag or click anywhere across the canvas to compare transformation</span>
                <span className="sm:hidden">Swipe to compare</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-white/40">SPLIT:</span>
                <span className="text-emerald-300 font-bold">{Math.round(sliderPos)}% After</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ================= 4. BENTO GRID: IN-DEPTH TRANSFORMATION BREAKDOWN ================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bento-${activePillar.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch mb-14"
          >
            {/* Bento Card 1: The Painful Problem (Before State) */}
            <div className="md:col-span-4 rounded-2xl p-6 sm:p-7 bg-[#0F1420]/80 border border-rose-500/25 flex flex-col justify-between hover:border-rose-500/40 transition-colors backdrop-blur-xl shadow-lg">
              <div>
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>The Problem (Before)</span>
                </div>
                <h4 className="text-base sm:text-lg font-display font-bold text-white mb-2">
                  What was holding them back:
                </h4>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-4">
                  {activePillar.bento.challenge}
                </p>
                <div className="space-y-2 pt-2 border-t border-white/5">
                  {activePillar.before.painPoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-neutral-400">
                      <span className="text-rose-400 font-bold shrink-0">✕</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bento Card 2: The Engineered Architecture (After State) */}
            <div className="md:col-span-4 rounded-2xl p-6 sm:p-7 bg-[#0F1420]/80 border border-indigo-500/25 flex flex-col justify-between hover:border-indigo-500/40 transition-colors backdrop-blur-xl shadow-lg">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
                  <Workflow className="w-4 h-4 text-indigo-400" />
                  <span>The Solution (After)</span>
                </div>
                <h4 className="text-base sm:text-lg font-display font-bold text-white mb-2">
                  What we engineered:
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                  {activePillar.bento.solution}
                </p>
                <div className="space-y-2 pt-2 border-t border-white/5 mb-4">
                  {activePillar.after.gains.map((gain, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-emerald-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{gain}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="pt-3 border-t border-white/10">
                <div className="flex flex-wrap gap-1.5">
                  {activePillar.bento.stack.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bento Card 3: Measured Results & Impact */}
            <div className="md:col-span-4 rounded-2xl p-6 sm:p-7 bg-[#0F1420]/80 border border-emerald-500/35 flex flex-col justify-between shadow-[0_0_40px_rgba(16,185,129,0.15)] backdrop-blur-xl">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
                  <Flame className="w-4 h-4 text-emerald-400" />
                  <span>Verified Impact</span>
                </div>
                <h4 className="text-base sm:text-lg font-display font-bold text-white mb-3">
                  Measurable ROI Delivered:
                </h4>
                <div className="space-y-3">
                  {activePillar.bento.metrics.map((res, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between font-mono"
                    >
                      <div>
                        <span className="text-xs text-neutral-400 block">{res.label}</span>
                        {res.delta && (
                          <span className="text-[10px] text-emerald-400/90 block mt-0.5 font-semibold">
                            {res.delta}
                          </span>
                        )}
                      </div>
                      <span className={`text-xl font-display font-extrabold ${res.highlight ? "text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]" : "text-white"}`}>
                        {res.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ================= 5. BOTTOM SUMMARY METRICS BAR (Bento Strip) ================= */}
        <div className="mb-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {/* Card 1: Traffic & Conversion */}
            <div className="rounded-2xl p-5 sm:p-6 bg-[#0D111A]/90 border border-white/10 hover:border-emerald-500/40 transition-all flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400 font-mono leading-none">
                  +320%
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white mt-1">
                  Avg. Traffic & Conversion Lift
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Measured across 40+ client redesigns
                </div>
              </div>
            </div>

            {/* Card 2: Hours Saved via AI */}
            <div className="rounded-2xl p-5 sm:p-6 bg-[#0D111A]/90 border border-white/10 hover:border-indigo-500/40 transition-all flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-indigo-400 font-mono leading-none">
                  1,500+
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white mt-1">
                  Hours Saved via AI Agents
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Autonomous CRM triage & lead workflows
                </div>
              </div>
            </div>

            {/* Card 3: Google PageSpeed */}
            <div className="rounded-2xl p-5 sm:p-6 bg-[#0D111A]/90 border border-white/10 hover:border-amber-400/40 transition-all flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-amber-300 font-mono leading-none">
                  99/100
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white mt-1">
                  Google PageSpeed Performance
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Sub-second edge CDN & clean codebases
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 6. CALL TO ACTION (CTA) ================= */}
        <div className="text-center p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0F1420] to-[#07090E] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-indigo-500/15 blur-3xl pointer-events-none" />

          <p className="text-base sm:text-lg font-medium text-neutral-300 mb-6">
            Want your business to look like the <span className="text-emerald-400 font-bold">&quot;After&quot;</span> side?
          </p>

          <button
            type="button"
            onClick={() => scrollToSection("contact")}
            className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-emerald-500 text-white font-bold text-sm sm:text-base shadow-[0_0_35px_rgba(99,102,241,0.5)] hover:shadow-[0_0_50px_rgba(16,185,129,0.7)] hover:scale-105 active:scale-95 transition-all group"
          >
            <span>Book Your Free Growth & Automation Audit</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}