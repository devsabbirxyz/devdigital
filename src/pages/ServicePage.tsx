import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsAppButton from "@/components/site/WhatsAppButton";

type Page = { slug: string; title: string; description: string; image_url: string | null; floating_icons: string[] };
type CardT = { id: string; title: string; description: string; image_url: string | null; price: string | null };

export default function ServicePage({ forcedSlug }: { forcedSlug?: string } = {}) {
  const params = useParams();
  const slug = forcedSlug ?? params.slug;
  const navigate = useNavigate();
  const [page, setPage] = useState<Page | null>(null);
  const [cards, setCards] = useState<CardT[]>([]);

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase.from("service_pages").select("*").eq("slug", slug!).maybeSingle();
      setPage(p as any);
      if (p) document.title = `${(p as any).title} — Portfolio`;
      const { data: c } = await supabase.from("service_page_cards").select("*").eq("page_slug", slug!).order("sort_order");
      setCards((c as any) || []);
    })();
  }, [slug]);

  const goBook = () => {
    navigate("/#contact");
    setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  if (!page) return <main className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</main>;

  const icons = page.floating_icons || [];

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-grid">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="container relative z-10 grid md:grid-cols-2 gap-12 items-center">
          {/* Image with orbit icons */}
          <div className="relative flex justify-center">
            <div className="relative w-72 h-72 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-primary/40 blur-[80px] rounded-full animate-pulse-glow" />
              <div className="relative w-full h-full rounded-full overflow-hidden glass-strong p-2 animate-float">
                {page.image_url ? (
                  <img src={page.image_url} alt={page.title} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-primary flex items-center justify-center">
                    <Sparkles className="h-20 w-20 text-white" />
                  </div>
                )}
              </div>
              {/* Orbiting icons */}
              {icons.map((name, i) => {
                const Icon = (Icons as any)[name] ?? Sparkles;
                const angle = (360 / Math.max(icons.length, 1)) * i;
                return (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ transform: `translate(-50%,-50%) rotate(${angle}deg)` }}
                  >
                    <div
                      className="animate-orbit"
                      style={{ ["--r" as any]: "180px", ["--speed" as any]: `${14 + i * 2}s` }}
                    >
                      <div className="w-12 h-12 rounded-2xl glass-strong flex items-center justify-center neon-glow">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">Services</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-6">
              <span className="text-gradient">{page.title}</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">{page.description}</p>
            <button onClick={goBook} className="bg-gradient-primary text-white font-semibold px-7 py-3 rounded-full neon-glow hover:scale-105 transition-transform inline-flex items-center gap-2">
              Book Now <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Cards */}
      <section className="relative py-20">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">My Services</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">
              What I <span className="text-gradient">Offer</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="glass-strong rounded-3xl overflow-hidden glow-border hover:-translate-y-1 transition-all flex flex-col"
              >
                {c.image_url ? (
                  <img src={c.image_url} alt={c.title} className="w-full aspect-video object-cover" />
                ) : (
                  <div className="w-full aspect-video bg-gradient-to-br from-primary/30 via-accent/20 to-background" />
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 flex-1">{c.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    {c.price && <span className="text-2xl font-display font-bold text-gradient">{c.price}</span>}
                    <button onClick={goBook} className="bg-gradient-primary text-white text-sm font-semibold px-4 py-2 rounded-full neon-glow hover:scale-105 transition-transform inline-flex items-center gap-1">
                      Book Now <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to home</Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}