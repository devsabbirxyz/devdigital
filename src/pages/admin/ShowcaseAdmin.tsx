import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  PageHeader, Card, Field, inputCls, PrimaryBtn, GhostBtn, uploadToBucket,
} from "./_ui";

type Item = {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string | null;
  badge: string | null;
  media_url: string | null;
  media_type: "image" | "video";
  sort_order: number;
  is_active: boolean;
};

type Settings = {
  enabled: boolean;
  title: string;
  subtitle: string;
  background: string;
  animation_speed: number;
};

const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  title: "আমার দক্ষতা ও সেবাসমূহ",
  subtitle:
    "Digital Marketing, Web Development এবং AI Automation এর মাধ্যমে ব্যবসার দ্রুত বৃদ্ধি ও অটোমেশন সমাধান।",
  background: "",
  animation_speed: 1,
};

export default function ShowcaseAdmin() {
  const [list, setList] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Partial<Item> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [featuresText, setFeaturesText] = useState("");

  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [savingSettings, setSavingSettings] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("showcase_items").select("*").order("sort_order");
    setList(((data as any[]) || []).map((d) => ({
      ...d, features: Array.isArray(d.features) ? d.features : [],
    })));
    const { data: s } = await supabase
      .from("site_settings").select("value").eq("key", "showcase_section").maybeSingle();
    if (s?.value) setSettings({ ...DEFAULT_SETTINGS, ...(s.value as object) } as Settings);
  };
  useEffect(() => { load(); }, []);

  const openEdit = (it?: Item) => {
    const v = it ?? {
      title: "", description: "", features: [], icon: "Sparkles",
      badge: "", media_url: null, media_type: "image" as const,
      sort_order: list.length, is_active: true,
    };
    setEditing(v);
    setFeaturesText((v.features ?? []).join("\n"));
  };

  const onSave = async () => {
    if (!editing?.title) return toast.error("Title required");
    setSaving(true);
    const payload = {
      title: editing.title,
      description: editing.description ?? "",
      features: featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
      icon: editing.icon ?? null,
      badge: editing.badge ?? null,
      media_url: editing.media_url ?? null,
      media_type: (editing.media_type ?? "image") as "image" | "video",
      sort_order: editing.sort_order ?? list.length,
      is_active: editing.is_active ?? true,
    };
    const { error } = editing.id
      ? await supabase.from("showcase_items").update(payload).eq("id", editing.id)
      : await supabase.from("showcase_items").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from("showcase_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const toggleActive = async (it: Item) => {
    await supabase.from("showcase_items").update({ is_active: !it.is_active }).eq("id", it.id);
    load();
  };

  const move = async (it: Item, dir: -1 | 1) => {
    const idx = list.findIndex((x) => x.id === it.id);
    const swap = list[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("showcase_items").update({ sort_order: swap.sort_order }).eq("id", it.id),
      supabase.from("showcase_items").update({ sort_order: it.sort_order }).eq("id", swap.id),
    ]);
    load();
  };

  const handleMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    const url = await uploadToBucket(file, "showcase");
    setUploading(false);
    if (!url) return toast.error("Upload failed");
    setEditing({
      ...editing,
      media_url: url,
      media_type: file.type.startsWith("video") ? "video" : "image",
    });
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "showcase_section", value: settings as any }, { onConflict: "key" });
    setSavingSettings(false);
    if (error) return toast.error(error.message);
    toast.success("Section settings saved");
  };

  return (
    <>
      <PageHeader
        title="Showcase Section"
        description="Sticky scroll showcase shown between Projects and Pricing."
        action={
          <PrimaryBtn onClick={() => openEdit()}>
            <Plus className="h-4 w-4" /> Add Item
          </PrimaryBtn>
        }
      />

      <Card className="mb-6 space-y-4">
        <h3 className="font-display font-semibold">Section Settings</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Title">
            <input className={inputCls} value={settings.title}
              onChange={(e) => setSettings({ ...settings, title: e.target.value })} />
          </Field>
          <Field label="Background (CSS, optional)">
            <input className={inputCls} placeholder="e.g. #0a0a1a or linear-gradient(...)"
              value={settings.background}
              onChange={(e) => setSettings({ ...settings, background: e.target.value })} />
          </Field>
        </div>
        <Field label="Subtitle">
          <textarea rows={2} className={inputCls + " resize-none"} value={settings.subtitle}
            onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={`Animation speed (${settings.animation_speed.toFixed(1)}x)`}>
            <input type="range" min={0.5} max={2} step={0.1}
              value={settings.animation_speed}
              onChange={(e) => setSettings({ ...settings, animation_speed: Number(e.target.value) })}
              className="w-full accent-primary" />
          </Field>
          <label className="flex items-end gap-2 pb-2">
            <input type="checkbox" checked={settings.enabled}
              onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
              className="h-4 w-4 accent-primary" />
            <span className="text-sm">Show section on site</span>
          </label>
        </div>
        <div className="flex justify-end">
          <PrimaryBtn onClick={saveSettings} loading={savingSettings}>Save settings</PrimaryBtn>
        </div>
      </Card>

      {editing && (
        <Card className="mb-6 space-y-4 ring-1 ring-primary/30">
          <h3 className="font-display font-semibold">{editing.id ? "Edit" : "New"} Item</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title">
              <input className={inputCls} value={editing.title ?? ""}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="Badge (optional)">
              <input className={inputCls} value={editing.badge ?? ""}
                onChange={(e) => setEditing({ ...editing, badge: e.target.value })} />
            </Field>
          </div>
          <Field label="Description">
            <textarea rows={3} className={inputCls + " resize-none"} value={editing.description ?? ""}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          </Field>
          <Field label="Features (one per line)">
            <textarea rows={4} className={inputCls + " resize-none"} value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Lucide Icon name" hint="e.g. Search, Sparkles, Code2, Megaphone, TrendingUp">
              <input className={inputCls} value={editing.icon ?? ""}
                onChange={(e) => setEditing({ ...editing, icon: e.target.value })} />
            </Field>
            <Field label="Sort order">
              <input type="number" className={inputCls} value={editing.sort_order ?? 0}
                onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
            </Field>
          </div>
          <Field label="Media (image or video)">
            <div className="flex items-center gap-4 flex-wrap">
              {editing.media_url && (
                editing.media_type === "video"
                  ? <video src={editing.media_url} muted className="h-20 w-28 rounded-lg object-cover glass" />
                  : <img src={editing.media_url} alt="" className="h-20 w-28 rounded-lg object-cover glass" />
              )}
              <input type="file" accept="image/*,video/mp4" onChange={handleMedia} disabled={uploading} className="text-sm" />
              {editing.media_url && (
                <GhostBtn onClick={() => setEditing({ ...editing, media_url: null })}>Remove</GhostBtn>
              )}
            </div>
          </Field>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={editing.is_active ?? true}
              onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
              className="h-4 w-4 accent-primary" />
            <span className="text-sm">Active</span>
          </label>
          <div className="flex justify-end gap-2">
            <GhostBtn onClick={() => setEditing(null)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={onSave} loading={saving}>Save</PrimaryBtn>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {list.length === 0 && <p className="text-muted-foreground text-sm">No items yet.</p>}
        {list.map((it, i) => (
          <Card key={it.id} className="!p-3 flex items-center gap-3">
            <div className="flex flex-col">
              <button onClick={() => move(it, -1)} disabled={i === 0}
                className="p-1 rounded hover:bg-white/5 disabled:opacity-30" aria-label="Move up">
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => move(it, 1)} disabled={i === list.length - 1}
                className="p-1 rounded hover:bg-white/5 disabled:opacity-30" aria-label="Move down">
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>
            {it.media_url ? (
              it.media_type === "video"
                ? <video src={it.media_url} muted className="h-12 w-16 rounded object-cover" />
                : <img src={it.media_url} alt="" className="h-12 w-16 rounded object-cover" />
            ) : (
              <div className="h-12 w-16 rounded bg-gradient-primary/30" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`font-medium text-sm truncate ${!it.is_active && "opacity-50"}`}>{it.title}</p>
              <p className="text-xs text-muted-foreground truncate">{it.description}</p>
            </div>
            <button onClick={() => toggleActive(it)} className="p-1.5 rounded-lg hover:bg-white/5"
              aria-label="Toggle">
              {it.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 opacity-50" />}
            </button>
            <button onClick={() => openEdit(it)} className="p-1.5 rounded-lg hover:bg-white/5" aria-label="Edit">
              <Pencil className="h-4 w-4" />
            </button>
            <button onClick={() => remove(it.id)}
              className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive" aria-label="Delete">
              <Trash2 className="h-4 w-4" />
            </button>
          </Card>
        ))}
      </div>
    </>
  );
}