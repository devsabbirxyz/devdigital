import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  TrendingUp,
  Code2,
  Bot,
  Briefcase,
  Download,
  Phone,
  Mail,
  Home,
  DollarSign,
  HelpCircle,
  Copy,
  ExternalLink,
  Sparkles,
  Terminal,
  BookOpen,
  Calculator,
  Newspaper,
  Play,
  Calendar,
} from "lucide-react";
import { openLeadMagnet } from "./LeadMagnetModal";
import { openAiTerminal } from "./AiTerminal";
import { openIntroVideo } from "./IntroVideoModal";
import { openBookingModal } from "./BookingModal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent("open-command-palette"));
}

type CommandItem = {
  id: string;
  title: string;
  subtitle?: string;
  category: "Services" | "Navigation" | "Actions" | "Projects";
  icon: any;
  action: () => void;
};

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [projects, setProjects] = useState<Array<{ id: string; title: string; description: string }>>([]);
  const navigate = useNavigate();

  // Listen for keyboard shortcuts (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setQuery("");
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
      setQuery("");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isOpen]);

  // Fetch recent projects once for live search
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, title, description")
        .limit(10);
      if (data) setProjects(data);
    })();
  }, []);

  // Built-in command list
  const baseCommands: CommandItem[] = useMemo(
    () => [
      // Services
      {
        id: "srv-dm",
        title: "Digital Marketing Services",
        subtitle: "Paid ads, ROAS scale & SEO",
        category: "Services",
        icon: TrendingUp,
        action: () => {
          navigate("/digitalmarketingservice");
          setIsOpen(false);
        },
      },
      {
        id: "srv-wd",
        title: "Web Development",
        subtitle: "Next.js, React, TypeScript & Full-Stack",
        category: "Services",
        icon: Code2,
        action: () => {
          navigate("/webdev");
          setIsOpen(false);
        },
      },
      {
        id: "srv-ai",
        title: "AI Automation",
        subtitle: "Autonomous bots, n8n & API workflows",
        category: "Services",
        icon: Bot,
        action: () => {
          navigate("/aiautomation");
          setIsOpen(false);
        },
      },

      // Navigation
      {
        id: "nav-home",
        title: "Home",
        subtitle: "Return to homepage",
        category: "Navigation",
        icon: Home,
        action: () => {
          navigate("/");
          setIsOpen(false);
        },
      },
      {
        id: "nav-projects",
        title: "All Projects & Portfolio",
        subtitle: "Explore completed case studies",
        category: "Navigation",
        icon: Briefcase,
        action: () => {
          navigate("/projects");
          setIsOpen(false);
        },
      },
      {
        id: "nav-hire",
        title: "Hire Me / Project Estimator",
        subtitle: "Multi-step scope & custom quote",
        category: "Navigation",
        icon: Sparkles,
        action: () => {
          navigate("/hire-me");
          setIsOpen(false);
        },
      },

      {
        id: "nav-pricing",
        title: "Investment Plans & Pricing",
        subtitle: "Predictable monthly retainer & turnkey project packages",
        category: "Navigation",
        icon: DollarSign,
        action: () => {
          navigate("/#pricing");
          setIsOpen(false);
          setTimeout(() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }), 100);
        },
      },
      {
        id: "nav-roi-calc",
        title: "Interactive ROI & Growth Calculator",
        subtitle: "Simulate projected revenue lift & payback period (BDT / USD)",
        category: "Navigation",
        icon: Calculator,
        action: () => {
          navigate("/#roi-calculator");
          setIsOpen(false);
          setTimeout(() => document.getElementById("roi-calculator")?.scrollIntoView({ behavior: "smooth" }), 100);
        },
      },
      {
        id: "nav-blog",
        title: "Industry Insights & Blog",
        subtitle: "Latest playbooks on Meta Ads, AI, and Next.js CRO",
        category: "Navigation",
        icon: Newspaper,
        action: () => {
          navigate("/#blog");
          setIsOpen(false);
          setTimeout(() => document.getElementById("blog")?.scrollIntoView({ behavior: "smooth" }), 100);
        },
      },
      {
        id: "act-book-call",
        title: "Book a 15-Minute Strategy Call",
        subtitle: "Schedule a 1-on-1 discovery meeting with Sabbir via Google Meet",
        category: "Actions",
        icon: Calendar,
        action: () => {
          setIsOpen(false);
          openBookingModal();
        },
      },
      {
        id: "nav-estimator",
        title: "Project Scope & Budget Estimator",
        subtitle: "Instant interactive 3-step quote configurator",
        category: "Navigation",
        icon: Calculator,
        action: () => {
          navigate("/#estimator");
          setIsOpen(false);
          setTimeout(() => document.getElementById("estimator")?.scrollIntoView({ behavior: "smooth" }), 100);
        },
      },
      {
        id: "act-intro-video",
        title: "Watch 60-Second Video Pitch",
        subtitle: "Quick video intro from Sabbir (Founder)",
        category: "Actions",
        icon: Play,
        action: () => {
          setIsOpen(false);
          openIntroVideo();
        },
      },
      {
        id: "nav-blueprint",
        title: "2026 Growth Blueprint",
        subtitle: "Free 28-page tactical strategy guide",
        category: "Navigation",
        icon: BookOpen,
        action: () => {
          navigate("/#blueprint");
          setIsOpen(false);
          setTimeout(() => document.getElementById("blueprint")?.scrollIntoView({ behavior: "smooth" }), 100);
        },
      },
      {
        id: "nav-faq",
        title: "Frequently Asked Questions",
        subtitle: "Common questions & timelines",
        category: "Navigation",
        icon: HelpCircle,
        action: () => {
          navigate("/#faq");
          setIsOpen(false);
          setTimeout(() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" }), 100);
        },
      },

      // Actions
      {
        id: "act-ai-terminal",
        title: "Open AI Strategy Terminal (v2.6)",
        subtitle: "Audit Meta/Google Ads, estimate web stack, & simulate ROI (⌘J)",
        category: "Actions",
        icon: Terminal,
        action: () => {
          setIsOpen(false);
          setTimeout(() => openAiTerminal(), 120);
        },
      },
      {
        id: "act-blueprint",
        title: "Download 2026 Growth Blueprint (Free PDF)",
        subtitle: "Tactical 28-page ad & tech guide",
        category: "Actions",
        icon: Download,
        action: () => {
          setIsOpen(false);
          openLeadMagnet();
        },
      },
      {
        id: "act-whatsapp",
        title: "Chat with Sabbir on WhatsApp",
        subtitle: "Direct instant consultation",
        category: "Actions",
        icon: Phone,
        action: () => {
          window.open("https://wa.me/8801941130981", "_blank");
          setIsOpen(false);
        },
      },
      {
        id: "act-copy-email",
        title: "Copy Email Address",
        subtitle: "developersabbir.x@gmail.com",
        category: "Actions",
        icon: Copy,
        action: () => {
          navigator.clipboard.writeText("developersabbir.x@gmail.com");
          toast.success("✓ Email copied to clipboard!");
          setIsOpen(false);
        },
      },
      {
        id: "act-contact",
        title: "Book Strategy Call / Contact Form",
        subtitle: "Send a direct project inquiry",
        category: "Actions",
        icon: Mail,
        action: () => {
          navigate("/#contact");
          setIsOpen(false);
          setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 100);
        },
      },
    ],
    [navigate]
  );

  // Dynamic project commands
  const projectCommands: CommandItem[] = useMemo(() => {
    return projects.map((p) => ({
      id: `proj-${p.id}`,
      title: p.title,
      subtitle: p.description?.slice(0, 50) + "...",
      category: "Projects" as const,
      icon: ExternalLink,
      action: () => {
        navigate("/projects");
        setIsOpen(false);
      },
    }));
  }, [projects, navigate]);

  // Combined and filtered commands
  const filteredCommands = useMemo(() => {
    const all = [...baseCommands, ...projectCommands];
    if (!query.trim()) return all;
    const q = query.toLowerCase().trim();
    return all.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subtitle?.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [baseCommands, projectCommands, query]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Arrow key navigation inside command palette
  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 pb-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Palette Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            onKeyDown={handleKeyNavigation}
            className="relative z-10 w-full max-w-xl bg-neutral-950/95 rounded-2xl overflow-hidden ring-1 ring-white/15 shadow-2xl glass-strong flex flex-col max-h-[75vh]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
              <Search className="w-4 h-4 text-primary shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, page, service or project..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/20 text-muted-foreground shrink-0">
                ESC
              </span>
            </div>

            {/* Results List */}
            <div className="overflow-y-auto p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No matching results found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                filteredCommands.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                        isSelected
                          ? "bg-primary/20 text-white ring-1 ring-primary/50 shadow-sm"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-1.5 rounded-lg shrink-0 ${
                            isSelected ? "bg-primary text-white" : "glass text-primary"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs sm:text-sm font-semibold truncate ${isSelected ? "text-white" : "text-foreground"}`}>
                            {item.title}
                          </p>
                          {item.subtitle && (
                            <p className="text-[11px] text-muted-foreground truncate">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full glass text-muted-foreground">
                          {item.category}
                        </span>
                        {isSelected && <ArrowRight className="w-3.5 h-3.5 text-primary" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Bottom Keyboard Hint Bar */}
            <div className="px-4 py-2 bg-neutral-900/60 border-t border-white/10 flex items-center justify-between text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">↓</kbd> Navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">↵</kbd> Select
                </span>
              </div>
              <span className="text-[10px] font-semibold text-primary/80">
                DevDigital Spotlight
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
