import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Stat = {
  id: string;
  value: number;
  suffix: string;
  title: string;
  description: string | null;
  icon: string;
  sort_order: number;
};

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 2.5,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("stats")
        .select("id,value,suffix,title,description,icon,sort_order")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (data) setStats(data as Stat[]);
    })();
  }, []);

  if (!stats.length) return null;

  return (
    <section id="stats" className="relative py-24 overflow-hidden">
      {/* glowing particles */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-primary/20 blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-accent/20 blur-[120px] animate-pulse-glow" />
      </div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">
            Achievements
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">
            My <span className="text-gradient">Achievements</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Not just numbers — results define my work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {stats.map((s, i) => {
            const Icon =
              ((LucideIcons as unknown) as Record<string, React.ComponentType<{ className?: string }>>)[s.icon] ||
              Sparkles;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-primary opacity-20 blur-lg group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative glass-strong rounded-2xl p-4 md:p-5 flex items-center gap-3.5 md:gap-4 border border-primary/15 group-hover:border-primary/40 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.5)]">
                  {/* Premium diamond icon badge */}
                  <div className="shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-[0.85rem] bg-gradient-primary flex items-center justify-center rotate-45 neon-glow">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-white -rotate-45" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5 flex-wrap leading-tight">
                      <span className="font-display text-2xl md:text-3xl font-extrabold text-gradient tabular-nums drop-shadow-[0_0_12px_hsl(var(--primary)/0.4)]">
                        <Counter to={s.value} suffix={s.suffix} />
                      </span>
                      <span className="font-semibold text-sm md:text-[0.95rem] truncate">{s.title}</span>
                    </div>
                    {s.description && (
                      <p className="text-[0.7rem] md:text-xs text-muted-foreground truncate mt-0.5">
                        {s.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}