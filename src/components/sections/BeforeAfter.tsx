import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GitCompare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Result = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  before_image: string;
  after_image: string;
};

function Compare({ before, after, alt }: { before: string; after: string; alt: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, x)));
  };

  return (
    <div
      ref={ref}
      className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl select-none touch-none cursor-ew-resize"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      {/* After (base) */}
      <img
        src={after}
        alt={`${alt} — after`}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={before}
          alt={`${alt} — before`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/60 text-white backdrop-blur">
        Before
      </span>
      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gradient-primary text-white shadow-glow-soft">
        After
      </span>

      {/* Divider + handle */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white/90 pointer-events-none"
        style={{ left: `${pos}%`, boxShadow: "0 0 20px hsl(271 91% 65% / 0.9)" }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-0 h-10 w-10 rounded-full bg-gradient-primary border-2 border-white/90 flex items-center justify-center shadow-glow-soft pointer-events-none">
          <GitCompare className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfter() {
  const [items, setItems] = useState<Result[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("before_after_results")
        .select("id,title,description,category,before_image,after_image,sort_order,active")
        .eq("active", true)
        .order("sort_order");
      setItems((data as Result[]) || []);
    })();
  }, []);

  if (items.length === 0) return null;

  const categories = Array.from(new Set(items.map((i) => i.category || "general")));
  const filtered = filter === "all" ? items : items.filter((i) => (i.category || "general") === filter);

  return (
    <section id="results" className="relative py-24 overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-[420px] h-[420px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-accent/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">Results</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">
            Before <span className="text-gradient">&amp;</span> After
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Real transformations. Drag the divider to compare.
          </p>
        </motion.div>

        {categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {["all", ...categories].map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                  filter === c
                    ? "bg-gradient-primary text-white shadow-glow-soft"
                    : "glass text-foreground/70 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {filtered.map((r, i) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
              className="glass-strong rounded-3xl p-4 md:p-5 backdrop-blur-2xl ring-1 ring-primary/20 hover:ring-primary/40 transition"
              style={{ boxShadow: "0 0 40px hsl(271 91% 65% / 0.15)" }}
            >
              <Compare before={r.before_image} after={r.after_image} alt={r.title} />
              <div className="px-2 pt-4">
                <h3 className="font-display font-bold text-lg">{r.title}</h3>
                {r.description && (
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{r.description}</p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}