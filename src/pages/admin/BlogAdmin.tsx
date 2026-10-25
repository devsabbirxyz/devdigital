import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Sparkles, RotateCcw, Clock, Eye, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { PageHeader, Card, Field, inputCls, PrimaryBtn, GhostBtn, uploadToBucket } from "./_ui";

export type AdminBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  category: string;
  read_time: string;
  published: boolean;
  sort_order: number;
};

const DEFAULT_ADMIN_POSTS: AdminBlogPost[] = [
  {
    id: "post-meta-ads",
    slug: "meta-ads-scaling-playbook",
    title: "The 2026 Meta Ads & CAPI Scaling Playbook: How to Slash CPA by 48%",
    excerpt: "How server-side Conversions API (CAPI), first-party data tracking, and dynamic creative testing consistently generate 4x+ ROAS.",
    cover_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    category: "Paid Ads & CAPI",
    read_time: "6 min read",
    published: true,
    sort_order: 1,
    content: `# The 2026 Meta Ads & CAPI Scaling Playbook

Scaling paid advertising in 2026 requires fundamentally different architecture than boosting posts or relying on browser cookies. With iOS privacy restrictions, browser cookie deprecation, and ad-blockers, tracking data loss is the #1 silent profit killer for modern brands.

---

### 1. The Death of Browser Pixels: Enter Server-Side CAPI
Standard browser pixels now lose up to 30–45% of customer purchase events due to client-side ad-blockers and privacy shields. 

By routing purchase, add-to-cart, and lead events directly through server-side endpoints with hashed user parameters (email, phone, IP, and click IDs), your Event Match Quality (EMQ) jumps from 60% to 95%+. This gives Meta's AI algorithms the clean signal needed to locate genuine high-value buyers instead of tire-kickers.

---

### 2. The 3-Tier Creative Testing Engine
Never scale ads until creative testing proves market resonance. We use a weekly 3-tier sprint:
- **Pain-Point Hooks:** Directly calling out the bottleneck the customer experiences right now.
- **Before-and-After Transformations:** Concrete proof demonstrating the outcome of working with your solution.
- **Founder's Authentic Perspective:** Behind-the-scenes engineering and genuine founder authority.

Winners from testing are horizontally scaled across broad advantage+ audiences without creative fatigue.

---

### 3. Funnel Alignment & CRO
If your ad hook promises "Double Your Sales in 90 Days," your landing page hero section must reiterate that exact promise within 3 seconds. Any cognitive disconnect will spike bounce rates above 70%.

By pairing server-side CAPI with frictionless, sub-second landing pages, our clients maintain a consistent 3.8x to 5.2x return on ad spend (ROAS).`,
  },
  {
    id: "post-ai-agents",
    slug: "autonomous-ai-agents-for-business",
    title: "Building Autonomous AI Agents That Operate 24/7 & Scale Revenue",
    excerpt: "Replacing manual CRM entries, customer qualification, and booking pipelines with intelligent, autonomous AI workflows.",
    cover_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    category: "AI Automation",
    read_time: "5 min read",
    published: true,
    sort_order: 2,
    content: `# Building Autonomous AI Agents That Operate 24/7

In 2026, AI is no longer a gimmick chatbot widget that recites generic canned answers. Modern forward-thinking businesses deploy autonomous agentic workflows that perform multi-step actions across systems without human intervention.

---

### 1. Instant 24/7 Lead Qualification & WhatsApp Routing
When a prospect visits your website at 2:00 AM and submits a consultation request, waiting 8 hours until morning cuts conversion rates by 80%.

An autonomous agent triggers within 15 seconds:
1. Analyzes the submission, budget, and business niche.
2. Checks Google Calendar availability in real-time.
3. Sends a personalized WhatsApp and email invitation with a direct booking link.
4. Notifies your team via Slack/Telegram with an AI-generated briefing sheet.

---

### 2. Automated CRM & Database Synchronization
Zero manual copy-pasting. Every client touchpoint, inquiry, meeting notes summary, and project milestone is automatically captured in Supabase and your CRM. Staff hours are reclaimed for strategic client advisory rather than clerical data entry.

---

### 3. Custom API & Tool Calling
Using modern LLM tool calling (function calling), autonomous bots can query inventory databases, calculate live custom pricing, generate personalized PDF proposal decks, and issue invoices automatically.`,
  },
  {
    id: "post-design-trends",
    slug: "design-trends-2026",
    title: "High-Converting Web Design Trends in 2026: Tactical Glassmorphism & Spatial Depth",
    excerpt: "Why modern interfaces with tactile feedback, sub-second latency, and glass aesthetics drive 3x more conversions.",
    cover_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    category: "Web Development",
    read_time: "4 min read",
    published: true,
    sort_order: 3,
    content: `# High-Converting Web Design Trends in 2026

Web design in 2026 has evolved past flat generic templates. Today's top digital brands command high-ticket client trust through tactile depth, emotional connection, and ultra-smooth micro-interactions.

---

### 1. Tactical Glassmorphism & Multi-Layer Depth
Users immediately perceive quality when an interface feels tangible. Combining layered dark frosted glass with localized radial ambient glows establishes a natural visual hierarchy that guides eyes effortlessly toward key conversion goals.

---

### 2. Micro-Interactions & Magnetic Hover Feedback
When interactive elements dynamically gravitate toward user cursors, glow with specular light sweeps, and respond to touch with tactile micro-springs, perceived performance skyrockets and user friction melts away.

---

### 3. Conversion-Driven Visual Architecture
Great design is never just about aesthetics—it exists to drive measurable business outcomes. Every visual asset must highlight social proof, risk-reversal guarantees, and transparent pricing that empowers prospects to buy with complete confidence.`,
  },
  {
    id: "post-cro-speed",
    slug: "nextjs-cro-speed-guide",
    title: "Sub-Second Page Load: The Secret to High-Ticket CRO & 99+ Lighthouse Score",
    excerpt: "Why every 100ms delay costs 7% in sales, and how to achieve a 99+ Google Lighthouse score on production.",
    cover_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    category: "Speed & CRO",
    read_time: "5 min read",
    published: true,
    sort_order: 4,
    content: `# Sub-Second Page Load: The Secret to High-Ticket CRO

Conversion Rate Optimization (CRO) starts with speed. Google and Amazon research proved years ago that every 100ms of delay in page load time directly decreases conversion rates by 7%. On mobile devices, over 53% of visits are abandoned if a website takes more than 3 seconds to render.

---

### 1. Code-Splitting Below-the-Fold Modules
Only load what is immediately visible in the viewport: the Navigation Bar, Hero Section, and critical above-the-fold CSS. Complex components like interactive calculators, testimonial carousels, and footer maps should be lazily loaded via dynamic imports.

---

### 2. Modern Image Optimization & Next-Gen Formats
Never serve raw JPEGs or PNGs without compression. Modern production builds leverage AVIF and WebP with responsive srcset attributes, preventing costly layout shifts and shaving megabytes off the network payload.

---

### 3. Server-Driven Architecture & Zero Unnecessary Re-renders
By maintaining lean component states, deduplicating React contexts, and leveraging edge caching, you can guarantee a consistent 99+ score on Google Lighthouse while delivering an instantaneous browsing experience.`,
  },
];

const CATEGORY_OPTIONS = [
  "Paid Ads & CAPI",
  "AI Automation",
  "Web Development",
  "Speed & CRO",
  "General Tech & Strategy",
];

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

export default function BlogAdmin() {
  const [list, setList] = useState<AdminBlogPost[]>(DEFAULT_ADMIN_POSTS);
  const [editing, setEditing] = useState<Partial<AdminBlogPost> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      // 1. Check site_settings for customized blog posts
      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "blog_posts")
        .maybeSingle();

      if (settingsData?.value && Array.isArray(settingsData.value) && settingsData.value.length > 0) {
        setList(settingsData.value as AdminBlogPost[]);
        setLoading(false);
        return;
      }

      // 2. Check blog_posts table
      const { data: dbPosts } = await supabase.from("blog_posts").select("*").order("sort_order");
      if (dbPosts && dbPosts.length > 0) {
        const cleaned = (dbPosts as any[])
          .filter((p) => !p.slug.includes("hy-bara") && !p.slug.includes("video-editing"))
          .map((p, i) => {
            const fallback = DEFAULT_ADMIN_POSTS.find((df) => df.slug === p.slug) || DEFAULT_ADMIN_POSTS[i % DEFAULT_ADMIN_POSTS.length];
            return {
              id: p.id,
              slug: p.slug,
              title: p.title,
              excerpt: p.excerpt || fallback.excerpt,
              content: p.content || fallback.content,
              cover_url: p.cover_url || fallback.cover_url,
              category: fallback.category,
              read_time: fallback.read_time,
              published: p.published !== false,
              sort_order: p.sort_order ?? i,
            };
          });

        if (cleaned.length > 0) {
          // Merge missing defaults
          const merged = [...cleaned];
          for (const def of DEFAULT_ADMIN_POSTS) {
            if (!merged.some((m) => m.slug === def.slug)) {
              merged.push(def);
            }
          }
          setList(merged);
          setLoading(false);
          return;
        }
      }

      setList(DEFAULT_ADMIN_POSTS);
    } catch {
      setList(DEFAULT_ADMIN_POSTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveList = async (newList: AdminBlogPost[]) => {
    setSaving(true);
    try {
      // Save to site_settings for guaranteed instant frontend update
      await supabase.from("site_settings").upsert({
        key: "blog_posts",
        value: newList as any,
      });

      // Also sync to blog_posts table if possible
      for (const p of newList) {
        await supabase.from("blog_posts").upsert({
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          content: p.content,
          cover_url: p.cover_url,
          published: p.published,
          sort_order: p.sort_order,
        });
      }

      setList(newList);
      setEditing(null);
      toast.success("Blog article saved successfully!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  const onSave = async () => {
    if (!editing?.title) return toast.error("Title required");
    const slug = editing.slug || slugify(editing.title);

    const postItem: AdminBlogPost = {
      id: editing.id || `post-${Date.now()}`,
      slug,
      title: editing.title,
      excerpt: editing.excerpt ?? null,
      content: editing.content ?? "",
      cover_url: editing.cover_url ?? null,
      category: editing.category || "General Tech & Strategy",
      read_time: editing.read_time || "5 min read",
      published: editing.published !== false,
      sort_order: editing.sort_order ?? list.length,
    };

    let updated: AdminBlogPost[];
    if (editing.id && list.some((p) => p.id === editing.id)) {
      updated = list.map((p) => (p.id === editing.id ? postItem : p));
    } else {
      updated = [...list, postItem];
    }

    await saveList(updated);
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    const updated = list.filter((p) => p.id !== id);
    await saveList(updated);
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    const url = await uploadToBucket(file, "blog");
    setUploading(false);
    if (!url) return toast.error("Upload failed");
    setEditing({ ...editing, cover_url: url });
  };

  const resetToDefault = async () => {
    if (!confirm("Reset blog articles to the 4 default expert playbooks?")) return;
    await saveList(DEFAULT_ADMIN_POSTS);
  };

  return (
    <>
      <PageHeader
        title="Blog & Insights Manager"
        description="Write, edit, and organize authoritative articles, case studies, and growth playbooks."
        action={
          <div className="flex items-center gap-2">
            <GhostBtn onClick={resetToDefault} title="Restore original 4 default articles">
              <RotateCcw className="h-4 w-4" /> Reset Default
            </GhostBtn>
            <PrimaryBtn
              onClick={() =>
                setEditing({
                  title: "",
                  slug: "",
                  category: "Web Development",
                  read_time: "5 min read",
                  excerpt: "",
                  content: "# New Article Title\n\nWrite your insights here...",
                  published: true,
                  sort_order: list.length,
                })
              }
            >
              <Plus className="h-4 w-4" /> New Article
            </PrimaryBtn>
          </div>
        }
      />

      {editing && (
        <Card className="mb-6 space-y-4 ring-1 ring-primary/30 bg-card/90 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-display font-semibold text-lg text-white">
              {editing.id ? "Edit Article" : "Create New Article"}
            </h3>
            {editing.slug && (
              <Link
                to={`/blog/${editing.slug}`}
                target="_blank"
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Live Preview</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>

          <Field label="Article Title">
            <input
              value={editing.title ?? ""}
              maxLength={200}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              className={inputCls}
              placeholder="e.g. The 2026 Meta Ads & CAPI Scaling Playbook"
            />
          </Field>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="URL Slug" hint="Auto-generated if left empty">
              <input
                value={editing.slug ?? ""}
                maxLength={80}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                className={inputCls}
                placeholder={editing.title ? slugify(editing.title) : "my-article-slug"}
              />
            </Field>

            <Field label="Category Tag">
              <select
                value={editing.category ?? "Web Development"}
                onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                className={inputCls}
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Estimated Read Time">
              <input
                value={editing.read_time ?? "5 min read"}
                maxLength={30}
                onChange={(e) => setEditing({ ...editing, read_time: e.target.value })}
                className={inputCls}
                placeholder="e.g. 5 min read"
              />
            </Field>
          </div>

          <Field label="Excerpt / Summary (Shown on homepage card)">
            <textarea
              value={editing.excerpt ?? ""}
              maxLength={300}
              rows={2}
              onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
              className={inputCls + " resize-none"}
              placeholder="A brief 1-2 sentence compelling summary of the article..."
            />
          </Field>

          <Field label="Cover Image" hint="Upload a photo or paste a direct image URL">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                {editing.cover_url && (
                  <img
                    src={editing.cover_url}
                    alt=""
                    className="h-20 w-32 rounded-lg object-cover border border-white/20 glass"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  disabled={uploading}
                  className="text-sm text-slate-300"
                />
                {editing.cover_url && (
                  <GhostBtn onClick={() => setEditing({ ...editing, cover_url: null })}>
                    Remove
                  </GhostBtn>
                )}
              </div>
              <input
                value={editing.cover_url ?? ""}
                onChange={(e) => setEditing({ ...editing, cover_url: e.target.value })}
                className={inputCls}
                placeholder="Or paste image URL (e.g. https://images.unsplash.com/...)"
              />
            </div>
          </Field>

          <Field label="Article Markdown Content" hint="Write your full article using Markdown headings (#, ##), bullet points, and code blocks.">
            <textarea
              value={editing.content ?? ""}
              rows={14}
              onChange={(e) => setEditing({ ...editing, content: e.target.value })}
              className={inputCls + " resize-y font-mono text-xs leading-relaxed"}
              placeholder="# Introduction&#10;&#10;Explain your strategy here..."
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Sort Order">
              <input
                type="number"
                value={editing.sort_order ?? 0}
                onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                className={inputCls}
              />
            </Field>
            <label className="flex items-end gap-2 pb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.published ?? true}
                onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                className="h-4 w-4 accent-cyan-500 rounded"
              />
              <span className="text-sm font-semibold text-white">Published (Visible on site)</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <GhostBtn onClick={() => setEditing(null)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={onSave} loading={saving}>
              Save Article
            </PrimaryBtn>
          </div>
        </Card>
      )}

      {/* Articles Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-muted-foreground font-mono text-sm">
            Loading articles...
          </div>
        ) : list.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No articles found. Click "New Article" or "Reset Default" to add.
          </div>
        ) : (
          list.map((p) => (
            <Card key={p.id || p.slug} className="!p-0 overflow-hidden flex flex-col justify-between">
              <div>
                {p.cover_url && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
                    <img src={p.cover_url} alt="" className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/80 border border-cyan-400/40 text-cyan-300">
                      {p.category}
                    </span>
                    {!p.published && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/80 text-black font-bold">
                        DRAFT
                      </span>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h3 className="font-bold text-white text-sm line-clamp-2">{p.title}</h3>
                      <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        /{p.slug} • {p.read_time || "5 min read"}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Link
                        to={`/blog/${p.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg hover:bg-white/10 text-cyan-400"
                        title="View live article"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => setEditing(p)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                        title="Edit article"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => remove(p.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/15 text-destructive"
                        title="Delete article"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                    {p.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex justify-between items-center text-xs border-t border-white/5 mt-2">
                <span className="text-[10px] font-mono text-slate-400">Order: #{p.sort_order}</span>
                <button
                  onClick={() => setEditing(p)}
                  className="text-cyan-400 font-bold hover:underline"
                >
                  Edit Article →
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}