import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/sections/Footer";
import Seo from "@/components/Seo";
import BlogComments from "@/components/BlogComments";
import RelatedPosts from "@/components/RelatedPosts";
import profileImg from "@/assets/profile.jpg";

type Post = {
  id: string;
  title: string;
  content: string;
  cover_url: string | null;
  excerpt: string | null;
  created_at: string;
  category?: string;
  read_time?: string;
};

const FALLBACK_ARTICLES: Record<string, Post> = {
  "design-trends-2026": {
    id: "def-post-1",
    title: "High-Converting Web Design Trends in 2026: Tactical Glassmorphism & Spatial Depth",
    cover_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Why modern interfaces with tactile feedback, sub-second latency, and glass aesthetics drive 3x more conversions.",
    created_at: new Date().toISOString(),
    category: "Web Development",
    read_time: "4 min read",
    content: `Web design in 2026 has evolved beyond static cards and flat colors. Today’s top brands win through emotional connection, tactical depth, and ultra-smooth tactile feedback.

1. Tactical Glassmorphism & Multi-Layer Depth
Users immediately perceive depth. Combining layered glass backdrops with soft radial glows establishes visual hierarchy that guides the user's eye directly to high-converting CTAs.

2. Micro-Interactions & Magnetic Hover Feedback
When buttons dynamically gravitate toward user cursors and reveal subtle light sweeps, perceived performance increases and friction disappears.

3. Performance First (Sub-Second Latency)
A flashy website is useless if it takes more than 1 second to load. Modern architectures prioritize critical path rendering, code-split below-the-fold sections, and zero layout shift.`,
  },
  "meta-ads-scaling-playbook": {
    id: "def-post-2",
    title: "The 2026 Meta Ads & CAPI Scaling Playbook: How to Slash CPA by 48%",
    cover_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    excerpt: "How server-side Conversions API (CAPI) and high-converting creative testing slashed cost per acquisition by 48%.",
    created_at: new Date().toISOString(),
    category: "Paid Ads & CAPI",
    read_time: "6 min read",
    content: `Scaling paid advertising in 2026 requires more than boosting posts or relying on browser cookies. With iOS privacy restrictions and ad-blockers, tracking data loss is the #1 silent profit killer.

1. Server-Side Conversions API (CAPI)
By routing conversion events directly through server-side endpoints with hashed user parameters (email, phone, IP), event match quality jumps from 60% to 95%+, allowing Meta's AI algorithms to accurately locate buyers.

2. Creative Testing Sprints
Test 3 angles weekly: Pain-point hooks, direct customer transformation proof, and founders' authentic perspective. Winning creatives get scaled horizontally across broader audiences.

3. Landing Page CRO Alignment
Ensure message match between the ad hook and the hero headline. If the ad promises "Scale 10x ROI", the hero section must reiterate that exact promise within 3 seconds.`,
  },
  "autonomous-ai-agents-for-business": {
    id: "def-post-3",
    title: "Building Autonomous AI Agents That Operate 24/7 & Scale Revenue",
    cover_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Replacing manual CRM entries, customer qualification, and booking pipelines with intelligent automated agents.",
    created_at: new Date().toISOString(),
    category: "AI Automation",
    read_time: "5 min read",
    content: `In 2026, AI is no longer just a chatbot widget that answers generic questions. Modern businesses deploy autonomous agentic workflows that perform multi-step actions.

1. 24/7 Lead Qualification & WhatsApp Routing
When a prospect fills out a form, an agent analyzes their budget and timeline, checks calendar availability, and sends an automated WhatsApp message within 30 seconds.

2. CRM & Database Synchronization
Zero manual data entry. Every contact submission, client touchpoint, and project phase change is automatically recorded in Supabase and alerted to private company channels.

3. Custom Tool Calling & Autonomous APIs
Agents can query inventory, calculate live custom estimates, verify client eligibility, and schedule Zoom calls without requiring human intervention.`,
  },
  "nextjs-cro-speed-guide": {
    id: "def-post-4",
    title: "Sub-Second Page Load: The Secret to High-Ticket CRO & 99+ Score",
    cover_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Why every 100ms delay costs 7% in sales, and how to achieve a 99+ Google Lighthouse score on production.",
    created_at: new Date().toISOString(),
    category: "Speed & CRO",
    read_time: "5 min read",
    content: `Conversion Rate Optimization (CRO) starts with speed. Studies show that 53% of mobile visits are abandoned if pages take longer than 3 seconds to load.

1. Code-Splitting Below-the-Fold Content
Only load the Navbar, Hero, and critical CSS on initial paint. Heavy modules like charts, calculators, and complex testimonial grids should be lazily loaded after the hero renders.

2. Modern Image Optimization
Serve WebP and AVIF formats with responsive srcset, precise aspect ratios, and asynchronous decoding.

3. High-Converting Visual Polish
Fast load speeds combined with premium typography, curated dark palettes, and clear benefit-driven headlines convert cold visitors into eager clients.`,
  },
};

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 1. Check site_settings first for instant admin updates
        const { data: settingsData } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "blog_posts")
          .maybeSingle();

        if (settingsData?.value && Array.isArray(settingsData.value)) {
          const matched = (settingsData.value as any[]).find((p) => p.slug === slug);
          if (matched && matched.content) {
            const fallback = slug && FALLBACK_ARTICLES[slug] ? FALLBACK_ARTICLES[slug] : null;
            setPost({
              id: matched.id || `post-${slug}`,
              title: matched.title || fallback?.title || "",
              content: matched.content,
              cover_url: matched.cover_url || fallback?.cover_url || null,
              excerpt: matched.excerpt || fallback?.excerpt || null,
              created_at: new Date().toISOString(),
              category: matched.category || fallback?.category || "Tech & Growth",
              read_time: matched.read_time || fallback?.read_time || "5 min read",
            });
            document.title = `${matched.title} — Blog`;
            setLoading(false);
            return;
          }
        }

        // 2. Check blog_posts table
        const { data } = await supabase
          .from("blog_posts")
          .select("id,title,content,cover_url,excerpt,created_at")
          .eq("slug", slug!)
          .eq("published", true)
          .maybeSingle();

        if (data && (data as any).title && (data as any).content && (data as any).content.length > 30) {
          const fallback = slug && FALLBACK_ARTICLES[slug] ? FALLBACK_ARTICLES[slug] : null;
          setPost({
            ...(data as any),
            cover_url: (data as any).cover_url || fallback?.cover_url || null,
            category: fallback?.category || "Tech & Growth",
            read_time: fallback?.read_time || "5 min read",
          });
          document.title = `${(data as any).title} — Blog`;
        } else if (slug && FALLBACK_ARTICLES[slug]) {
          setPost(FALLBACK_ARTICLES[slug]);
          document.title = `${FALLBACK_ARTICLES[slug].title} — Blog`;
        }
      } catch {
        if (slug && FALLBACK_ARTICLES[slug]) {
          setPost(FALLBACK_ARTICLES[slug]);
          document.title = `${FALLBACK_ARTICLES[slug].title} — Blog`;
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  return (
    <main className="min-h-screen bg-[#07090E] text-slate-100">
      {post && slug && (
        <Seo
          path={`/blog/${slug}`}
          defaultTitle={`${post.title} — Blog`}
          defaultDescription={post.excerpt ?? undefined}
          defaultImage={post.cover_url ?? undefined}
          type="article"
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt ?? undefined,
            image: post.cover_url ?? undefined,
            datePublished: post.created_at,
          }}
        />
      )}
      <Navbar />

      <article className="container max-w-4xl pt-28 sm:pt-36 pb-20 px-4 sm:px-6">
        <Link
          to="/#blog"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to all insights</span>
        </Link>

        {loading ? (
          <div className="py-20 text-center text-slate-400 font-mono text-sm">
            Loading article...
          </div>
        ) : !post ? (
          <div className="py-20 text-center text-slate-400">
            <h2 className="text-xl font-bold text-white mb-2">Article Not Found</h2>
            <p className="text-sm">The article you are looking for may have been moved or updated.</p>
          </div>
        ) : (
          <>
            {/* Header Metadata */}
            <div className="mb-6">
              {post.category && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  {post.category}
                </span>
              )}

              <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.18] mt-2 mb-4">
                {post.title}
              </h1>

              {/* Author and Read Time Bar */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 border-b border-white/10 pb-5 pt-1">
                <div className="flex items-center gap-2.5">
                  <img
                    src={profileImg}
                    alt="Sabbir"
                    className="w-8 h-8 rounded-full object-cover border border-cyan-400/40"
                  />
                  <div>
                    <span className="font-semibold text-white block leading-tight">Sabbir</span>
                    <span className="text-[11px] text-slate-400">Founder & Tech Lead</span>
                  </div>
                </div>

                <span className="text-white/20">•</span>

                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>

                <span className="text-white/20">•</span>

                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{post.read_time || "5 min read"}</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.cover_url && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 mb-8 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
                <img
                  src={post.cover_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Excerpt Highlight */}
            {post.excerpt && (
              <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/25 text-sm sm:text-base text-cyan-100/90 leading-relaxed font-medium mb-8">
                {post.excerpt}
              </div>
            )}

            {/* Content Body */}
            <div className="prose prose-invert prose-cyan max-w-none text-slate-300 leading-relaxed text-sm sm:text-base space-y-4">
              <div className="whitespace-pre-wrap leading-relaxed">
                {post.content}
              </div>
            </div>

            {/* High-Converting CTA Banner */}
            <div className="mt-12 sm:mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-[#0E152A] to-purple-950/60 border border-cyan-400/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(6,182,212,0.25)] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-300 font-bold mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% FREE STRATEGY DISCOVERY</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Ready to Implement These Growth Strategies?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg leading-relaxed">
                  Book a direct 30-minute strategy call with Sabbir. We will audit your current setup and deliver a tailored execution roadmap.
                </p>
              </div>

              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Book Free Call</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <RelatedPosts currentSlug={slug!} />
            <BlogComments postId={post.id} />
          </>
        )}
      </article>

      <Footer />
    </main>
  );
}