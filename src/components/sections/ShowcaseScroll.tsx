import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";

type Item = {
  id: string;
  title: string;
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

export default function ShowcaseScroll() {
  const { data: settings } = useSiteSettings<Settings>("showcase_section", DEFAULTS);
  const [items, setItems] = useState<Item[]>([]);
  const [progress, setProgress] = useState(0); // 0..items.length-1 (float)
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("showcase_items")
        .select("id,title,sort_order,is_active")
        .eq("is_active", true)
        .order("sort_order");
      setItems((data as any[]) || []);
    })();
  }, []);

  // Sticky scroll progress -> smooth float index
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || items.length === 0) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = Math.max(1, el.offsetHeight - vh);
        const p = Math.min(1, Math.max(0, -rect.top / total));
        setProgress(p * (items.length - 1));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items.length]);

  // Make each item ~80vh of scroll so transitions feel deliberate
  const sectionHeight = useMemo(
    () => `${Math.max(1, items.length) * 80 + 20}vh`,
    [items.length]
  );

  if (!settings.enabled || items.length === 0) return null;

  const ITEM_H = 140; // px per word row

  return (
    <section
      id="showcase"
      ref={sectionRef}
      className="relative w-full"
      style={{ height: sectionHeight, background: settings.background || undefined }}
      aria-label="Services showcase"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-[520px] w-[520px] rounded-full bg-accent/20 blur-3xl" />
        </div>

        <div className="container mx-auto h-full px-4 md:px-8 flex flex-col">
          {/* header */}
          <div className="pt-16 md:pt-24 pb-2 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-2xl md:text-4xl font-bold text-gradient">
              {settings.title}
            </h2>
          </div>

          {/* Rolling word list (slot-machine, scroll-tied) */}
          <div className="relative flex-1 overflow-hidden">
            {/* fade masks */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-background via-background/70 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background via-background/70 to-transparent z-10" />

            {/* arrow indicator */}
            <div className="absolute left-4 md:left-16 top-1/2 -translate-y-1/2 z-20 text-white">
              <ArrowRight className="h-8 w-8 md:h-12 md:w-12 drop-shadow-[0_0_16px_hsl(var(--primary))]" />
            </div>

            <ul
              className="absolute left-0 right-0 top-1/2 will-change-transform"
              style={{
                transform: `translate3d(0, ${-progress * ITEM_H - ITEM_H / 2}px, 0)`,
              }}
            >
              {items.map((it, i) => {
                const diff = i - progress; // negative = above center, positive = below
                const abs = Math.abs(diff);
                const t = Math.max(0, 1 - abs); // 1 at center, 0 at ±1
                const scale = 0.5 + t * 0.8; // 0.5 .. 1.3
                const opacity = 0.15 + t * 0.85;
                const blur = abs < 1 ? (1 - t) * 4 : Math.min(10, 4 + (abs - 1) * 3);
                const rotate = diff * -6; // tilt around center
                const isCenter = abs < 0.5;
                return (
                  <li
                    key={it.id}
                    style={{ height: ITEM_H }}
                    className="flex items-center pl-16 md:pl-32"
                  >
                    <span
                      className="font-display font-extrabold tracking-tight text-white whitespace-nowrap"
                      style={{
                        fontSize: "clamp(2rem, 8vw, 6rem)",
                        transform: `scale(${scale}) rotate(${rotate}deg)`,
                        transformOrigin: "left center",
                        opacity,
                        filter: `blur(${blur}px)`,
                        textShadow: isCenter ? "0 0 40px hsl(var(--primary) / 0.5)" : "none",
                        transition: "text-shadow 0.3s ease",
                      }}
                    >
                      {it.title}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}