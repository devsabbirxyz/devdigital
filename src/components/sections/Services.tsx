import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Service = { id: string; icon: string; title: string; description: string };

function routeForTitle(title: string): string | null {
  const t = title.toLowerCase();
  if (t.includes("digital") || t.includes("marketing")) return "/digitalmarketingservice";
  if (t.includes("ai") || t.includes("automation")) return "/aiautomation";
  if (t.includes("web") || t.includes("dev")) return "/webdev";
  return null;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("services")
        .select("id, icon, title, description")
        .order("sort_order");
      setServices((data as Service[]) || []);
    })();
  }, []);

  return (
    <section id="services" className="relative py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">What I Do</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">
            Premium <span className="text-gradient">Solutions</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const Icon = (Icons as any)[s.icon] ?? Sparkles;
            const route = routeForTitle(s.title);
            const Wrapper: any = route ? Link : "div";
            const wrapperProps: any = route ? { to: route } : {};
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass-strong rounded-3xl p-8 glow-border group transition-all hover:shadow-neon"
              >
                <Wrapper {...wrapperProps} className="block h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform neon-glow">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    {route && (
                      <div className="w-9 h-9 rounded-full glass flex items-center justify-center group-hover:rotate-45 transition-transform">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.description}</p>
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
