import { useEffect, useMemo, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Play } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { scrollToSection } from "@/lib/scroll";
import { openIntroVideo } from "@/components/site/IntroVideoModal";
import { openBookingModal } from "@/components/site/BookingModal";
import CosmicCtaButton from "@/components/ui/CosmicCtaButton";
import CosmicStarfield from "@/components/ui/CosmicStarfield";

import h1 from "@/assets/hero-1.jpg";
import h2 from "@/assets/hero-2.jpg";
import h3 from "@/assets/hero-3.jpg";
import h4 from "@/assets/hero-4.jpg";
import h5 from "@/assets/hero-5.jpg";
import h6 from "@/assets/hero-6.jpg";
import h7 from "@/assets/hero-7.jpg";

const FALLBACK_HERO_IMAGES = [h1, h2, h3, h4, h5, h6, h7];
const CACHE_KEY = "hero_images_v4";

const ROTATING_PHRASES = [
  "Inspire & Convert.",
  "Dominate Google Rankings.",
  "Scale 10x Revenue.",
  "Automate Repetitive Workflows.",
  "Elevate Brand Authority.",
];

function readCache(): string[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const arr = JSON.parse(raw);
    if (Array.isArray(arr) && arr.length > 0 && arr.every((s) => typeof s === "string" && s)) {
      return arr;
    }
  } catch {}
  return null;
}

type HeroData = {
  title: string;
  description: string;
  primary_cta: string;
  secondary_cta: string;
};

const DEFAULT_HERO_DESC =
  "Transforming Ideas into Powerful Digital Experiences That Help Brands Scale Faster with Web development, Marketing & AI automation";

const DEFAULT: HeroData = {
  title: "Crafting Digital Experiences That Inspire",
  description: DEFAULT_HERO_DESC,
  primary_cta: "Hire Me",
  secondary_cta: "View Work",
};

// -------------------------------------------------------------
// Magnetic Button Component (Gravitates smoothly toward cursor)
// -------------------------------------------------------------
function MagneticButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Magnetic pull factor
    const distanceX = (e.clientX - centerX) * 0.32;
    const distanceY = (e.clientY - centerY) * 0.32;
    setPosition({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 220, damping: 16, mass: 0.1 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

export default function Hero() {
  const { data } = useSiteSettings<HeroData>("hero", DEFAULT);
  const isMobile = useIsMobile();
  const [images, setImages] = useState<string[]>(() => readCache() ?? FALLBACK_HERO_IMAGES);
  const [active, setActive] = useState(0);
  const [phraseIdx, setPhraseIdx] = useState(0);

  const currentMonthYear = useMemo(() => {
    try {
      return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date());
    } catch {
      return "November 2026";
    }
  }, []);

  const readyImages = useMemo(
    () => images.filter(Boolean).slice(0, isMobile ? 5 : 7),
    [images, isMobile]
  );
  const shouldAnimate = readyImages.length > 1;

  // Cycle rotating service phrases every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIdx((prev) => (prev + 1) % ROTATING_PHRASES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    (async () => {
      const { data: rows } = await supabase
        .from("hero_images")
        .select("image_url, sort_order")
        .order("sort_order");
      if (rows && rows.length > 0) {
        const urls = rows.map((r) => r.image_url).filter(Boolean) as string[];
        if (urls.length === 0) return;
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(urls)); } catch {}
        setImages((prev) =>
          prev.length === urls.length && prev.every((u, i) => u === urls[i]) ? prev : urls
        );
      }
    })();
  }, []);

  // Preload primary hero image
  useEffect(() => {
    if (readyImages[0]) {
      const img = new Image();
      img.decoding = "async";
      img.src = readyImages[0];
    }
  }, [readyImages]);

  useEffect(() => {
    if (!shouldAnimate) return;
    const t = setInterval(() => setActive((i) => (i + 1) % readyImages.length), 4500);
    return () => clearInterval(t);
  }, [readyImages.length, shouldAnimate]);

  useEffect(() => {
    if (active >= readyImages.length) setActive(0);
  }, [active, readyImages.length]);

  // Arrange images in a fan: positions relative to center, dynamic by count
  const n = readyImages.length;
  const center = Math.floor(n / 2);
  const getStyle = (i: number) => {
    let pos = (i - active) % n;
    if (pos > center) pos -= n;
    if (pos < -center) pos += n;
    const abs = Math.abs(pos);
    return {
      x: pos * (isMobile ? 72 : 96),
      y: abs * (isMobile ? 14 : 22),
      rotate: pos * (isMobile ? 5 : 8),
      scale: pos === 0 ? 1.08 : 1 - abs * (isMobile ? 0.08 : 0.12),
      zIndex: 10 - abs,
      opacity: abs > (isMobile ? 2 : 3) ? 0 : 1 - abs * (isMobile ? 0.24 : 0.18),
    };
  };

  const isDefaultTitle =
    !data.title ||
    data.title.toLowerCase().includes("crafting digital experiences");

  const heroDescription =
    data.description && !data.description.toLowerCase().includes("premium portfolio showcasing")
      ? data.description
      : DEFAULT_HERO_DESC;

  // Touch swipe support for mobile carousel
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        setActive((prev) => (prev + 1) % readyImages.length);
      } else {
        setActive((prev) => (prev - 1 + readyImages.length) % readyImages.length);
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section id="home" className="relative pt-24 pb-16 overflow-hidden bg-[#08070C]">
      {/* Deep Space Cosmic Starlight Background */}
      <CosmicStarfield count={80} />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* 1. REAL-TIME AVAILABILITY BADGE (Green Pulsing Dot - Urgency & Scarcity) */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-medium border border-emerald-500/35 bg-emerald-950/50 text-emerald-300 backdrop-blur-xl mb-4 sm:mb-6 shadow-[0_0_25px_rgba(16,185,129,0.22)] max-w-full">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
            </span>
            <span className="font-semibold text-emerald-100 tracking-wide">
              Available for <span className="text-emerald-400 font-bold underline decoration-emerald-500/50 underline-offset-2">2 Client Projects</span> in {currentMonthYear}
            </span>
            <span className="hidden sm:inline text-emerald-500/40">•</span>
            <span className="hidden sm:inline text-xs text-white/80 font-normal">Marketing • Web • AI</span>
          </div>

          {/* 2. BOLD CRISP WHITE TITLE WITH KINETIC NEON ACCENT */}
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.12] tracking-tight mb-4 sm:mb-6 text-white px-2">
            {isDefaultTitle ? (
              <>
                <span>Crafting Digital Experiences That </span>
                <span className="inline-block relative min-w-[190px] sm:min-w-[340px] text-center sm:text-left align-bottom">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={phraseIdx}
                      initial={{ y: 28, opacity: 0, filter: "blur(6px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: -28, opacity: 0, filter: "blur(6px)" }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="inline-block bg-gradient-to-r from-[#E0C3FC] via-[#B57BFF] to-[#9B5DE5] bg-clip-text text-transparent font-extrabold"
                    >
                      {ROTATING_PHRASES[phraseIdx]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </>
            ) : (
              data.title.split(" ").map((w, i, arr) => (
                <span
                  key={i}
                  className={
                    i >= arr.length - 2
                      ? "bg-gradient-to-r from-[#E0C3FC] via-[#B57BFF] to-[#9B5DE5] bg-clip-text text-transparent"
                      : "text-white"
                  }
                >
                  {w}{" "}
                </span>
              ))
            )}
          </h1>

          {/* 3. SUB-HEADING: Mobile 1-Line Animated Ticker & Desktop Paragraph */}
          {/* Mobile: exactly 1 single line with smooth continuous horizontal marquee animation */}
          <div className="sm:hidden relative w-full max-w-sm mx-auto overflow-hidden mb-6 px-1 py-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 z-10 bg-gradient-to-r from-[#08070C] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-[#08070C] to-transparent" />

            <div
              className="animate-marquee-left flex items-center whitespace-nowrap text-xs text-[#A39EB8]"
              style={{ "--marquee-duration": "24s" } as React.CSSProperties}
            >
              <div className="flex items-center gap-2.5 pr-8">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                <span>{heroDescription}</span>
              </div>
              <div className="flex items-center gap-2.5 pr-8">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                <span>{heroDescription}</span>
              </div>
            </div>
          </div>

          {/* Desktop: Multiline elegant paragraph */}
          <p className="hidden sm:block text-sm sm:text-base md:text-lg text-[#A39EB8] max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed font-normal px-2">
            {heroDescription}
          </p>

          {/* 4. ULTRA-MODERN COSMIC CTA BUTTONS (Mobile: exactly 2 buttons, Desktop: 3 buttons) */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 mb-6 w-full max-w-sm sm:max-w-none mx-auto px-3 sm:px-0">
            {/* Primary Hire Me Button */}
            <div className="flex-1 sm:flex-none">
              <CosmicCtaButton
                text={data.primary_cta || "Hire Me"}
                onClick={() => scrollToSection("contact")}
                size="sm"
                showSparkles
                showArrow
                className="w-full sm:w-auto"
              />
            </div>

            {/* Desktop Only: Free AI Audit (Hidden on mobile) */}
            <button
              type="button"
              onClick={() => openBookingModal("Free AI Audit Strategy Session")}
              className="hidden sm:inline-flex relative group rounded-full px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white border border-white/25 hover:border-white/50 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_0_35px_rgba(14,165,233,0.55)] overflow-hidden items-center justify-center gap-2 cursor-pointer shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(37, 99, 235, 0.30) 50%, rgba(14, 165, 233, 0.18) 100%)",
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
              <Sparkles className="w-4 h-4 text-cyan-300 group-hover:rotate-12 transition-transform relative z-10 shrink-0" />
              <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] whitespace-nowrap">
                Book a Free AI Audit
              </span>
            </button>

            {/* Watch 60s Pitch Button */}
            <div className="flex-1 sm:flex-none">
              <button
                type="button"
                onClick={openIntroVideo}
                className="relative group text-slate-200 hover:text-white font-semibold text-xs sm:text-sm w-full sm:w-auto px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-full border border-white/20 hover:border-white/40 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] overflow-hidden inline-flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer min-h-[40px] sm:min-h-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.10) 0%, rgba(37, 99, 235, 0.18) 50%, rgba(14, 165, 233, 0.12) 100%)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
                title="Watch 60-Second Video Intro"
              >
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-300 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all shadow-sm shrink-0">
                  <Play className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-current ml-0.5" />
                </span>
                <span className="relative z-10 whitespace-nowrap text-[11px] sm:text-sm">Watch 60s Pitch</span>
              </button>
            </div>
          </div>

          {/* 5. TRUST & CREDIBILITY METRICS */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-[#A39EB8] mt-3 sm:mt-4 pb-2 px-2">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A2FF]" />
              Verified 100% Client Satisfaction
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[#E0C3FC] font-bold">50+</span> Scaled Projects
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">&lt; 24h</span> Turnaround Response
            </span>
          </div>
        </motion.div>

        {/* 5. 3D FAN CAROUSEL WITH INTERACTIVE CLICK-TO-CENTER & MOBILE SWIPE */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative mt-4 md:mt-6 h-[340px] md:h-[400px] flex items-center justify-center [perspective:1200px] touch-pan-y"
        >
          {/* Spotlight Glow Container — centered directly behind the middle picture */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ zIndex: 0 }}
          >
            {/* Outer halo — wide neon wash behind center picture */}
            <div
              className="absolute w-[520px] md:w-[760px] h-[520px] md:h-[760px] rounded-full blur-3xl animate-pulse-glow"
              style={{
                background:
                  "radial-gradient(circle, #a855f7ee 0%, #a855f7aa 28%, #a855f744 55%, transparent 75%)",
              }}
            />
            {/* Inner core — bright spotlight bulb right behind center active picture */}
            <div
              className="absolute w-[280px] md:w-[420px] h-[280px] md:h-[420px] rounded-full blur-2xl animate-pulse-glow"
              style={{
                background:
                  "radial-gradient(circle, #ffffff 0%, #f5d0fe 22%, #d8b4fe 44%, #a855f7 68%, transparent 100%)",
                animationDuration: "2.4s",
                zIndex: 5,
              }}
            />
          </div>

          {readyImages.map((src, i) => {
            const style = getStyle(i);
            const isCurrentActive = i === active;

            return (
              <motion.div
                key={i}
                animate={style}
                onClick={() => setActive(i)}
                transition={{ type: "spring", stiffness: 70, damping: 20, mass: 0.8 }}
                className="absolute w-32 md:w-48 h-48 md:h-72 rounded-3xl overflow-hidden glass-strong cursor-pointer group"
                style={{
                  zIndex: isCurrentActive ? 20 : style.zIndex,
                  willChange: "transform, opacity",
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                  boxShadow: isCurrentActive
                    ? "0 0 50px rgba(168, 85, 247, 0.85), 0 0 100px rgba(168, 85, 247, 0.5), 0 0 160px rgba(217, 70, 239, 0.3)"
                    : undefined,
                }}
              >
                <img
                  src={src}
                  alt={`Showcase ${i + 1}`}
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={i === 0 ? "high" : "auto"}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      FALLBACK_HERO_IMAGES[i % FALLBACK_HERO_IMAGES.length];
                  }}
                  width={192}
                  height={288}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {isCurrentActive && (
                  <div className="absolute inset-0 ring-2 ring-primary/80 rounded-3xl pointer-events-none animate-pulse-glow shadow-[inset_0_0_24px_rgba(168,85,247,0.6)]" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Carousel indicator dots */}
        <div className="flex justify-center gap-2 mt-8">
          {readyImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-8 bg-gradient-primary shadow-[0_0_12px_rgba(0,153,255,0.7)]" : "w-2 bg-foreground/20 hover:bg-foreground/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Mobile Swipe Indicator */}
        <div className="flex md:hidden items-center justify-center gap-2 mt-3 text-[10px] text-muted-foreground/60 font-mono tracking-wider select-none">
          <span className="inline-block animate-pulse text-cyan-400">‹</span>
          <span>Swipe cards or tap to switch</span>
          <span className="inline-block animate-pulse text-cyan-400">›</span>
        </div>
      </div>
    </section>
  );
}
