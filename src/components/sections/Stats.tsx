import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  TrendingUp,
  Zap,
  Bot,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Activity,
  Layers,
  Award,
  DollarSign,
  Clock,
  Globe,
  SlidersHorizontal,
} from "lucide-react";
import HolographicCard from "@/components/ui/HolographicCard";
import SectionWatermark from "@/components/ui/SectionWatermark";
import { openBookingModal } from "@/components/site/BookingModal";

export type StatItem = {
  id: string;
  category: "SCALE" | "MARKETING" | "ENGINEERING" | "AUTOMATION" | "REVENUE" | "TRUST";
  value: number;
  prefix?: string;
  suffix: string;
  decimals?: number;
  title: string;
  description: string;
  verifiedBadge: string;
  icon: any;
  accentGradient: string;
  glowColor: string;
  benchmarkPercent: number; // For progress bar visual
  traditionalValue: string; // For comparison
  highlightMetric: string;
};

const STATS_DATA: StatItem[] = [
  {
    id: "stat-1",
    category: "SCALE",
    value: 120,
    suffix: "+",
    title: "Global Systems Deployed",
    description: "Across 4 continents, 15+ niches, including e-commerce, healthcare & logistics.",
    verifiedBadge: "Worldwide Footprint",
    icon: Briefcase,
    accentGradient: "from-blue-500 to-cyan-500",
    glowColor: "rgba(6, 182, 212, 0.4)",
    benchmarkPercent: 95,
    traditionalValue: "10-15 Local",
    highlightMetric: "4 Continents & 15+ Niches",
  },
  {
    id: "stat-2",
    category: "MARKETING",
    value: 4.8,
    suffix: "x",
    decimals: 1,
    title: "Average Client ROAS",
    description: "Meta Conversions API (CAPI) + Google Search funnels with zero cookie drop.",
    verifiedBadge: "95%+ CAPI Match",
    icon: TrendingUp,
    accentGradient: "from-amber-500 to-orange-500",
    glowColor: "rgba(245, 158, 11, 0.4)",
    benchmarkPercent: 92,
    traditionalValue: "1.4x - 1.8x ROAS",
    highlightMetric: "+240% Blended ROI",
  },
  {
    id: "stat-3",
    category: "ENGINEERING",
    value: 99,
    suffix: "/100",
    title: "Lighthouse Speed Score",
    description: "Sub-second Next.js edge architecture with zero layout shift & 0.4s load times.",
    verifiedBadge: "< 0.4s Core Web Vitals",
    icon: Zap,
    accentGradient: "from-purple-500 to-indigo-500",
    glowColor: "rgba(168, 85, 247, 0.4)",
    benchmarkPercent: 99,
    traditionalValue: "38/100 (4.8s lag)",
    highlightMetric: "Sub-40ms Edge Latency",
  },
  {
    id: "stat-4",
    category: "AUTOMATION",
    value: 85,
    suffix: "%",
    title: "Manual Ops Eliminated",
    description: "24/7 autonomous Make.com & n8n webhooks routing leads in under 15 seconds.",
    verifiedBadge: "< 15s Lead Dispatch",
    icon: Bot,
    accentGradient: "from-emerald-500 to-teal-500",
    glowColor: "rgba(16, 185, 129, 0.4)",
    benchmarkPercent: 88,
    traditionalValue: "0% (Manual Sheets)",
    highlightMetric: "Zero Human Bottlenecks",
  },
  {
    id: "stat-5",
    category: "REVENUE",
    prefix: "$",
    value: 3.2,
    suffix: "M+",
    decimals: 1,
    title: "Tracked Client Revenue",
    description: "Total verified client sales and ad-attributed GMV scaled through modern funnels.",
    verifiedBadge: "Audited GMV Impact",
    icon: DollarSign,
    accentGradient: "from-emerald-400 to-cyan-500",
    glowColor: "rgba(52, 211, 153, 0.4)",
    benchmarkPercent: 96,
    traditionalValue: "Unmeasured",
    highlightMetric: "Direct Revenue Attribution",
  },
  {
    id: "stat-6",
    category: "TRUST",
    value: 98,
    suffix: "%",
    title: "Client Retention & CSAT",
    description: "Milestone escrow delivery model and unlimited sprint revisions until 100% satisfied.",
    verifiedBadge: "100% Risk-Free SLA",
    icon: ShieldCheck,
    accentGradient: "from-pink-500 to-rose-500",
    glowColor: "rgba(244, 63, 94, 0.4)",
    benchmarkPercent: 98,
    traditionalValue: "52% Retention",
    highlightMetric: "Zero Hostage Code",
  },
];

function Counter({
  to,
  suffix,
  prefix = "",
  decimals = 0,
}: {
  to: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, to]);

  const formatted = decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toString();

  return (
    <span ref={ref} className="tabular-nums font-mono">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const [viewMode, setViewMode] = useState<"devdigital" | "comparison">("devdigital");
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  return (
    <section id="stats" className="relative py-12 sm:py-20 md:py-28 overflow-hidden bg-[#0A0C11] isolate">
      <SectionWatermark text="METRICS" glowColor="cyan" />

      {/* Cyber Ambient Lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[400px] rounded-full blur-[160px] opacity-20"
          style={{ background: "radial-gradient(circle, #0099FF 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[480px] h-[380px] rounded-full blur-[140px] opacity-15"
          style={{ background: "radial-gradient(circle, #38BDF8 0%, transparent 70%)" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] text-cyan-400 uppercase bg-cyan-500/10 border border-cyan-500/30 mb-3 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>REAL-TIME AUDITED TELEMETRY &bull; PROVEN TRACK RECORD</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Measurable Numbers That <span className="text-gradient">Define Success</span>
          </h2>

          <p className="text-muted-foreground mt-2 sm:mt-3 text-xs sm:text-base leading-relaxed">
            Not vanity promises — hard performance benchmarks and profitable acquisition metrics engineered across 120+ client ecosystems worldwide.
          </p>

          {/* Interactive Toggle: Live Numbers vs Industry Benchmark */}
          <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6">
            <div className="p-1 rounded-full glass-strong border border-white/15 flex items-center shadow-lg">
              <button
                type="button"
                onClick={() => setViewMode("devdigital")}
                className={`px-3.5 sm:px-5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === "devdigital"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-neon"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span>DevDigital Verified Metrics</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("comparison")}
                className={`px-3.5 sm:px-5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === "comparison"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-purple-200" />
                <span>Vs. Industry Standard</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* ------------------------------------------------------------- */}
        {/* 6-CARD ADVANCED CYBER COMMAND GRID */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-10 sm:mb-14">
          {STATS_DATA.map((item, idx) => {
            const Icon = item.icon;
            const isHovered = activeCardId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                onMouseEnter={() => setActiveCardId(item.id)}
                onMouseLeave={() => setActiveCardId(null)}
                className="cursor-pointer"
              >
                <HolographicCard
                  className={`h-full p-4 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-500 glass-strong flex flex-col justify-between ${
                    isHovered
                      ? "border-primary/60 shadow-[0_15px_40px_rgba(0,153,255,0.25)] scale-[1.02]"
                      : "border-white/10 hover:border-white/25"
                  }`}
                  tiltStrength={6}
                  enableBorderBeam={isHovered}
                  enableGlare={true}
                >
                  <div>
                    {/* Top Row: Category Pill & Verified Badge */}
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                        {item.category}
                      </span>

                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/35 text-emerald-300 font-mono text-[10px] font-semibold">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                        </span>
                        <span>{item.verifiedBadge}</span>
                      </div>
                    </div>

                    {/* Icon + Number Row */}
                    <div className="flex items-center gap-3.5 mb-3">
                      <div
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${item.accentGradient} flex items-center justify-center text-white shadow-lg shrink-0`}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-white leading-none tracking-tight">
                          <Counter
                            to={item.value}
                            suffix={item.suffix}
                            prefix={item.prefix}
                            decimals={item.decimals}
                          />
                        </div>
                        <p className="text-[11px] font-mono text-cyan-300 font-semibold mt-1 truncate">
                          {item.highlightMetric}
                        </p>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-display text-base sm:text-lg font-bold text-white mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Benchmark Comparison Bar (Dynamic by Toggle Mode) */}
                  <div className="pt-3 border-t border-white/10">
                    {viewMode === "devdigital" ? (
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground mb-1.5">
                          <span>SLA Performance Index</span>
                          <span className="text-emerald-400 font-bold">{item.benchmarkPercent}% Peak</span>
                        </div>
                        {/* High-Tech Progress Track */}
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden p-0.2">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.benchmarkPercent}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`h-full rounded-full bg-gradient-to-r ${item.accentGradient}`}
                          />
                        </div>
                      </div>
                    ) : (
                      /* Industry Delta Mode */
                      <div className="flex items-center justify-between text-xs font-mono p-2 rounded-xl bg-white/[0.03] border border-white/5">
                        <span className="text-muted-foreground text-[10px]">Standard Agency:</span>
                        <span className="text-rose-400 font-bold text-[11px] line-through decoration-rose-500/60">
                          {item.traditionalValue}
                        </span>
                        <span className="text-emerald-400 font-black text-[11px] ml-1">
                          +240% Lift
                        </span>
                      </div>
                    )}
                  </div>
                </HolographicCard>
              </motion.div>
            );
          })}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* EXECUTIVE PROOF BANNER FOOTER */}
        {/* ------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl sm:rounded-3xl glass-strong border border-white/15 p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto shadow-2xl bg-gradient-to-r from-black/60 via-purple-950/20 to-black/60"
        >
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-neon">
              <ShieldCheck className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                Ready to turn your metrics into verified revenue?
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Every project is secured with milestone escrow, 90+ speed SLA, and full IP handover.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openBookingModal("Claim Free Metrics & Growth Audit")}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-primary text-white text-xs sm:text-sm font-bold shadow-neon hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Book 15-Min Strategy Session</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
