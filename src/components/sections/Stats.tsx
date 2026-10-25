import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { getDynamicIcon } from "@/lib/dynamicIcons";
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

const DEFAULT_STATS: Stat[] = [
  { id: "1", value: 120, suffix: "+", title: "Global Projects Delivered", description: "Across 4 continents & 15+ niches", icon: "Briefcase", sort_order: 1 },
  { id: "2", value: 4, suffix: ".8x", title: "Average Client ROAS", description: "Meta CAPI & Google Search funnels", icon: "TrendingUp", sort_order: 2 },
  { id: "3", value: 99, suffix: "/100", title: "Lighthouse Web Performance", description: "Sub-second Next.js edge architecture", icon: "Zap", sort_order: 3 },
  { id: "4", value: 85, suffix: "%", title: "Manual Ops Reduced", description: "24/7 AI agents & n8n webhook sync", icon: "Bot", sort_order: 4 },
];

export default function Stats() {
  const [stats, setStats] = useState<Stat[]>(DEFAULT_STATS);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("stats")
        .select("id,value,suffix,title,description,icon,sort_order")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      if (data && data.length > 0) setStats(data as Stat[]);
    })();
  }, []);

  return (
    <section id="stats" className="relative py-10 sm:py-16 md:py-24 overflow-hidden content-auto bg-[#0A0C11]">
      {/* glowing particles - optimized radial gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full blur-[160px] opacity-20"
          style={{
            background: "radial-gradient(circle, #0099FF 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[450px] h-[350px] rounded-full blur-[140px] opacity-15"
          style={{
            background: "radial-gradient(circle, #38BDF8 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-10 md:mb-14"
        >
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-primary uppercase">
            Achievements
          </span>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold mt-2 sm:mt-3">
            My <span className="text-gradient">Achievements</span>
          </h2>
          <p className="text-muted-foreground mt-1.5 sm:mt-3 text-xs sm:text-base md:text-lg">
            Not just numbers — results define my work.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
          {stats.map((s, i) => {
            const Icon = getDynamicIcon(s.icon);
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative cursor-pointer"
              >
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-primary opacity-20 blur-lg group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative h-full glass-strong rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 border border-primary/20 group-hover:border-primary/50 transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.5)] active:border-primary/60">
                  {/* Premium diamond icon badge */}
                  <div className="shrink-0 w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-[0.65rem] sm:rounded-[0.85rem] bg-gradient-primary flex items-center justify-center rotate-45 neon-glow">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white -rotate-45" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-gradient tabular-nums leading-none drop-shadow-[0_0_12px_hsl(var(--primary)/0.4)]">
                      <Counter to={s.value} suffix={s.suffix} />
                    </div>
                    <div className="font-semibold text-xs sm:text-sm md:text-[0.95rem] mt-1.5 sm:mt-1 truncate">{s.title}</div>
                    {s.description && (
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate mt-0.5">
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