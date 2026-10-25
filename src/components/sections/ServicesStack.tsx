import {
  Search,
  Sparkles,
  Megaphone,
  Code2,
  Users,
  Share2,
  Mail,
  PenTool,
  Video,
  ShoppingCart,
  BarChart3,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";

type Service = { label: string; Icon: LucideIcon };

const SERVICES: Service[] = [
  { label: "SEO", Icon: Search },
  { label: "Branding", Icon: Sparkles },
  { label: "Google Ads", Icon: Megaphone },
  { label: "Web Development", Icon: Code2 },
  { label: "Influencer Marketing", Icon: Users },
  { label: "Social Media Marketing", Icon: Share2 },
  { label: "Email Marketing", Icon: Mail },
  { label: "Content Creation", Icon: PenTool },
  { label: "Video Marketing", Icon: Video },
  { label: "E-commerce Solutions", Icon: ShoppingCart },
  { label: "Analytics & Reporting", Icon: BarChart3 },
  { label: "Mobile Marketing", Icon: Smartphone },
];

export default function ServicesStack() {
  const loop = [...SERVICES, ...SERVICES];
  return (
    <section className="relative py-24 bg-background content-auto">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">
            Services
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">
            What I <span className="text-gradient">Offer</span>
          </h2>
        </div>

        <div
          className="relative mx-auto overflow-hidden"
          style={{ maxWidth: 400, height: 420 }}
        >
          {/* fade masks */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 z-10 bg-gradient-to-b from-background to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 z-10 bg-gradient-to-t from-background to-transparent" />

          <div className="services-stack-track flex flex-col">
            {loop.map(({ label, Icon }, i) => {
              const dark = i % 2 === 0;
              const rotate = i % 2 === 0 ? -3 : 3;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-4 rounded-2xl px-5 py-4 -mt-3 first:mt-0 shadow-card-soft border ${
                    dark
                      ? "bg-primary text-primary-foreground border-primary/40"
                      : "bg-card text-card-foreground border-border"
                  }`}
                  style={{ transform: `rotate(${rotate}deg)` }}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                      dark
                        ? "border-primary-foreground/30 text-primary-foreground"
                        : "border-border text-primary"
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <span className="font-display font-bold text-lg">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => scrollToSection("contact")}
            className="relative group text-white font-bold px-8 py-3.5 rounded-full border border-white/30 hover:border-white/60 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_25px_rgba(59,130,246,0.35)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_0_35px_rgba(14,165,233,0.55)] overflow-hidden flex items-center justify-center gap-2 cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.20) 0%, rgba(37, 99, 235, 0.35) 50%, rgba(14, 165, 233, 0.22) 100%)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <span
              aria-hidden="true"
              className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
            />
            <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">Hire Me</span>
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 text-cyan-300 relative z-10" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes services-stack-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .services-stack-track {
          animation: services-stack-scroll 20s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}