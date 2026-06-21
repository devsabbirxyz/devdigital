import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, ArrowUp, ArrowDown, Save, X } from "lucide-react";
import { PageHeader, Card, Field, inputCls, PrimaryBtn, GhostBtn, DangerBtn } from "./_ui";
import { logActivity } from "@/lib/activityLog";

type Stat = {
  id: string;
  value: number;
  suffix: string;
  title: string;
  description: string | null;
  icon: string;
  sort_order: number;
  active: boolean;
};

const ICONS = [
  "FolderCheck", "PackageCheck", "Rocket", "Globe", "Layers", "Code2",
  "HeartHandshake", "UsersRound", "Heart", "Handshake", "Users", "Smile",
  "CalendarDays", "CalendarClock", "Timer", "History", "Clock",
  "ShieldCheck", "BadgeCheck", "Shield", "CheckCircle2", "Award",
  "Gem", "Crown", "Diamond", "Medal", "Trophy", "Star", "Sparkles",
  "Zap", "Target", "TrendingUp", "ThumbsUp", "Briefcase",
];

const EMPTY: Omit<Stat, "id"> = {
  value: 0, suffix: "+", title: "", description: "", icon: "Sparkles", sort_order: 0, active: true,
};

export default function StatsAdmin() {
  const [rows, setRows] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Stat | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("stats").select("*").order("sort_order", { ascending: true });
    setRows((data ?? []) as Stat[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startCreate = () => {
    setForm({ ...EMPTY, sort_order: (rows.at(-1)?.sort_order ?? 0) + 1 });
    setEditing(null);
    setCreating(true);
  };

  const startEdit = (r: Stat) => {
    setForm({
      value: r.value, suffix: r.suffix, title: r.title,
      description: r.description ?? "", icon: r.icon,
      sort_order: r.sort_order, active: r.active,
    });
    setEditing(r);
    setCreating(false);
  };

  const cancel = () => { setEditing(null); setCreating(false); };

  const save = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (editing) {
      const { error } = await supabase.from("stats").update(form).eq("id", editing.id);
      if (error) return toast.error(error.message);
      await logActivity("stat.update", "stats", { id: editing.id, title: form.title });
      toast.success("Stat updated");
    } else {
      const { error } = await supabase.from("stats").insert(form);
      if (error) return toast.error(error.message);
      await logActivity("stat.create", "stats", { title: form.title });
      toast.success("Stat created");
    }
    cancel();
    load();
  };

  const remove = async (r: Stat) => {
    if (!confirm(`Delete "${r.title}"?`)) return;
    const { error } = await supabase.from("stats").delete().eq("id", r.id);
    if (error) return toast.error(error.message);
    await logActivity("stat.delete", "stats", { id: r.id, title: r.title });
    toast.success("Deleted");
    load();
  };

  const move = async (r: Stat, dir: -1 | 1) => {
    const idx = rows.findIndex(x => x.id === r.id);
    const swap = rows[idx + dir];
    if (!swap) return;
    await supabase.from("stats").update({ sort_order: swap.sort_order }).eq("id", r.id);
    await supabase.from("stats").update({ sort_order: r.sort_order }).eq("id", swap.id);
    load();
  };

  const toggleActive = async (r: Stat) => {
    await supabase.from("stats").update({ active: !r.active }).eq("id", r.id);
    load();
  };

  const showForm = creating || editing;

  return (
    <div>
      <PageHeader
        title="Stats"
        description="হোমপেজের আমার অর্জন সেকশনের counter কার্ডগুলো ম্যানেজ করুন"
        action={!showForm && <PrimaryBtn onClick={startCreate}><Plus className="h-4 w-4" /> Add Stat</PrimaryBtn>}
      />

      {showForm && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">{editing ? "Edit Stat" : "New Stat"}</h3>
            <GhostBtn onClick={cancel}><X className="h-4 w-4" /></GhostBtn>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Value (number)">
              <input type="number" className={inputCls} value={form.value}
                onChange={e => setForm({ ...form, value: parseInt(e.target.value) || 0 })} />
            </Field>
            <Field label="Suffix" hint='যেমন: "+" বা "%" বা খালি'>
              <input className={inputCls} value={form.suffix}
                onChange={e => setForm({ ...form, suffix: e.target.value })} />
            </Field>
            <Field label="Title">
              <input className={inputCls} value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="Icon">
              <select className={inputCls} value={form.icon}
                onChange={e => setForm({ ...form, icon: e.target.value })}>
                {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </Field>
            <Field label="Description (optional)">
              <input className={inputCls} value={form.description ?? ""}
                onChange={e => setForm({ ...form, description: e.target.value })} />
            </Field>
            <Field label="Sort order">
              <input type="number" className={inputCls} value={form.sort_order}
                onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active}
                onChange={e => setForm({ ...form, active: e.target.checked })} />
              Active (visible on site)
            </label>
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
          <div className="text-muted-foreground text-sm">No stats yet. Click "Add Stat".</div>
        ) : (
          <div className="space-y-2">
            {rows.map((r, i) => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-border/40">
                <div className="font-display text-2xl font-bold text-gradient w-20 text-center">
                  {r.value}{r.suffix}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{r.title}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {r.icon} · order {r.sort_order} {r.active ? "" : "· hidden"}
                  </div>
                </div>
                <button onClick={() => move(r, -1)} disabled={i === 0}
                  className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                <button onClick={() => move(r, 1)} disabled={i === rows.length - 1}
                  className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                <GhostBtn onClick={() => toggleActive(r)}>{r.active ? "Hide" : "Show"}</GhostBtn>
                <GhostBtn onClick={() => startEdit(r)}>Edit</GhostBtn>
                <DangerBtn onClick={() => remove(r)}><Trash2 className="h-4 w-4" /></DangerBtn>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}