import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(80),
  email: z.string().trim().email("Invalid email").max(200),
  body: z.string().trim().min(1, "Comment required").max(2000),
});

type Comment = { id: string; name: string; body: string; created_at: string };

export default function BlogComments({ postId }: { postId: string }) {
  const [list, setList] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("blog_comments")
      .select("id,name,body,created_at")
      .eq("post_id", postId)
      .eq("approved", true)
      .order("created_at", { ascending: false });
    setList((data as Comment[]) || []);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [postId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, email, body });
    if (!parsed.success) {
      return toast.error(parsed.error.issues[0].message);
    }
    setSubmitting(true);
    const { error } = await supabase.from("blog_comments").insert({
      post_id: postId,
      name: parsed.data.name,
      email: parsed.data.email,
      body: parsed.data.body,
      approved: false,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Comment submitted — awaiting moderation");
    setName(""); setEmail(""); setBody("");
  };

  const inputCls = "w-full bg-input/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl px-4 py-2.5 outline-none transition text-sm";

  return (
    <section className="mt-16 border-t border-border/50 pt-10">
      <h2 className="font-display text-2xl font-bold mb-6">Comments ({list.length})</h2>

      <form onSubmit={submit} className="glass-strong rounded-2xl p-5 space-y-3 mb-8">
        <div className="grid sm:grid-cols-2 gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={80} className={inputCls} required />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (not published)" maxLength={200} className={inputCls} required />
        </div>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your comment…" rows={4} maxLength={2000} className={inputCls + " resize-y"} required />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Comments are moderated before publishing.</p>
          <button type="submit" disabled={submitting} className="bg-gradient-primary text-white font-semibold px-5 py-2.5 rounded-xl neon-glow hover:scale-[1.02] transition-transform disabled:opacity-60 text-sm">
            {submitting ? "Submitting…" : "Post Comment"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {list.length === 0 && <p className="text-sm text-muted-foreground">Be the first to comment.</p>}
        {list.map((c) => (
          <article key={c.id} className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span className="font-semibold text-foreground">{c.name}</span>
              <span>·</span>
              <span>{new Date(c.created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-sm whitespace-pre-wrap text-foreground/90">{c.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}