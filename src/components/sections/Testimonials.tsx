import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Testimonial = {
  id: string;
  client_name: string;
  client_image: string | null;
  rating: number;
  feedback: string;
  show_desktop: boolean;
  show_mobile: boolean;
};

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < count ? "fill-primary text-primary" : "text-muted-foreground/40"}`}
        />
      ))}
    </div>
  );
}

function Avatar({ name, src }: { name: string; src: string | null }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        loading="lazy"
        className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/40"
      />
    );
  }
  return (
    <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-lg ring-2 ring-primary/40">
      {initial}
    </div>
  );
}

function FeedbackCard({
  t,
  active = false,
  className = "",
}: {
  t: Testimonial;
  active?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative glass-strong rounded-3xl p-6 md:p-8 backdrop-blur-2xl ${
        active ? "neon-glow ring-1 ring-primary/40" : ""
      } ${className}`}
      style={
        active
          ? {
              boxShadow:
                "0 0 60px hsl(271 91% 65% / 0.45), 0 0 120px hsl(271 91% 65% / 0.25)",
            }
          : undefined
      }
    >
      <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/30" />
      <div className="flex items-center gap-3 mb-4">
        <Avatar name={t.client_name} src={t.client_image} />
        <div>
          <p className="font-display font-semibold">{t.client_name}</p>
          <Stars count={Math.max(0, Math.min(5, t.rating))} />
        </div>
      </div>
      <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
        "{t.feedback}"
      </p>
    </div>
  );
}

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("id,client_name,client_image,rating,feedback,show_desktop,show_mobile,sort_order")
        .order("sort_order");
      setItems((data as Testimonial[]) || []);
    })();
  }, []);

  const desktop = items.filter((t) => t.show_desktop);
  const mobile = items.filter((t) => t.show_mobile);

  useEffect(() => {
    if (desktop.length < 2) return;
    const t = setInterval(() => setActive((i) => (i + 1) % desktop.length), 5000);
    return () => clearInterval(t);
  }, [desktop.length]);

  if (items.length === 0) return null;

  const prev2 = desktop.length ? (active - 2 + desktop.length) % desktop.length : 0;
  const prev = desktop.length ? (active - 1 + desktop.length) % desktop.length : 0;
  const next = desktop.length ? (active + 1) % desktop.length : 0;
  const next2 = desktop.length ? (active + 2) % desktop.length : 0;

  return (
    <section id="testimonials" className="relative py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">
            Client <span className="text-gradient">Feedback</span>
          </h2>
        </motion.div>

        {/* Desktop: depth carousel — slides right→left */}
        {desktop.length > 0 && (
          <div className="hidden md:block relative h-[400px] [perspective:1600px]">
            {/* Far back-left */}
            {desktop.length > 4 && (
              <motion.div
                key={`p2-${desktop[prev2].id}`}
                animate={{ opacity: 0.25, x: -520, scale: 0.65, filter: "blur(6px)", rotateY: 30 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] z-0"
              >
                <FeedbackCard t={desktop[prev2]} />
              </motion.div>
            )}
            {/* Back-left */}
            {desktop.length > 2 && (
              <motion.div
                key={`p-${desktop[prev].id}`}
                animate={{ opacity: 0.5, x: -300, scale: 0.82, filter: "blur(3px)", rotateY: 22 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] z-10"
              >
                <FeedbackCard t={desktop[prev]} />
              </motion.div>
            )}
            {/* Active center — slides in from right */}
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={`a-${desktop[active].id}`}
                initial={{ opacity: 0, x: 320, scale: 0.85 }}
                animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)", rotateY: 0 }}
                exit={{ opacity: 0, x: -320, scale: 0.85 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] z-30"
              >
                <FeedbackCard t={desktop[active]} active />
              </motion.div>
            </AnimatePresence>
            {/* Back-right */}
            {desktop.length > 1 && (
              <motion.div
                key={`n-${desktop[next].id}`}
                animate={{ opacity: 0.5, x: 300, scale: 0.82, filter: "blur(3px)", rotateY: -22 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] z-10"
              >
                <FeedbackCard t={desktop[next]} />
              </motion.div>
            )}
            {/* Far back-right */}
            {desktop.length > 3 && (
              <motion.div
                key={`n2-${desktop[next2].id}`}
                animate={{ opacity: 0.25, x: 520, scale: 0.65, filter: "blur(6px)", rotateY: -30 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] z-0"
              >
                <FeedbackCard t={desktop[next2]} />
              </motion.div>
            )}

            {/* Dots */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-40">
              {desktop.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-8 bg-gradient-primary" : "w-2 bg-foreground/20"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mobile: horizontal snap scroll */}
        {mobile.length > 0 && (
          <div className="md:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            <div className="flex gap-4 pb-4">
              {mobile.map((t) => (
                <div
                  key={t.id}
                  className="snap-center shrink-0 w-[82%] first:ml-2 last:mr-2"
                >
                  <FeedbackCard t={t} active />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
