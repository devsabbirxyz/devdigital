import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Sparkles,
  Check,
  Zap,
  Globe,
  Bot,
  TrendingUp,
  MessageCircle,
  Calendar,
  Clock,
  Layers,
  ShieldCheck,
  ArrowRight,
  Send,
} from "lucide-react";
import SectionWatermark from "@/components/ui/SectionWatermark";
import { openBookingModal } from "@/components/site/BookingModal";

interface ScopeOption {
  id: string;
  name: string;
  category: string;
  icon: any;
  baseUSD: number;
  baseBDT: number;
  timelineDays: number;
  desc: string;
}

interface AddonOption {
  id: string;
  name: string;
  priceUSD: number;
  priceBDT: number;
  desc: string;
}

const PRIMARY_OPTIONS: ScopeOption[] = [
  {
    id: "ads-funnel",
    name: "Paid Ads & High-ROAS Funnel",
    category: "Marketing",
    icon: TrendingUp,
    baseUSD: 650,
    baseBDT: 78000,
    timelineDays: 10,
    desc: "Full Meta & Google Ads setup with conversion tracking, creative sprint, and audience segmentation.",
  },
  {
    id: "landing-page",
    name: "High-Converting Custom Landing Page",
    category: "Web & CRO",
    icon: Globe,
    baseUSD: 850,
    baseBDT: 102000,
    timelineDays: 12,
    desc: "Bespoke sub-second React/Next.js landing page engineered for maximum sales conversion.",
  },
  {
    id: "full-platform",
    name: "Full-Stack Web App & SaaS Platform",
    category: "Web Engineering",
    icon: Layers,
    baseUSD: 1950,
    baseBDT: 235000,
    timelineDays: 24,
    desc: "Complete headless web architecture with auth, database, multi-tenant portal, and admin panel.",
  },
  {
    id: "ai-pipeline",
    name: "Autonomous AI Agent & Bot Pipeline",
    category: "AI Automation",
    icon: Bot,
    baseUSD: 1200,
    baseBDT: 144000,
    timelineDays: 14,
    desc: "Custom 24/7 AI conversational qualifier, CRM webhook sync, and automated client booking flow.",
  },
  {
    id: "turnkey-3in1",
    name: "Turnkey 3-in-1 Compounding Engine",
    category: "Full Stack Partnership",
    icon: Zap,
    baseUSD: 2950,
    baseBDT: 355000,
    timelineDays: 30,
    desc: "All three pillars unified: Full-stack web build, Meta CAPI ad campaigns, and automated AI pipelines.",
  },
];

const ADDONS: AddonOption[] = [
  {
    id: "meta-capi",
    name: "Server-Side Meta CAPI (95%+ Match Quality)",
    priceUSD: 250,
    priceBDT: 30000,
    desc: "Bypass iOS tracking loss with server-side conversion tracking.",
  },
  {
    id: "payments",
    name: "Global & Local Payment Gateways (Stripe / bKash)",
    priceUSD: 300,
    priceBDT: 36000,
    desc: "Frictionless multi-currency checkout & automated invoice generator.",
  },
  {
    id: "speed-cro",
    name: "99+ Lighthouse Sub-Second Speed Optimization",
    priceUSD: 200,
    priceBDT: 24000,
    desc: "Edge-cached CDN delivery, image WebP compression, and zero CLS.",
  },
  {
    id: "ai-qualifier",
    name: "24/7 WhatsApp AI Customer Support Bot",
    priceUSD: 450,
    priceBDT: 54000,
    desc: "Instant conversational responses and lead handoff directly to your phone.",
  },
  {
    id: "seo-schema",
    name: "Semantic Schema & Google Rich Snippets SEO",
    priceUSD: 350,
    priceBDT: 42000,
    desc: "Rank with star ratings, FAQs, and author schema in Google SERP.",
  },
];

export default function ProjectEstimator() {
  const [selectedPrimary, setSelectedPrimary] = useState<string>("landing-page");
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["meta-capi"]);
  const [currency, setCurrency] = useState<"USD" | "BDT">("USD");

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const activePrimary = useMemo(
    () => PRIMARY_OPTIONS.find((p) => p.id === selectedPrimary) || PRIMARY_OPTIONS[0],
    [selectedPrimary]
  );

  const calculations = useMemo(() => {
    const basePrice = currency === "USD" ? activePrimary.baseUSD : activePrimary.baseBDT;
    const addonsTotal = selectedAddons.reduce((sum, addonId) => {
      const match = ADDONS.find((a) => a.id === addonId);
      if (!match) return sum;
      return sum + (currency === "USD" ? match.priceUSD : match.priceBDT);
    }, 0);

    const totalEstimate = basePrice + addonsTotal;
    const additionalDays = Math.ceil(selectedAddons.length * 1.5);
    const totalDays = activePrimary.timelineDays + additionalDays;

    return {
      totalEstimate,
      totalDays,
      currencySymbol: currency === "USD" ? "$" : "৳",
    };
  }, [activePrimary, selectedAddons, currency]);

  const whatsappMessage = encodeURIComponent(
    `Hi Sabbir! I configured a project estimate on your website:\n\n` +
      `📌 Core Build: ${activePrimary.name}\n` +
      `⚡ Add-ons: ${
        selectedAddons.length > 0
          ? selectedAddons
              .map((id) => ADDONS.find((a) => a.id === id)?.name)
              .filter(Boolean)
              .join(", ")
          : "None"
      }\n` +
      `💰 Estimated Budget: ${calculations.currencySymbol}${calculations.totalEstimate.toLocaleString()} ${currency}\n` +
      `⏱️ Target Timeline: ~${calculations.totalDays} Days\n\n` +
      `Can we review this scope and finalize a quote?`
  );

  return (
    <section id="estimator" className="relative py-10 sm:py-16 md:py-28 overflow-hidden bg-[#0A0C11]">
      {/* Background Watermark with Localized Hover Spotlight */}
      <SectionWatermark text="ESTIMATE" glowColor="cyan" />

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

      <div className="container relative z-10 px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 border border-primary/25 mb-3 sm:mb-4 shadow-sm"
          >
            <Calculator className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span>INSTANT PROJECT SCOPE & BUDGET CALCULATOR</span>
          </motion.div>

          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Estimate Your <span className="text-gradient">Project Investment</span>
          </h2>

          <p className="text-muted-foreground mt-2 sm:mt-3 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
            Select your deliverables below to generate a transparent scope estimate in real-time. Export directly to WhatsApp with one click.
          </p>

          {/* Currency Toggle */}
          <div className="mt-4 sm:mt-6 inline-flex p-1 rounded-full glass-strong border border-white/15 shadow-md">
            <button
              type="button"
              onClick={() => setCurrency("USD")}
              className={`px-4 sm:px-5 py-1 sm:py-1.5 rounded-full text-xs font-bold transition-all ${
                currency === "USD"
                  ? "bg-gradient-primary text-white shadow-neon"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              USD ($)
            </button>
            <button
              type="button"
              onClick={() => setCurrency("BDT")}
              className={`px-4 sm:px-5 py-1 sm:py-1.5 rounded-full text-xs font-bold transition-all ${
                currency === "BDT"
                  ? "bg-gradient-primary text-white shadow-neon"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              BDT (৳)
            </button>
          </div>
        </div>

        {/* 2-Column Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-start">
          {/* Left Column: Scope Selection (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* Step 1: Core Service */}
            <div>
              <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px]">
                    1
                  </span>
                  Choose Primary Deliverable
                </span>
                <span className="text-[11px] text-muted-foreground">Select one</span>
              </div>

              <div className="space-y-2 sm:space-y-2.5">
                {PRIMARY_OPTIONS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedPrimary === item.id;
                  const price =
                    currency === "USD"
                      ? `$${item.baseUSD.toLocaleString()}`
                      : `৳${item.baseBDT.toLocaleString()}`;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedPrimary(item.id)}
                      className={`w-full text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 flex items-start gap-3 sm:gap-4 ${
                        isSelected
                          ? "bg-primary/10 border-primary shadow-[0_0_25px_rgba(168,85,247,0.2)] text-white"
                          : "glass-strong border-white/10 hover:border-white/20 text-muted-foreground hover:text-white"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? "bg-gradient-primary text-white neon-glow"
                            : "glass text-primary"
                        }`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                            {item.name}
                          </h4>
                          <span className="text-xs font-mono font-bold text-primary shrink-0">
                            {price}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Capabilities & Addons */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px]">
                    2
                  </span>
                  Optional Feature Add-ons
                </span>
                <span className="text-[11px] text-muted-foreground">Select any</span>
              </div>

              <div className="space-y-2">
                {ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  const price =
                    currency === "USD"
                      ? `+$${addon.priceUSD}`
                      : `+৳${addon.priceBDT.toLocaleString()}`;

                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={`w-full text-left p-3 sm:p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isChecked
                          ? "bg-primary/10 border-primary/50 text-white"
                          : "glass border-white/5 hover:border-white/15 text-muted-foreground hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                            isChecked
                              ? "bg-primary border-primary text-white"
                              : "border-white/20 glass"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-semibold text-foreground truncate">
                            {addon.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            {addon.desc}
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">
                        {price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Live Quote Card (5 Cols Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-neon text-left">
              <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-primary bg-primary/10 border border-primary/20 mb-3 sm:mb-4">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>DYNAMIC SCOPE SUMMARY</span>
              </div>

              <div className="mb-4 sm:mb-6">
                <div className="text-[11px] sm:text-xs text-muted-foreground uppercase font-semibold">
                  Estimated Investment
                </div>
                <div className="text-3xl sm:text-5xl font-display font-black text-white mt-1 tracking-tight">
                  <span className="text-primary">{calculations.currencySymbol}</span>
                  {calculations.totalEstimate.toLocaleString()}
                  <span className="text-xs text-muted-foreground font-mono font-normal ml-2">
                    {currency}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 sm:space-y-3 pb-4 sm:pb-6 border-b border-white/10 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" /> Target Delivery:
                  </span>
                  <span className="font-bold text-foreground">
                    ~{calculations.totalDays} Business Days
                  </span>
                </div>

                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Milestone Plan:
                  </span>
                  <span className="font-bold text-emerald-400">
                    50% Start &bull; 50% Launch
                  </span>
                </div>

                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" /> Selected Focus:
                  </span>
                  <span className="font-bold text-foreground truncate max-w-[170px]">
                    {activePrimary.name}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 sm:pt-6 space-y-2.5 sm:space-y-3">
                <a
                  href={`https://wa.me/8801941130981?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Lock In Scope via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => openBookingModal(`Estimated Project: ${activePrimary.name}`)}
                  className="relative group w-full text-white font-bold py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl text-xs sm:text-sm border border-white/30 hover:border-white/60 backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_0_30px_rgba(14,165,233,0.5)] overflow-hidden flex items-center justify-center gap-2 cursor-pointer"
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
                  <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">Schedule 15-Min Scope Audit</span>
                </button>
              </div>

              <div className="text-[11px] text-muted-foreground text-center mt-4">
                &bull; Estimates include responsive design, code testing, and 30-day post-launch support.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
