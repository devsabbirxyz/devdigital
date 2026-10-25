import { motion } from "framer-motion";
import { Download, Sparkles, TrendingUp, Zap, Bot, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { openLeadMagnet } from "@/components/site/LeadMagnetModal";
import SectionWatermark from "@/components/ui/SectionWatermark";

export default function LeadMagnetSection() {
  return (
    <section id="blueprint" className="relative py-10 sm:py-16 md:py-20 overflow-hidden content-auto isolate bg-[#0A0C11]">
      {/* Background radial glow & Watermark */}
      <SectionWatermark text="BLUEPRINT" glowColor="cyan" />

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

      <div className="container relative z-10 max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-14 overflow-hidden glass-strong glow-border border border-primary/30 shadow-2xl flex flex-col lg:flex-row items-center gap-6 sm:gap-10"
        >
          {/* Left Column: Copy & CTA */}
          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-primary uppercase glass mb-3 sm:mb-4">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Free 2026 Strategy Guide
            </div>

            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.15] mb-3 sm:mb-4">
              The 2026 Full-Stack <br className="hidden sm:inline" />
              <span className="text-gradient">Growth Blueprint</span>
            </h2>

            <p className="text-xs sm:text-base text-muted-foreground leading-relaxed max-w-xl mb-4 sm:mb-6">
              A tactical 28-page master guide for founders and marketers. Discover how we scale Meta Ads to 5.4X ROAS, architect sub-second conversion funnels, and build autonomous AI agents.
            </p>

            {/* Checklist */}
            <div className="grid sm:grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-8">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground font-medium">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>5.4X ROAS Creative Framework</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground font-medium">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Sub-1s Funnel Architecture</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground font-medium">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>n8n AI Workflow Pipelines</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground font-medium">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>2026 Budget Scaling Checklist</span>
              </div>
            </div>

            {/* Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={openLeadMagnet}
                className="relative group w-full sm:w-auto text-white text-xs sm:text-sm font-bold px-5 sm:px-7 py-3 sm:py-3.5 rounded-full border border-white/30 hover:border-white/60 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_25px_rgba(59,130,246,0.35)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_0_35px_rgba(14,165,233,0.55)] overflow-hidden inline-flex items-center justify-center gap-2 cursor-pointer"
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
                <Download className="w-4 h-4 text-cyan-300 relative z-10" />
                <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">Download Free Blueprint (PDF)</span>
                <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-1 transition-transform relative z-10" />
              </button>
              <span className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" /> Instant Free Access · Zero Spam
              </span>
            </div>
          </div>

          {/* Right Column: 3D Holographic Book / Blueprint Mockup */}
          <div className="w-full lg:w-80 shrink-0 flex items-center justify-center mt-2 lg:mt-0">
            <motion.div
              whileHover={{ rotateY: 5, rotateX: -5, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={openLeadMagnet}
              className="relative w-56 sm:w-72 aspect-[3/4] rounded-2xl p-5 sm:p-6 glass-strong glow-border border border-primary/40 shadow-2xl flex flex-col justify-between cursor-pointer group"
              style={{
                perspective: "1000px",
                background: "linear-gradient(135deg, rgba(20, 20, 35, 0.95), rgba(10, 10, 20, 0.98))",
              }}
            >
              {/* Corner Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-primary font-bold">
                    EDITION 2026
                  </span>
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-white leading-snug mb-2">
                  THE GROWTH <br />
                  <span className="text-gradient">BLUEPRINT</span>
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Proven tactics, code architectures, and ROAS formulas by Sabbir.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-[11px] font-semibold text-white/90">
                  <span>FORMAT</span>
                  <span className="text-primary font-mono">TACTICAL PDF</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-white/90">
                  <span>PAGES</span>
                  <span className="text-primary font-mono">28 PAGES</span>
                </div>
                <div className="w-full py-2 rounded-xl bg-primary/20 group-hover:bg-primary text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Click to Unlock
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
