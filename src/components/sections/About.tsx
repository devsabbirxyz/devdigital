import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  MapPin,
  Clock,
  Sparkles,
  Terminal,
  Code2,
  Cpu,
  Zap,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  MessageSquare,
  Eye,
  FileText,
} from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import profileImg from "@/assets/profile.jpg";
import SectionWatermark from "@/components/ui/SectionWatermark";
import InteractiveTerminal from "./InteractiveTerminal";
import CvPreviewModal from "@/components/site/CvPreviewModal";

type AboutData = {
  title: string;
  tagline: string;
  name: string;
  bio: string;
  image_url: string;
  resume_url: string;
};

const DEFAULT: AboutData = {
  title: "About Me",
  tagline: "Marketer · Developer · AI Specialist",
  name: "Sabbir",
  bio: "I drive measurable revenue with high-performing Meta & Google Ads, engineer sub-second web platforms, and deploy autonomous 24/7 AI pipelines.",
  image_url: "",
  resume_url: "",
};

type TechBadge = {
  name: string;
  category: "marketing" | "web" | "ai";
  dotColor: string;
};

const TECH_BADGES: TechBadge[] = [
  // 1. Digital Marketing & Paid Ads (FIRST)
  { name: "Facebook & Meta Ads", category: "marketing", dotColor: "bg-blue-500" },
  { name: "Google Ads", category: "marketing", dotColor: "bg-amber-400" },
  { name: "Technical SEO", category: "marketing", dotColor: "bg-emerald-400" },
  { name: "Pixel & GA4 Tracking", category: "marketing", dotColor: "bg-rose-400" },

  // 2. Web Development (SECOND)
  { name: "Next.js", category: "web", dotColor: "bg-cyan-400" },
  { name: "React 18", category: "web", dotColor: "bg-sky-400" },
  { name: "TypeScript", category: "web", dotColor: "bg-blue-400" },
  { name: "Tailwind CSS", category: "web", dotColor: "bg-teal-400" },
  { name: "Supabase / SQL", category: "web", dotColor: "bg-emerald-400" },

  // 3. AI & Automations (THIRD)
  { name: "AI Automations", category: "ai", dotColor: "bg-purple-400" },
  { name: "n8n & Make", category: "ai", dotColor: "bg-pink-400" },
  { name: "Python", category: "ai", dotColor: "bg-yellow-400" },
  { name: "Custom AI Agents", category: "ai", dotColor: "bg-violet-400" },
];

const METRICS = [
  { value: "50+", label: "Global Deployments", suffix: "" },
  { value: "99.8", label: "Client Satisfaction", suffix: "%" },
  { value: "3.8", label: "Average ROI Boost", suffix: "x" },
  { value: "<24", label: "Response & Turnaround", suffix: "h" },
];

export default function About() {
  const { data } = useSiteSettings<AboutData>("about", DEFAULT);
  const img = data.image_url || profileImg;

  // Real-time ticking clock for Dhaka (GMT+6)
  const [timeStr, setTimeStr] = useState("");
  const [techCategory, setTechCategory] = useState<"all" | "web" | "ai" | "marketing">("all");
  const [cvModalOpen, setCvModalOpen] = useState(false);

  const filteredBadges =
    techCategory === "all"
      ? TECH_BADGES
      : TECH_BADGES.filter((b) => b.category === techCategory);

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Dhaka",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(now);
        setTimeStr(formatted);
      } catch {
        setTimeStr("06:00 PM GMT+6");
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="relative py-12 sm:py-20 md:py-32 overflow-hidden bg-[#0A0C11] isolate">
      {/* Background ambient lighting & Watermark */}
      <SectionWatermark text="ABOUT" glowColor="cyan" />

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

      <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12 md:mb-16 px-2 sm:px-0">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="hidden sm:inline-flex items-center gap-1.5 sm:gap-2 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.2em] sm:tracking-[0.25em] text-primary uppercase glass mb-2.5 sm:mb-4"
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {data.tagline || "ABOUT THE SPECIALIST"}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground"
          >
            Engineered For Results,{" "}
            <span className="text-gradient">Powered By Code & AI</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xs sm:text-base md:text-lg text-muted-foreground mt-2 sm:mt-4 leading-relaxed max-w-2xl mx-auto line-clamp-2 sm:line-clamp-none"
          >
            Scaling revenue through high-converting Digital Marketing, robust Web Development, and autonomous AI pipelines.
          </motion.p>
        </div>

        {/* ============================================================== */}
        {/* CYBER BENTO GRID ARCHITECTURE                                  */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-5 lg:gap-6">
          {/* ------------------------------------------------------------ */}
          {/* CARD 1: PRIMARY PROFILE BENTO (ColSpan 7 on Desktop)         */}
          {/* ------------------------------------------------------------ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-7 rounded-2xl sm:rounded-3xl glass-strong glow-border p-4 sm:p-7 md:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-primary/50 transition-all duration-500 shadow-card-soft"
          >
            {/* Subtle background gradient glow */}
            <div
              aria-hidden
              className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl pointer-events-none group-hover:bg-primary/30 transition-all duration-700"
            />

            <div>
              {/* Header with Live Booking Status */}
              <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-6">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-ping" />
                  Available for Projects
                </span>

                <span className="text-[10px] sm:text-xs font-mono text-muted-foreground tracking-wider uppercase">
                  Q2 2026 BOOKING
                </span>
              </div>

              {/* Profile Image & Details Row: Compact side-by-side on mobile */}
              <div className="flex flex-row items-center sm:items-start gap-3.5 sm:gap-6 mb-3.5 sm:mb-6">
                <div className="relative flex-shrink-0">
                  <div className="relative w-16 h-16 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl sm:rounded-2xl overflow-hidden glass border sm:border-2 border-primary/40 shadow-neon">
                    <img
                      src={img}
                      alt={data.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  {/* Verified Star Badge */}
                  <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-gradient-primary text-white p-1 sm:p-1.5 rounded-full shadow-lg ring-1 sm:ring-2 ring-background">
                    <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                </div>

                <div className="text-left flex-1 min-w-0">
                  <h3 className="font-display text-lg sm:text-2xl md:text-3xl font-bold text-foreground truncate">
                    {data.name || "Sabbir"}
                  </h3>
                  <p className="text-[11px] sm:text-sm font-medium text-gradient mt-0.5 mb-1 sm:mb-2 line-clamp-1">
                    Digital Marketing · Web · AI Automations
                  </p>
                  <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {data.bio}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3.5 sm:pt-6 border-t border-white/10 flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-2.5">
              {/* Compact "Let's Build Something" with Shimmer & Hover Animation */}
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => scrollToSection("contact")}
                className="relative group overflow-hidden flex-1 sm:flex-initial bg-gradient-primary text-white text-[11px] sm:text-xs font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full neon-glow transition-all duration-300 inline-flex items-center justify-center gap-1.5 shadow-neon cursor-pointer hover:shadow-[0_0_20px_rgba(0,180,255,0.55)] whitespace-nowrap"
              >
                {/* Dynamic light shimmer sweep on hover */}
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
                />
                <MessageSquare className="w-3.5 h-3.5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 shrink-0" />
                <span className="tracking-wide truncate">Let's Build Something</span>
              </motion.button>

              {/* Compact "Download / View CV" with In-Page Modal Preview & Hover Animation */}
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setCvModalOpen(true)}
                className="relative group flex-1 sm:flex-initial glass text-foreground hover:text-white text-[11px] sm:text-xs font-medium px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full hover:bg-white/10 hover:border-primary/50 transition-all duration-300 inline-flex items-center justify-center gap-1.5 border border-white/15 cursor-pointer shadow-sm hover:shadow-[0_0_16px_rgba(118,185,0,0.3)] whitespace-nowrap"
                title="View & Download verified CV / Resume"
              >
                <Eye className="w-3.5 h-3.5 text-primary group-hover:scale-110 group-hover:text-emerald-400 transition-all duration-300 shrink-0" />
                <span className="truncate">Download CV</span>
              </motion.button>
            </div>
          </motion.div>

          {/* ------------------------------------------------------------ */}
          {/* CARD 2: REAL-TIME TIMEZONE & LOCATION (ColSpan 5 on Desktop) */}
          {/* ------------------------------------------------------------ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-5 rounded-2xl sm:rounded-3xl glass-strong glow-border p-4 sm:p-7 md:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-primary/50 transition-all duration-500 shadow-card-soft"
          >
            <div
              aria-hidden
              className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-accent/20 blur-3xl pointer-events-none"
            />

            <div>
              <div className="flex items-center justify-between mb-2.5 sm:mb-4">
                <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-primary uppercase inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Live Timezone
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-md glass text-muted-foreground">
                  UTC+6
                </span>
              </div>

              {/* Big Ticking Clock */}
              <div className="my-1 sm:my-2">
                <div className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground text-gradient">
                  {timeStr || "12:00:00 PM"}
                </div>
                <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400" />
                  Currently Available & Coding
                </div>
              </div>

              {/* Location pill */}
              <div className="mt-3 sm:mt-5 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl glass border border-white/10 flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-foreground">Dhaka, Bangladesh</h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Remote Worldwide Client Collaboration</p>
                </div>
              </div>
            </div>

            {/* Response time guarantee */}
            <div className="mt-3.5 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-between text-[11px] sm:text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" /> Average Response:
              </span>
              <span className="font-semibold text-foreground">&lt; 15 Mins</span>
            </div>
          </motion.div>

          {/* ------------------------------------------------------------ */}
          {/* CARD 3: TECH ARSENAL PILLS (ColSpan 5 on Desktop)            */}
          {/* ------------------------------------------------------------ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-5 rounded-2xl sm:rounded-3xl glass-strong glow-border p-4 sm:p-6 md:p-7 flex flex-col justify-between relative overflow-hidden group hover:border-primary/50 transition-all duration-500 shadow-card-soft"
          >
            <div>
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-primary uppercase inline-flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> Core Arsenal
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">Modern Stack</span>
              </div>

              <h4 className="font-display text-sm sm:text-lg font-bold text-foreground mb-2 sm:mb-3">
                Production-Ready Stack
              </h4>

              {/* 3-Pillar Category Filter Tabs */}
              <div className="flex items-center gap-1 mb-2.5 sm:mb-3.5 p-0.5 sm:p-1 rounded-xl bg-white/5 border border-white/10 text-[10px] sm:text-[11px] overflow-x-auto scrollbar-hide">
                {[
                  { key: "all", label: "All (13)" },
                  { key: "marketing", label: "Digital Marketing" },
                  { key: "web", label: "Web Dev" },
                  { key: "ai", label: "AI Automations" },
                ].map((tab) => (
                  <motion.button
                    key={tab.key}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTechCategory(tab.key as any)}
                    className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                      techCategory === tab.key
                        ? "bg-primary text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>

              {/* Tech Badges Grid */}
              <motion.div layout className="flex flex-wrap gap-1.5 sm:gap-2 min-h-[75px] sm:min-h-[110px] content-start">
                <AnimatePresence mode="popLayout">
                  {filteredBadges.map((b) => (
                    <motion.span
                      layout
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.2 }}
                      key={b.name}
                      className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium glass hover:bg-white/10 border border-white/10 hover:border-primary/50 text-foreground transition-all duration-300 hover:scale-105 inline-flex items-center gap-1.5 cursor-default"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${b.dotColor}`} />
                      {b.name}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            <div className="mt-3.5 sm:mt-5 pt-2.5 sm:pt-3.5 border-t border-white/10 text-[11px] sm:text-xs text-muted-foreground flex items-center justify-between">
              <span>Zero bloated dependencies</span>
              <span className="text-primary font-semibold">Digital Marketing · Web · AI</span>
            </div>
          </motion.div>

          {/* ------------------------------------------------------------ */}
          {/* CARD 4: PROVEN METRICS & IMPACT (ColSpan 7 on Desktop)       */}
          {/* ------------------------------------------------------------ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex md:col-span-7 rounded-2xl sm:rounded-3xl glass-strong glow-border p-4 sm:p-6 md:p-7 flex-col justify-between relative overflow-hidden group hover:border-primary/50 transition-all duration-500 shadow-card-soft"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5 sm:mb-4">
                <span className="text-[11px] sm:text-xs font-semibold tracking-widest text-primary uppercase inline-flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Proven Milestones
                </span>
                <span className="text-[11px] sm:text-xs text-emerald-400 font-semibold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Results
                </span>
              </div>

              {/* 4 Counter Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 my-1 sm:my-2">
                {METRICS.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl glass border border-white/10 text-center hover:border-primary/40 transition-colors"
                  >
                    <div className="font-display text-xl sm:text-3xl font-extrabold text-foreground text-gradient">
                      {m.value}
                      <span className="text-primary text-base sm:text-xl font-bold">{m.suffix}</span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5 sm:mt-1 leading-snug">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] sm:text-xs text-muted-foreground gap-2">
              <span>Enterprise Grade Performance</span>
              <span className="text-foreground font-semibold">Sub-Second Page Latency</span>
            </div>
          </motion.div>

          {/* ------------------------------------------------------------ */}
          {/* CARD 5: MULTI-LANGUAGE INTERACTIVE TERMINAL & CODE RUNNER   */}
          {/* ------------------------------------------------------------ */}
          <InteractiveTerminal />
        </div>
      </div>

      {/* Interactive In-Page CV / Resume Viewer Modal */}
      <CvPreviewModal
        isOpen={cvModalOpen}
        onClose={() => setCvModalOpen(false)}
        resumeUrl={data.resume_url}
        candidateName={data.name || "Sabbir Hosen"}
      />
    </section>
  );
}
