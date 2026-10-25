import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SectionWatermark from "@/components/ui/SectionWatermark";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
};

const DEFAULT_FAQS: FAQ[] = [
  {
    id: "faq-1",
    question: "What is your typical project timeline and delivery turnaround?",
    answer: "Most custom web platforms and high-converting landing pages are delivered within 1 to 3 weeks. Full-scale SaaS architectures or complex multi-agent AI systems typically take 3 to 6 weeks, structured into transparent agile sprints with bi-weekly live staging demos.",
    sort_order: 1,
  },
  {
    id: "faq-2",
    question: "How do your digital marketing and paid ads generate measurable ROI?",
    answer: "I don't just 'boost posts'. I build end-to-end full-funnel acquisition systems with Meta Server-Side Conversions API (CAPI), Google Enhanced Conversions, dedicated high-converting landing pages, and automated retargeting funnels designed to maximize ROAS and minimize Customer Acquisition Cost (CAC).",
    sort_order: 2,
  },
  {
    id: "faq-3",
    question: "Can you automate our business workflows with custom AI agents?",
    answer: "Yes! I architect and deploy autonomous 24/7 AI agents using OpenAI, Claude, n8n, and Python that handle automated customer support, lead qualification, CRM synchronization, and automated invoice/order processing without human intervention.",
    sort_order: 3,
  },
  {
    id: "faq-4",
    question: "What technologies and modern stack do you specialize in?",
    answer: "My core engineering stack includes Next.js 14/15, React 19, TypeScript, Tailwind CSS, Supabase, PostgreSQL, and Python. For motion and micro-interactions, I use Framer Motion, and for hosting, I deploy on Vercel and Cloudflare for 99.99% uptime and sub-second edge speeds.",
    sort_order: 4,
  },
  {
    id: "faq-5",
    question: "Do you offer post-launch maintenance, hosting, and support?",
    answer: "Absolutely. Every project includes 30 days of complimentary post-launch bug fixes and performance monitoring. I also offer ongoing retainer packages covering security updates, continuous SEO optimization, and feature enhancements.",
    sort_order: 5,
  },
  {
    id: "faq-6",
    question: "How do we get started on a project together?",
    answer: "Simply click 'Hire Me' or tap the WhatsApp button to book a quick 15-minute discovery call. We'll discuss your business goals, scope of work, budget, and I'll deliver a tailored roadmap and quote within 24 hours.",
    sort_order: 6,
  },
];

export default function FAQ() {
  const [items, setItems] = useState<FAQ[]>(DEFAULT_FAQS);
  const [openId, setOpenId] = useState<string | null>("faq-1");

  useEffect(() => {
    supabase
      .from("faqs")
      .select("id,question,answer,sort_order")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        const rows = (data ?? []) as FAQ[];
        if (rows && rows.length > 0) {
          setItems(rows);
          setOpenId(rows[0].id);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="faq" className="relative py-10 sm:py-16 md:py-28 overflow-hidden content-auto isolate bg-[#0A0C11]">
      {/* Background glowing particles & Watermark */}
      <SectionWatermark text="QUESTIONS" glowColor="cyan" />

      {/* Subtle Ambient Radial Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[160px] opacity-20"
          style={{ background: "radial-gradient(circle, #0099FF 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full blur-[140px] opacity-15"
          style={{ background: "radial-gradient(circle, #38BDF8 0%, transparent 70%)" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-10 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full glass border border-primary/30 text-[10px] sm:text-xs font-medium text-primary mb-3 sm:mb-4">
            <HelpCircle className="h-3.5 w-3.5" />
            FAQ
          </div>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3">
            <span className="text-gradient">Frequently Asked Questions</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-xs sm:text-sm md:text-base">
            Answers to the most common questions about my services.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-2.5 sm:space-y-3 md:space-y-4">
          {items.map((it, i) => {
            const open = openId === it.id;
            return (
              <motion.div
                key={it.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`group relative rounded-xl sm:rounded-2xl glass border transition-all duration-300 ${
                  open
                    ? "border-primary/50 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.4)]"
                    : "border-border/40 hover:border-primary/30 hover:shadow-[0_0_25px_-8px_hsl(var(--primary)/0.35)]"
                }`}
              >
                <button
                  onClick={() => setOpenId(open ? null : it.id)}
                  className="w-full flex items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-5 md:p-6 text-left"
                  aria-expanded={open}
                >
                  <span className="font-display font-semibold text-sm sm:text-base md:text-lg">
                    {it.question}
                  </span>
                  <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex-shrink-0 h-7 w-7 sm:h-9 sm:w-9 rounded-full flex items-center justify-center transition-colors ${
                      open
                        ? "bg-gradient-primary text-white"
                        : "bg-white/5 text-foreground/70 group-hover:bg-primary/20 group-hover:text-primary"
                    }`}
                  >
                    <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
                      <div className="px-3.5 sm:px-5 md:px-6 pb-3.5 sm:pb-5 md:pb-6 text-muted-foreground text-xs sm:text-sm md:text-base leading-relaxed border-t border-border/30 pt-3 sm:pt-4">
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