// Runs before `vite dev` and `vite build`; writes public/sitemap.xml and public/rss.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";

config();

const BASE_URL = "https://devsabbir.pro.bd";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type Entry = { path: string; lastmod?: string; changefreq?: string; priority?: string };

const staticEntries: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/projects", changefreq: "weekly", priority: "0.8" },
  { path: "/webdev", changefreq: "monthly", priority: "0.7" },
  { path: "/aiautomation", changefreq: "monthly", priority: "0.7" },
  { path: "/digitalmarketingservice", changefreq: "monthly", priority: "0.7" },
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
    "  <title>DevDigital — Blog</title>",
    `  <link>${BASE_URL}/</link>`,
    "  <description>Latest articles from DevDigital.</description>",
    `  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    items,
    "</channel></rss>",
  ].join("\n");
}

async function main() {
  const posts = await fetchTable<{ slug: string; title: string; excerpt: string | null; created_at: string; updated_at?: string }>(
    "blog_posts",
    "select=slug,title,excerpt,created_at,updated_at&published=eq.true&order=created_at.desc",
  );
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

  writeFileSync(resolve("public/sitemap.xml"), buildSitemap([...staticEntries, ...dynamicEntries]));
  writeFileSync(resolve("public/rss.xml"), buildRss(posts));
  console.log(`sitemap.xml (${staticEntries.length + dynamicEntries.length} urls) and rss.xml (${posts.length} posts) written`);
}

main().catch((e) => {
  console.warn("sitemap generator failed:", e?.message ?? e);
});