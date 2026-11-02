import { motion } from "framer-motion";
import { Globe, ExternalLink, Sparkles } from "lucide-react";

// Real client brands with authentic downloaded logo images from live sites
const CLIENTS = [
  {
    name: "Blood BD",
    domain: "blood-bd.com",
    tagline: "Emergency Donor Network",
    logo: "/images/clients/blood-bd.com.png",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/25 hover:border-red-400/50",
    initial: "B",
    live_url: "https://blood-bd.com",
  },
  {
    name: "Gorur Ghash",
    domain: "gorurghash.com",
    tagline: "Streetwear Apparel & DTC",
    logo: "/images/clients/gorurghash.com.png",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/25 hover:border-emerald-400/50",
    initial: "G",
    live_url: "https://gorurghash.com",
  },
  {
    name: "Praava Health",
    domain: "praavahealth.com",
    tagline: "Healthcare & Diagnostics",
    logo: "/images/clients/praavahealth.com.png",
    color: "text-sky-400",
    bg: "bg-sky-500/10 border-sky-500/25 hover:border-sky-400/50",
    initial: "P",
    live_url: "https://praavahealth.com",
  },
  {
    name: "Khaas Food",
    domain: "khaasfood.com",
    tagline: "Pure Food Delivery Platform",
    logo: "/images/clients/khaasfood.com.png",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/25 hover:border-amber-400/50",
    initial: "K",
    live_url: "https://khaasfood.com",
  },
  {
    name: "Dorji Bari",
    domain: "dorjibari.com.bd",
    tagline: "Nationwide Fashion Retail",
    logo: "/images/clients/dorjibari.com.bd.png",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/25 hover:border-purple-400/50",
    initial: "D",
    live_url: "https://dorjibari.com.bd",
  },
  {
    name: "Steadfast Courier",
    domain: "steadfast.com.bd",
    tagline: "Nationwide Parcel Tracking",
    logo: "/images/clients/steadfast.com.bd.png",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/25 hover:border-blue-400/50",
    initial: "S",
    live_url: "https://steadfast.com.bd",
  },
];

// Duplicate for seamless 360-degree marquee loop
const LIST = [...CLIENTS, ...CLIENTS, ...CLIENTS];

export default function ClientLogoStrip() {
  return (
    <section className="relative py-8 sm:py-12 overflow-hidden bg-[#08070C] border-y border-white/[0.06]">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent" />

      {/* Header Eyebrow (Global Scale-Ups & Brands) */}
      <div className="container mb-5 text-center relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2"
        >
          <Globe className="w-3.5 h-3.5 text-primary/70 animate-pulse" />
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-muted-foreground/80">
            Trusted by Ambitious Brands & Fast-Growing Scale-Ups Worldwide
          </p>
          <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
        </motion.div>
      </div>

      {/* Infinite Logo Marquee */}
      <div className="relative w-full overflow-hidden pause-on-hover">
        {/* Soft edge gradient masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 z-20 bg-gradient-to-r from-[#08070C] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 z-20 bg-gradient-to-l from-[#08070C] to-transparent" />

        <div
          className="animate-marquee-left flex items-center gap-3 sm:gap-4 py-2"
          style={{ "--marquee-duration": "35s" } as React.CSSProperties}
        >
          {LIST.map((client, idx) => (
            <a
              key={`${client.name}-${idx}`}
              href={client.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex items-center gap-3 px-4 py-2.5 sm:py-3 rounded-2xl border ${client.bg} bg-[#0D0C14] transition-all duration-300 hover:scale-105 shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(0,153,255,0.25)] select-none min-w-[190px] sm:min-w-[220px]`}
              title={`Visit ${client.name} (${client.domain})`}
            >
              {/* Authentic Client Brand Logo */}
              <div className="w-10 h-10 rounded-xl bg-white/[0.08] p-1.5 flex items-center justify-center border border-white/15 shrink-0 overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                <img
                  src={client.logo}
                  alt={`${client.name} official logo`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain rounded-md"
                  onError={(e) => {
                    // Fallback to text initial if image load fails
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget.parentElement?.querySelector(".logo-fallback");
                    if (fallback) (fallback as HTMLElement).style.display = "flex";
                  }}
                />
                <span
                  className="logo-fallback hidden w-full h-full items-center justify-center font-black text-sm text-white"
                >
                  {client.initial}
                </span>
              </div>

              {/* Client Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className={`text-xs sm:text-sm font-bold ${client.color} leading-tight truncate group-hover:text-white transition-colors`}>
                    {client.name}
                  </p>
                  <ExternalLink className="w-2.5 h-2.5 text-muted-foreground/60 group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
                <p className="text-[10px] text-muted-foreground/75 font-mono truncate mt-0.5">
                  {client.tagline}
                </p>
              </div>

              {/* Verified Badge */}
              <div className="ml-auto shrink-0">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                  <svg className="w-2.5 h-2.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
