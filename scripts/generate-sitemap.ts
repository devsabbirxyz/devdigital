// Runs before `vite dev` and `vite build`; writes public/sitemap.xml and public/rss.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";

config();

const BASE_URL = "https://developersabbir.pro.bd";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type Entry = { path: string; lastmod?: string; changefreq?: string; priority?: string };

const staticEntries: Entry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/projects", changefreq: "weekly", priority: "0.8" },
  { path: "/hire-me", changefreq: "weekly", priority: "0.8" },
  { path: "/blog/how-we-scaled-apparel-brand-15l-meta-capi", changefreq: "weekly", priority: "0.9" },
  { path: "/blog/why-moving-wordpress-to-nextjs-cut-bounce-50", changefreq: "weekly", priority: "0.9" },
  { path: "/services/digital-marketing", changefreq: "monthly", priority: "0.7" },
  { path: "/services/web-development", changefreq: "monthly", priority: "0.7" },
  { path: "/services/ai-automation", changefreq: "monthly", priority: "0.7" },
];

const FALLBACK_POSTS = [
  {
    slug: "how-we-scaled-apparel-brand-15l-meta-capi",
    title: "How We Scaled an Apparel Brand to ৳15L/Month using Meta CAPI",
    excerpt: "A deep dive into server-side conversion matching, creative testing, and retargeting funnels that boosted monthly revenue from ৳2.5L to ৳15L.",
    created_at: "2026-11-01T00:00:00.000Z",
  },
  {
    slug: "why-moving-wordpress-to-nextjs-cut-bounce-50",
    title: "Why Moving from WordPress to Next.js Cut Bounce Rates by 50%",
    excerpt: "How migrating a bloated 4.8s WooCommerce store to a headless Next.js 15 edge architecture doubled mobile checkouts and sliced bounce rates in half.",
    created_at: "2026-11-01T00:00:00.000Z",
  },
];

async function fetchTable<T = any>(table: string, query: string): Promise<T[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!res.ok) return [];
    return (await res.json()) as T[];
  } catch {
    return [];
  }
}

function xmlEscape(s: string) {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!));
}

function buildSitemap(entries: Entry[]) {
  const urls = entries.map((e) =>
    [
      "  <url>",
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      "  </url>",
    ].filter(Boolean).join("\n"),
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
  ].join("\n");
}

function buildRss(posts: Array<{ slug: string; title: string; excerpt: string | null; created_at: string }>) {
  const items = posts.map((p) => [
    "    <item>",
    `      <title>${xmlEscape(p.title)}</title>`,
    `      <link>${BASE_URL}/blog/${p.slug}</link>`,
    `      <guid isPermaLink="true">${BASE_URL}/blog/${p.slug}</guid>`,
    `      <pubDate>${new Date(p.created_at).toUTCString()}</pubDate>`,
    p.excerpt ? `      <description>${xmlEscape(p.excerpt)}</description>` : null,
    "    </item>",
  ].filter(Boolean).join("\n")).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0"><channel>',
    "  <title>DevDigital — Insights &amp; Case Studies</title>",
    `  <link>${BASE_URL}/</link>`,
    "  <description>Deep case studies and actionable growth frameworks on Paid Ads, CAPI, Next.js Web Engineering, and AI Automations by Sabbir.</description>",
    `  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    items,
    "</channel></rss>",
  ].join("\n");
}

async function main() {
  let posts = await fetchTable<{ slug: string; title: string; excerpt: string | null; created_at: string; updated_at?: string }>(
    "blog_posts",
    "select=slug,title,excerpt,created_at,updated_at&published=eq.true&order=created_at.desc",
  );

  if (!posts || posts.length === 0) {
    posts = FALLBACK_POSTS;
  }

  const services = await fetchTable<{ slug: string; updated_at?: string }>(
    "service_pages",
    "select=slug,updated_at",
  );

  const dynamicEntries: Entry[] = [
    ...posts.map((p) => ({
      path: `/blog/${p.slug}`,
      lastmod: (p.updated_at || p.created_at).slice(0, 10),
      changefreq: "monthly",
      priority: "0.6",
    })),
    ...services.map((s) => ({
      path: `/services/${s.slug}`,
      lastmod: s.updated_at?.slice(0, 10),
      changefreq: "monthly",
      priority: "0.7",
    })),
  ];

  // Avoid duplicate entries if present in staticEntries
  const seenPaths = new Set<string>();
  const allEntries: Entry[] = [];
  for (const entry of [...staticEntries, ...dynamicEntries]) {
    if (!seenPaths.has(entry.path)) {
      seenPaths.add(entry.path);
      allEntries.push(entry);
    }
  }

  writeFileSync(resolve("public/sitemap.xml"), buildSitemap(allEntries));
  writeFileSync(resolve("public/rss.xml"), buildRss(posts));
  console.log(`sitemap.xml (${allEntries.length} urls) and rss.xml (${posts.length} posts) written`);
}

main().catch((e) => {
  console.warn("sitemap generator failed:", e?.message ?? e);
});
