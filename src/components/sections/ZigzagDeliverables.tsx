import { useState, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Clock, ArrowRight, Sparkles } from "lucide-react";
import type { ServiceItem } from "@/data/services";

interface ZigzagDeliverablesProps {
  items: ServiceItem[];
  introTitle?: string;
  heading?: string;
  subheading?: string;
  sectionDesc?: string;
  accentColor?: string;
  headingGradient: string;
  badgeCls: string;
  numBadge: string;
  glowBorder: string;
  ctaBtn: string;
  ServiceIcon: React.ComponentType<{ className?: string }>;
  onSelectDetail: (item: ServiceItem) => void;
}

export default function ZigzagDeliverables({
  items,
  introTitle,
  heading = "WHAT I DO",
  subheading,
  sectionDesc,
  accentColor = "pink",
  headingGradient,
  badgeCls,
  numBadge,
  glowBorder,
  ctaBtn,
  ServiceIcon,
  onSelectDetail,
}: ZigzagDeliverablesProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  // Dynamic Scroll Progress for the Glowing Laser Beam along the line
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 65%", "end 75%"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  // Palette by service accent
  const themeConfig = {
    pink: {
      beam: "from-pink-500/20 via-pink-500 to-rose-400",
      shadow: "0 0 16px rgba(244, 63, 94, 0.75), 0 0 30px rgba(244, 63, 94, 0.35)",
      spotlight: "rgba(244, 63, 94, 0.22)",
      connector: "from-pink-500/80 via-pink-500/40 to-transparent",
      activeRing: "border-pink-500/60 shadow-[0_0_20px_rgba(244,63,94,0.45)]",
      activePing: "bg-pink-500/30",
    },
    teal: {
      beam: "from-teal-500/20 via-teal-400 to-emerald-400",
      shadow: "0 0 16px rgba(20, 184, 166, 0.75), 0 0 30px rgba(20, 184, 166, 0.35)",
      spotlight: "rgba(20, 184, 166, 0.22)",
      connector: "from-teal-500/80 via-teal-500/40 to-transparent",
      activeRing: "border-teal-500/60 shadow-[0_0_20px_rgba(20,184,166,0.45)]",
      activePing: "bg-teal-500/30",
    },
    purple: {
      beam: "from-purple-500/20 via-purple-400 to-indigo-400",
      shadow: "0 0 16px rgba(168, 85, 247, 0.75), 0 0 30px rgba(168, 85, 247, 0.35)",
      spotlight: "rgba(168, 85, 247, 0.22)",
      connector: "from-purple-500/80 via-purple-500/40 to-transparent",
      activeRing: "border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.45)]",
      activePing: "bg-purple-500/30",
    },
  }[accentColor] || {
    beam: "from-primary/20 via-primary to-primary-glow",
    shadow: "0 0 16px rgba(168, 85, 247, 0.75)",
    spotlight: "rgba(168, 85, 247, 0.22)",
    connector: "from-primary/80 to-transparent",
    activeRing: "border-primary/60 shadow-[0_0_20px_rgba(168,85,247,0.4)]",
    activePing: "bg-primary/30",
  };

  return (
    <section id="section-service-deliverables" className="relative py-20 content-auto overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        {/* Section Intro Header */}
        <div className="service-intro text-center max-w-3xl mx-auto mb-16 will-change-transform">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-[0.25em] uppercase mb-3 ${badgeCls}`}>
            <ServiceIcon className="w-3.5 h-3.5" />
            <span>{introTitle || `Welcome to ${subheading}`}</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            {heading}{" "}
            <span className={`bg-gradient-to-r ${headingGradient} bg-clip-text text-transparent`}>
              {subheading}
            </span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mt-3">
            {sectionDesc}
          </p>
        </div>

        {/* ZIGZAG TIMELINE CONTAINER WITH CENTRAL SPINE LINE */}
        <div ref={timelineRef} className="relative max-w-5xl mx-auto my-12">
          {/* 1. Base Vertical Spine Line */}
          <div
            aria-hidden="true"
            className="absolute left-6 md:left-1/2 top-6 bottom-6 w-[2px] -translate-x-1/2 bg-gradient-to-b from-primary/10 via-primary/50 to-primary/10 pointer-events-none"
          />

          {/* 2. Active Scroll Laser Beam on top of the line */}
          <motion.div
            aria-hidden="true"
            className={`absolute left-6 md:left-1/2 top-6 bottom-6 w-[3px] -translate-x-1/2 origin-top rounded-full bg-gradient-to-b ${themeConfig.beam} pointer-events-none z-10`}
            style={{
              scaleY,
              boxShadow: themeConfig.shadow,
            }}
          />

          {/* 3. Cards & Nodes List */}
          <div className="space-y-12 md:space-y-20 relative">
            {items.map((item, idx) => {
              const isRight = idx % 2 === 1; // 0=Left, 1=Right, 2=Left, 3=Right

              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isRight ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Step Card Half */}
                  <div className="w-full md:w-[calc(50%-48px)] pl-14 md:pl-0">
                    <ZigzagCard
                      item={item}
                      idx={idx}
                      isRight={isRight}
                      glowBorder={glowBorder}
                      numBadge={numBadge}
                      ctaBtn={ctaBtn}
                      spotlightColor={themeConfig.spotlight}
                      onSelectDetail={onSelectDetail}
                    />
                  </div>

                  {/* Desktop Connecting Beam between Central Node and Card */}
                  <motion.div
                    aria-hidden="true"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: false, margin: "0px 0px -80px 0px" }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: isRight ? "left" : "right" }}
                    className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[2px] pointer-events-none z-10 ${
                      isRight
                        ? `left-1/2 w-12 bg-gradient-to-r ${themeConfig.connector}`
                        : `right-1/2 w-12 bg-gradient-to-l ${themeConfig.connector}`
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-pulse" />
                  </motion.div>

                  {/* Central Spine Node with Number (01, 02, etc.) */}
                  <SpineNode
                    number={item.number}
                    numBadge={numBadge}
                    activeRing={themeConfig.activeRing}
                    activePing={themeConfig.activePing}
                  />

                  {/* Spacer for opposite half on desktop */}
                  <div className="hidden md:block md:w-[calc(50%-48px)]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Interactive 3D Card: Slides in from Left or Right + 3D Mouse Tilt & Hover FX
// -----------------------------------------------------------------------------
interface ZigzagCardProps {
  item: ServiceItem;
  idx: number;
  isRight: boolean;
  glowBorder: string;
  numBadge: string;
  ctaBtn: string;
  spotlightColor: string;
  onSelectDetail: (item: ServiceItem) => void;
}

function ZigzagCard({
  item,
  idx,
  isRight,
  glowBorder,
  numBadge,
  ctaBtn,
  spotlightColor,
  onSelectDetail,
}: ZigzagCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  // 3D tilt tracking cursor inside the card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rx = ((y - cy) / cy) * -6; // tilt range -6deg to +6deg
    const ry = ((x - cx) / cx) * 6;

    setTilt({ rx, ry });
    setMousePos({ x, y, active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setMousePos((prev) => ({ ...prev, active: false }));
  };

  return (
    <motion.div
      // Left card glides in from Left (-100px), Right card glides in from Right (+100px)
      initial={{
        opacity: 0,
        x: isRight ? 100 : -100,
        rotateY: isRight ? 10 : -10,
        scale: 0.94,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        rotateY: 0,
        scale: 1,
      }}
      viewport={{ once: false, margin: "0px 0px -80px 0px" }}
      transition={{
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: 1200 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: mousePos.active
            ? "transform 0.1s ease-out"
            : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className={`service-card-${idx + 1} group relative glass-strong rounded-3xl overflow-hidden border flex flex-col justify-between transition-all duration-300 ${glowBorder} bg-gradient-to-b from-card/90 via-card/80 to-card/50 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:-translate-y-2 will-change-transform`}
      >
        {/* Dynamic radial mouse spotlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
          style={{
            background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 80%)`,
          }}
        />

        <div>
          {/* Card Cover Visual */}
          <div className="relative w-full aspect-video overflow-hidden bg-neutral-900 rounded-t-3xl">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
            />
            {/* Ambient shadow gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />

            {/* Shimmer sweep effect on card hover */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"
            />

            {/* Number step badge */}
            <span
              className={`absolute top-3 left-3 text-xs font-mono font-bold px-3 py-1 rounded-xl border backdrop-blur-md shadow-md transition-transform duration-300 group-hover:scale-105 ${numBadge}`}
            >
              0{item.number}
            </span>

            {/* Key result badge */}
            {item.details?.stats?.[0] && (
              <span className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-xl bg-black/70 text-white backdrop-blur-md border border-white/15 shadow-md flex items-center gap-1.5 transition-transform duration-300 group-hover:scale-105">
                <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                +{item.details.stats[0].value}
                {item.details.stats[0].suffix}
              </span>
            )}
          </div>

          {/* Card Body */}
          <div className="p-6 relative z-10">
            <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors flex items-center justify-between">
              <span>{item.title}</span>
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary shrink-0" />
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {item.short}
            </p>

            {/* Timeline & Quick Metric */}
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-primary" />
                {item.details?.timeline ? item.details.timeline.split(",")[0] : "Fast Turnaround"}
              </span>
              <span className="text-primary font-mono font-medium tracking-wide">
                {item.details?.stats?.[0]?.label || "Verified Result"}
              </span>
            </div>
          </div>
        </div>

        {/* Card Action Buttons */}
        <div className="p-6 pt-0 flex gap-2 relative z-10">
          <button
            onClick={() => onSelectDetail(item)}
            className="flex-1 glass py-2.5 px-4 rounded-xl text-xs font-semibold hover:bg-white/10 hover:text-white text-foreground transition-all flex items-center justify-center gap-1.5 border border-white/10 hover:border-white/20"
          >
            Full Breakdown <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <a
            href={
              item.details?.cta?.href ||
              `https://wa.me/8801700000000?text=Hi,%20I%20am%20interested%20in%20${encodeURIComponent(
                item.title
              )}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className={`py-2.5 px-5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] ${ctaBtn}`}
          >
            Start
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// Central Spine Node with Animated Number Ring & Hover Pulse
// -----------------------------------------------------------------------------
interface SpineNodeProps {
  number: number;
  numBadge: string;
  activeRing: string;
  activePing: string;
}

function SpineNode({ number, numBadge, activeRing, activePing }: SpineNodeProps) {
  return (
    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20 top-6 md:top-1/2 md:-translate-y-1/2">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: false, margin: "0px 0px -80px 0px" }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center justify-center group"
      >
        {/* Outer ambient ripple ping */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 rounded-full ${activePing} animate-ping pointer-events-none opacity-50`}
        />

        {/* Rotating subtle cyber dash ring */}
        <div
          aria-hidden="true"
          className="absolute -inset-1 rounded-full border border-dashed border-white/20 animate-[spin_12s_linear_infinite] pointer-events-none"
        />

        {/* Inner number orb */}
        <div
          className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-background/95 border-2 flex items-center justify-center font-display font-black text-sm md:text-base backdrop-blur-xl shadow-xl transition-all duration-300 group-hover:scale-110 ${numBadge} ${activeRing}`}
        >
          0{number}
        </div>
      </motion.div>
    </div>
  );
}
