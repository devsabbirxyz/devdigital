import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

// Past client logos — text-based with brand colors (no external image dependency)
const CLIENTS = [
  {
    name: "Blood BD",
    domain: "blood-bd.com",
    tagline: "Blood Donation Platform",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/25",
    initial: "B",
  },
  {
    name: "Gorur Ghash",
    domain: "gorurghash.com",
    tagline: "Livestock Marketplace",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/25",
    initial: "G",
  },
  {
    name: "Praava Health",
    domain: "praavahealth.com",
    tagline: "Healthcare Platform",
    color: "text-sky-400",
    bg: "bg-sky-500/10 border-sky-500/25",
    initial: "P",
  },
  {
    name: "Khaas Food",
    domain: "khaasfood.com",
    tagline: "Premium Food Delivery",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/25",
    initial: "K",
  },
  {
    name: "Dorji Bari",
    domain: "dorjibari.com.bd",
    tagline: "Fashion & Tailoring",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/25",
    initial: "D",
  },
  {
    name: "Apple Gadgets",
    domain: "applegadgetsbd.com",
    tagline: "Tech Retail Store",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/25",
    initial: "A",
  },
];

// Duplicate for seamless marquee
const LIST = [...CLIENTS, ...CLIENTS];

export default function ClientLogoStrip() {
  return (
    <section className="relative py-8 sm:py-12 overflow-hidden bg-[#08070C] border-y border-white/[0.06]">
      {/* Subtle glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent" />

      <div className="container mb-5 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2"
        >
          <Building2 className="w-3.5 h-3.5 text-primary/60" />
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-muted-foreground/70">
            Trusted by Growing Businesses Across Bangladesh
          </p>
          <Building2 className="w-3.5 h-3.5 text-primary/60" />
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative w-full overflow-hidden">
        {/* Edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 z-20 bg-gradient-to-r from-[#08070C] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 z-20 bg-gradient-to-l from-[#08070C] to-transparent" />

        <div
          className="animate-marquee-left flex items-center gap-3 sm:gap-4 py-2"
          style={{ "--marquee-duration": "30s" } as React.CSSProperties}
        >
          {LIST.map((client, idx) => (
            <div
              key={`${client.name}-${idx}`}
              className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl border ${client.bg} backdrop-blur-md transition-all duration-300 hover:scale-105 shrink-0 shadow-sm cursor-default select-none min-w-[160px] sm:min-w-[190px]`}
            >
              {/* Avatar initial */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-black border ${client.bg} ${client.color} shrink-0`}
              >
                {client.initial}
              </div>
              <div>
                <p className={`text-xs sm:text-sm font-bold ${client.color} leading-tight`}>
                  {client.name}
                </p>
                <p className="text-[10px] text-muted-foreground/70 font-mono mt-0.5">
                  {client.tagline}
                </p>
              </div>
              {/* Verified checkmark */}
              <div className="ml-auto">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
