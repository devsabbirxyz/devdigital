import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";

type Item = {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string | null;
  badge: string | null;
  media_url: string | null;
  media_type: "image" | "video";
  sort_order: number;
  is_active: boolean;
};

type Settings = {
  enabled: boolean;
  title: string;
  subtitle: string;
  background: string;
  animation_speed: number;
};

const DEFAULTS: Settings = {
  enabled: true,
  title: "আমার দক্ষতা ও সেবাসমূহ",
  subtitle:
    "Digital Marketing, Web Development এবং AI Automation এর মাধ্যমে ব্যবসার দ্রুত বৃদ্ধি ও অটোমেশন সমাধান।",
  background: "",
  animation_speed: 1,
};

function Icon({ name, className }: { name?: string | null; className?: string }) {
  const C = (name && (Icons as any)[name]) || Icons.Sparkles;
  return <C className={className} />;
}

export default function ShowcaseScroll() {
  const { data: settings } = useSiteSettings<Settings>("showcase_section", DEFAULTS);
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("showcase_items")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      setItems(((data as any[]) || []).map((d) => ({
        ...d,
        features: Array.isArray(d.features) ? d.features : [],
      })));
    })();
  }, []);

  // Sticky scroll progress -> active index
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || items.length === 0) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = el.offsetHeight - vh;
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      const idx = Math.min(items.length - 1, Math.floor(progress * items.length));
      setActive(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items.length]);

  const sectionHeight = useMemo(
    () => `${Math.max(1, items.length) * 100}vh`,
    [items.length]
  );

  if (!settings.enabled || items.length === 0) return null;

  const current = items[active];
  const ITEM_H = 110; // px per word row

  return (
    <section
      id="showcase"
      ref={sectionRef}
      className="relative w-full"
      style={{ height: sectionHeight, background: settings.background || undefined }}
      aria-label="Services showcase"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-[520px] w-[520px] rounded-full bg-accent/20 blur-3xl" />
        </div>

        <div className="container mx-auto h-full px-4 md:px-8 flex flex-col">
          {/* header */}
          <div className="pt-20 md:pt-24 pb-4 md:pb-6 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-gradient">
              {settings.title}
            </h2>
            <p className="mt-3 text-sm md:text-base text-muted-foreground">
              {settings.subtitle}
            </p>
          </div>

          {/* content */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 md:gap-10 items-center pb-10">
            {/* Rolling word list (slot-machine) */}
            <div className="relative h-[440px] md:h-[520px] overflow-hidden order-1">
              {/* fade masks */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent z-10" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
              {/* arrow indicator */}
              <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 text-primary">
                <ArrowRight className="h-7 w-7 md:h-9 md:w-9 drop-shadow-[0_0_12px_hsl(var(--primary))]" />
              </div>

              <motion.ul
                className="absolute left-0 right-0 top-1/2 will-change-transform"
                style={{ perspective: 800 }}
                animate={{ y: -active * ITEM_H - ITEM_H / 2 }}
                transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.6 }}
              >
                {items.map((it, i) => {
                  const diff = i - active;
                  const isActive = diff === 0;
                  return (
                    <li
                      key={it.id}
                      style={{ height: ITEM_H }}
                      className="flex items-center pl-14 md:pl-20"
                    >
                      <span
                        className={`font-display font-extrabold tracking-tight transition-all duration-500 ${
                          isActive
                            ? "text-white text-5xl md:text-7xl"
                            : "text-white/30 text-3xl md:text-5xl"
                        }`}
                        style={{
                          filter: isActive ? "blur(0px)" : `blur(${Math.min(8, Math.abs(diff) * 3)}px)`,
                          transform: isActive
                            ? "rotate(0deg) scale(1)"
                            : `rotate(${diff > 0 ? -8 : 8}deg) scale(${Math.max(0.7, 1 - Math.abs(diff) * 0.08)})`,
                          opacity: isActive ? 1 : Math.max(0.15, 1 - Math.abs(diff) * 0.25),
                          textShadow: isActive ? "0 0 40px hsl(var(--primary) / 0.5)" : "none",
                        }}
                      >
                        {it.title}
                      </span>
                    </li>
                  );
                })}
              </motion.ul>
            </div>

            {/* Detail panel */}
            <div className="order-2 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24, filter: "blur(8px)" }}
                  transition={{ duration: 0.45 / (settings.animation_speed || 1) }}
                  className="glass-strong rounded-3xl p-6 md:p-8 ring-1 ring-primary/20"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center neon-glow">
                      <Icon name={current.icon} className="h-6 w-6 text-white" />
                    </div>
                    {current.badge && (
                      <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full glass border border-primary/30 text-primary">
                        {current.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground mb-5">
                    {current.description}
                  </p>
                  {current.features.length > 0 && (
                    <ul className="space-y-2">
                      {current.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm md:text-base">
                          <Icons.Check className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {current.media_url && (
                    <div className="mt-5 rounded-2xl overflow-hidden ring-1 ring-primary/20">
                      {current.media_type === "video" ? (
                        <video src={current.media_url} autoPlay muted loop playsInline className="w-full h-48 object-cover" />
                      ) : (
                        <img src={current.media_url} alt={current.title} loading="lazy" className="w-full h-48 object-cover" />
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* progress dots */}
              <div className="mt-4 flex justify-center gap-2">
                {items.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === active ? "w-8 bg-primary shadow-glow-soft" : "w-2 bg-white/15"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}