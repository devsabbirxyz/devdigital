import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, ArrowUp, ArrowDown, Save, X } from "lucide-react";
import { PageHeader, Card, Field, inputCls, PrimaryBtn, GhostBtn, DangerBtn } from "./_ui";
import { logActivity } from "@/lib/activityLog";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  active: boolean;
};

const EMPTY: Omit<FAQ, "id"> = { question: "", answer: "", sort_order: 0, active: true };

export default function FaqAdmin() {
  const [rows, setRows] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("faqs").select("*").order("sort_order", { ascending: true });
    setRows((data ?? []) as FAQ[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startCreate = () => {
    setForm({ ...EMPTY, sort_order: (rows.at(-1)?.sort_order ?? 0) + 1 });
    setEditing(null);
    setCreating(true);
  };

  const startEdit = (r: FAQ) => {
    setForm({ question: r.question, answer: r.answer, sort_order: r.sort_order, active: r.active });
    setEditing(r);
    setCreating(false);
  };

  const cancel = () => { setEditing(null); setCreating(false); };

  const save = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Question এবং Answer দুটোই দিতে হবে");
      return;
    }
    if (editing) {
      const { error } = await supabase.from("faqs").update(form).eq("id", editing.id);
      if (error) return toast.error(error.message);
      await logActivity("faq.update", "faqs", { id: editing.id });
      toast.success("FAQ updated");
    } else {
      const { error } = await supabase.from("faqs").insert(form);
      if (error) return toast.error(error.message);
      await logActivity("faq.create", "faqs", { question: form.question });
      toast.success("FAQ created");
    }
    cancel();
    load();
  };

  const remove = async (r: FAQ) => {
    if (!confirm(`Delete this FAQ?`)) return;
    const { error } = await supabase.from("faqs").delete().eq("id", r.id);
    if (error) return toast.error(error.message);
    await logActivity("faq.delete", "faqs", { id: r.id });
    toast.success("Deleted");
    load();
  };

  const move = async (r: FAQ, dir: -1 | 1) => {
    const idx = rows.findIndex(x => x.id === r.id);
    const swap = rows[idx + dir];
    if (!swap) return;
    await supabase.from("faqs").update({ sort_order: swap.sort_order }).eq("id", r.id);
    await supabase.from("faqs").update({ sort_order: r.sort_order }).eq("id", swap.id);
    load();
  };

  const toggleActive = async (r: FAQ) => {
    await supabase.from("faqs").update({ active: !r.active }).eq("id", r.id);
    load();
  };

  const showForm = creating || editing;

  return (
    <div>
      <PageHeader
        title="FAQ"
        description="সাধারণ জিজ্ঞাসা সেকশনের প্রশ্ন ও উত্তর ম্যানেজ করুন"
        action={!showForm && <PrimaryBtn onClick={startCreate}><Plus className="h-4 w-4" /> Add FAQ</PrimaryBtn>}
      />

      {showForm && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">{editing ? "Edit FAQ" : "New FAQ"}</h3>
            <GhostBtn onClick={cancel}><X className="h-4 w-4" /></GhostBtn>
          </div>
          <div className="space-y-4">
            <Field label="Question">
              <input className={inputCls} value={form.question}
                onChange={e => setForm({ ...form, question: e.target.value })} />
            </Field>
            <Field label="Answer">
              <textarea rows={5} className={inputCls} value={form.answer}
                onChange={e => setForm({ ...form, answer: e.target.value })} />
            </Field>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Sort order">
                <input type="number" className={inputCls} value={form.sort_order}
                  onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
              </Field>
              <label className="flex items-center gap-2 text-sm pt-7">
                <input type="checkbox" checked={form.active}
                  onChange={e => setForm({ ...form, active: e.target.checked })} />
                Active (visible on site)
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <PrimaryBtn onClick={save}><Save className="h-4 w-4" /> Save</PrimaryBtn>
            <GhostBtn onClick={cancel}>Cancel</GhostBtn>
          </div>
        </Card>
      )}

      <Card>
        {loading ? (
          <div className="text-muted-foreground text-sm">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="text-muted-foreground text-sm">No FAQs yet. Click "Add FAQ".</div>
        ) : (
          <div className="space-y-2">
            {rows.map((r, i) => (
              <div key={r.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-border/40">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{r.question}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2 mt-1">{r.answer}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    order {r.sort_order} {r.active ? "" : "· hidden"}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => move(r, -1)} disabled={i === 0}
                    className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                  <button onClick={() => move(r, 1)} disabled={i === rows.length - 1}
                    className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                  <GhostBtn onClick={() => toggleActive(r)}>{r.active ? "Hide" : "Show"}</GhostBtn>
                  <GhostBtn onClick={() => startEdit(r)}>Edit</GhostBtn>
                  <DangerBtn onClick={() => remove(r)}><Trash2 className="h-4 w-4" /></DangerBtn>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}