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
      if (!all) q = q.eq("featured", true).limit(8);
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

        <div className={`grid grid-cols-2 ${all ? "sm:grid-cols-2 lg:grid-cols-3" : "lg:grid-cols-4"} gap-3 md:gap-4`}>
          {(all ? projects : projects.slice(0, 8)).map((p, i) => {
            const img = p.image_url || FALLBACK[i % FALLBACK.length];
            return (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
                className="group relative rounded-2xl overflow-hidden glass-strong cursor-pointer"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={img}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={128}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full glass-strong flex items-center justify-center opacity-0 group-hover:opacity-100 transition group-hover:neon-glow">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold group-hover:text-gradient transition-colors line-clamp-1">{p.title}</h3>
                  <p className="text-muted-foreground text-xs line-clamp-2 mt-1">{p.description}</p>
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
