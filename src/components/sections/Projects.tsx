import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";

const FALLBACK = [p1, p2, p3, p4];

type Project = { id: string; title: string; description: string; image_url: string | null };

export default function Projects({ all = false }: { all?: boolean }) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    (async () => {
      let q = supabase.from("projects").select("id,title,description,image_url,featured,sort_order").order("sort_order");
      if (!all) q = q.eq("featured", true).limit(4);
      const { data } = await q;
      setProjects((data as Project[]) || []);
    })();
  }, [all]);

  return (
    <section id="projects" className="relative py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">Portfolio</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">
              {all ? "All " : "Featured "}<span className="text-gradient">Projects</span>
            </h2>
          </div>
          {!all && (
            <Link
              to="/projects"
              className="glass-strong rounded-full px-5 py-2.5 text-sm font-semibold hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              View All <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {projects.map((p, i) => {
            const img = p.image_url || FALLBACK[i % FALLBACK.length];
            return (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
                className="group relative aspect-[4/3] rounded-3xl overflow-hidden glass-strong cursor-pointer"
              >
                <img
                  src={img}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90 group-hover:opacity-95 transition" />
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-gradient transition-colors">{p.title}</h3>
                  <p className="text-muted-foreground text-sm max-h-0 overflow-hidden opacity-0 group-hover:max-h-32 group-hover:opacity-100 transition-all duration-500">
                    {p.description}
                  </p>
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass-strong flex items-center justify-center opacity-0 group-hover:opacity-100 transition group-hover:neon-glow">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </motion.article>
            );
          })}
        </div>

        {projects.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No projects yet.</p>
        )}
      </div>
    </section>
  );
}
