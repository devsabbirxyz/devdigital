import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  MessageCircle,
  ShieldCheck,
  Code2,
  TrendingUp,
} from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { openBookingModal } from "@/components/site/BookingModal";

type IntroData = { enabled: boolean; video_url: string; show_once: boolean };
const DEFAULT: IntroData = { enabled: false, video_url: "", show_once: true };
const STORAGE_KEY = "intro_video_seen_v1";

export function openIntroVideo() {
  window.dispatchEvent(new CustomEvent("open-intro-video"));
}

function toEmbed(url: string): { type: "iframe" | "video"; src: string } | null {
  if (!url) return null;
  // Loom
  const loom = url.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9_-]+)/);
  if (loom) return { type: "iframe", src: `https://www.loom.com/embed/${loom[1]}?autoplay=1` };
  // YouTube
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
  if (yt) return { type: "iframe", src: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0` };
  // Vimeo
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return { type: "iframe", src: `https://player.vimeo.com/video/${vm[1]}?autoplay=1` };
  // Direct file
  return { type: "video", src: url };
}

export default function IntroVideoModal() {
  const { data, loading } = useSiteSettings<IntroData>("intro_video", DEFAULT);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-intro-video", handleOpen);
    return () => window.removeEventListener("open-intro-video", handleOpen);
  }, []);

  useEffect(() => {
    if (loading || !data.enabled || !data.video_url) return;
    if (data.show_once && localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 1800);
    return () => clearTimeout(t);
  }, [loading, data]);

  const close = () => {
    setOpen(false);
    if (data.show_once) localStorage.setItem(STORAGE_KEY, "1");
  };

  const embed = toEmbed(data.video_url);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl glass-strong rounded-3xl p-5 sm:p-8 shadow-2xl border border-white/20 bg-[#0C0F17]/95 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={close}
              aria-label="Close modal"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-20 border border-white/10"
            >
              <X className="h-4 w-4" />
            </button>

            {embed ? (
              <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl">
                {embed.type === "iframe" ? (
                  <iframe
                    src={embed.src}
                    title="Intro pitch video"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <video
                    src={embed.src}
                    controls
                    autoPlay
                    onEnded={close}
                    className="w-full h-full"
                  />
                )}
              </div>
            ) : (
              /* High-Converting 60-Second Interactive Pitch Presentation */
              <div>
                {/* Header Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-500/35">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    <span>60-SECOND EXECUTIVE BRIEFING &bull; FOUNDER DIRECT</span>
                  </div>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-2 leading-tight">
                  How <span className="text-gradient">DevDigital</span> Scales Your Business
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                  Hi, I'm <strong className="text-white">Sabbir</strong>. I engineer end-to-end digital growth systems that combine sub-second web platforms, high-ROAS Meta & Google advertising funnels, and 24/7 autonomous AI agents.
                </p>

                {/* 3 Core Pillars */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-primary/40 transition-all">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Code2 className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        <span>Sub-Second Next.js Web Platforms (90+ Speed SLA)</span>
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        No slow templates or bloated plugins. Built on modern headless architecture that loads under 0.8s for maximum conversion.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-primary/40 transition-all">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        <span>Omnichannel Ad Scaling & Server-Side Meta CAPI</span>
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Bypass iOS tracking loss with server-side CAPI event matching (95%+ match rate) for predictable, profitable ROAS.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-primary/40 transition-all">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        <span>Zero Risk: Milestone Escrow & Full IP Transfer</span>
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Pay only when milestones are tested and verified. 100% full GitHub repository and ad account ownership under mutual NDA.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      openBookingModal("Free 1:1 Strategy Call from Pitch Briefing");
                    }}
                    className="w-full sm:flex-1 py-3 px-5 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-bold text-xs sm:text-sm hover:brightness-110 transition-all shadow-[0_0_25px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Free 1:1 Strategy Call</span>
                  </button>

                  <a
                    href="https://wa.me/8801941130981?text=Hi%20Sabbir,%20I%20reviewed%20your%20briefing%20and%20want%20to%20discuss%20a%20project."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-3 px-5 rounded-full bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Sabbir</span>
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
