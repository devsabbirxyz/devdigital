import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ContactPopup from "@/components/site/ContactPopup";

type Plan = { id: string; name: string; price: string; features: string[]; highlighted: boolean };

export default function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [openPlan, setOpenPlan] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("pricing_plans")
        .select("id,name,price,features,highlighted,sort_order")
        .order("sort_order");
      setPlans(((data as any[]) || []).map((p) => ({ ...p, features: Array.isArray(p.features) ? p.features : [] })));
    })();
  }, []);

  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      {/* Faded watermark - desktop only */}
      <div className="hidden md:block absolute inset-x-0 top-1/2 -translate-y-1/2 text-center pointer-events-none select-none">
        <span className="font-display font-black text-[200px] leading-none text-white/[0.025] tracking-tighter">
          Pricing
        </span>
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">Investment</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 md:hidden">
            <span className="text-gradient">Pricing</span> Plans
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mt-4">
            Flexible plans tailored to fit your goals — from quick launches to enterprise-grade builds.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 transition-all hover:-translate-y-2 ${
                plan.highlighted
                  ? "md:scale-110 md:-mt-4 ring-2 ring-primary/70 shadow-neon bg-gradient-to-br from-primary/30 via-accent/15 to-background/40 backdrop-blur-2xl border border-primary/40"
                  : "glass-strong glow-border"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-white text-xs font-bold px-4 py-1 rounded-full neon-glow">
                  MOST POPULAR
                </div>
              )}
              <p className="text-sm text-muted-foreground mb-2">{plan.name} Plan</p>
              <h3 className="text-5xl font-display font-bold mb-6">
                {plan.price === "Custom" ? (
                  <span className="text-gradient">Custom</span>
                ) : (
                  plan.price
                )}
              </h3>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary" />
                    </span>
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setOpenPlan(plan.name)}
                className={`w-full py-3 rounded-full font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-gradient-primary text-white neon-glow hover:scale-105 shadow-[0_0_30px_hsl(var(--primary)/0.6)]"
                    : "glass border border-primary/30 text-foreground hover:bg-primary/10 hover:scale-105"
                }`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <ContactPopup
        open={!!openPlan}
        onOpenChange={(o) => !o && setOpenPlan(null)}
        plan={openPlan ?? undefined}
      />
    </section>
  );
}
