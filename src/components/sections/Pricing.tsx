import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Headphones,
  Calendar,
  ArrowRight,
  Sparkles,
  Clock,
  RotateCcw,
} from "lucide-react";
import ContactPopup from "@/components/site/ContactPopup";
import { openBookingModal } from "@/components/site/BookingModal";
import SectionWatermark from "@/components/ui/SectionWatermark";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export type BillingCycle = "monthly" | "annually";
export type Currency = "USD" | "BDT";

export interface PricingPlan {
  id: string;
  name: string;
  priceUSD: { monthly: string; annual: string; period: string };
  priceBDT: { monthly: string; annual: string; period: string };
  description: string;
  isPopular?: boolean;
  ctaText: string;
  ctaVariant: "free" | "popular" | "standard";
  bookingTopic: string;
  coreDeliverables: string[];
  features: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free Discovery",
    priceUSD: { monthly: "$0", annual: "$0", period: "Free 1:1 Session" },
    priceBDT: { monthly: "৳০", annual: "৳০", period: "ফ্রি ১:১ স্ট্র্যাটেজি" },
    description: "Book a direct 30-minute strategy meeting with Sabbir to audit your ads, website, and growth roadmap.",
    isPopular: false,
    ctaText: "Book Free Meeting",
    ctaVariant: "free",
    bookingTopic: "Free 1:1 Strategy Discovery Call",
    coreDeliverables: [
      "Full Meta/Google Ads & Website Speed Audit",
      "Custom 90-Day Conversion & Growth Action Plan",
      "30-Min 1:1 Strategy Discovery Call with Sabbir",
    ],
    features: [
      "30-min 1:1 consultation with Sabbir",
      "Meta & Google Ads performance audit",
      "Website conversion rate (CRO) review",
      "AI automation & workflow roadmap",
      "100% free with zero commitment",
    ],
  },
  {
    id: "growth",
    name: "Growth Engine",
    priceUSD: { monthly: "$490", annual: "$365", period: "Per month" },
    priceBDT: { monthly: "৳৫৮,০০০", annual: "৳৪৪,০০০", period: "প্রতি মাসে" },
    description: "Scale your revenue with high-ROAS Meta & Google ad management, CAPI tracking, and landing page CRO.",
    isPopular: true,
    ctaText: "Book Growth Plan",
    ctaVariant: "popular",
    bookingTopic: "Growth Engine Plan ($490/mo)",
    coreDeliverables: [
      "High-ROAS Meta & Google Ad Campaign Scaling",
      "Server-Side Meta CAPI (99% Match) + Speed CRO",
      "Automated Instant CRM & WhatsApp Lead Routing",
    ],
    features: [
      "Everything in Free Discovery",
      "Meta & Google Ads campaign scaling",
      "Server-side Meta CAPI (99% match rate)",
      "Continuous landing page CRO & speed fixes",
      "Automated CRM & WhatsApp lead routing",
      "Weekly video report & private line with Sabbir",
    ],
  },
  {
    id: "scale",
    name: "Scale & Dominate",
    priceUSD: { monthly: "$1,250", annual: "$935", period: "Per month" },
    priceBDT: { monthly: "৳১,৫০,০০০", annual: "৳১,১২,০০০", period: "প্রতি মাসে" },
    description: "Complete turnkey Next.js web application + omnichannel paid acquisition + 24/7 autonomous AI agents.",
    isPopular: false,
    ctaText: "Deploy Pro Stack",
    ctaVariant: "standard",
    bookingTopic: "Scale & Dominate Pro Plan ($1,250/mo)",
    coreDeliverables: [
      "Custom Next.js 15 & Supabase Web Architecture",
      "24/7 Autonomous AI Agent for Instant Booking",
      "Omnichannel Scale (Meta + Google) & Priority SLA",
    ],
    features: [
      "Everything in Growth Engine",
      "Custom Next.js 15 & Supabase platform",
      "24/7 AI conversational agent for lead capture",
      "Omnichannel ads (Meta, Google, YouTube)",
      "Continuous A/B testing & feature sprints",
      "Priority 4-hour SLA response time",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Titan",
    priceUSD: { monthly: "Let’s talk", annual: "Let’s talk", period: "Custom Scope" },
    priceBDT: { monthly: "কাস্টম বাজেট", annual: "কাস্টম বাজেট", period: "কাস্টম রিকোয়ারমেন্ট" },
    description: "Dedicated full-stack growth engineering squad, bespoke LLM infrastructure, and multi-brand scaling.",
    isPopular: false,
    ctaText: "Contact Sales",
    ctaVariant: "standard",
    bookingTopic: "Enterprise Titan - Custom Scope",
    coreDeliverables: [
      "Dedicated Squad (Senior Full-Stack Dev + Growth Lead)",
      "Custom LLM Infrastructure & Multi-Brand Automation",
      "100% IP Handover, NDA & 1-Hour SLA Emergency Line",
    ],
    features: [
      "Everything in Scale & Dominate",
      "Dedicated full-stack developer & ad strategist",
      "Proprietary internal AI bots & n8n pipelines",
      "Multi-tenant architecture & payment gateways",
      "Dedicated private Slack & 1-hour critical SLA",
      "Full intellectual property (IP) handover & NDA",
    ],
  },
];

interface TrustPillar {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  badge: string;
  metric: string;
  description: string;
  glowColor: string;
  badgeColor: string;
  dotColor: string;
  iconBoxBg: string;
  borderHover: string;
}

const TRUST_PILLARS: TrustPillar[] = [
  {
    icon: ShieldCheck,
    title: "Satisfaction Guarantee",
    badge: "Milestone Escrow",
    metric: "100% Risk-Free",
    description: "Milestone-based delivery with revisions until you're completely satisfied before sign-off.",
    glowColor: "rgba(16, 185, 129, 0.28)",
    badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    dotColor: "bg-emerald-400",
    iconBoxBg: "bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
    borderHover: "hover:border-emerald-500/50 hover:shadow-[0_8px_30px_rgba(16,185,129,0.18)]",
  },
  {
    icon: Lock,
    title: "100% IP & Code Ownership",
    badge: "Full IP Transfer",
    metric: "Full Ownership",
    description: "Full ownership of all repositories, databases, ad accounts, and creative assets with signed NDA.",
    glowColor: "rgba(6, 182, 212, 0.28)",
    badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    dotColor: "bg-cyan-400",
    iconBoxBg: "bg-gradient-to-br from-cyan-500/20 via-cyan-500/10 to-transparent text-cyan-300 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]",
    borderHover: "hover:border-cyan-500/50 hover:shadow-[0_8px_30px_rgba(6,182,212,0.18)]",
  },
  {
    icon: Clock,
    title: "30-Day Free Support",
    badge: "Post-Launch SLA",
    metric: "30-Day SLA",
    description: "Post-launch dedicated bug fixes, performance monitoring, speed CRO, and priority SLA.",
    glowColor: "rgba(168, 85, 247, 0.28)",
    badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    dotColor: "bg-purple-400",
    iconBoxBg: "bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent text-purple-300 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]",
    borderHover: "hover:border-purple-500/50 hover:shadow-[0_8px_30px_rgba(168,85,247,0.18)]",
  },
  {
    icon: RotateCcw,
    title: "Cancel Anytime",
    badge: "Zero Lock-in",
    metric: "Flexible Contract",
    description: "Flexible arrangements with zero lock-in contracts. Upgrade, pause, or cancel with complete peace of mind.",
    glowColor: "rgba(245, 158, 11, 0.28)",
    badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    dotColor: "bg-amber-400",
    iconBoxBg: "bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent text-amber-300 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
    borderHover: "hover:border-amber-500/50 hover:shadow-[0_8px_30px_rgba(245,158,11,0.18)]",
  },
];

export default function Pricing() {
  const { data: dynamicPlans } = useSiteSettings<PricingPlan[]>("pricing_plans", PRICING_PLANS);
  const activePlans = Array.isArray(dynamicPlans) && dynamicPlans.length > 0 ? dynamicPlans : PRICING_PLANS;
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [openContactPlan, setOpenContactPlan] = useState<string | null>(null);

  const handlePlanAction = (plan: PricingPlan) => {
    // If it's the free meeting tier or enterprise/standard, open the meeting booking calendar
    openBookingModal(plan.bookingTopic);
  };

  return (
    <section id="pricing" className="relative py-10 sm:py-16 md:py-32 overflow-hidden bg-[#0A0C11]">
      {/* Background Watermark */}
      <SectionWatermark text="PRICING" glowColor="cyan" />

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
        {/* ================= SECTION HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-6 sm:mb-10 md:mb-16"
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans leading-tight">
            Transparent Investment, <br className="hidden sm:inline" />
            Guaranteed Business Outcomes
          </h2>

          <p className="text-slate-400 mt-2 sm:mt-4 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Unlock high-performance digital engineering. Book a free 1-on-1 strategy meeting with Sabbir
            or deploy our proven paid ads, web development, and AI automation systems.
          </p>

          {/* ================= SWITCHERS ROW: Billing Cycle & Currency Sync ================= */}
          <div className="mt-5 sm:mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
            {/* Monthly / Annually Pill */}
            <div className="p-1 sm:p-1.5 rounded-full bg-[#141721] border border-white/10 flex items-center shadow-inner">
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setBillingCycle("monthly")}
                className={`relative px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                  billingCycle === "monthly"
                    ? "bg-[#202533] text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Monthly
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setBillingCycle("annually")}
                className={`relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                  billingCycle === "annually"
                    ? "bg-[#202533] text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Annually</span>
                <span className="bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)] tracking-tight">
                  Save 25%
                </span>
              </motion.button>
            </div>

            {/* Currency Sync Dropdown / Switcher */}
            <div className="p-1 sm:p-1.5 rounded-full bg-[#141721] border border-white/10 flex items-center shadow-inner">
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrency("USD")}
                className={`relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                  currency === "USD"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>$ USD</span>
              </motion.button>

              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrency("BDT")}
                className={`relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                  currency === "BDT"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>৳ BDT</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ================= 4 PRICING CARDS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 items-stretch mb-8 sm:mb-16">
          {activePlans.map((plan, idx) => {
            const isPopular = plan.isPopular;
            const priceInfo = currency === "USD" ? plan.priceUSD : plan.priceBDT;
            const price = billingCycle === "monthly" ? priceInfo.monthly : priceInfo.annual;
            const periodText = priceInfo.period;
            const isTextPrice = isNaN(Number(price.replace(/[^0-9]/g, ""))) || price.toLowerCase().includes("talk") || price.toLowerCase().includes("custom") || price.includes("বাজেট");

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                whileTap={{ scale: 0.985 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`relative rounded-2xl sm:rounded-[26px] p-4 sm:p-6 md:p-7 flex flex-col justify-between transition-all duration-300 overflow-hidden ${
                  isPopular
                    ? "bg-gradient-to-b from-[#111827] via-[#0B0F19] to-[#080B14] border border-cyan-400/40 shadow-[0_0_50px_rgba(6,182,212,0.22),inset_0_1px_1px_rgba(255,255,255,0.15)] lg:-translate-y-2 before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-cyan-400 before:to-transparent before:rounded-t-[26px]"
                    : "bg-[#0D111C]/90 border border-white/[0.08] hover:border-white/[0.18] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                }`}
              >
                {/* Popular Card Laser Glow Beam */}
                {isPopular && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-[1.5px] rounded-2xl sm:rounded-[26px] overflow-hidden z-0"
                  >
                    <div
                      className="absolute inset-[-150%] animate-border-beam opacity-60"
                      style={{
                        background:
                          "conic-gradient(from 0deg, transparent 0 310deg, #06b6d4 330deg, #38bdf8 350deg, #ffffff 360deg)",
                      }}
                    />
                  </div>
                )}
                {/* Top Section */}
                <div>
                  {/* Plan Name & Popular Badge */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-xs sm:text-sm font-semibold text-white/90">
                      {plan.name}
                    </span>
                    {isPopular && (
                      <span className="inline-flex items-center gap-1.5 bg-cyan-400/10 border border-cyan-400/35 text-cyan-300 text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        Most Popular
                      </span>
                    )}
                  </div>

                  {/* Price Section */}
                  <div className="flex items-baseline gap-1.5 my-2 sm:my-3">
                    <span
                      className={`font-sans font-bold text-white tracking-tight ${
                        isTextPrice ? "text-xl sm:text-3xl" : "text-3xl sm:text-5xl"
                      }`}
                    >
                      {price}
                    </span>
                    {periodText && (
                      <span className="text-[11px] sm:text-xs text-slate-400 font-normal">
                        {periodText}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed sm:min-h-[44px] mb-4 sm:mb-6">
                    {plan.description}
                  </p>

                  {/* Action CTA Button */}
                  <div className="mb-4 sm:mb-5">
                    {plan.ctaVariant === "popular" ? (
                      <button
                        type="button"
                        onClick={() => handlePlanAction(plan)}
                        className="relative w-full py-3.5 px-5 rounded-full text-white font-extrabold text-xs sm:text-sm tracking-wide border border-white/35 hover:border-white/60 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_0_25px_rgba(59,130,246,0.4)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_0_40px_rgba(14,165,233,0.65)] overflow-hidden flex items-center justify-center gap-2 group cursor-pointer"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(37, 99, 235, 0.40) 50%, rgba(14, 165, 233, 0.25) 100%)",
                          backdropFilter: "blur(16px)",
                          WebkitBackdropFilter: "blur(16px)",
                        }}
                      >
                        {/* Top specular glossy reflection */}
                        <span
                          aria-hidden="true"
                          className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none"
                        />
                        {/* Shimmer sweep effect */}
                        <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                        
                        <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-300 group-hover:rotate-12 transition-transform" />
                          <span>{plan.ctaText}</span>
                          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                        </span>
                      </button>
                    ) : plan.ctaVariant === "free" ? (
                      <button
                        type="button"
                        onClick={() => handlePlanAction(plan)}
                        className="relative w-full py-3.5 px-4 rounded-full border border-white/25 hover:border-white/45 text-white font-semibold text-xs sm:text-sm backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_0_18px_rgba(59,130,246,0.25)] hover:shadow-[0_0_28px_rgba(14,165,233,0.4)] overflow-hidden flex items-center justify-center gap-2 group cursor-pointer"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(37, 99, 235, 0.22) 50%, rgba(14, 165, 233, 0.14) 100%)",
                          backdropFilter: "blur(16px)",
                          WebkitBackdropFilter: "blur(16px)",
                        }}
                      >
                        <Calendar className="w-3.5 h-3.5 text-cyan-300 group-hover:scale-110 transition-transform" />
                        <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{plan.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-300/70 group-hover:translate-x-1 group-hover:text-white transition-all" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePlanAction(plan)}
                        className="relative w-full py-3.5 px-4 rounded-full border border-white/20 hover:border-white/40 text-white font-semibold text-xs sm:text-sm backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] hover:shadow-[0_0_22px_rgba(59,130,246,0.3)] overflow-hidden flex items-center justify-center gap-2 group cursor-pointer"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255, 255, 255, 0.10) 0%, rgba(37, 99, 235, 0.18) 50%, rgba(14, 165, 233, 0.12) 100%)",
                          backdropFilter: "blur(16px)",
                          WebkitBackdropFilter: "blur(16px)",
                        }}
                      >
                        <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{plan.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-300/60 group-hover:translate-x-1 group-hover:text-white transition-all" />
                      </button>
                    )}
                  </div>

                  {/* Checklist Features - Directly visible on all 4 cards (See More button removed) */}
                  <div className="pt-3 border-t border-white/5 mt-auto">
                    <div className="pt-1">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2.5 flex items-center justify-between">
                        <span>Included Scope:</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {plan.features.length} items
                        </span>
                      </p>

                      <ul className="space-y-2 text-xs text-slate-300">
                        {plan.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5">
                            <Check
                              className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                isPopular ? "text-cyan-400" : "text-slate-400"
                              }`}
                            />
                            <span
                              className={`leading-snug font-normal ${
                                isPopular ? "text-slate-200" : "text-slate-300/90"
                              }`}
                            >
                              {feat}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ================= 4-PILLAR TRUST & ASSURANCE BENTO ================= */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-6xl mx-auto rounded-3xl p-[1px] bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          {/* Ambient Background Glow Behind the Bento Box */}
          <div
            aria-hidden="true"
            className="absolute -inset-1 rounded-3xl blur-2xl opacity-20 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 pointer-events-none -z-10"
          />

          <div className="relative rounded-[23px] bg-[#0C1019]/95 backdrop-blur-2xl p-5 sm:p-7 md:p-8 border border-white/[0.06] overflow-hidden">
            {/* Subtle Header Row with Live Security Assurance Badge */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 mb-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Guaranteed Peace of Mind</span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                      Zero Risk Policy
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Every milestone is bound by ironclad quality guarantees and legal NDA safeguards.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-300 bg-white/[0.03] border border-white/10 px-3.5 py-1.5 rounded-full shadow-inner self-start sm:self-auto">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-[11px] text-slate-300">Live Client SLA Active</span>
              </div>
            </div>

            {/* 4 Animated Bento Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {TRUST_PILLARS.map((pillar, pIdx) => {
                const IconComponent = pillar.icon;
                return (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: pIdx * 0.08 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className={`relative rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-[#131926]/90 to-[#0A0D15]/95 border border-white/[0.08] ${pillar.borderHover} transition-all duration-300 group overflow-hidden flex flex-col justify-between cursor-default`}
                  >
                    {/* Ambient Radial Spotlight inside each card */}
                    <div
                      aria-hidden="true"
                      className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: pillar.glowColor }}
                    />

                    {/* Shimmer sweep effect on hover */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/[0.05] to-transparent pointer-events-none"
                    />

                    <div>
                      {/* Top Row: Icon + Badge */}
                      <div className="flex items-center justify-between mb-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${pillar.iconBoxBg}`}
                        >
                          <IconComponent className="w-5 h-5 transition-transform group-hover:scale-105" />
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${pillar.badgeColor}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${pillar.dotColor}`} />
                          {pillar.badge}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug mb-1">
                        {pillar.title}
                      </h4>

                      {/* Description */}
                      <p className="text-[11px] text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                        {pillar.description}
                      </p>
                    </div>

                    {/* Bottom micro-stat footer line */}
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Assurance</span>
                      <span className="font-semibold text-slate-300 group-hover:text-white transition-colors">
                        {pillar.metric}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ================= CUSTOM ENTERPRISE SCOPE FOOTER ================= */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            Need a bespoke enterprise quote, custom automation pipeline, or multi-brand retainer?{" "}
            <button
              onClick={() => {
                const el = document.getElementById("estimator");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                else openBookingModal("Custom Enterprise Scope");
              }}
              className="text-cyan-400 hover:underline font-bold"
            >
              Calculate custom scope with Project Estimator &rarr;
            </button>
          </p>
        </div>
      </div>

      <ContactPopup
        open={!!openContactPlan}
        onOpenChange={(o) => !o && setOpenContactPlan(null)}
        plan={openContactPlan ?? undefined}
      />
    </section>
  );
}
