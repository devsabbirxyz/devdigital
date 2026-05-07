import { Facebook, Instagram, Linkedin, MessageCircle, Sparkles } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Link } from "react-router-dom";
import { scrollToSection } from "@/lib/scroll";

type FooterData = {
  brand_name: string;
  slogan: string;
  phone: string;
  email: string;
  location: string;
  copyright: string;
  socials: { platform: string; url: string }[];
};
const DEFAULT: FooterData = {
  brand_name: "PORTFOLIO",
  slogan: "Building the future, one pixel at a time.",
  phone: "+1 (555) 123-4567",
  email: "hello@portfolio.com",
  location: "New York, USA",
  copyright: "© 2026 Portfolio. All rights reserved.",
  socials: [
    { platform: "facebook", url: "#" },
    { platform: "instagram", url: "#" },
    { platform: "linkedin", url: "#" },
    { platform: "whatsapp", url: "#" },
  ],
};

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
};

export default function Footer() {
  const { data } = useSiteSettings<FooterData>("footer", DEFAULT);

  return (
    <footer className="relative mt-12 border-t border-border/50">
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center neon-glow">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg tracking-wider">{data.brand_name}</span>
            </div>
            <p className="text-muted-foreground max-w-sm mb-6">{data.slogan}</p>
            <div className="flex gap-2">
              {data.socials.map((s) => {
                const Icon = ICONS[s.platform] ?? MessageCircle;
                return (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full glass-strong flex items-center justify-center hover:bg-gradient-primary hover:scale-110 transition-all"
                    aria-label={s.platform}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wider">SERVICES</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/digitalmarketingservice" className="hover:text-foreground transition">Digital Marketing</Link></li>
              <li><Link to="/webdev" className="hover:text-foreground transition">Web Development</Link></li>
              <li><Link to="/aiautomation" className="hover:text-foreground transition">AI Automation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wider">COMPANY</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => scrollToSection("about")} className="hover:text-foreground transition">About</button></li>
              <li><Link to="/projects" className="hover:text-foreground transition">Projects</Link></li>
              <li><button onClick={() => scrollToSection("pricing")} className="hover:text-foreground transition">Pricing</button></li>
              <li><button onClick={() => scrollToSection("contact")} className="hover:text-foreground transition">Contact</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wider">CONTACT</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{data.phone}</li>
              <li className="break-all">{data.email}</li>
              <li>{data.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
          {data.copyright}
        </div>
      </div>
    </footer>
  );
}
