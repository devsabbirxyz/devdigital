import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { scrollToSection } from "@/lib/scroll";
import ThemeToggle from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";

type NavData = {
  logo_url: string;
  brand_name: string;
  menu_items: { label: string; target: string }[];
};

const DEFAULT: NavData = {
  logo_url: "",
  brand_name: "PORTFOLIO",
  menu_items: [
    { label: "Home", target: "home" },
    { label: "About", target: "about" },
    { label: "Services", target: "services" },
    { label: "Projects", target: "projects" },
    { label: "Process", target: "process" },
    { label: "Pricing", target: "pricing" },
    
    { label: "Contact", target: "contact" },
  ],
};

export default function Navbar() {
  const { data } = useSiteSettings<NavData>("navigation", DEFAULT);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (target: string) => {
    if (target.startsWith("/")) {
      navigate(target);
    } else {
      scrollToSection(target);
    }
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-3 md:top-4 left-0 right-0 z-50 flex justify-center px-3"
    >
      <nav
        className={`neon-border-rotate glass-strong rounded-full px-2 md:px-3 py-1.5 md:py-2 flex items-center gap-1 md:gap-2 transition-all ${
          scrolled ? "shadow-glow-soft" : ""
        }`}
      >
        <Link to="/" className="flex items-center gap-1.5 md:gap-2 pl-1.5 md:pl-2 pr-2 md:pr-3" aria-label="Home">
          {data.logo_url ? (
            <img src={data.logo_url} alt={data.brand_name} loading="eager" decoding="async" width={32} height={32} className="h-6 w-6 md:h-8 md:w-8 rounded-full object-cover" />
          ) : (
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-gradient-primary flex items-center justify-center neon-glow">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-white" />
            </div>
          )}
          <span className="font-display font-bold text-[10px] md:text-sm tracking-wider">
            {data.brand_name}
          </span>
        </Link>

        <ul className="flex items-center gap-0.5 md:gap-1">
          {data.menu_items.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => handleNav(item.target)}
                className="px-2 md:px-4 py-1 md:py-2 text-[10px] md:text-sm font-medium rounded-full text-foreground/80 hover:text-foreground hover:bg-white/5 transition-all whitespace-nowrap"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {!isMobile && <ThemeToggle />}

        <button
          onClick={() => handleNav("contact")}
          className="bg-gradient-primary text-white text-[10px] md:text-sm font-semibold px-2.5 md:px-5 py-1 md:py-2 rounded-full neon-glow hover:scale-105 transition-transform whitespace-nowrap"
        >
          Hire Me
        </button>
      </nav>
    </motion.header>
  );
}
