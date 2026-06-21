import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Workflow, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Step = {
  id: string;
  step_number: string;
  title: string;
  description: string;
  icon: string;
};

type TimelineItem = { day: string; label: string; icon: string };

type Settings = {
  section_title: string;
  section_subtitle: string;
  timeline_title: string;
  timeline_items: TimelineItem[];
  cta_text: string;
  cta_button_label: string;
  cta_button_link: string;
};

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as any)[name] ?? Icons.Sparkles;
  return <Cmp className={className} />;
}

export default function Process() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: s }, { data: cfg }] = await Promise.all([
        supabase
          .from("process_steps")
          .select("id,step_number,title,description,icon")
          .eq("active", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("process_settings")
          .select("*")
          .eq("active", true)
          .limit(1)
          .maybeSingle(),
      ]);
      setSteps((s ?? []) as Step[]);
      if (cfg) {
        setSettings({
          ...cfg,
          timeline_items: Array.isArray(cfg.timeline_items)
            ? (cfg.timeline_items as unknown as TimelineItem[])
            : [],
        } as Settings);
      }
    })();
  }, []);

  if (!settings || steps.length === 0) return null;

  return (
    <section id="process" className="relative py-20 md:py-28 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/30 text-xs font-medium text-primary mb-4">
            <Workflow className="h-3.5 w-3.5" />
            Process
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-3">
            <span className="text-gradient">{settings.section_title}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            {settings.section_subtitle}
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
          {steps.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative rounded-2xl glass border border-border/40 p-6 md:p-7 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_35px_-8px_hsl(var(--primary)/0.45)]"
            >
              <div className="absolute -top-3 -right-3 font-display font-black text-5xl md:text-6xl text-primary/10 group-hover:text-primary/20 transition-colors select-none">
                {s.step_number}
              </div>
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-5 shadow-glow-soft">
                  <Icon name={s.icon} className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-lg md:text-xl mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        {settings.timeline_items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-14 md:mt-16 max-w-5xl mx-auto rounded-2xl glass border border-border/40 p-6 md:p-8"
          >
            <h4 className="font-display font-bold text-sm uppercase tracking-[0.2em] text-primary mb-5 text-center">
              {settings.timeline_title}
            </h4>
            <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
              {settings.timeline_items.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-border/30"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <Icon name={t.icon} className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-primary">{t.day}</div>
                    <div className="text-sm text-foreground/85 truncate">{t.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 md:mt-14 text-center"
        >
          <p className="text-foreground/85 text-base md:text-lg max-w-2xl mx-auto mb-5">
            {settings.cta_text}
          </p>
          <a
            href={settings.cta_button_link}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-primary text-white font-semibold shadow-glow-soft hover:shadow-[0_0_40px_-5px_hsl(var(--primary)/0.7)] transition-all"
          >
            {settings.cta_button_label}
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}