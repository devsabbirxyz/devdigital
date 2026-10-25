import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export type ServicePoster = {
  id: "marketing" | "web" | "ai";
  title: string;
  tabLabel: string;
  image: string;
  alt: string;
};

export const SERVICE_POSTERS: ServicePoster[] = [
  {
    id: "marketing",
    title: "DIGITAL MARKETING",
    tabLabel: "Digital Marketing",
    image: "/images/poster-marketing.jpg",
    alt: "Digital Marketing - Strategy & Growth - Innovate Now, Scale Later",
  },
  {
    id: "web",
    title: "WEB DEVELOPMENT",
    tabLabel: "Web Development",
    image: "/images/poster-web.jpg",
    alt: "Web Development - Coding & Design - Create Now, Deploy Later",
  },
  {
    id: "ai",
    title: "AI AUTOMATION",
    tabLabel: "AI Automation",
    image: "/images/poster-ai.jpg",
    alt: "AI Automation - Efficiency & Intelligence - Automate Now, Scale Later",
  },
];

interface ServicesHeroProps {
  initialServiceId?: "marketing" | "web" | "ai";
  onServiceChange?: (serviceId: "marketing" | "web" | "ai", isManual: boolean) => void;
}

export default function ServicesHero({
  initialServiceId = "marketing",
  onServiceChange,
}: ServicesHeroProps) {
  const [activeId, setActiveId] = useState<"marketing" | "web" | "ai">(initialServiceId);
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // 3D Mouse Tilt physics
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const currentPoster =
    SERVICE_POSTERS.find((p) => p.id === activeId) || SERVICE_POSTERS[0];

  // Sync prop changes (e.g. when route slug changes)
  useEffect(() => {
    if (initialServiceId) {
      setActiveId(initialServiceId);
    }
  }, [initialServiceId]);

  // Handle service switch
  const handleSelectService = useCallback(
    (id: "marketing" | "web" | "ai", manual = true) => {
      setActiveId(id);
      if (manual) {
        setHasInteracted(true);
      }
      onServiceChange?.(id, manual);
    },
    [onServiceChange]
  );

  // Auto-rotate every 6.5s if user hasn't manually clicked
  useEffect(() => {
    if (isHovered || hasInteracted) return;

    const interval = setInterval(() => {
      setActiveId((prev) => {
        const idx = SERVICE_POSTERS.findIndex((s) => s.id === prev);
        const nextIdx = (idx + 1) % SERVICE_POSTERS.length;
        const nextId = SERVICE_POSTERS[nextIdx].id;
        onServiceChange?.(nextId, false);
        return nextId;
      });
    }, 6500);

    return () => clearInterval(interval);
  }, [isHovered, hasInteracted, onServiceChange]);

  // Mouse move handler for realistic 3D perspective tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion || window.innerWidth < 768) return;
    const { clientX, clientY } = e;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const nx = (clientX / w - 0.5) * 2;
    const ny = (clientY / h - 0.5) * 2;
    setTilt({ rx: -ny * 6, ry: nx * 8 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
  };

  // Keyboard navigation for tablist
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIdx = (index + 1) % SERVICE_POSTERS.length;
      handleSelectService(SERVICE_POSTERS[nextIdx].id, true);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIdx = (index - 1 + SERVICE_POSTERS.length) % SERVICE_POSTERS.length;
      handleSelectService(SERVICE_POSTERS[prevIdx].id, true);
    }
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[580px] sm:min-h-[640px] md:min-h-[700px] pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 bg-[#050505] text-white overflow-hidden select-none flex flex-col justify-between items-center"
      style={{ perspective: "1200px" }}
      aria-label="Services Cinematic Poster Hero"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Soft radial glow behind the poster */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[750px] h-[500px] md:h-[750px] rounded-full blur-[140px] opacity-25 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(168, 85, 247, 0.2) 40%, transparent 70%)",
          }}
        />

        {/* Dark vignette frame */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(5, 5, 5, 0.6) 75%, #050505 100%)",
          }}
        />
      </div>

      {/* Main Poster Stage (with Luxury Ambilight Neon Backlight & 3D perspective tilt) */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-2 sm:py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPoster.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: tilt.rx,
              rotateY: tilt.ry,
            }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 },
              rotateX: { type: "spring", stiffness: 120, damping: 25 },
              rotateY: { type: "spring", stiffness: 120, damping: 25 },
            }}
            className="group relative w-full max-w-[1020px] lg:max-w-[1120px] max-h-[50vh] sm:max-h-[56vh] md:max-h-[62vh] aspect-[16/9] flex items-center justify-center will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* 1. Dynamic Service-Matched Ambilight Halo (Glowing aura behind poster) */}
            <div
              aria-hidden
              className={`absolute -inset-4 sm:-inset-6 md:-inset-10 rounded-[2.5rem] bg-gradient-to-r ${
                currentPoster.id === "marketing"
                  ? "from-cyan-500/35 via-sky-400/30 to-blue-600/35"
                  : currentPoster.id === "web"
                  ? "from-cyan-400/35 via-teal-400/25 to-blue-500/35"
                  : "from-sky-400/35 via-indigo-500/30 to-cyan-500/35"
              } blur-3xl opacity-60 group-hover:opacity-90 transition-all duration-700 pointer-events-none -z-10`}
              style={{ filter: "blur(54px)" }}
            />

            {/* 2. Polished Ground Stage Light Reflection */}
            <div
              aria-hidden
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-16 rounded-full blur-2xl opacity-45 pointer-events-none -z-10"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(56, 189, 248, 0.45) 0%, rgba(59, 130, 246, 0.18) 50%, transparent 80%)",
              }}
            />

            {/* 3. Framed Poster Card */}
            <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.95),0_0_60px_rgba(56,189,248,0.18)] glass-strong">
              {/* The Cinematic Poster Image */}
              <img
                src={currentPoster.image}
                alt={currentPoster.alt}
                className="w-full h-full object-cover object-center select-none pointer-events-auto cursor-pointer transition-transform duration-700 group-hover:scale-[1.02]"
                loading="eager"
              />

              {/* Inner subtle vignette & top specular rim highlight */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none rounded-2xl sm:rounded-3xl ring-1 ring-inset ring-white/15"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(5, 5, 5, 0.35) 100%)",
                }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Switcher Controls & Scroll Indicator */}
      <div className="relative z-30 w-full pt-4 pb-2 px-4 sm:px-8 flex flex-col items-center gap-3">
        {/* Animated Scroll Indicator */}
        <div className="flex flex-col items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-[9px] md:text-[10px] font-sans font-medium tracking-[0.35em] text-[#b5b5b5] uppercase">
            SCROLL
          </span>
          <div className="w-[1px] h-5 bg-gradient-to-b from-white/70 to-transparent animate-pulse" />
        </div>

        {/* 3 Pill Tabs Switcher */}
        <div
          role="tablist"
          aria-label="Services poster selector"
          className="flex items-center gap-1 sm:gap-2 p-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 shadow-2xl max-w-full overflow-x-auto scrollbar-hide"
        >
          {SERVICE_POSTERS.map((srv, idx) => {
            const isActive = srv.id === activeId;
            return (
              <button
                key={srv.id}
                role="tab"
                id={`service-tab-${srv.id}`}
                aria-selected={isActive}
                aria-controls={`service-panel-${srv.id}`}
                tabIndex={isActive ? 0 : -1}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onClick={() => handleSelectService(srv.id, true)}
                className={`relative px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-sans transition-all duration-300 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  isActive
                    ? "bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-[1.02]"
                    : "text-white/80 hover:text-white hover:bg-white/[0.08] hover:-translate-y-0.5 font-medium"
                }`}
              >
                {srv.tabLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom 200px Smooth Fade into 3D Ring Section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[180px] md:h-[220px] z-20"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(5, 5, 5, 0.5) 40%, #050505 100%)",
        }}
      />
    </section>
  );
}
