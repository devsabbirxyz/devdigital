import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  Zap,
  Lock,
  Award,
  CheckCircle2,
  Calendar,
  TrendingUp,
  XCircle,
  ChevronRight,
  ChevronDown,
  Clock,
  Cpu,
  FileCheck,
  Headphones,
  Check,
  Star,
  Shield,
  BarChart3,
  RefreshCw,
  Globe,
  Code2,
  ArrowRight,
  BadgeCheck,
  Activity,
  Layers,
  Database,
  Eye,
  Target,
} from "lucide-react";
import SectionWatermark from "@/components/ui/SectionWatermark";
import { openBookingModal } from "@/components/site/BookingModal";

type ActiveTab = "guarantees" | "comparison" | "protocol";

// ── Animated Counter Hook ──────────────────────────────────────────────────────
function useCounter(target: number, duration = 1800, inView = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

// ── Trust Score Ring ───────────────────────────────────────────────────────────
function TrustScoreRing({ score, inView }: { score: number; inView: boolean }) {
  const [displayed, setDisplayed] = useState(0);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (displayed / 100) * circumference;

  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const timer = setInterval(() => {
      v += 1;
      setDisplayed(v);
      if (v >= score) clearInterval(timer);
    }, 18);
    return () => clearInterval(timer);
  }, [inView, score]);

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
        <circle
          cx="60" cy="60" r="54"
          fill="none"
          stroke="url(#trustGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.05s linear" }}
        />
        <defs>
          <linearGradient id="trustGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center z-10">
        <span className="text-3xl font-black text-white">{displayed}</span>
        <span className="text-lg font-bold text-primary">%</span>
        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold mt-0.5">Trust Score</p>
      </div>
    </div>
  );
}

// ── Live Metric Card ───────────────────────────────────────────────────────────
function LiveMetric({ value, suffix, label, icon: Icon, color, delay, inView }: {
  value: number; suffix: string; label: string; icon: any; color: string; delay: number; inView: boolean;
}) {
  const counted = useCounter(value, 2000, inView);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="glass rounded-2xl p-3.5 sm:p-5 border border-white/10 hover:border-primary/40 transition-all group relative overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative z-10">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <div className="flex items-end gap-1">
          <span className="text-2xl sm:text-3xl font-black text-white leading-none">{counted}</span>
          <span className="text-base sm:text-lg font-bold text-primary pb-0.5">{suffix}</span>
        </div>
        <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 font-medium line-clamp-1">{label}</p>
      </div>
    </motion.div>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────────
const GUARANTEES = [
  {
    id: "g-satisfaction",
    icon: ShieldCheck,
    title: "100% Satisfaction & Milestone Sprint Commitment",
    shortTag: "RISK-FREE",
    tagColor: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    desc: "We iterate, refine, and optimize during active development sprints until every visual detail, responsiveness benchmark, and conversion metric aligns with your exact vision.",
    slaMetric: "Unlimited Sprint Iterations",
    gradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
    border: "border-purple-500/30",
    glow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]",
    accentColor: "text-purple-400",
    commitments: [
      "Real-time visual previews shared on live staging URLs",
      "Immediate design tweaks executed within 24–48 hours",
      "No final sign-off until you are 100% thrilled",
    ],
    protocolNote: "Verified through staging approvals before any production deployment.",
  },
  {
    id: "g-escrow",
    icon: Lock,
    title: "Milestone-Based Escrow & Zero Upfront Lock-in",
    shortTag: "ZERO RISK",
    tagColor: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    desc: "Never pay 100% upfront into a black hole. Projects are broken into clear milestone phases: 50% deposit to initiate architecture, 50% released only upon verified handover.",
    slaMetric: "Phased Milestone Release",
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
    border: "border-blue-500/30",
    glow: "hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]",
    accentColor: "text-blue-400",
    commitments: [
      "Transparent milestone scope documented before invoice",
      "You inspect working features before releasing milestones",
      "Zero monthly retainer lock-ins (cancel anytime, 15 days notice)",
    ],
    protocolNote: "Guarantees complete alignment between developer incentives and client goals.",
  },
  {
    id: "g-speed",
    icon: Zap,
    title: "Sub-Second Performance & 90+ Core Web Vitals SLA",
    shortTag: "90+ GUARANTEED",
    tagColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    desc: "Slow sites kill ad ROAS. Every platform is engineered with headless frameworks, edge caching, and zero layout shift — guaranteed 90+ Google Lighthouse mobile scores.",
    slaMetric: "< 0.8s Time to Interactive",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    border: "border-emerald-500/30",
    glow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]",
    accentColor: "text-emerald-400",
    commitments: [
      "Cloudflare edge CDN & sub-second global asset delivery",
      "Full SSR & WebP image pipelines with next-gen formats",
      "Passes Google Core Web Vitals (LCP, INP, CLS) guaranteed",
    ],
    protocolNote: "If your custom site scores below 90 on launch, we optimize free of charge.",
  },
  {
    id: "g-ip",
    icon: Award,
    title: "100% Full IP, Code & Ad Account Ownership",
    shortTag: "NDA PROTECTED",
    tagColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    desc: "No hostage code or proprietary locks. All source code, GitHub repositories, Supabase tables, and advertising campaign pixels belong 100% to you under a strict binding NDA.",
    slaMetric: "Full Repository Transfer",
    gradient: "from-amber-500/20 via-rose-500/10 to-transparent",
    border: "border-amber-500/30",
    glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]",
    accentColor: "text-amber-400",
    commitments: [
      "Full admin transfer of GitHub, Vercel & Supabase environments",
      "All Meta & Google Ads data resides in your own business manager",
      "Mutual Non-Disclosure Agreement (NDA) signed upon request",
    ],
    protocolNote: "You retain full independence and can scale your in-house team effortlessly.",
  },
];

const COMPARISON_ROWS = [
  { feature: "Payment Structure", icon: Database, us: "Milestone escrow & 50/50 phase approval", agency: "Demands 100% upfront or 6-month lock-in", freelancer: "Unpredictable upfront requests with zero escrow" },
  { feature: "Engineered Speed & SLA", icon: Zap, us: "Sub-second (<0.8s) & guaranteed 90+ Lighthouse", agency: "Bloated 5–8s templates with 30+ plugins", freelancer: "Generic templates with zero speed optimization" },
  { feature: "Ad Tracking & Conversion", icon: Target, us: "Server-side Meta CAPI (95%+ match quality)", agency: "Basic browser pixel suffering 40% iOS loss", freelancer: "Often ignores server-side API completely" },
  { feature: "Code & Data Ownership", icon: Code2, us: "100% Git transfer & full IP ownership under NDA", agency: "Holds proprietary CMS hostage upon cancellation", freelancer: "Messy repositories with missing documentation" },
  { feature: "Communication Channel", icon: Headphones, us: "Direct WhatsApp & Slack line with Sabbir (Founder)", agency: "Junior account manager playing telephone", freelancer: "Ghosting, irregular replies & broken deadlines" },
  { feature: "Post-Launch Support", icon: RefreshCw, us: "30-Day included optimization & warranty sprint", agency: "Hefty hourly change-order invoices", freelancer: "Vanishes immediately after final invoice" },
  { feature: "Reporting & Analytics", icon: BarChart3, us: "Weekly KPI dashboards with live attribution data", agency: "Monthly vanity PDFs with no action items", freelancer: "Rarely provides any performance reporting" },
];

const PROTOCOL_STEPS = [
  { step: "01", title: "Discovery & Mutual NDA", desc: "We diagnose your bottlenecks, align on measurable KPIs, and sign a strict mutual NDA to protect your company's intellectual property.", icon: FileCheck, tag: "Day 01", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  { step: "02", title: "Milestone Escrow Lock", desc: "Deliverables are divided into transparent phases. Initial 50% deposit locks in dedicated sprint calendar; remaining balance stays in escrow.", icon: Lock, tag: "Day 02", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { step: "03", title: "Sprint Execution & Staging Previews", desc: "We build on private staging environments. You receive weekly video walkthroughs and interactive links to test features in real-time.", icon: Cpu, tag: "Days 03–12", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  { step: "04", title: "Performance & CAPI Stress Audit", desc: "Before production rollout, we audit Google Lighthouse 90+ speed scores, server-side CAPI event matching, and checkout flows.", icon: Zap, tag: "Pre-Launch", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { step: "05", title: "Full Production Handover & 30-Day Warranty", desc: "Domain pointing, complete GitHub repository admin transfer, and 30 days of included post-launch monitoring and optimization.", icon: ShieldCheck, tag: "Launch & Beyond", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
];

const BADGES = [
  { id: "meta", name: "Meta Certified", sub: "Server-Side CAPI & ROAS", dot: "bg-blue-400", ring: "border-blue-500/30 hover:border-blue-400" },
  { id: "google", name: "Google Ads Certified", sub: "Search, P-Max & Display", dot: "bg-red-400", ring: "border-red-500/30 hover:border-red-400" },
  { id: "upwork", name: "Upwork Top Rated", sub: "100% Job Success Score", dot: "bg-emerald-400", ring: "border-emerald-500/30 hover:border-emerald-400" },
  { id: "clutch", name: "Clutch 5.0 Rating", sub: "Verified Client Reviews", dot: "bg-amber-400", ring: "border-amber-500/30 hover:border-amber-400" },
  { id: "stripe", name: "Stripe Verified", sub: "Secure Global Gateways", dot: "bg-cyan-400", ring: "border-cyan-500/30 hover:border-cyan-400" },
  { id: "sla", name: "24/7 Priority SLA", sub: "< 4h Rapid Response", dot: "bg-purple-400", ring: "border-purple-500/30 hover:border-purple-400" },
];

// ── Main Component ─────────────────────────────────────────────────────────────
export default function TrustGuarantee() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("guarantees");
  const [expandedGuarantee, setExpandedGuarantee] = useState<string | null>("g-satisfaction");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const tabs: { key: ActiveTab; label: string; icon: any }[] = [
    { key: "guarantees", label: "Executive Guarantees", icon: ShieldCheck },
    { key: "comparison", label: "Us vs Others", icon: TrendingUp },
    { key: "protocol", label: "Escrow Protocol", icon: Lock },
  ];

  return (
    <section id="guarantee" className="relative py-10 sm:py-16 md:py-28 overflow-hidden bg-[#0A0C11]" ref={ref}>
      <SectionWatermark text="TRUST" glowColor="cyan" />

      {/* Subtle Ambient Radial Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[160px] opacity-20"
          style={{ background: "radial-gradient(circle, #0099FF 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full blur-[140px] opacity-15"
          style={{ background: "radial-gradient(circle, #38BDF8 0%, transparent 70%)" }}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 max-w-7xl mx-auto">

        {/* ══ HEADER + LIVE METRICS ══════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 items-center mb-6 sm:mb-10 md:mb-14">
          {/* Left: Text */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 border border-primary/25 mb-3 sm:mb-5 shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
              <span>Executive Peace of Mind • Zero Risk Architecture</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-3 sm:mb-4"
            >
              Built on{" "}
              <span className="relative inline-block">
                <span className="text-gradient">Absolute Trust</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 origin-left"
                />
              </span>{" "}
              &{" "}
              <span className="text-gradient">Measurable ROI</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-xs sm:text-base leading-relaxed max-w-xl"
            >
              Hiring an engineer or marketing growth squad should never feel like a gamble. 
              We protect your capital, code ownership, and timelines with ironclad guarantees — 
              every single sprint, every single deliverable.
            </motion.p>
          </div>

          {/* Right: Trust Score Ring + Live Metrics */}
          <div className="lg:col-span-2 flex flex-col items-center gap-4 sm:gap-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/15 text-center w-full max-w-xs mx-auto"
            >
              <div className="flex justify-center mb-2 sm:mb-3">
                <TrustScoreRing score={98} inView={inView} />
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground font-medium">Based on 47 verified client reviews</p>
              <div className="flex items-center justify-center gap-1 mt-1.5 sm:mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-amber-300 ml-1">5.0</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ══ LIVE METRICS ROW ═══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-6 sm:mb-12">
          <LiveMetric value={47} suffix="+" label="Projects Delivered" icon={CheckCircle2} color="from-purple-500/10 to-transparent" delay={0.1} inView={inView} />
          <LiveMetric value={98} suffix="%" label="Client Satisfaction" icon={Star} color="from-amber-500/10 to-transparent" delay={0.2} inView={inView} />
          <LiveMetric value={90} suffix="+" label="Lighthouse Score" icon={Zap} color="from-emerald-500/10 to-transparent" delay={0.3} inView={inView} />
          <LiveMetric value={30} suffix=" Day" label="Post-Launch Warranty" icon={ShieldCheck} color="from-cyan-500/10 to-transparent" delay={0.4} inView={inView} />
        </div>

        {/* ══ TAB SWITCHER ═══════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-center mb-6 sm:mb-10">
          <div className="p-1 rounded-full glass-strong border border-white/15 flex flex-wrap items-center justify-center gap-1 shadow-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 sm:gap-2 ${
                    activeTab === tab.key
                      ? "bg-gradient-primary text-white shadow-neon"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ══ TAB 1: EXECUTIVE GUARANTEES — BENTO LAYOUT ══════════════════════════ */}
        <AnimatePresence mode="wait">
          {activeTab === "guarantees" && (
            <motion.div
              key="guarantees"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* ── Row 1: Hero card (full width) ── */}
              {(() => {
                const item = GUARANTEES[0];
                const Icon = item.icon;
                const isExpanded = expandedGuarantee === item.id;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                    className="relative rounded-3xl overflow-hidden group cursor-default"
                  >
                    {/* Full-bleed gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#10121A] via-[#121520] to-[#0A0C11]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,153,255,0.2),transparent_60%)]" />
                    <div className="absolute top-0 right-0 w-72 h-72 bg-[#0099FF]/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0 opacity-[0.04]"
                      style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "40px 40px" }}
                    />

                    <div className="relative z-10 border border-[#0099FF]/30 rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-9 flex flex-col sm:flex-row gap-4 sm:gap-8 items-start">
                      {/* Left: Big number + content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2.5 sm:gap-3 mb-3.5 sm:mb-5">
                          <span className="text-[10px] sm:text-[11px] font-mono font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#0099FF]/20 text-[#38BDF8] border border-[#0099FF]/40 tracking-widest">
                            {item.shortTag}
                          </span>
                          <span className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono text-emerald-400 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            ACTIVE GUARANTEE
                          </span>
                        </div>

                        <div className="flex items-start gap-3 sm:gap-5">
                          <span className="font-black text-[38px] sm:text-[100px] leading-none text-white/10 sm:text-white/5 select-none shrink-0 -mt-1 sm:-mt-2">01</span>
                          <div>
                            <h3 className="text-lg sm:text-2xl font-display font-extrabold text-white leading-snug mb-2 sm:mb-3">
                              {item.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-4 sm:mb-5">{item.desc}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {item.commitments.map((c, i) => (
                                <div key={i} className="flex items-start gap-2 text-[11px] sm:text-xs text-white/80 bg-white/5 rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 border border-white/8">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{c}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: SLA pill */}
                      <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-3 shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                        <div className="w-12 h-12 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-6 h-6 sm:w-10 sm:h-10 text-purple-300" />
                        </div>
                        <div className="text-left sm:text-center">
                          <div className="text-[9px] sm:text-[10px] text-muted-foreground font-mono">SLA Metric</div>
                          <div className="text-xs font-bold text-purple-300 mt-0.5">{item.slaMetric}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setExpandedGuarantee(p => p === item.id ? null : item.id)}
                          className="mt-1 text-[11px] font-semibold px-4 py-2 rounded-xl bg-white/8 border border-white/15 text-white/70 hover:text-white hover:bg-white/15 transition flex items-center gap-1.5"
                        >
                          {isExpanded ? "Hide Clause" : "View Clause"}
                          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="relative z-10 mx-7 sm:mx-9 mb-7 text-[11px] font-mono text-purple-200/70 bg-black/60 border border-purple-500/20 px-4 py-3 rounded-xl"
                        >
                          <span className="text-purple-400 font-bold block mb-1">Protocol Enforcement:</span>
                          {item.protocolNote}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })()}

              {/* ── Row 2: Three compact horizontal strip cards ── */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {GUARANTEES.slice(1).map((item, idx) => {
                  const Icon = item.icon;
                  const isExpanded = expandedGuarantee === item.id;
                  const numLabel = ["02", "03", "04"][idx];

                  const stripColors: Record<string, { bg: string; border: string; icon: string; tag: string; num: string }> = {
                    "g-escrow":  { bg: "from-blue-900/40 to-background",   border: "border-blue-500/30",   icon: "text-blue-400",   tag: "bg-blue-500/15 text-blue-300 border-blue-500/30",   num: "text-blue-500/10" },
                    "g-speed":   { bg: "from-emerald-900/40 to-background", border: "border-emerald-500/30", icon: "text-emerald-400", tag: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", num: "text-emerald-500/10" },
                    "g-ip":      { bg: "from-amber-900/40 to-background",   border: "border-amber-500/30",   icon: "text-amber-400",   tag: "bg-amber-500/15 text-amber-300 border-amber-500/30",   num: "text-amber-500/10" },
                  };
                  const c = stripColors[item.id];

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.08 }}
                      className={`relative rounded-2xl overflow-hidden group cursor-default`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-b ${c.bg}`} />
                      <div className="absolute inset-0 bg-black/20" />

                      <div className={`relative z-10 border ${c.border} rounded-2xl p-4 sm:p-5 flex flex-col h-full`}>
                        {/* Top row */}
                        <div className="flex items-start justify-between mb-3">
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${c.tag}`}>
                            {item.shortTag}
                          </span>
                          <span className={`font-black text-5xl leading-none select-none ${c.num}`}>{numLabel}</span>
                        </div>

                        {/* Icon */}
                        <div className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-5 h-5 ${c.icon}`} />
                        </div>

                        <h3 className="text-base font-display font-extrabold text-foreground mb-2 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-[11px] text-muted-foreground leading-relaxed mb-4 flex-1">{item.desc}</p>

                        {/* Commitments */}
                        <div className="space-y-1.5 mb-4">
                          {item.commitments.map((c2, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-[11px] text-foreground/80">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{c2}</span>
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="pt-3 border-t border-white/8 flex items-center justify-between">
                          <span className={`text-[10px] font-mono font-bold flex items-center gap-1 ${c.icon}`}>
                            <Zap className="w-3 h-3" />
                            {item.slaMetric}
                          </span>
                          <button
                            type="button"
                            onClick={() => setExpandedGuarantee(p => p === item.id ? null : item.id)}
                            className="text-[10px] font-semibold text-muted-foreground hover:text-white transition flex items-center gap-1"
                          >
                            {isExpanded ? "Hide" : "Terms"}
                            {isExpanded ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />}
                          </button>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 text-[10px] font-mono text-muted-foreground bg-black/50 border border-white/5 px-3 py-2.5 rounded-xl"
                            >
                              <span className={`font-bold block mb-1 ${c.icon}`}>Protocol:</span>
                              {item.protocolNote}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}



          {/* ══ TAB 2: US VS OTHERS MATRIX ═══════════════════════════════════════ */}
          {activeTab === "comparison" && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Side-by-Side Industry Comparison
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-display mt-2">
                  Why Ambitious Brands Partner with{" "}
                  <span className="text-gradient">DevDigital</span>
                </h3>
              </div>

              {/* Desktop table */}
              <div className="hidden md:block glass-strong rounded-3xl border border-white/15 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-4 px-6 text-xs uppercase tracking-wider text-muted-foreground font-semibold w-[22%]">Factor</th>
                      <th className="py-4 px-6 text-xs uppercase tracking-wider font-bold text-white bg-primary/15 border-x border-primary/25 w-[28%]">
                        <span className="flex items-center gap-2 text-primary">
                          <Sparkles className="w-4 h-4 text-accent" />
                          DevDigital (Sabbir)
                        </span>
                      </th>
                      <th className="py-4 px-6 text-xs uppercase tracking-wider text-muted-foreground font-semibold w-[25%]">Traditional Agencies</th>
                      <th className="py-4 px-6 text-xs uppercase tracking-wider text-muted-foreground font-semibold w-[25%]">Random Freelancers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {COMPARISON_ROWS.map((row, idx) => {
                      const RowIcon = row.icon;
                      return (
                        <motion.tr
                          key={idx}
                          onHoverStart={() => setHoveredRow(idx)}
                          onHoverEnd={() => setHoveredRow(null)}
                          className={`transition-colors ${hoveredRow === idx ? "bg-white/[0.03]" : ""}`}
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                                <RowIcon className="w-3.5 h-3.5 text-muted-foreground" />
                              </div>
                              <span className="text-xs font-semibold text-foreground">{row.feature}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 bg-primary/8 border-x border-primary/20">
                            <div className="flex items-start gap-2 text-xs font-semibold text-emerald-300">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{row.us}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                              <XCircle className="w-4 h-4 text-rose-400/70 shrink-0 mt-0.5" />
                              <span>{row.agency}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                              <XCircle className="w-4 h-4 text-rose-400/70 shrink-0 mt-0.5" />
                              <span>{row.freelancer}</span>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-4">
                {COMPARISON_ROWS.map((row, idx) => {
                  const RowIcon = row.icon;
                  return (
                    <div key={idx} className="glass-strong rounded-2xl border border-white/10 overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/8">
                        <RowIcon className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-foreground">{row.feature}</span>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-start gap-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong className="text-emerald-400">DevDigital:</strong> {row.us}</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                          <XCircle className="w-3.5 h-3.5 text-rose-400/70 shrink-0 mt-0.5" />
                          <span><strong className="text-foreground/60">Agency:</strong> {row.agency}</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                          <XCircle className="w-3.5 h-3.5 text-rose-400/70 shrink-0 mt-0.5" />
                          <span><strong className="text-foreground/60">Freelancer:</strong> {row.freelancer}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ══ TAB 3: ESCROW PROTOCOL ════════════════════════════════════════════ */}
          {activeTab === "protocol" && (
            <motion.div
              key="protocol"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-10 max-w-2xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">
                  Transparent Execution Blueprint
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-display mt-2">
                  How Your Capital & Timelines Stay Protected
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-3">
                  Every project runs through a verified 5-stage pipeline with strict quality gates at every release.
                </p>
              </div>

              {/* Connector line (desktop) */}
              <div className="relative">
                <div className="hidden md:block absolute top-14 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-purple-500/30 via-cyan-500/30 to-emerald-500/30 z-0" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
                  {PROTOCOL_STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                      <motion.div
                        key={step.step}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-strong rounded-2xl p-5 border border-white/10 hover:border-primary/40 transition-all group shadow-md flex flex-col"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-mono text-2xl font-black text-primary/30 group-hover:text-primary/70 transition-colors">
                            {step.step}
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${step.bg} ${step.color}`}>
                            {step.tag}
                          </span>
                        </div>

                        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${step.bg}`}>
                          <Icon className={`w-5 h-5 ${step.color}`} />
                        </div>

                        <h4 className="text-sm font-bold text-foreground mb-2 leading-snug">{step.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed flex-1">{step.desc}</p>

                        <div className={`mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-bold ${step.color}`}>
                          <Check className="w-3 h-3" />
                          Gate Verified
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ ACCREDITATIONS ═════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-8 sm:mt-14 glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-white/15 shadow-xl"
        >
          <div className="text-center mb-4 sm:mb-6">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Verified Industry Accreditations & Trust Signals
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 mb-6 sm:mb-8">
            {BADGES.map((b) => (
              <div
                key={b.id}
                className={`glass rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border ${b.ring} transition-all text-center cursor-default group hover:scale-105`}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1.5 sm:mb-2">
                  <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${b.dot} animate-pulse`} />
                  <span className="text-[9px] sm:text-[10px] font-mono text-muted-foreground">Live</span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-foreground leading-tight">{b.name}</div>
                <div className="text-[9px] sm:text-[10px] text-primary font-mono mt-1 leading-tight">{b.sub}</div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <h4 className="text-base font-bold text-foreground flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Ready to engineer your growth with zero risk?
              </h4>
              <p className="text-xs text-muted-foreground">
                Book a free 15-minute discovery call. We diagnose your bottleneck and draft an implementation scope — no cost, no commitment.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => openBookingModal("Executive Guarantee Inquiry")}
                className="relative group w-full sm:w-auto text-white text-sm font-bold px-7 py-3.5 rounded-full border border-white/30 hover:border-white/60 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_25px_rgba(59,130,246,0.35)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_0_35px_rgba(14,165,233,0.55)] overflow-hidden flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.20) 0%, rgba(37, 99, 235, 0.35) 50%, rgba(14, 165, 233, 0.22) 100%)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
              >
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                />
                <Calendar className="w-4 h-4 text-cyan-300 relative z-10" />
                <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">Schedule 15-Min Strategy Call</span>
                <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform relative z-10" />
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
