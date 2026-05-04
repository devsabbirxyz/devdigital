import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminPlaceholder() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    document.title = "Admin — Portfolio";
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setEmail(session.user.email ?? "");
    });
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

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="container max-w-4xl">
        <header className="flex items-center justify-between mb-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center neon-glow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold tracking-wider">ADMIN</span>
          </Link>
          <button onClick={signOut} className="glass-strong rounded-full px-4 py-2 text-sm font-medium inline-flex items-center gap-2 hover:scale-105 transition">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </header>

        <div className="glass-strong rounded-3xl p-8 md:p-12 text-center shadow-glow-soft">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-6 neon-glow">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Welcome, <span className="text-gradient">{email}</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            🚀 Phase 1 complete — your site is live! The full admin dashboard with all 11 settings sections (navigation, hero, about, services, projects manager, pricing, contact submissions, footer, WhatsApp, intro video, admin users) will be built in <strong className="text-foreground">Phase 2</strong>.
          </p>
          <Link
            to="/"
            className="inline-block mt-6 bg-gradient-primary text-white font-semibold px-6 py-3 rounded-full neon-glow hover:scale-105 transition"
          >
            View Site
          </Link>
        </div>
      </div>
    </main>
  );
}
