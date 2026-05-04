import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

type IntroData = { enabled: boolean; video_url: string; show_once: boolean };
const DEFAULT: IntroData = { enabled: false, video_url: "", show_once: true };
const STORAGE_KEY = "intro_video_seen_v1";

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
    if (loading || !data.enabled || !data.video_url) return;
    if (data.show_once && localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(t);
  }, [loading, data]);

  const close = () => {
    setOpen(false);
    if (data.show_once) localStorage.setItem(STORAGE_KEY, "1");
  };

  const embed = toEmbed(data.video_url);

  return (
    <AnimatePresence>
      {open && embed && (
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
            className="relative w-full max-w-3xl glass-strong rounded-3xl p-2 shadow-neon"
          >
            <button
              onClick={close}
              aria-label="Close video"
              className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-primary text-white flex items-center justify-center neon-glow hover:scale-110 transition z-10"
            >
              <X className="h-5 w-5" />
            </button>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
