import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Post = { id: string; slug: string; title: string; excerpt: string | null; cover_url: string | null };

export default function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id,slug,title,excerpt,cover_url")
        .eq("published", true)
        .neq("slug", currentSlug)
        .order("sort_order")
        .limit(3);
      setPosts((data as Post[]) || []);
    })();
  }, [currentSlug]);

  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border/50 pt-10">
      <h2 className="font-display text-2xl font-bold mb-6">Related Posts</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {posts.map((p) => (
          <Link key={p.id} to={`/blog/${p.slug}`} className="group glass-strong rounded-2xl overflow-hidden glow-border block">
            {p.cover_url ? (
              <img src={p.cover_url} alt={p.title} loading="lazy" decoding="async" className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full aspect-video bg-gradient-to-br from-primary/30 via-accent/20 to-background" />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-gradient transition-colors">{p.title}</h3>
              {p.excerpt && <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{p.excerpt}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}