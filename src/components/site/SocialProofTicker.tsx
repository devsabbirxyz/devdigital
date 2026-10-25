import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, TrendingUp, Calendar, Zap, Bot, CheckCircle2 } from "lucide-react";
import { openBookingModal } from "./BookingModal";

interface TickerItem {
  id: string;
  avatarText: string;
  avatarBg: string;
  icon: any;
  title: string;
  sub: string;
  timeAgo: string;
  actionTopic?: string;
}

const TICKER_ITEMS: TickerItem[] = [
  {
    id: "act-1",
    avatarText: "TA",
    avatarBg: "bg-blue-500",
    icon: Calendar,
    title: "Strategy Call Booked",
    sub: "E-Commerce founder in Dhaka booked a 15-min Growth Audit",
    timeAgo: "14m ago",
    actionTopic: "Paid Ads & Meta CAPI Scaling",
  },
  {
    id: "act-2",
    avatarText: "GG",
    avatarBg: "bg-emerald-500",
    icon: TrendingUp,
    title: "5.2x ROAS Achieved",
    sub: "Gorur Ghash scaled Meta CAPI campaign with +380% order volume",
    timeAgo: "1h ago",
    actionTopic: "Digital Marketing & CRO",
  },
  {
    id: "act-3",
    avatarText: "BD",
    avatarBg: "bg-rose-500",
    icon: Zap,
    title: "2,400+ Donors & 0.4s Speed",
    sub: "Blood BD nationwide emergency donor platform reached 0.4s sub-second LCP",
    timeAgo: "2h ago",
    actionTopic: "Full-Stack Web Development",
  },
  {
    id: "act-4",
    avatarText: "UK",
    avatarBg: "bg-cyan-500",
    icon: Calendar,
    title: "New Discovery Session",
    sub: "SaaS founder from London scheduled a technical architecture review",
    timeAgo: "4h ago",
    actionTopic: "Turnkey Web & AI Architecture",
  },
  {
    id: "act-5",
    avatarText: "AI",
    avatarBg: "bg-amber-500",
    icon: Bot,
    title: "AI Pipeline Deployed",
    sub: "Autonomous qualification agent saved 35 hours of manual CRM entries",
    timeAgo: "6h ago",
    actionTopic: "AI Autonomous Agents",
  },
];

export default function SocialProofTicker() {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Only show after user scrolls a bit
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350 && !isDismissed) {
        setIsVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  // Auto-cycle every 11 seconds when not paused
  useEffect(() => {
    if (!isVisible || isDismissed || isPaused) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TICKER_ITEMS.length);
    }, 11000);

    return () => clearInterval(timer);
  }, [isVisible, isDismissed, isPaused]);

  if (isDismissed || !isVisible) return null;

  const current = TICKER_ITEMS[index];
  const Icon = current.icon;

  return (
    <div
      className="fixed bottom-4 left-4 z-40 hidden sm:block max-w-sm pointer-events-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          onClick={() => openBookingModal(current.actionTopic)}
          className="relative group p-3.5 rounded-2xl glass-strong border border-white/15 shadow-[0_15px_35px_rgba(0,0,0,0.6)] cursor-pointer hover:border-primary/50 transition-all backdrop-blur-xl"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDismissed(true);
            }}
            aria-label="Dismiss activity notification"
            className="absolute top-2 right-2 w-5 h-5 rounded-full glass hover:bg-white/20 flex items-center justify-center text-muted-foreground hover:text-white transition opacity-0 group-hover:opacity-100"
          >
            <X className="w-3 h-3" />
          </button>

          <div className="flex items-center gap-3">
            {/* Avatar Pill */}
            <div className="relative shrink-0">
              <div
                className={`w-9 h-9 rounded-xl ${current.avatarBg} text-white font-bold text-xs flex items-center justify-center shadow-md`}
              >
                {current.avatarText}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-neutral-900 border border-white/20 flex items-center justify-center text-primary">
                <Icon className="w-2.5 h-2.5" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-foreground truncate">
                  {current.title}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                  {current.timeAgo}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5 leading-snug">
                {current.sub}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
