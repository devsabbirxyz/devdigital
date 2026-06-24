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
    <section className="relative py-24 bg-background">
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
          <Button
            size="lg"
            onClick={() => scrollToSection("contact")}
            className="rounded-full px-8 shadow-card-soft group"
          >
            Hire Me
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
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