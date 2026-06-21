import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  LayoutDashboard, FolderKanban, Sparkles, DollarSign, Image as ImageIcon,
  Settings, Mail, Users, LogOut, Menu, X, Compass, User, MessageCircle, Video, Phone, Newspaper, Briefcase, History, Search, MessagesSquare,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import Dashboard from "./Dashboard";
import Navigation from "./Navigation";
import HeroAdmin from "./HeroAdmin";
import AboutAdmin from "./About";
import ServicesAdmin from "./Services";
import ProjectsAdmin from "./ProjectsAdmin";
import PricingAdmin from "./PricingAdmin";
import ContactInfoAdmin from "./ContactInfo";
import Submissions from "./Submissions";
import FooterAdmin from "./FooterAdmin";
import WhatsAppAdmin from "./WhatsAppAdmin";
import IntroVideoAdmin from "./IntroVideoAdmin";
import AdminUsers from "./AdminUsers";
import BlogAdmin from "./BlogAdmin";
import ServicePagesAdmin from "./ServicePagesAdmin";
import BrandingAdmin from "./BrandingAdmin";
import ActivityLogAdmin from "./ActivityLogAdmin";
import PageSeoAdmin from "./PageSeoAdmin";
import CommentsAdmin from "./CommentsAdmin";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, Component: Dashboard },
  { id: "navigation", label: "Navigation", icon: Compass, Component: Navigation },
  { id: "branding", label: "Branding", icon: ImageIcon, Component: BrandingAdmin },
  { id: "hero", label: "Hero Section", icon: ImageIcon, Component: HeroAdmin },
  { id: "about", label: "About", icon: User, Component: AboutAdmin },
  { id: "services", label: "Services", icon: Sparkles, Component: ServicesAdmin },
  { id: "projects", label: "Projects", icon: FolderKanban, Component: ProjectsAdmin },
  { id: "pricing", label: "Pricing", icon: DollarSign, Component: PricingAdmin },
  { id: "blog", label: "Blog", icon: Newspaper, Component: BlogAdmin },
  { id: "comments", label: "Comments", icon: MessagesSquare, Component: CommentsAdmin },
  { id: "seo", label: "SEO Meta", icon: Search, Component: PageSeoAdmin },
  { id: "contact", label: "Contact Info", icon: Phone, Component: ContactInfoAdmin },
  { id: "submissions", label: "Submissions", icon: Mail, Component: Submissions },
  { id: "footer", label: "Footer", icon: Settings, Component: FooterAdmin },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, Component: WhatsAppAdmin },
  { id: "intro-video", label: "Intro Video", icon: Video, Component: IntroVideoAdmin },
  { id: "service-pages", label: "Service Pages", icon: Briefcase, Component: ServicePagesAdmin },
  { id: "users", label: "Admin Users", icon: Users, Component: AdminUsers },
  { id: "activity", label: "Activity Log", icon: History, Component: ActivityLogAdmin },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const activeId = params.get("tab") ?? "dashboard";
  const Active = TABS.find((t) => t.id === activeId)?.Component ?? Dashboard;

  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.title = "Admin — Portfolio";
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      setEmail(session.user.email ?? "");
      const { data: roles, error } = await supabase
        .from("user_roles").select("role")
        .eq("user_id", session.user.id).eq("role", "admin").limit(1);
      if (error || !roles?.length) {
        toast.error("Admin access required");
        await supabase.auth.signOut();
        navigate("/auth");
        return;
      }
      setAllowed(true);
      setChecking(false);
    };
    init();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/auth");
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/");
  };

  const selectTab = (id: string) => {
    setParams(id === "dashboard" ? {} : { tab: id });
    setOpen(false);
  };

  if (checking || !allowed) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading…</div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 z-40 transform transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full glass-strong border-r border-border/50 flex flex-col">
          <div className="p-5 border-b border-border/50 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center neon-glow">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-display font-bold tracking-wider text-sm">ADMIN</p>
                <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">{email}</p>
              </div>
            </Link>
            <button onClick={() => setOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-white/5" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {TABS.map((t) => {
              const isActive = t.id === activeId;
              return (
                <button
                  key={t.id}
                  onClick={() => selectTab(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    isActive
                      ? "bg-gradient-primary text-white shadow-glow-soft"
                      : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <t.icon className="h-4 w-4 flex-shrink-0" />
                  {t.label}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border/50 space-y-1">
            <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-white/5 transition">
              <Compass className="h-4 w-4" /> View Site
            </Link>
            <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-20 glass-strong border-b border-border/50 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-white/5" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display font-bold tracking-wider text-sm">ADMIN</span>
          <div className="w-9" />
        </header>

        <main className="p-5 md:p-8 max-w-6xl">
          <Active />
        </main>
      </div>
    </div>
  );
}
