import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { scrollToSection } from "@/lib/scroll";

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
    { label: "Solutions", target: "services" },
    { label: "Plans", target: "pricing" },
    { label: "Contact", target: "contact" },
  ],
};

export default function Navbar() {
  const { data } = useSiteSettings<NavData>("navigation", DEFAULT);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (target: string) => {
    setOpen(false);
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
      className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
    >
      <nav
        className={`glass-strong rounded-full px-3 py-2 flex items-center gap-2 transition-all ${
          scrolled ? "shadow-glow-soft" : ""
        }`}
      >
        <Link to="/" className="flex items-center gap-2 pl-2 pr-3" aria-label="Home">
          {data.logo_url ? (
            <img src={data.logo_url} alt={data.brand_name} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center neon-glow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          )}
          <span className="font-display font-bold text-sm tracking-wider hidden sm:inline">
            {data.brand_name}
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {data.menu_items.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => handleNav(item.target)}
                className="px-4 py-2 text-sm font-medium rounded-full text-foreground/80 hover:text-foreground hover:bg-white/5 transition-all"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => handleNav("contact")}
          className="hidden md:inline-flex bg-gradient-primary text-white text-sm font-semibold px-5 py-2 rounded-full neon-glow hover:scale-105 transition-transform"
        >
          Hire Me
        </button>

        <button
          onClick={() => setOpen((s) => !s)}
          className="md:hidden p-2 rounded-full hover:bg-white/5"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-4 right-4 glass-strong rounded-3xl p-4 flex flex-col gap-1"
        >
          {data.menu_items.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNav(item.target)}
              className="px-4 py-3 text-left rounded-xl hover:bg-white/5 font-medium"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNav("contact")}
            className="mt-2 bg-gradient-primary text-white font-semibold py-3 rounded-xl"
          >
            Hire Me
          </button>
        </motion.div>
      )}
    </motion.header>
  );
}
