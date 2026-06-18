import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
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
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center pb-10">
            {/* Media */}
            <div className="relative order-1 lg:order-1">
              <div className="relative aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden glass-strong neon-glow ring-1 ring-primary/30">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, scale: 0.96, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
                    transition={{ duration: 0.5 / (settings.animation_speed || 1) }}
                    className="absolute inset-0"
                  >
                    {current.media_url ? (
                      current.media_type === "video" ? (
                        <video
                          src={current.media_url}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={current.media_url}
                          alt={current.title}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      )
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                        <Icon name={current.icon} className="h-24 w-24 text-primary" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>
              </div>

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

            {/* Text panel */}
            <div className="order-2 lg:order-2 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
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
                  <h3 className="font-display text-2xl md:text-4xl font-bold mb-2">
                    {current.title}
                  </h3>
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
                </motion.div>
              </AnimatePresence>

              {/* item nav */}
              <div className="mt-4 hidden md:flex flex-wrap gap-2">
                {items.map((it, i) => (
                  <button
                    key={it.id}
                    onClick={() => {
                      const el = sectionRef.current;
                      if (!el) return;
                      const vh = window.innerHeight;
                      const total = el.offsetHeight - vh;
                      const target =
                        el.offsetTop + (total * (i + 0.5)) / items.length;
                      window.scrollTo({ top: target, behavior: "smooth" });
                    }}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      i === active
                        ? "border-primary/60 bg-primary/15 text-foreground shadow-glow-soft scale-105"
                        : "border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 blur-[0.3px] opacity-70"
                    }`}
                  >
                    {it.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}