import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MessageCircle, X, Zap } from "lucide-react";
import { openBookingModal } from "@/components/site/BookingModal";
import { scrollToSection } from "@/lib/scroll";

export default function StickyBottomCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show after scrolling 40% of page
    const handleScroll = () => {
      if (dismissed) return;
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      setVisible(scrolled > total * 0.15 && scrolled < total * 0.90);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
        >
          {/* Backdrop blur bar */}
          <div
            className="pointer-events-auto mx-auto max-w-3xl mb-4 sm:mb-6 mx-3 sm:mx-auto sm:px-4"
            style={{ padding: "0 12px" }}
          >
            <div
              className="relative flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-5 py-3 sm:py-3.5 rounded-2xl border border-white/15 shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(168,85,247,0.15)] overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(10,8,20,0.96) 0%, rgba(15,10,30,0.96) 100%)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
            >
              {/* Left glow */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-cyan-400 to-emerald-500 rounded-l-2xl" />

              {/* Pulse dot + text */}
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 pl-2">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs font-bold text-white truncate">
                    <span className="text-emerald-400">Available Now</span>
                    <span className="hidden sm:inline text-white/50"> — </span>
                    <span className="hidden sm:inline text-white/70">Only 2 client slots open this month</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 font-mono hidden sm:block">
                    Book before slots fill up ⚡
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openBookingModal("Free Discovery Call")}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-[11px] sm:text-xs font-bold hover:brightness-110 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95"
                >
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Book Free Call</span>
                  <span className="sm:hidden">Book</span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection("contact")}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl border border-white/20 bg-white/5 text-white text-[11px] sm:text-xs font-semibold hover:bg-white/10 transition-all active:scale-95"
                >
                  <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Message</span>
                </button>
              </div>

              {/* Dismiss */}
              <button
                type="button"
                onClick={() => { setDismissed(true); setVisible(false); }}
                className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground/50 hover:text-white hover:bg-white/10 transition-all ml-1"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
