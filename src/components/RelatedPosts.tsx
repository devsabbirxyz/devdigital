import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Post = { id: string; slug: string; title: string; excerpt: string | null; cover_url: string | null };

const FALLBACKS: Post[] = [
  {
    id: "def-1",
    slug: "meta-ads-scaling-playbook",
    title: "The 2026 Meta Ads & CAPI Scaling Playbook: How to Slash CPA by 48%",
    excerpt: "How server-side Conversions API (CAPI) and creative testing generate 4x+ ROAS.",
    cover_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "def-2",
    slug: "autonomous-ai-agents-for-business",
    title: "Building Autonomous AI Agents That Operate 24/7 & Scale Revenue",
    excerpt: "Replacing manual CRM entries, customer qualification, and booking pipelines with AI.",
    cover_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "def-3",
    slug: "design-trends-2026",
    title: "High-Converting Web Design Trends in 2026: Tactical Glassmorphism",
    excerpt: "Why modern interfaces with tactile feedback drive 3x more conversions.",
    cover_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "def-4",
    slug: "nextjs-cro-speed-guide",
    title: "Sub-Second Page Load: The Secret to High-Ticket CRO & 99+ Score",
    excerpt: "Why every 100ms delay costs 7% in sales, and how to achieve a 99+ Lighthouse score.",
    cover_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("blog_posts")
          .select("id,slug,title,excerpt,cover_url")
          .eq("published", true)
          .neq("slug", currentSlug)
          .order("sort_order")
          .limit(3);

        const valid = (data as Post[])?.filter((p) => !p.slug.includes("hy-bara") && !p.slug.includes("video-editing")) || [];
        if (valid.length > 0) {
          setPosts(valid);
        } else {
          setPosts(FALLBACKS.filter((p) => p.slug !== currentSlug).slice(0, 3));
        }
      } catch {
        setPosts(FALLBACKS.filter((p) => p.slug !== currentSlug).slice(0, 3));
      }
    })();
  }, [currentSlug]);

  const displayList = posts.length > 0 ? posts : FALLBACKS.filter((p) => p.slug !== currentSlug).slice(0, 3);

  return (
    <section className="mt-16 border-t border-white/10 pt-10">
      <h2 className="font-display text-xl sm:text-2xl font-bold mb-6 text-white">Related Insights</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {displayList.map((p) => (
          <Link
            key={p.id}
            to={`/blog/${p.slug}`}
            className="group rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-400/50 bg-[#0B0F19]/90 backdrop-blur-xl transition-all duration-300 block hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(6,182,212,0.2)]"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-[#121828]">
              {p.cover_url ? (
                <img
                  src={p.cover_url}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyan-900/40 via-blue-900/20 to-background" />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm line-clamp-2 text-white group-hover:text-cyan-300 transition-colors">
                {p.title}
              </h3>
              {p.excerpt && <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">{p.excerpt}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}