import { Facebook, Instagram, Linkedin, MessageCircle, Sparkles, Lock, Twitter, Youtube, Github, Music2 } from "lucide-react";
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
  brand_name: "DevDigital",
  slogan: "Building high-performance digital experiences that scale.",
  phone: "+880 1941-130981",
  email: "developersabbir.x@gmail.com",
  location: "Dhaka, Bangladesh",
  copyright: "© 2026 DevDigital. All Rights Reserved.",
  socials: [
    { platform: "facebook", url: "" },
    { platform: "instagram", url: "" },
    { platform: "linkedin", url: "" },
    { platform: "whatsapp", url: "" },
  ],
};

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
  twitter: Twitter,
  youtube: Youtube,
  github: Github,
  tiktok: Music2,
};

export default function Footer() {
  const { data } = useSiteSettings<FooterData>("footer", DEFAULT);
  const brandName = data.brand_name && data.brand_name !== "PORTFOLIO" ? data.brand_name : "DevDigital";
  const copyrightText =
    data.copyright && !data.copyright.toLowerCase().includes("portfolio")
      ? data.copyright
      : "© 2026 DevDigital. All Rights Reserved.";

  const phone =
    data.phone && !data.phone.includes("555") && !data.phone.includes("501")
      ? data.phone
      : DEFAULT.phone;
  const email =
    data.email && data.email !== "hello@portfolio.com" && data.email !== "johnnykyorov@gmail.com"
      ? data.email
      : DEFAULT.email;
  const location =
    data.location && !data.location.includes("New York") && !data.location.includes("Crosby")
      ? data.location
      : DEFAULT.location;

  return (
    <footer className="relative mt-12 border-t border-white/5 bg-[#0A0C11] content-auto overflow-hidden">
      {/* Subtle Ambient Radial Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-[160px] opacity-15"
          style={{ background: "radial-gradient(circle, #0099FF 0%, transparent 70%)" }}
        />
      </div>
      <div className="container py-8 sm:py-16 px-4">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-10">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-primary flex items-center justify-center neon-glow">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-bold text-base sm:text-lg tracking-wider">{brandName}</span>
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-sm mb-4 sm:mb-6">{data.slogan}</p>
            <div className="flex gap-2 flex-wrap">
              {data.socials.filter((s) => s.url && s.url !== "#").map((s) => {
                const Icon = ICONS[s.platform] ?? MessageCircle;
                return (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full glass-strong flex items-center justify-center hover:bg-gradient-primary hover:scale-110 transition-all"
                    aria-label={s.platform}
                  >
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </a>
                );
              })}
            </div>
            <Link
              to="/admin"
              className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 glass rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-medium opacity-30 hover:opacity-100 hover:bg-primary/10 transition-all w-fit"
              aria-label="Admin login"
            >
              <Lock className="h-3 w-3" />
              Admin
            </Link>
          </div>

          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-xs sm:text-sm tracking-wider">SERVICES</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li><Link to="/digitalmarketingservice" className="hover:text-foreground transition">Digital Marketing</Link></li>
              <li><Link to="/webdev" className="hover:text-foreground transition">Web Development</Link></li>
              <li><Link to="/aiautomation" className="hover:text-foreground transition">AI Automation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-xs sm:text-sm tracking-wider">COMPANY</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li><button onClick={() => scrollToSection("about")} className="hover:text-foreground transition">About</button></li>
              <li><Link to="/projects" className="hover:text-foreground transition">Projects</Link></li>
              <li><button onClick={() => scrollToSection("blog")} className="hover:text-foreground transition">Insights & Blog</button></li>
              <li><button onClick={() => scrollToSection("contact")} className="hover:text-foreground transition">Contact</button></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold mb-3 sm:mb-4 text-xs sm:text-sm tracking-wider">CONTACT</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <a
                  href={`https://wa.me/8801941130981?text=${encodeURIComponent(
                    "Hi Sabbir! I saw your portfolio and I want to discuss a project for my business."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition"
                >
                  {phone}
                </a>
              </li>
              <li className="break-all">
                <a
                  href={`mailto:${email}`}
                  className="hover:text-foreground transition"
                >
                  {email}
                </a>
              </li>
              <li>{location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-border/50 text-center text-xs sm:text-sm text-muted-foreground">
          {copyrightText}
        </div>
      </div>
    </footer>
  );
}
