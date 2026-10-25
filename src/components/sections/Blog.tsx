import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Clock, Calendar, ArrowRight, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SectionWatermark from "@/components/ui/SectionWatermark";
import profileImg from "@/assets/profile.jpg";

export type BlogPostItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_url: string;
  category: "Paid Ads & CAPI" | "AI Automation" | "Web Development" | "Speed & CRO";
  read_time: string;
  date: string;
};

const DEFAULT_POSTS: BlogPostItem[] = [
  {
    id: "post-meta-ads",
    slug: "meta-ads-scaling-playbook",
    title: "The 2026 Meta Ads & CAPI Scaling Playbook: How to Slash CPA by 48%",
    excerpt: "How server-side Conversions API (CAPI), first-party data tracking, and dynamic creative testing consistently generate 4x+ ROAS.",
    cover_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    category: "Paid Ads & CAPI",
    read_time: "6 min read",
    date: "Oct 2026",
  },
  {
    id: "post-ai-agents",
    slug: "autonomous-ai-agents-for-business",
    title: "Building Autonomous AI Agents That Operate 24/7 & Scale Revenue",
    excerpt: "Replacing manual CRM entries, customer qualification, and booking pipelines with intelligent, automated agentic workflows.",
    cover_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    category: "AI Automation",
    read_time: "5 min read",
    date: "Oct 2026",
  },
  {
    id: "post-design-trends",
    slug: "design-trends-2026",
    title: "High-Converting Web Design Trends in 2026: Tactical Glassmorphism",
    excerpt: "Why modern interfaces with tactile feedback, sub-second latency, and spatial glass aesthetics drive 3x more conversions.",
    cover_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    category: "Web Development",
    read_time: "4 min read",
    date: "Oct 2026",
  },
  {
    id: "post-cro-speed",
    slug: "nextjs-cro-speed-guide",
    title: "Sub-Second Page Load: The Secret to High-Ticket CRO & 99+ Score",
    excerpt: "Why every 100ms delay costs 7% in sales, and how to achieve a 99+ Google Lighthouse score on production websites.",
    cover_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    category: "Speed & CRO",
    read_time: "5 min read",
    date: "Oct 2026",
  },
];

const CATEGORIES = ["All", "Paid Ads & CAPI", "AI Automation", "Web Development", "Speed & CRO"] as const;

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [remotePosts, setRemotePosts] = useState<BlogPostItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // 1. Check site_settings first for instant admin sync
        const { data: settingsData } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "blog_posts")
          .maybeSingle();

        if (settingsData?.value && Array.isArray(settingsData.value) && settingsData.value.length > 0) {
          const list = (settingsData.value as any[])
            .filter((p) => p.published !== false)
            .map((p, idx) => {
              const fallback = DEFAULT_POSTS.find((df) => df.slug === p.slug) || DEFAULT_POSTS[idx % DEFAULT_POSTS.length];
              return {
                id: p.id || `post-${idx}`,
                slug: p.slug,
                title: p.title || fallback.title,
                excerpt: p.excerpt || fallback.excerpt,
                cover_url: p.cover_url || fallback.cover_url,
                category: p.category || fallback.category,
                read_time: p.read_time || fallback.read_time,
                date: "Oct 2026",
              };
            });

          if (list.length > 0) {
            setRemotePosts(list);
            setLoaded(true);
            return;
          }
        }

        // 2. Check blog_posts table
        const { data, error } = await supabase
          .from("blog_posts")
          .select("id,slug,title,excerpt,cover_url,created_at,published")
          .eq("published", true)
          .order("sort_order")
          .limit(8);

        if (!error && Array.isArray(data) && data.length > 0) {
          const valid = data
            .filter((p: any) => !p.slug.includes("hy-bara") && !p.slug.includes("video-editing"))
            .map((p: any, idx: number) => {
              const fallback = DEFAULT_POSTS.find((df) => df.slug === p.slug) || DEFAULT_POSTS[idx % DEFAULT_POSTS.length];
              return {
                id: p.id,
                slug: p.slug,
                title: p.title || fallback.title,
                excerpt: p.excerpt || fallback.excerpt,
                cover_url: p.cover_url || fallback.cover_url,
                category: fallback.category,
                read_time: fallback.read_time,
                date: p.created_at ? new Date(p.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Oct 2026",
              };
            });

          if (valid.length > 0) {
            setRemotePosts(valid);
          }
        }
      } catch {
        // Fallback gracefully to curated DEFAULT_POSTS
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const allPosts = useMemo(() => {
    const list = remotePosts.length > 0 ? remotePosts : DEFAULT_POSTS;
    // Guarantee our 4 high-value posts are always accessible
    const merged = [...list];
    for (const def of DEFAULT_POSTS) {
      if (!merged.some((p) => p.slug === def.slug)) {
        merged.push(def);
      }
    }
    return merged;
  }, [remotePosts]);

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") return allPosts;
    return allPosts.filter((p) => p.category === activeCategory);
  }, [allPosts, activeCategory]);

  return (
    <section id="blog" className="relative py-14 sm:py-20 md:py-28 overflow-hidden bg-[#07090E]">
      {/* Background Watermark */}
      <SectionWatermark text="INSIGHTS" glowColor="cyan" />

      {/* Ambient Cosmic Lights */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[380px] rounded-full blur-[160px] opacity-20"
          style={{ background: "radial-gradient(circle, #0099FF 0%, #3B82F6 40%, transparent 75%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] rounded-full blur-[140px] opacity-15"
          style={{ background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)" }}
        />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider text-cyan-300 uppercase bg-cyan-950/60 border border-cyan-500/35 shadow-[0_0_20px_rgba(6,182,212,0.25)] mb-3"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>EXPERT PLAYBOOKS & STRATEGY</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display leading-tight"
          >
            Latest Insights from the{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Frontline
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="text-slate-400 mt-2.5 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-normal"
          >
            Actionable technical playbooks, conversion breakdowns, and AI frameworks to help your brand scale profitably.
          </motion.p>

          {/* Interactive Category Filter Pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-6 p-1.5 rounded-full bg-[#0D121F]/80 border border-white/10 backdrop-blur-xl max-w-fit mx-auto"
          >
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.45)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* 4-Card Grid with Glass Jewel Aesthetic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.id || post.slug}
                layout
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between border border-white/[0.12] hover:border-cyan-400/50 bg-[#0B0F19]/90 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(6,182,212,0.25)]"
              >
                {/* Outer Glow Halo on Hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-0.5 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-cyan-500/20 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"
                />

                <Link to={`/blog/${post.slug}`} className="flex flex-col h-full">
                  {/* Thumbnail Banner with Zoom Effect */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl sm:rounded-t-3xl bg-[#121828]">
                    <img
                      src={post.cover_url}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/30 to-transparent" />

                    {/* Category Pill Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wide bg-[#0B0F19]/90 border border-cyan-400/35 text-cyan-300 backdrop-blur-md shadow-sm">
                        {post.category}
                      </span>
                    </div>

                    {/* Floating Top Right Link Jewel Button */}
                    <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/[0.12] backdrop-blur-xl border border-white/25 flex items-center justify-center text-slate-200 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all duration-300 shadow-md">
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>

                    {/* Read Time Chip */}
                    <div className="absolute bottom-2.5 right-3 z-10 flex items-center gap-1 text-[10px] font-mono text-slate-300/90 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{post.read_time}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Date Indicator */}
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 mb-2">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{post.date}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-cyan-300 transition-colors">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Footer Author & Read Action */}
                    <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={profileImg}
                          alt="Sabbir"
                          className="w-6 h-6 rounded-full object-cover border border-cyan-400/40"
                        />
                        <span className="text-[11px] font-medium text-slate-300">Sabbir</span>
                      </div>

                      <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Read Article
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom Strategy Call Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-[#0E152A] to-purple-950/40 border border-cyan-500/30 backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-5 shadow-[0_15px_50px_rgba(0,0,0,0.7),0_0_35px_rgba(6,182,212,0.18)]"
        >
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 font-bold mb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>CUSTOM DIGITAL AUDIT</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Want a Tailored Growth Strategy for Your Business?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Book a free 30-minute 1:1 strategy discovery session with Sabbir to audit your ads, website speed, and AI workflows.
            </p>
          </div>

          <a
            href="https://wa.me/8801700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Book Free 1:1 Session</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}