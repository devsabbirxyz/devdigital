import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
};

export default function FAQ() {
  const [items, setItems] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("faqs")
      .select("id,question,answer,sort_order")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        const rows = (data ?? []) as FAQ[];
        setItems(rows);
        if (rows[0]) setOpenId(rows[0].id);
      });
  }, []);

  if (items.length === 0) return null;

  return (
    <section id="faq" className="relative py-20 md:py-28 overflow-hidden">
      {/* glowing particles */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-10 left-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-pulse" />
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
            <HelpCircle className="h-3.5 w-3.5" />
            FAQ
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-3">
            <span className="text-gradient">Frequently Asked Questions</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Answers to the most common questions about my services.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
          {items.map((it, i) => {
            const open = openId === it.id;
            return (
              <motion.div
                key={it.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`group relative rounded-2xl glass border transition-all duration-300 ${
                  open
                    ? "border-primary/50 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.4)]"
                    : "border-border/40 hover:border-primary/30 hover:shadow-[0_0_25px_-8px_hsl(var(--primary)/0.35)]"
                }`}
              >
                <button
                  onClick={() => setOpenId(open ? null : it.id)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
                  aria-expanded={open}
                >
                  <span className="font-display font-semibold text-base md:text-lg">
                    {it.question}
                  </span>
                  <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center transition-colors ${
                      open
                        ? "bg-gradient-primary text-white"
                        : "bg-white/5 text-foreground/70 group-hover:bg-primary/20 group-hover:text-primary"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-5 md:pb-6 text-muted-foreground text-sm md:text-base leading-relaxed border-t border-border/30 pt-4">
                        {it.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}