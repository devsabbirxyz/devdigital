import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Post = { id: string; slug: string; title: string; excerpt: string | null; cover_url: string | null };

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id,slug,title,excerpt,cover_url,sort_order,published")
        .eq("published", true)
        .order("sort_order")
        .limit(8);
      if (error) {
        setLoaded(true);
        return;
      }
      setPosts((data as any) || []);
      setLoaded(true);
    })();
  }, []);

  if (loaded && posts.length === 0) return null;

  return (
    <section id="blog" className="relative py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">Insights</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">
            From the <span className="text-gradient">Blog</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {posts.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative rounded-2xl overflow-hidden glass-strong glow-border"
            >
              <Link to={`/blog/${p.slug}`} className="block">
                <div className="relative h-32 md:h-36 overflow-hidden">
                  {p.cover_url ? (
                    <img src={p.cover_url} alt={p.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 via-accent/20 to-background" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
                  <div className="absolute inset-0 p-3 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-xs text-foreground/90 line-clamp-3">{p.excerpt}</p>
                  </div>
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full glass-strong flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:neon-glow transition">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-gradient transition-colors">{p.title}</h3>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}