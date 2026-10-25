import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import type { ServiceItem } from "@/data/services";

interface StickyDeliverablesStackProps {
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

export default function StickyDeliverablesStack({
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
}: StickyDeliverablesStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Spotlight color based on service accent
  const spotlightColor =
    accentColor === "pink"
      ? "rgba(244, 63, 94, 0.16)"
      : accentColor === "teal"
      ? "rgba(20, 184, 166, 0.16)"
      : "rgba(168, 85, 247, 0.16)";

  return (
    <section id="section-service-deliverables" className="relative py-20 content-auto overflow-hidden">
      {/* Background ambient decorative light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

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

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs text-muted-foreground bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Scroll down to explore all {items.length} deliverables
          </div>
        </div>

        {/* STICKY STACKING CARDS CONTAINER (NO VERTICAL SPINE LINE) */}
        <div ref={containerRef} className="max-w-5xl mx-auto relative my-8 pb-16">
          {items.map((item, idx) => {
            // Sticky top position: each card rests slightly lower than the previous one, forming a layered stack
            const stickyTop = `calc(96px + ${idx * 26}px)`;

            return (
              <div
                key={item.id}
                style={{ top: stickyTop }}
                className="sticky mb-12 sm:mb-16 md:mb-20 last:mb-0 transition-transform will-change-transform"
              >
                <StickyStackCard
                  item={item}
                  idx={idx}
                  total={items.length}
                  glowBorder={glowBorder}
                  numBadge={numBadge}
                  ctaBtn={ctaBtn}
                  spotlightColor={spotlightColor}
                  onSelectDetail={onSelectDetail}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Individual Sticky Deck Card with 3D Spotlight & Split Landscape Showcase
// -----------------------------------------------------------------------------
interface StickyStackCardProps {
  item: ServiceItem;
  idx: number;
  total: number;
  glowBorder: string;
  numBadge: string;
  ctaBtn: string;
  spotlightColor: string;
  onSelectDetail: (item: ServiceItem) => void;
}

function StickyStackCard({
  item,
  idx,
  total,
  glowBorder,
  numBadge,
  ctaBtn,
  spotlightColor,
  onSelectDetail,
}: StickyStackCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, active: false }));
  };

  const timelineText = item.details?.timeline ? item.details.timeline.split(",")[0] : "Fast Turnaround";
  const primaryStat = item.details?.stats?.[0];
  const deliverables = item.details?.deliverables?.slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`group relative glass-strong rounded-3xl overflow-hidden border p-6 sm:p-8 md:p-10 transition-all duration-300 ${glowBorder} bg-gradient-to-br from-card/95 via-card/85 to-card/65 backdrop-blur-2xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)]`}
      >
        {/* Interactive radial mouse spotlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
          style={{
            background: `radial-gradient(480px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 80%)`,
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center relative z-20">
          {/* LEFT COLUMN: Service Information & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            <div>
              {/* Header Badges: Index Counter + Turnaround */}
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className={`inline-flex items-center text-xs font-mono font-bold px-3 py-1 rounded-lg border backdrop-blur-md shadow-sm ${numBadge}`}>
                  0{item.number} <span className="opacity-40 mx-1">/</span> 0{total}
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-white/5 border border-white/10 px-3 py-1 rounded-lg font-medium">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  {timelineText}
                </span>

                {primaryStat && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary font-mono bg-primary/10 border border-primary/20 px-3 py-1 rounded-lg">
                    <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                    +{primaryStat.value}{primaryStat.suffix} {primaryStat.label}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground group-hover:text-primary transition-colors tracking-tight">
                {item.title}
              </h3>

              {/* Short summary */}
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mt-2.5">
                {item.short}
              </p>

              {/* Deliverable preview bullets */}
              {deliverables && deliverables.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                  {deliverables.map((d, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{d}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap sm:flex-nowrap gap-3">
              <button
                onClick={() => onSelectDetail(item)}
                className="flex-1 sm:flex-initial glass py-3 px-6 rounded-xl text-xs sm:text-sm font-semibold hover:bg-white/10 text-foreground transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-white/20"
              >
                Full Breakdown <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                className={`py-3 px-7 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] ${ctaBtn}`}
              >
                Start This Project
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Visual Showcase Cover */}
          <div className="lg:col-span-5">
            <div className="relative w-full aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl group/image">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/image:scale-108"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

              {/* Shimmer sweep on hover */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"
              />

              {/* Floating Bottom Metric Badge */}
              {primaryStat && (
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                      Proven Impact
                    </div>
                    <div className="text-xs font-bold text-white truncate">
                      {primaryStat.label}
                    </div>
                  </div>
                  <div className="text-base font-display font-black text-primary">
                    +{primaryStat.value}{primaryStat.suffix}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
