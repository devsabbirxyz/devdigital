import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FolderKanban, Sparkles, DollarSign, Image as ImageIcon,
  Settings, Mail, Users, LogOut, Menu, X, Compass, User, MessageCircle, Video, Phone,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NAV = [
  { to: "/admin", end: true, label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/navigation", label: "Navigation", icon: Compass },
  { to: "/admin/hero", label: "Hero Section", icon: ImageIcon },
  { to: "/admin/about", label: "About", icon: User },
  { to: "/admin/services", label: "Services", icon: Sparkles },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/pricing", label: "Pricing", icon: DollarSign },
  { to: "/admin/contact", label: "Contact Info", icon: Phone },
  { to: "/admin/submissions", label: "Submissions", icon: Mail },
  { to: "/admin/footer", label: "Footer", icon: Settings },
  { to: "/admin/whatsapp", label: "WhatsApp", icon: MessageCircle },
  { to: "/admin/intro-video", label: "Intro Video", icon: Video },
  { to: "/admin/users", label: "Admin Users", icon: Users },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.title = "Admin — Portfolio";
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setEmail(session.user.email ?? "");
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      });
      if (!isAdmin) {
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

  if (checking || !allowed) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading…</div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
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
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/5"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-primary text-white shadow-glow-soft"
                      : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                  }`
                }
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="p-3 border-t border-border/50 space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-white/5 transition"
            >
              <Compass className="h-4 w-4" /> View Site
            </Link>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-20 glass-strong border-b border-border/50 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-white/5"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display font-bold tracking-wider text-sm">ADMIN</span>
          <div className="w-9" />
        </header>

        <main className="p-5 md:p-8 max-w-6xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}