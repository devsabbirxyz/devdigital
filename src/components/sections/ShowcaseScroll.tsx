import { useEffect, useRef, useState } from "react";
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
  const boxRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef(0);
  const draggingRef = useRef(false);
  const lastYRef = useRef(0);
  const autoPausedRef = useRef(false);

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

  // Animation loop: ease current progress toward target + autoplay
  useEffect(() => {
    if (items.length === 0) return;
    let raf = 0;
    let last = performance.now();
    const max = items.length - 1;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // autoplay (loops) when not interacting
      if (!draggingRef.current && !autoPausedRef.current) {
        const speed = 0.35 * (settings.animation_speed || 1); // items per second
        targetRef.current += dt * speed;
        if (targetRef.current > max) targetRef.current -= max + 1; // wrap
      }
      setProgress((prev) => {
        const t = targetRef.current;
        // ease toward target
        const next = prev + (t - prev) * Math.min(1, dt * 6);
        return Math.abs(next - t) < 0.0005 ? t : next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [items.length, settings.animation_speed]);

  // Interaction: wheel + drag inside the box, independent of page scroll
  useEffect(() => {
    const el = boxRef.current;
    if (!el || items.length === 0) return;
    const max = items.length - 1;
    const clamp = (v: number) => Math.max(0, Math.min(max, v));

    const pause = () => {
      autoPausedRef.current = true;
    };

    const onWheel = (e: WheelEvent) => {
      // Only intercept if the gesture is mostly vertical
      if (Math.abs(e.deltaY) < 2) return;
      e.preventDefault();
      pause();
      targetRef.current = clamp(targetRef.current + e.deltaY / 180);
    };

    const onPointerDown = (e: PointerEvent) => {
      draggingRef.current = true;
      lastYRef.current = e.clientY;
      pause();
      (e.target as Element).setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const dy = e.clientY - lastYRef.current;
      lastYRef.current = e.clientY;
      targetRef.current = clamp(targetRef.current - dy / 120);
    };
    const onPointerUp = () => {
      draggingRef.current = false;
      // snap to nearest
      targetRef.current = Math.round(targetRef.current);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, [items.length]);

  if (!settings.enabled || items.length === 0) return null;

  const ITEM_H = 140; // px per word row

  return (
    <section
      id="showcase"
      className="relative w-full py-16 md:py-24"
      style={{ background: settings.background || undefined }}
      aria-label="Services showcase"
    >
      <div className="relative w-full overflow-hidden">
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-[520px] w-[520px] rounded-full bg-accent/20 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-8 flex flex-col">
          {/* header */}
          <div className="pb-6 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-2xl md:text-4xl font-bold text-gradient">
              {settings.title}
            </h2>
          </div>

          {/* Rolling word list (interactive, independent of page scroll) */}
          <div
            ref={boxRef}
            className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden touch-none select-none cursor-grab active:cursor-grabbing"
          >
            {/* fade masks */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-background via-background/70 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background via-background/70 to-transparent z-10" />

            {/* arrow indicator */}
            <div className="pointer-events-none absolute left-4 md:left-16 top-1/2 -translate-y-1/2 z-20 text-white">
              <ArrowRight className="h-8 w-8 md:h-12 md:w-12 drop-shadow-[0_0_16px_hsl(var(--primary))]" />
            </div>

            <ul
              className="absolute left-0 right-0 top-1/2 will-change-transform pointer-events-none"
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