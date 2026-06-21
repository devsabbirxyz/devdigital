import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, ArrowUp, ArrowDown, Save, X } from "lucide-react";
import { PageHeader, Card, Field, inputCls, PrimaryBtn, GhostBtn, DangerBtn } from "./_ui";
import { logActivity } from "@/lib/activityLog";

type Step = {
  id: string;
  step_number: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  active: boolean;
};

type TimelineItem = { day: string; label: string; icon: string };

type Settings = {
  id: string;
  section_title: string;
  section_subtitle: string;
  timeline_title: string;
  timeline_items: TimelineItem[];
  cta_text: string;
  cta_button_label: string;
  cta_button_link: string;
  active: boolean;
};

const EMPTY_STEP: Omit<Step, "id"> = {
  step_number: "",
  title: "",
  description: "",
  icon: "Sparkles",
  sort_order: 0,
  active: true,
};

export default function ProcessAdmin() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Step | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_STEP);
  const [savingSettings, setSavingSettings] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: s }, { data: cfg }] = await Promise.all([
      supabase.from("process_steps").select("*").order("sort_order", { ascending: true }),
      supabase.from("process_settings").select("*").limit(1).maybeSingle(),
    ]);
    setSteps((s ?? []) as Step[]);
    if (cfg) {
      setSettings({
        ...cfg,
        timeline_items: Array.isArray(cfg.timeline_items)
          ? (cfg.timeline_items as unknown as TimelineItem[])
          : [],
      } as Settings);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // ---- step CRUD ----
  const startCreate = () => {
    setForm({ ...EMPTY_STEP, sort_order: (steps.at(-1)?.sort_order ?? 0) + 1 });
    setEditing(null);
    setCreating(true);
  };
  const startEdit = (r: Step) => {
    setForm({
      step_number: r.step_number, title: r.title, description: r.description,
      icon: r.icon, sort_order: r.sort_order, active: r.active,
    });
    setEditing(r);
    setCreating(false);
  };
  const cancel = () => { setEditing(null); setCreating(false); };

  const save = async () => {
    if (!form.step_number.trim() || !form.title.trim() || !form.description.trim()) {
      toast.error("Step number, title and description are required");
      return;
    }
    if (editing) {
      const { error } = await supabase.from("process_steps").update(form).eq("id", editing.id);
      if (error) return toast.error(error.message);
      await logActivity("process.step.update", "process_steps", { id: editing.id });
      toast.success("Step updated");
    } else {
      const { error } = await supabase.from("process_steps").insert(form);
      if (error) return toast.error(error.message);
      await logActivity("process.step.create", "process_steps", { title: form.title });
      toast.success("Step created");
    }
    cancel();
    load();
  };

  const remove = async (r: Step) => {
    if (!confirm("Delete this step?")) return;
    const { error } = await supabase.from("process_steps").delete().eq("id", r.id);
    if (error) return toast.error(error.message);
    await logActivity("process.step.delete", "process_steps", { id: r.id });
    toast.success("Deleted");
    load();
  };

  const move = async (r: Step, dir: -1 | 1) => {
    const idx = steps.findIndex(x => x.id === r.id);
    const swap = steps[idx + dir];
    if (!swap) return;
    await supabase.from("process_steps").update({ sort_order: swap.sort_order }).eq("id", r.id);
    await supabase.from("process_steps").update({ sort_order: r.sort_order }).eq("id", swap.id);
    load();
  };

  const toggleActive = async (r: Step) => {
    await supabase.from("process_steps").update({ active: !r.active }).eq("id", r.id);
    load();
  };

  // ---- settings ----
  const updateSetting = <K extends keyof Settings>(k: K, v: Settings[K]) => {
    if (!settings) return;
    setSettings({ ...settings, [k]: v });
  };

  const updateTimelineItem = (i: number, patch: Partial<TimelineItem>) => {
    if (!settings) return;
    const items = settings.timeline_items.map((t, idx) => idx === i ? { ...t, ...patch } : t);
    setSettings({ ...settings, timeline_items: items });
  };

  const addTimelineItem = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      timeline_items: [...settings.timeline_items, { day: "", label: "", icon: "Calendar" }],
    });
  };

  const removeTimelineItem = (i: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      timeline_items: settings.timeline_items.filter((_, idx) => idx !== i),
    });
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSavingSettings(true);
    const { error } = await supabase
      .from("process_settings")
      .update({
        section_title: settings.section_title,
        section_subtitle: settings.section_subtitle,
        timeline_title: settings.timeline_title,
        timeline_items: settings.timeline_items as any,
        cta_text: settings.cta_text,
        cta_button_label: settings.cta_button_label,
        cta_button_link: settings.cta_button_link,
        active: settings.active,
      })
      .eq("id", settings.id);
    setSavingSettings(false);
    if (error) return toast.error(error.message);
    await logActivity("process.settings.update", "process_settings", { id: settings.id });
    toast.success("Settings saved");
  };

  const showForm = creating || editing;

  return (
    <div>
      <PageHeader
        title="Process"
        description="Manage the 'How I Turn Ideas Into Reality' section — steps, timeline and CTA."
        action={!showForm && <PrimaryBtn onClick={startCreate}><Plus className="h-4 w-4" /> Add Step</PrimaryBtn>}
      />

      {/* Step form */}
      {showForm && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">{editing ? "Edit Step" : "New Step"}</h3>
            <GhostBtn onClick={cancel}><X className="h-4 w-4" /></GhostBtn>
          </div>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="Step number (e.g. 01)">
                <input className={inputCls} value={form.step_number}
                  onChange={e => setForm({ ...form, step_number: e.target.value })} />
              </Field>
              <Field label="Icon (lucide name)">
                <input className={inputCls} value={form.icon}
                  onChange={e => setForm({ ...form, icon: e.target.value })}
                  placeholder="Lightbulb, Palette, Rocket…" />
              </Field>
              <Field label="Sort order">
                <input type="number" className={inputCls} value={form.sort_order}
                  onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
              </Field>
            </div>
            <Field label="Title">
              <input className={inputCls} value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea rows={4} className={inputCls} value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} />
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

      {/* Steps list */}
      <Card className="mb-8">
        <h3 className="font-display font-bold text-base mb-3">Steps</h3>
        {loading ? (
          <div className="text-muted-foreground text-sm">Loading…</div>
        ) : steps.length === 0 ? (
          <div className="text-muted-foreground text-sm">No steps yet. Click "Add Step".</div>
        ) : (
          <div className="space-y-2">
            {steps.map((r, i) => (
              <div key={r.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-border/40">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">
                    <span className="text-primary mr-2">{r.step_number}</span>{r.title}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2 mt-1">{r.description}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    icon: {r.icon} · order {r.sort_order} {r.active ? "" : "· hidden"}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => move(r, -1)} disabled={i === 0}
                    className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                  <button onClick={() => move(r, 1)} disabled={i === steps.length - 1}
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

      {/* Settings */}
      {settings && (
        <Card>
          <h3 className="font-display font-bold text-base mb-4">Section Settings</h3>
          <div className="space-y-4">
            <Field label="Section title">
              <input className={inputCls} value={settings.section_title}
                onChange={e => updateSetting("section_title", e.target.value)} />
            </Field>
            <Field label="Section subtitle">
              <textarea rows={2} className={inputCls} value={settings.section_subtitle}
                onChange={e => updateSetting("section_subtitle", e.target.value)} />
            </Field>

            <div className="pt-2 border-t border-border/40">
              <Field label="Timeline title">
                <input className={inputCls} value={settings.timeline_title}
                  onChange={e => updateSetting("timeline_title", e.target.value)} />
              </Field>
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Timeline items</span>
                  <GhostBtn onClick={addTimelineItem}><Plus className="h-3 w-3" /> Add item</GhostBtn>
                </div>
                <div className="space-y-2">
                  {settings.timeline_items.map((t, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center">
                      <input className={`${inputCls} col-span-3`} placeholder="Day 1" value={t.day}
                        onChange={e => updateTimelineItem(i, { day: e.target.value })} />
                      <input className={`${inputCls} col-span-6`} placeholder="Label" value={t.label}
                        onChange={e => updateTimelineItem(i, { label: e.target.value })} />
                      <input className={`${inputCls} col-span-2`} placeholder="Icon" value={t.icon}
                        onChange={e => updateTimelineItem(i, { icon: e.target.value })} />
                      <button onClick={() => removeTimelineItem(i)}
                        className="col-span-1 p-2 rounded-lg text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {settings.timeline_items.length === 0 && (
                    <div className="text-xs text-muted-foreground">No timeline items.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/40 space-y-4">
              <Field label="CTA text">
                <textarea rows={2} className={inputCls} value={settings.cta_text}
                  onChange={e => updateSetting("cta_text", e.target.value)} />
              </Field>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="CTA button label">
                  <input className={inputCls} value={settings.cta_button_label}
                    onChange={e => updateSetting("cta_button_label", e.target.value)} />
                </Field>
                <Field label="CTA button link">
                  <input className={inputCls} value={settings.cta_button_link}
                    onChange={e => updateSetting("cta_button_link", e.target.value)} />
                </Field>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={settings.active}
                onChange={e => updateSetting("active", e.target.checked)} />
              Show section on site
            </label>
          </div>
          <div className="flex gap-2 mt-5">
            <PrimaryBtn onClick={saveSettings} disabled={savingSettings}>
              <Save className="h-4 w-4" /> {savingSettings ? "Saving…" : "Save settings"}
            </PrimaryBtn>
          </div>
        </Card>
      )}
    </div>
  );
}