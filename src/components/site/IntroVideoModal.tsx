import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

type IntroData = { enabled: boolean; video_url: string; show_once: boolean };
const DEFAULT: IntroData = { enabled: false, video_url: "", show_once: true };
const STORAGE_KEY = "intro_video_seen_v1";

export function openIntroVideo() {
  window.dispatchEvent(new CustomEvent("open-intro-video"));
}

function toEmbed(url: string): { type: "iframe" | "video"; src: string } | null {
  if (!url) return null;
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
          className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl glass-strong rounded-3xl p-3 sm:p-4 shadow-neon border border-white/20"
          >
            <button
              onClick={close}
              aria-label="Close video"
              className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-primary text-white flex items-center justify-center neon-glow hover:scale-110 transition z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {embed ? (
              <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
                {embed.type === "iframe" ? (
                  <iframe
                    src={embed.src}
                    title="Intro video"
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
              <div className="py-10 px-6 sm:px-10 text-center max-w-lg mx-auto">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center text-white neon-glow mb-5 shadow-lg">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-bold tracking-tight mb-2">
                  Meet <span className="text-gradient">Sabbir</span> (DevDigital)
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Ready to scale your business with high-ROAS marketing, custom sub-second web platforms, and automated 24/7 AI pipelines? Connect directly with me today!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="https://wa.me/8801941130981"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full transition shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2"
                  >
                    <span>Chat on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={close}
                    className="glass px-5 py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-white/10 transition text-muted-foreground hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
