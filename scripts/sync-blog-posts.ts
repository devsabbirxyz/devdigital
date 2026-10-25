import { config } from "dotenv";
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "resolution=merge-duplicates",
};

const POSTS = [
  {
    slug: "meta-ads-scaling-playbook",
    title: "The 2026 Meta Ads & CAPI Scaling Playbook: How to Slash CPA by 48%",
    excerpt: "How server-side Conversions API (CAPI), first-party data tracking, and dynamic creative testing consistently generate 4x+ ROAS.",
    cover_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
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
    slug: "autonomous-ai-agents-for-business",
    title: "Building Autonomous AI Agents That Operate 24/7 & Scale Revenue",
    excerpt: "Replacing manual CRM entries, customer qualification, and booking pipelines with intelligent, autonomous AI workflows.",
    cover_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
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
    slug: "design-trends-2026",
    title: "High-Converting Web Design Trends in 2026: Tactical Glassmorphism & Spatial Depth",
    excerpt: "Why modern interfaces with tactile feedback, sub-second latency, and glass aesthetics drive 3x more conversions.",
    cover_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
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
    slug: "nextjs-cro-speed-guide",
    title: "Sub-Second Page Load: The Secret to High-Ticket CRO & 99+ Lighthouse Score",
    excerpt: "Why every 100ms delay costs 7% in sales, and how to achieve a 99+ Google Lighthouse score on production.",
    cover_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
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

async function run() {
  console.log("Connecting to Supabase...");

  // 1. Delete junk test posts
  const junkSlugs = ["hy-bara-shala-ra", "video-editing", "welcome-to-the-blog"];
  for (const slug of junkSlugs) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${slug}`, {
      method: "DELETE",
      headers,
    });
    console.log(`Deleted junk post ${slug}: status ${res.status}`);
  }

  // 2. Upsert high quality posts
  for (const post of POSTS) {
    // Check if post exists
    const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${post.slug}&select=id`, {
      headers,
    });
    const existing = await checkRes.json();

    if (Array.isArray(existing) && existing.length > 0) {
      // Update
      const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${existing[0].id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(post),
      });
      console.log(`Updated post: ${post.slug} (status: ${updateRes.status})`);
    } else {
      // Insert
      const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
        method: "POST",
        headers,
        body: JSON.stringify(post),
      });
      console.log(`Inserted post: ${post.slug} (status: ${insertRes.status})`);
    }
  }

  console.log("All blog posts synced successfully!");
}

run().catch(console.error);
