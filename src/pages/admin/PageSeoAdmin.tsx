import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader, Card, Field, inputCls, PrimaryBtn, GhostBtn, uploadToBucket } from "./_ui";
import { logActivity } from "@/lib/activityLog";

type Row = {
  id: string;
  path: string;
  title: string | null;
  description: string | null;
  og_image_url: string | null;
};

const PRESETS = ["/", "/projects", "/webdev", "/aiautomation", "/digitalmarketingservice"];

export default function PageSeoAdmin() {
  const [list, setList] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Partial<Row> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("page_seo").select("*").order("path");
    setList((data as Row[]) || []);
  };
  useEffect(() => { load(); }, []);

  const onSave = async () => {
    if (!editing?.path) return toast.error("Path required (e.g. /, /projects)");
    setSaving(true);
    const payload = {
      path: editing.path,
      title: editing.title || null,
      description: editing.description || null,
      og_image_url: editing.og_image_url || null,
    };
    const { error } = editing.id
      ? await supabase.from("page_seo").update(payload).eq("id", editing.id)
      : await supabase.from("page_seo").upsert(payload, { onConflict: "path" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    logActivity("update", `page_seo:${payload.path}`);
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this SEO entry?")) return;
    const { error } = await supabase.from("page_seo").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    const url = await uploadToBucket(file, "seo");
    setUploading(false);
    if (!url) return toast.error("Upload failed");
    setEditing({ ...editing, og_image_url: url });
  };

  return (
    <>
      <PageHeader
        title="SEO Meta Tags"
        description="Per-page title, description, and Open Graph image. Overrides defaults."
        action={
          <PrimaryBtn onClick={() => setEditing({ path: "" })}>
            <Plus className="h-4 w-4" /> New
          </PrimaryBtn>
        }
      />

      {editing && (
        <Card className="mb-6 space-y-4 ring-1 ring-primary/30">
          <h3 className="font-display font-semibold">{editing.id ? "Edit" : "New"} SEO entry</h3>
          <Field label="Path" hint="Exact URL path. E.g. / for home, /projects, /blog/my-slug">
            <input value={editing.path ?? ""} onChange={(e) => setEditing({ ...editing, path: e.target.value })} className={inputCls} placeholder="/about" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {PRESETS.map((p) => (
                <button key={p} type="button" onClick={() => setEditing({ ...editing, path: p })} className="px-2 py-1 rounded-md text-xs bg-white/5 hover:bg-white/10">{p}</button>
              ))}
            </div>
          </Field>
          <Field label="Title" hint="Recommended < 60 chars">
            <input value={editing.title ?? ""} maxLength={120} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Description" hint="Recommended < 160 chars">
            <textarea value={editing.description ?? ""} maxLength={300} rows={3} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={inputCls + " resize-none"} />
          </Field>
          <Field label="OG Image (1200×630 recommended)">
            <div className="flex items-center gap-4">
              {editing.og_image_url && <img src={editing.og_image_url} alt="" className="h-16 w-28 rounded-lg object-cover glass" />}
              <input type="file" accept="image/*" onChange={handleImage} disabled={uploading} className="text-sm" />
              {editing.og_image_url && <GhostBtn onClick={() => setEditing({ ...editing, og_image_url: null })}>Remove</GhostBtn>}
            </div>
          </Field>
          <div className="flex justify-end gap-2">
            <GhostBtn onClick={() => setEditing(null)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={onSave} loading={saving}>Save</PrimaryBtn>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {list.length === 0 && <p className="text-muted-foreground text-sm">No custom SEO entries yet. Sitewide defaults apply.</p>}
        {list.map((r) => (
          <Card key={r.id} className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-mono text-primary">{r.path}</p>
              <p className="font-semibold truncate">{r.title || <span className="text-muted-foreground">— no title —</span>}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => setEditing(r)} className="p-1.5 rounded-lg hover:bg-white/5"><Pencil className="h-3.5 w-3.5" /></button>
              <button onClick={() => remove(r.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}