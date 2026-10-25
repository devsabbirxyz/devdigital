import React from "react";
import {
  TrendingUp,
  Code2,
  Bot,
  Zap,
  Globe,
  Database,
  Cpu,
  Layers,
  ShieldCheck,
  Workflow,
  ShoppingBag,
  CreditCard,
  Sparkles,
} from "lucide-react";

interface BrandItem {
  name: string;
  role: string;
  category: "marketing" | "web" | "ai" | "infra";
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badge?: string;
}

const BRAND_ITEMS: BrandItem[] = [
  {
    name: "Meta Ads Partner",
    role: "Facebook & IG Funnels",
    category: "marketing",
    icon: TrendingUp,
    accentColor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
    badge: "Verified ROI",
  },
  {
    name: "Google Ads & GA4",
    role: "Search, CAPI & Analytics",
    category: "marketing",
    icon: Globe,
    accentColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    badge: "Certified",
  },
  {
    name: "Next.js 14 / React",
    role: "Sub-second Edge Speed",
    category: "web",
    icon: Code2,
    accentColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  {
    name: "OpenAI & Anthropic",
    role: "Autonomous 24/7 Agents",
    category: "ai",
    icon: Bot,
    accentColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    badge: "AI Powered",
  },
  {
    name: "TypeScript",
    role: "Enterprise Codebase",
    category: "web",
    icon: Layers,
    accentColor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  },
  {
    name: "Supabase & Postgres",
    role: "Real-time Edge Database",
    category: "infra",
    icon: Database,
    accentColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  },
  {
    name: "Tailwind & Framer",
    role: "Awwwards-level Motion",
    category: "web",
    icon: Sparkles,
    accentColor: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  },
  {
    name: "n8n & Make Automations",
    role: "Webhook Data Sync",
    category: "ai",
    icon: Workflow,
    accentColor: "text-pink-400 border-pink-500/30 bg-pink-500/10",
  },
  {
    name: "Shopify E-Commerce",
    role: "High-Converting Stores",
    category: "marketing",
    icon: ShoppingBag,
    accentColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  },
  {
    name: "Stripe Global",
    role: "Secure Billing & Subscriptions",
    category: "infra",
    icon: CreditCard,
    accentColor: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },
  {
    name: "Python AI Pipelines",
    role: "Data Scraping & Model Serving",
    category: "ai",
    icon: Cpu,
    accentColor: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
  },
  {
    name: "Vercel & Cloudflare",
    role: "99.99% Edge Availability",
    category: "infra",
    icon: ShieldCheck,
    accentColor: "text-teal-400 border-teal-500/30 bg-teal-500/10",
  },
];

export default function BrandMarquee() {
  // Duplicate for seamless 50% translation loop
  const list = [...BRAND_ITEMS, ...BRAND_ITEMS];

  return (
    <section className="relative py-8 md:py-12 border-y border-white/5 bg-[#0A0C11] overflow-hidden select-none">
      {/* Ambient background accent */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#0099FF]/5 to-transparent opacity-60" />

      {/* Header Eyebrow */}
      <div className="container mx-auto px-4 mb-5 text-center relative z-10">
        <p className="text-[11px] md:text-xs font-semibold tracking-[0.28em] uppercase text-muted-foreground/80 flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
          <span>Industry-Standard Tech Stack & Certified Platforms</span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        </p>
      </div>

      {/* Marquee Wrapper with soft gradient masks on edges */}
      <div className="relative w-full overflow-hidden pause-on-hover">
        {/* Left & Right gradient masks for smooth fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 z-20 bg-gradient-to-r from-[#0A0C11] via-[#0A0C11]/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 z-20 bg-gradient-to-l from-[#0A0C11] via-[#0A0C11]/80 to-transparent" />

        <div
          className="animate-marquee-left flex items-center gap-3 md:gap-4 py-2"
          style={{ "--marquee-duration": "35s" } as React.CSSProperties}
        >
          {list.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`${item.name}-${idx}`}
                className="group relative flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-primary/40 backdrop-blur-md transition-all duration-300 shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_0_20px_rgba(0,153,255,0.25)] cursor-default"
              >
                <div
                  className={`p-2 rounded-lg border flex items-center justify-center ${item.accentColor} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold tracking-wider uppercase bg-primary/20 text-primary-foreground border border-primary/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] md:text-[11px] text-muted-foreground/80 font-mono">
                    {item.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
