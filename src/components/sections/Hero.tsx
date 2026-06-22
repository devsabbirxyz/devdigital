import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { scrollToSection } from "@/lib/scroll";

const CACHE_KEY = "hero_images_v3";

function readCache(): string[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const arr = JSON.parse(raw);
    if (Array.isArray(arr) && arr.length === 7 && arr.every((s) => typeof s === "string" && s)) {
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

const DEFAULT: HeroData = {
  title: "Crafting Digital Experiences That Inspire",
  description: "Premium portfolio showcasing innovative design, cutting-edge development, and AI-powered automation solutions.",
  primary_cta: "Hire Me",
  secondary_cta: "View Work",
};

export default function Hero() {
  const { data } = useSiteSettings<HeroData>("hero", DEFAULT);
  const isMobile = useIsMobile();
  const [images, setImages] = useState<string[]>(() => readCache() ?? []);
  const [active, setActive] = useState(0);
  const readyImages = useMemo(
    () => images.filter(Boolean).slice(0, isMobile ? 5 : 7),
    [images, isMobile]
  );
  const shouldAnimate = readyImages.length > 1;

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

  // Preload all hero images via <link rel="preload"> for instant render
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    readyImages.forEach((src, i) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      if (i === 0) link.setAttribute("fetchpriority", "high");
      document.head.appendChild(link);
      links.push(link);
    });
    return () => { links.forEach((l) => l.remove()); };
  }, [readyImages]);

  useEffect(() => {
    readyImages.forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  }, [readyImages]);

  useEffect(() => {
    if (!shouldAnimate) return;
    const t = setInterval(() => setActive((i) => (i + 1) % readyImages.length), 4200);
    return () => clearInterval(t);
  }, [readyImages.length, shouldAnimate]);

  useEffect(() => {
    if (active >= readyImages.length) setActive(0);
  }, [active, readyImages.length]);

  // arrange images in a fan: positions relative to center, dynamic by count
  const n = readyImages.length;
  const center = Math.floor(n / 2);
  const getStyle = (i: number) => {
    const offset = ((i - active + n) % n);
    const pos = offset - center;
    const abs = Math.abs(pos);
    return {
      x: pos * (isMobile ? 72 : 96),
      y: abs * (isMobile ? 14 : 22),
      rotate: pos * (isMobile ? 5 : 8),
      scale: pos === 0 ? 1.06 : 1 - abs * (isMobile ? 0.08 : 0.12),
      zIndex: 10 - abs,
      opacity: abs > (isMobile ? 2 : 3) ? 0 : 1 - abs * (isMobile ? 0.24 : 0.18),
    };
  };

  return (
    <section id="home" className="relative pt-24 pb-16 overflow-hidden bg-grid">
      {/* ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
            {data.title.split(" ").map((w, i, arr) => (
              <span key={i} className={i >= arr.length - 2 ? "text-gradient" : ""}>
                {w}{" "}
              </span>
            ))}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {data.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <button
              onClick={() => scrollToSection("contact")}
              className="bg-gradient-primary text-white font-semibold px-7 py-3 rounded-full neon-glow hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              {data.primary_cta} <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollToSection("projects")}
              className="glass-strong text-foreground font-semibold px-7 py-3 rounded-full hover:scale-105 transition-transform"
            >
              {data.secondary_cta}
            </button>
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="relative mt-2 md:mt-4 h-[340px] md:h-[400px] flex items-center justify-center [perspective:1200px]">
          {/* Outer halo — wide soft purple wash behind everything */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] md:w-[720px] h-[460px] md:h-[720px] rounded-full blur-3xl animate-pulse-glow"
            style={{
              background:
                "radial-gradient(circle, #a855f7cc 0%, #a855f799 28%, #a855f744 55%, transparent 78%)",
              zIndex: 0,
              animationDuration: isMobile ? "4.8s" : undefined,
            }}
          />
          {/* Inner core — bright lamp bulb, sits in front of side cards but behind the active card */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] md:w-[360px] h-[260px] md:h-[360px] rounded-full blur-2xl animate-pulse-glow"
            style={{
              background:
                "radial-gradient(circle, #f5d0fe 0%, #d8b4fe 18%, #a855f7 45%, #a855f766 70%, transparent 100%)",
              zIndex: 5,
              animationDuration: isMobile ? "5.4s" : "2.6s",
            }}
          />
          {readyImages.map((src, i) => {
            const style = getStyle(i);
            return (
              <motion.div
                key={i}
                animate={style}
                transition={{ type: "spring", stiffness: 70, damping: 20, mass: 0.8 }}
                className="absolute w-32 md:w-48 h-48 md:h-72 rounded-3xl overflow-hidden glass-strong"
                style={{
                  zIndex: i === active ? 20 : style.zIndex,
                  willChange: "transform, opacity",
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                  contain: "layout paint style",
                  boxShadow:
                    i === active
                      ? "0 0 80px #a855f7cc, 0 0 160px #a855f766"
                      : undefined,
                }}
              >
                <img
                  src={src}
                  alt={`Showcase ${i + 1}`}
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={i === 0 ? "high" : "auto"}
                  width={192}
                  height={288}
                  className="w-full h-full object-cover"
                />
                {i === active && (
                  <div className="absolute inset-0 ring-2 ring-primary/60 rounded-3xl pointer-events-none animate-pulse-glow" />
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {readyImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-8 bg-gradient-primary" : "w-2 bg-foreground/20"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
