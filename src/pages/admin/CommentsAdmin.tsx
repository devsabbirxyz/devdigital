import { useEffect, useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader, Card, GhostBtn } from "./_ui";

type Row = {
  id: string;
  post_id: string;
  name: string;
  email: string;
  body: string;
  approved: boolean;
  created_at: string;
  blog_posts?: { title: string; slug: string } | null;
};

export default function CommentsAdmin() {
  const [list, setList] = useState<Row[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending");

  const load = async () => {
    let q = supabase
      .from("blog_comments")
      .select("*, blog_posts(title, slug)")
      .order("created_at", { ascending: false })
      .limit(500);
    if (filter === "pending") q = q.eq("approved", false);
    if (filter === "approved") q = q.eq("approved", true);
    const { data } = await q;
    setList((data as any) || []);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

  const approve = async (id: string) => {
    const { error } = await supabase.from("blog_comments").update({ approved: true }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Approved");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this comment?")) return;
    const { error } = await supabase.from("blog_comments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <>
      <PageHeader title="Blog Comments" description="Moderate reader comments." />
      <div className="flex gap-2 mb-4">
        {(["pending", "approved", "all"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === f ? "bg-gradient-primary text-white" : "glass hover:bg-white/5"}`}>
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {list.length === 0 && <p className="text-muted-foreground text-sm">No comments.</p>}
        {list.map((c) => (
          <Card key={c.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span className="font-semibold text-foreground">{c.name}</span>
                  <span>·</span>
                  <span>{c.email}</span>
                  <span>·</span>
                  <span>{new Date(c.created_at).toLocaleString()}</span>
                  {!c.approved && <span className="ml-1 px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-400">pending</span>}
                </div>
                {c.blog_posts && (
                  <p className="text-xs text-primary mb-1">on: {c.blog_posts.title}</p>
                )}
                <p className="text-sm whitespace-pre-wrap">{c.body}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {!c.approved && (
                  <button onClick={() => approve(c.id)} className="p-1.5 rounded-lg hover:bg-green-500/10 text-green-400" title="Approve">
                    <Check className="h-3.5 w-3.5" />
                  </button>
                )}
                <button onClick={() => remove(c.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}