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
            আমার <span className="text-gradient">অর্জন</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            সংখ্যা নয়, ফলাফলই আমার কাজের পরিচয়।
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
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
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-primary opacity-30 blur-lg group-hover:opacity-70 transition-opacity duration-500" />
                <div className="relative glass-strong rounded-2xl p-5 md:p-7 text-center border border-primary/20 group-hover:border-primary/50 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.6)]">
                  <div className="mx-auto mb-4 w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-primary flex items-center justify-center neon-glow">
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <div className="font-display text-3xl md:text-5xl font-extrabold text-gradient drop-shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-2 font-semibold text-sm md:text-base">{s.title}</div>
                  {s.description && (
                    <div className="mt-1 text-xs md:text-sm text-muted-foreground">
                      {s.description}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}