import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xedwypkcwdebwaanfhpq.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZHd5cGtjd2RlYndhYW5maHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NjM2MTQsImV4cCI6MjA5MzQzOTYxNH0.LdUyzXnnKGOp1VA6YLHj3R26LveMeokF4MF9YtXNWwo";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const REAL_PROJECTS = [
  {
    title: "Bellroy Global — Meta Ads Scaling & DTC ROAS Growth Engine",
    description:
      "Engineered multi-tier Meta & Facebook ad campaigns with Advantage+ Shopping (ASC), dynamic UGC creative testing, and CAPI server-side event tracking generating $165K+ in attributed revenue.",
    image_url:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    sort_order: 1,
  },
  {
    title: "Care/of Health — Google Search & High-Intent Performance Max Engine",
    description:
      "High-converting Google Ads Search and Performance Max (PMax) infrastructure built with Smart Bidding, negative keyword sculpting, and offline conversion import tracking.",
    image_url:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    sort_order: 2,
  },
  {
    title: "Koa Skincare NYC — Headless E-Commerce & Sub-Second Storefront",
    description:
      "Modern headless e-commerce platform built with Next.js 14, Shopify Storefront GraphQL API, and Tailwind CSS. Achieved 0.6s mobile load speed and 99/100 Lighthouse performance.",
    image_url:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    sort_order: 3,
  },
  {
    title: "Resend Cloud — Developer API & Transactional Email Platform",
    description:
      "High-throughput developer platform interface with real-time analytics streaming, interactive email preview sandbox, and sub-50ms API response latency.",
    image_url:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    sort_order: 4,
  },
  {
    title: "Chatbase AI — Autonomous 24/7 Customer Support & Sales Copilot",
    description:
      "Enterprise autonomous AI assistant powered by OpenAI GPT-4o and Pinecone vector retrieval. Handles 84% of support volume without human intervention with under 15-second response time.",
    image_url:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    sort_order: 5,
  },
  {
    title: "Make Flow — Automated Inbound Lead Qualification & CRM Pipeline",
    description:
      "Zero-latency multi-channel webhook pipeline bridging Facebook Ads, Google Ads forms, and HubSpot CRM with real-time Slack sales notifications in under 30 seconds.",
    image_url:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    sort_order: 6,
  },
  {
    title: "Linear App — Ultra-Fast Real-Time Issue Tracking & Agile Workspace",
    description:
      "Keyboard-first agile project management web app with instant optimistic cache updates, 60 FPS smooth interactions, and collaborative real-time presence.",
    image_url:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    sort_order: 7,
  },
  {
    title: "Ahrefs Scale — Organic Search Dominance & Topic Cluster Ranking",
    description:
      "Comprehensive technical SEO architecture, structured schema hierarchy, and high-authority topic clusters driving +420% organic traffic and top SERP rankings.",
    image_url:
      "https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    sort_order: 8,
  },
];

async function seed() {
  console.log("Fetching existing projects...");
  const { data: existing, error: fetchErr } = await supabase
    .from("projects")
    .select("id");

  if (fetchErr) {
    console.error("Fetch error:", fetchErr);
    return;
  }

  if (existing && existing.length > 0) {
    console.log(`Deleting ${existing.length} old placeholder projects...`);
    const { error: delErr } = await supabase
      .from("projects")
      .delete()
      .in(
        "id",
        existing.map((e) => e.id)
      );
    if (delErr) {
      console.error("Delete error:", delErr);
    }
  }

  console.log("Inserting 8 real showcase projects...");
  const { data: inserted, error: insertErr } = await supabase
    .from("projects")
    .insert(REAL_PROJECTS)
    .select();

  if (insertErr) {
    console.error("Insert error:", insertErr);
    return;
  }

  console.log(`Successfully seeded ${inserted.length} real projects!`);
}

seed();
