import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ArrowRight, Sparkles, Maximize2 } from "lucide-react";

export type RingItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  metric?: string;
  description?: string;
  price?: string;
};

interface Ring3DGalleryProps {
  items: RingItem[];
  headline?: string;
  subheading?: string;
  categoryBadge?: string;
  onBookItem?: (item: RingItem) => void;
}

export default function Ring3DGallery({
  items,
  headline,
  subheading,
  categoryBadge,
  onBookItem,
}: Ring3DGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Active item locked / selected
  const [activeItem, setActiveItem] = useState<RingItem | null>(null);
  // Hovered item (overrides active temporarily for preview)
  const [hoveredItem, setHoveredItem] = useState<RingItem | null>(null);
  // Full modal preview
  const [modalItem, setModalItem] = useState<RingItem | null>(null);

  // Displayed item in center (only shown when hovered)
  const displayItem = hoveredItem;

  // Total panels in orbit (120 for desktop, 60 for mobile)
  const [totalPanels, setTotalPanels] = useState(120);
  const [dimensions, setDimensions] = useState({ rx: 660, ry: 160 });

  // Physics & Animation state refs (avoid React re-renders on every animation frame)
  const rotationRef = useRef(0);
  const velocityRef = useRef(0.0014); // default gentle auto-rotation
  const targetVelocityRef = useRef(0.0014);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const lastDragXRef = useRef(0);
  const isHoveringGalleryRef = useRef(false);

  // Resize handler
  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      const isMobile = w < 768;
      const isTablet = w >= 768 && w < 1024;
      setTotalPanels(isMobile ? 54 : isTablet ? 84 : 120);
      setDimensions({
        rx: isMobile ? Math.min(w * 0.44, 340) : isTablet ? 500 : Math.min(w * 0.44, 680),
        ry: isMobile ? 85 : isTablet ? 120 : 155,
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Populate virtual panels by looping items to reach totalPanels
  const panels = useMemo(() => {
    if (!items || items.length === 0) return [];
    const list: (RingItem & { virtualIndex: number })[] = [];
    for (let i = 0; i < totalPanels; i++) {
      const src = items[i % items.length];
      list.push({ ...src, virtualIndex: i });
    }
    return list;
  }, [items, totalPanels]);


  // Main 60fps render loop with GPU transforms
  useEffect(() => {
    let animId: number;
    const ringEl = ringRef.current;
    if (!ringEl) return;

    const panelEls = ringEl.querySelectorAll<HTMLElement>(".ring-panel");
    const count = panels.length;
    if (count === 0) return;

    const render = () => {
      // Smooth inertia
      if (!isDraggingRef.current) {
        // Return velocity to targetVelocity
        velocityRef.current += (targetVelocityRef.current - velocityRef.current) * 0.05;
        rotationRef.current += velocityRef.current;
      }

      const rot = rotationRef.current;
      const { rx, ry } = dimensions;

      panelEls.forEach((el, i) => {
        const angle = (i / count) * Math.PI * 2 + rot;
        const sinA = Math.sin(angle);
        const cosA = Math.cos(angle);

        // Position: 0 angle is front-center, PI is back-center
        const x = sinA * rx;
        const y = cosA * ry;
        const zDepth = (cosA + 1) / 2; // 0 = back, 1 = front

        const scale = 0.5 + zDepth * 0.55;
        const opacity = 0.22 + zDepth * 0.78;
        const blur = (1 - zDepth) * 1.5;
        const rotateY = -sinA * 42; // slightly curved inward
        const zIndex = Math.round(zDepth * 120);

        el.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px), ${Math.round(cosA * 150)}px) scale(${scale.toFixed(3)}) rotateY(${rotateY.toFixed(1)}deg)`;
        el.style.opacity = opacity.toFixed(2);
        el.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : "none";
        el.style.zIndex = String(zIndex);
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [panels, dimensions]);

  // Mouse move handler (adjusts rotation speed & direction subtly)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      const deltaX = e.clientX - lastDragXRef.current;
      lastDragXRef.current = e.clientX;
      rotationRef.current += deltaX * 0.0035;
      velocityRef.current = deltaX * 0.002;
      return;
    }
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    // Subtle speed nudge based on mouse distance from center
    targetVelocityRef.current = normalizedX * 0.006;
  }, []);

  const handleMouseEnter = () => {
    isHoveringGalleryRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveringGalleryRef.current = false;
    targetVelocityRef.current = 0.0014;
    setHoveredItem(null);
  };

  // Drag handlers for mouse & touch
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    lastDragXRef.current = e.clientX;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    targetVelocityRef.current = 0.0014;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      isDraggingRef.current = true;
      lastDragXRef.current = e.touches[0].clientX;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDraggingRef.current && e.touches[0]) {
      const currentX = e.touches[0].clientX;
      const deltaX = currentX - lastDragXRef.current;
      lastDragXRef.current = currentX;
      rotationRef.current += deltaX * 0.004;
      velocityRef.current = deltaX * 0.002;
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    targetVelocityRef.current = 0.0014;
  };

  return (
    <section className="relative w-full min-h-[92vh] flex flex-col items-center justify-start overflow-hidden bg-grid pt-28 pb-16 select-none">
      {/* Background ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[550px] rounded-full blur-[140px] opacity-35"
        style={{
          background: "radial-gradient(circle, hsl(271 91% 65%) 0%, hsl(328 86% 60%) 40%, transparent 75%)",
        }}
      />

      {/* Header Info */}
      <div className="container relative z-20 text-center max-w-4xl mx-auto px-4 mb-2">
        {categoryBadge && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-[0.25em] text-primary uppercase glass mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {categoryBadge}
          </motion.div>
        )}
        {headline && (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-4 text-foreground"
          >
            {headline}
          </motion.h1>
        )}
        {subheading && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {subheading}
          </motion.p>
        )}
      </div>

      {/* 3D Ring Orbit Interactive Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-[1400px] h-[480px] sm:h-[540px] md:h-[600px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: "1200px" }}
      >
        {/* CENTER PREVIEW CARD */}
        <AnimatePresence mode="wait">
          {displayItem && (
            <motion.div
              key={displayItem.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute z-10 flex flex-col items-center justify-center text-center pointer-events-auto max-w-[340px] sm:max-w-[420px] px-3"
            >
              {/* Preview image */}
              <div
                onClick={() => setModalItem(displayItem)}
                className="group relative w-56 sm:w-64 md:w-72 aspect-[4/3] rounded-2xl overflow-hidden glass-strong glow-border mb-3 cursor-pointer shadow-neon transition-transform hover:scale-[1.03]"
              >
                <img
                  src={displayItem.image}
                  alt={displayItem.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                  <span className="text-xs font-semibold text-white inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass">
                    <Maximize2 className="w-3.5 h-3.5" /> Enlarge
                  </span>
                </div>
                {displayItem.metric && (
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary text-white shadow-lg">
                    {displayItem.metric}
                  </span>
                )}
              </div>

              {/* Title & metadata */}
              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight mb-1">
                {displayItem.title}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {displayItem.category}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => setModalItem(displayItem)}
                  className="text-xs font-semibold text-primary hover:text-primary-glow underline underline-offset-4 tracking-wider uppercase transition-colors"
                >
                  Click to Enlarge +
                </button>
                {onBookItem && (
                  <button
                    onClick={() => onBookItem(displayItem)}
                    className="ml-2 bg-gradient-primary text-white text-xs font-semibold px-4 py-1.5 rounded-full neon-glow hover:scale-105 transition-transform inline-flex items-center gap-1.5"
                  >
                    Book Now <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D ELLIPTICAL RING ORBIT */}
        <div
          ref={ringRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          {panels.map((p, idx) => {
            const isHovered = hoveredItem?.id === p.id;
            const isActive = activeItem?.id === p.id;

            return (
              <div
                key={`${p.id}-${idx}`}
                data-index={idx}
                onMouseEnter={() => setHoveredItem(p)}
                onClick={() => {
                  setActiveItem(p);
                  setModalItem(p);
                }}
                className={`ring-panel pointer-events-auto absolute left-1/2 top-1/2 w-[34px] sm:w-[42px] h-[92px] sm:h-[114px] rounded-[3px] overflow-hidden cursor-pointer bg-neutral-900 border transition-[box-shadow,border-color] duration-200 ${
                  isActive || isHovered
                    ? "border-primary ring-2 ring-primary/80 shadow-[0_0_20px_rgba(168,85,247,0.7)]"
                    : "border-white/10 hover:border-primary/50 shadow-md"
                }`}
                style={{ willChange: "transform, opacity" }}
              >
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover pointer-events-none select-none"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom hint */}
      <div className="relative z-20 mt-4 text-center">
        <p className="text-[11px] sm:text-xs font-semibold tracking-[0.28em] text-muted-foreground/60 uppercase">
          MOVE TO EXPLORE · DRAG TO ROTATE · CLICK TO PREVIEW
        </p>
      </div>

      {/* FULL-SCREEN LUXURY ENLARGED MODAL (As in Screenshot 5) */}
      <AnimatePresence>
        {modalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalItem(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-4xl bg-neutral-950/90 rounded-3xl overflow-hidden ring-1 ring-white/15 shadow-2xl glass-strong flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setModalItem(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full glass hover:bg-white/15 transition-colors text-white"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Large Image Preview */}
              <div className="relative w-full md:w-3/5 aspect-[4/3] md:aspect-auto min-h-[260px] md:min-h-[460px] bg-black">
                <img
                  src={modalItem.image}
                  alt={modalItem.title}
                  className="w-full h-full object-cover"
                />
                {modalItem.metric && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-primary text-white shadow-lg">
                    {modalItem.metric}
                  </span>
                )}
              </div>

              {/* Information & Booking Column */}
              <div className="w-full md:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
                <div>
                  <span className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                    {modalItem.category}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-2 mb-4">
                    {modalItem.title}
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                    {modalItem.description ||
                      "Engineered for high-growth businesses. Tailored execution, verified results, and end-to-end management."}
                  </p>

                  {modalItem.price && (
                    <div className="mb-6 p-4 rounded-2xl glass border border-primary/20">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">
                        Starting Investment
                      </span>
                      <span className="text-2xl font-display font-bold text-gradient">
                        {modalItem.price}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setModalItem(null);
                      if (onBookItem) onBookItem(modalItem);
                    }}
                    className="w-full bg-gradient-primary text-white font-semibold py-3.5 px-6 rounded-full neon-glow hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                  >
                    Book This Service <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setModalItem(null)}
                    className="w-full glass py-2.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
