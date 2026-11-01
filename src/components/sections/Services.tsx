import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Code2,
  Bot,
  Globe,
  Cpu,
  Zap,
  Megaphone,
  Search,
  Share2,
  Layers,
  Smartphone,
  Laptop,
  Rocket,
  BarChart,
  Shield,
  Workflow,
  Palette,
  Terminal,
  Database,
  LineChart,
  Target,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import HolographicCard from "@/components/ui/HolographicCard";
import SectionWatermark from "@/components/ui/SectionWatermark";

type Service = { id: string; icon: string; title: string; description: string };

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  Code2,
  Bot,
  Sparkles,
  Globe,
  Cpu,
  Zap,
  Megaphone,
  Search,
  Share2,
  Layers,
  Smartphone,
  Laptop,
  Rocket,
  BarChart,
  Shield,
  Workflow,
  Palette,
  Terminal,
  Database,
  LineChart,
  Target,
  MessageSquare,
};

function getServiceIcon(name: string) {
  return ICON_MAP[name] || Sparkles;
}

function routeForTitle(title: string): string | null {
  const t = title.toLowerCase();
  if (t.includes("digital") || t.includes("marketing")) return "/digitalmarketingservice";
  if (t.includes("ai") || t.includes("automation")) return "/aiautomation";
  if (t.includes("web") || t.includes("dev")) return "/webdev";
  return null;
}

const DEFAULT_SERVICES: Service[] = [
  {
    id: "serv-1",
    icon: "TrendingUp",
    title: "Digital Marketing & Paid Ads",
    description:
      "High-ROAS Meta Ads & Google Ads acquisition funnels engineered with server-side CAPI tracking, high-converting creative strategy, and scalable audience segmentation.",
  },
  {
    id: "serv-2",
    icon: "Code2",
    title: "Full-Stack Web Development",
    description:
      "Modern sub-second web platforms and SaaS architectures built with Next.js 14, React 19, TypeScript, and Tailwind CSS. Designed to maximize conversions and achieve 99+ Lighthouse scores.",
  },
  {
    id: "serv-3",
    icon: "Bot",
    title: "AI Automations & Autonomous Agents",
    description:
      "Custom intelligent AI agents, n8n webhook workflows, and automated CRM pipelines that handle 24/7 client operations, reduce manual hours, and scale business output effortlessly.",
  },
];

export default function Services() {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("services")
          .select("id, icon, title, description")
          .order("sort_order");
        if (data && data.length > 0) {
          setServices(data as Service[]);
        }
      } catch {}
    })();
  }, []);

  return (
    <section id="services" className="relative py-10 sm:py-16 md:py-24 isolate overflow-hidden bg-[#0A0C11]">
      <SectionWatermark text="SERVICES" glowColor="cyan" />

      {/* Subtle Ambient Radial Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[160px] opacity-20"
          style={{ background: "radial-gradient(circle, #0099FF 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full blur-[140px] opacity-15"
          style={{ background: "radial-gradient(circle, #38BDF8 0%, transparent 70%)" }}
        />
      </div>
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-10 md:mb-16"
        >
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-primary uppercase">What I Do</span>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold mt-2 sm:mt-3">
            Premium <span className="text-gradient">Solutions</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-3.5 sm:gap-6">
          {services.map((s, i) => {
            const Icon = getServiceIcon(s.icon);
            const route = routeForTitle(s.title);
            const Wrapper: any = route ? Link : "div";
            const wrapperProps: any = route ? { to: route } : {};
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="h-full"
              >
                <HolographicCard
                  className="h-full p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl group cursor-pointer border border-white/10 hover:border-primary/50 shadow-card hover:shadow-neon"
                  tiltStrength={8}
                  enableBorderBeam={true}
                  enableGlare={true}
                >
                  <Wrapper {...wrapperProps} className="block h-full">
                    <div className="flex items-start justify-between mb-3.5 sm:mb-6">
                      <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform neon-glow">
                        <Icon className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                      </div>
                      {route && (
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full glass flex items-center justify-center group-hover:rotate-45 transition-transform">
                          <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-base sm:text-xl font-bold mb-1.5 sm:mb-3">{s.title}</h3>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-3 sm:line-clamp-none">{s.description}</p>
                  </Wrapper>
                </HolographicCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
