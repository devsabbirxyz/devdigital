import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader, Card, GhostBtn } from "./_ui";

type Submission = {
  id: string; name: string; email: string; phone: string | null;
  message: string; plan: string | null; read: boolean; created_at: string;
};

export default function Submissions() {
  const [list, setList] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const load = async () => {
    const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    setList((data as Submission[]) || []);
  };
  useEffect(() => { load(); }, []);

  const toggleRead = async (s: Submission) => {
    const { error } = await supabase.from("contact_submissions").update({ read: !s.read }).eq("id", s.id);
    if (error) return toast.error(error.message);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const visible = list.filter((s) => filter === "all" || !s.read);

  const exportCsv = () => {
    if (list.length === 0) return toast.error("No submissions to export");
    const headers = ["Date", "Name", "Email", "Phone", "Plan", "Read", "Message"];
    const escape = (v: unknown) => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = list.map((s) => [
      new Date(s.created_at).toISOString(),
      s.name, s.email, s.phone ?? "", s.plan ?? "",
      s.read ? "yes" : "no", s.message,
    ].map(escape).join(","));
    const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${list.length} submissions`);
  };

  return (
    <>
      <PageHeader
        title="Form Submissions"
        description={`${list.length} total · ${list.filter((s) => !s.read).length} unread`}
        action={
          <div className="flex items-center gap-2">
            <GhostBtn onClick={exportCsv}>
              <Download className="h-4 w-4 inline mr-1.5" /> Export CSV
            </GhostBtn>
            <div className="flex gap-1 glass rounded-xl p-1">
            {(["all", "unread"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm rounded-lg capitalize transition ${
                  filter === f ? "bg-gradient-primary text-white" : "hover:bg-white/5"
                }`}
              >
                {f}
              </button>
            ))}
            </div>
          </div>
        }
      />
      <div className="space-y-3">
        {visible.length === 0 && <p className="text-muted-foreground text-sm">No submissions.</p>}
        {visible.map((s) => (
          <Card key={s.id} className={!s.read ? "ring-1 ring-primary/30" : ""}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{s.name}</h3>
                  <a href={`mailto:${s.email}`} className="text-xs text-primary hover:underline">{s.email}</a>
                  {s.phone && <span className="text-xs text-muted-foreground">· {s.phone}</span>}
                  {s.plan && <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">{s.plan}</span>}
                  {!s.read && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-white font-bold">NEW</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{new Date(s.created_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => toggleRead(s)} className="p-2 rounded-lg hover:bg-white/5" aria-label="Toggle read">
                  {s.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4 text-primary" />}
                </button>
                <button onClick={() => remove(s.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap">{s.message}</p>
          </Card>
        ))}
      </div>
    </>
  );
}