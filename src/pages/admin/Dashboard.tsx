import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderKanban, Sparkles, DollarSign, Mail, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, Card } from "./_ui";

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, services: 0, plans: 0, submissions: 0, unread: 0 });

  useEffect(() => {
    (async () => {
      const [p, s, pl, sub, unread] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("services").select("*", { count: "exact", head: true }),
        supabase.from("pricing_plans").select("*", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("read", false),
      ]);
      setStats({
        projects: p.count ?? 0,
        services: s.count ?? 0,
        plans: pl.count ?? 0,
        submissions: sub.count ?? 0,
        unread: unread.count ?? 0,
      });
    })();
  }, []);

  const tiles = [
    { label: "Projects", value: stats.projects, icon: FolderKanban, to: "/admin/projects" },
    { label: "Services", value: stats.services, icon: Sparkles, to: "/admin/services" },
    { label: "Pricing Plans", value: stats.plans, icon: DollarSign, to: "/admin/pricing" },
    { label: "Submissions", value: stats.submissions, icon: Mail, to: "/admin/submissions", badge: stats.unread },
  ];

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of your portfolio site." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {tiles.map((t) => (
          <Link key={t.label} to={t.to}>
            <Card className="hover:shadow-glow-soft transition group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{t.label}</p>
                  <p className="text-3xl font-display font-bold mt-2">{t.value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center neon-glow group-hover:scale-110 transition">
                  <t.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              {!!t.badge && t.badge > 0 && (
                <p className="mt-3 text-xs text-accent font-medium">{t.badge} unread</p>
              )}
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <h2 className="font-display font-semibold text-lg mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link to="/admin/projects" className="glass rounded-xl p-4 flex items-center gap-3 hover:bg-white/5 transition">
            <FolderKanban className="h-5 w-5 text-primary" />
            <span className="font-medium text-sm">Add a project</span>
          </Link>
          <Link to="/admin/hero" className="glass rounded-xl p-4 flex items-center gap-3 hover:bg-white/5 transition">
            <ImageIcon className="h-5 w-5 text-primary" />
            <span className="font-medium text-sm">Update hero</span>
          </Link>
          <Link to="/admin/submissions" className="glass rounded-xl p-4 flex items-center gap-3 hover:bg-white/5 transition">
            <Mail className="h-5 w-5 text-primary" />
            <span className="font-medium text-sm">View submissions</span>
          </Link>
        </div>
      </Card>
    </>
  );
}