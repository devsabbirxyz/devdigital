import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Search, Menu, X, ArrowRight, Calendar } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { scrollToSection } from "@/lib/scroll";
import { openCommandPalette } from "./CommandPalette";
import { openBookingModal } from "./BookingModal";
import SoundToggle from "./SoundToggle";

type NavData = {
  logo_url: string;
  brand_name: string;
  menu_items: { label: string; target: string }[];
};

const DEFAULT: NavData = {
  logo_url: "",
  brand_name: "DevDigital",
  menu_items: [
    { label: "Home", target: "home" },
    { label: "About", target: "about" },
    { label: "Services", target: "services" },
    { label: "Projects", target: "projects" },
    { label: "Process", target: "process" },
    { label: "Pricing", target: "pricing" },
    { label: "Blog", target: "blog" },
    { label: "Contact", target: "contact" },
  ],
};

export default function Navbar() {
  const { data } = useSiteSettings<NavData>("navigation", DEFAULT);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const isPast = window.scrollY > 30;
        setScrolled((prev) => (prev !== isPast ? isPast : prev));
        if (window.scrollY > 80 && mobileOpen) {
          setMobileOpen(false);
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileOpen]);

  const handleNav = (target: string) => {
    setMobileOpen(false);
    if (target.startsWith("/")) {
      navigate(target);
    } else {
      scrollToSection(target);
    }
  };

  const brandName = data.brand_name && data.brand_name !== "PORTFOLIO" ? data.brand_name : "DevDigital";

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-2.5 sm:top-3 md:top-4 left-0 right-0 z-50 flex flex-col items-center px-3"
    >
      {/* Tap backdrop to close mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[-1] bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav
        className={`rounded-full px-2.5 md:px-3 py-1.5 md:py-2 flex items-center gap-1.5 md:gap-2 transition-all duration-300 border border-white/15 backdrop-blur-2xl bg-[#090D1A]/80 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] max-w-full ${
          scrolled ? "shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_30px_rgba(37,99,235,0.25)] border-white/25" : ""
        }`}
      >
        {/* Brand Logo & Name */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-1.5 md:gap-2 pl-1 md:pl-2 pr-2 md:pr-3 py-1 rounded-full hover:bg-white/[0.06] transition-all group shrink-0"
          aria-label="Home"
        >
          {data.logo_url ? (
            <img
              src={data.logo_url}
              alt={brandName}
              loading="eager"
              decoding="async"
              width={32}
              height={32}
              className="h-6 w-6 md:h-8 md:w-8 rounded-full object-cover border border-white/20 shadow-sm"
            />
          ) : (
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-white/[0.12] backdrop-blur-xl border border-white/25 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_15px_rgba(59,130,246,0.35)] group-hover:scale-105 transition-transform">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-cyan-300" />
            </div>

          )}
          <span className="font-display font-bold text-xs md:text-sm tracking-wider text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            {brandName}
          </span>
        </Link>

        {/* Navigation Menu Items (Desktop only: hidden on mobile) */}
        <ul className="hidden md:flex items-center gap-0.5 md:gap-1">
          {data.menu_items.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => handleNav(item.target)}
                className="px-2.5 md:px-3.5 py-1.5 text-[11px] md:text-xs font-semibold rounded-full text-slate-300 hover:text-white bg-transparent hover:bg-white/[0.08] hover:backdrop-blur-xl hover:border hover:border-white/20 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-200 whitespace-nowrap cursor-pointer"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Quick Search (Cmd+K) Glass Button */}
        <button
          onClick={openCommandPalette}
          className="px-2 py-1.5 md:px-3 md:py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] backdrop-blur-xl border border-white/15 hover:border-white/35 text-slate-300 hover:text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-200 flex items-center gap-1.5 text-xs group cursor-pointer shrink-0"
          title="Search or Quick Navigation (Ctrl+K)"
          aria-label="Search command palette"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="hidden lg:inline text-[9px] font-mono border border-white/20 px-1.5 py-0.5 rounded-md bg-white/[0.06] text-slate-300 shadow-inner">
            ⌘K
          </span>
        </button>

        {/* Tactile Cyber Audio Switch */}
        <SoundToggle compact />

        {/* Hire Me Glass Jewel CTA Button */}
        <button
          onClick={() => {
            setMobileOpen(false);
            navigate("/hire-me");
          }}
          className="relative group text-white text-[11px] md:text-sm font-bold px-3 md:px-5 py-1 md:py-2 rounded-full border border-white/30 hover:border-white/60 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_0_35px_rgba(14,165,233,0.6)] overflow-hidden whitespace-nowrap flex items-center justify-center cursor-pointer shrink-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.20) 0%, rgba(37, 99, 235, 0.35) 50%, rgba(14, 165, 233, 0.22) 100%)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* Subtle top specular glossy reflection */}
          <span
            aria-hidden="true"
            className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none"
          />
          {/* Shimmer light sweep on hover */}
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
          />
          <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">Hire Me</span>
        </button>

        {/* Mobile Hamburger Toggle Button (Mobile only) */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden w-9 h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.16] active:bg-white/[0.22] border border-white/20 text-slate-200 hover:text-white backdrop-blur-xl transition-all duration-200 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] cursor-pointer shrink-0"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <motion.div
            animate={{ rotate: mobileOpen ? 90 : 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
          >
            {mobileOpen ? (
              <X className="w-4 h-4 text-cyan-300" />
            ) : (
              <Menu className="w-4 h-4 text-cyan-300" />
            )}
          </motion.div>
        </motion.button>
      </nav>

      {/* Mobile Drawer Sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="w-full max-w-[340px] mt-2 rounded-2xl p-3.5 border border-white/20 backdrop-blur-2xl bg-[#090D1A]/95 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(37,99,235,0.4),inset_0_1px_1px_rgba(255,255,255,0.25)] md:hidden flex flex-col gap-1.5"
          >
            {/* Navigation links with smooth cascade */}
            <div className="flex flex-col gap-0.5">
              {data.menu_items.map((item, idx) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.035, duration: 0.25 }}
                  whileTap={{ scale: 0.97, x: 4 }}
                  onClick={() => handleNav(item.target)}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/[0.08] active:bg-cyan-500/15 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all" />
                    <span>{item.label}</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400/50 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
                </motion.button>
              ))}
            </div>


            <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent my-1" />

            {/* Quick Actions in Mobile Menu */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setMobileOpen(false);
                  openBookingModal("Free AI Audit Strategy Session");
                }}
                className="w-full py-2.5 px-2.5 rounded-xl border border-white/20 bg-white/[0.08] hover:bg-white/[0.15] text-[11px] font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:border-cyan-400/50"
              >
                <Calendar className="w-3.5 h-3.5 text-cyan-300" />
                <span>Book Call</span>
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/hire-me");
                }}
                className="w-full py-2.5 px-2.5 rounded-xl border border-white/30 text-[11px] font-bold text-white flex items-center justify-center gap-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_0_20px_rgba(59,130,246,0.4)] transition-all cursor-pointer relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.20) 0%, rgba(37, 99, 235, 0.40) 50%, rgba(14, 165, 233, 0.25) 100%)",
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                <span>Hire Me</span>
              </motion.button>
            </div>

            {/* Mobile Tactile Audio Toggle */}
            <div className="pt-0.5">
              <SoundToggle className="w-full justify-center py-2" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
