import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader, Card, Field, inputCls, PrimaryBtn, GhostBtn, uploadToBucket } from "./_ui";

type Project = { id: string; title: string; description: string; image_url: string | null; featured: boolean; sort_order: number };

export default function ProjectsAdmin() {
  const [list, setList] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("projects").select("*").order("sort_order");
    setList((data as Project[]) || []);
  };
  useEffect(() => { load(); }, []);

  const onSave = async () => {
    if (!editing?.title || !editing.description) return toast.error("Title and description required");
    setSaving(true);
    const payload = {
      title: editing.title,
      description: editing.description,
      image_url: editing.image_url ?? null,
      featured: editing.featured ?? false,
      sort_order: editing.sort_order ?? list.length,
    };
    const { error } = editing.id
      ? await supabase.from("projects").update(payload).eq("id", editing.id)
      : await supabase.from("projects").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    const url = await uploadToBucket(file, "projects");
    setUploading(false);
    if (!url) return toast.error("Upload failed");
    setEditing({ ...editing, image_url: url });
  };

  return (
    <>
      <PageHeader
        title="Projects"
        description="Add, edit, feature your portfolio projects."
        action={
          <PrimaryBtn onClick={() => setEditing({ title: "", description: "", featured: true, sort_order: list.length })}>
            <Plus className="h-4 w-4" /> Add Project
          </PrimaryBtn>
        }
      />

      {editing && (
        <Card className="mb-6 space-y-4 ring-1 ring-primary/30">
          <h3 className="font-display font-semibold">{editing.id ? "Edit" : "New"} Project</h3>
          <Field label="Title">
            <input value={editing.title ?? ""} maxLength={150} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Description">
            <textarea value={editing.description ?? ""} maxLength={1000} rows={3} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={inputCls + " resize-none"} />
          </Field>
          <Field label="Image">
            <div className="flex items-center gap-4">
              {editing.image_url && <img src={editing.image_url} alt="" className="h-20 w-28 rounded-lg object-cover glass" />}
              <input type="file" accept="image/*" onChange={handleImage} disabled={uploading} className="text-sm" />
              {editing.image_url && <GhostBtn onClick={() => setEditing({ ...editing, image_url: null })}>Remove</GhostBtn>}
            </div>
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Sort Order">
              <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={inputCls} />
            </Field>
            <label className="flex items-end gap-2 pb-2">
              <input type="checkbox" checked={editing.featured ?? false} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="h-4 w-4 accent-primary" />
              <span className="text-sm">Featured (shown on homepage)</span>
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <GhostBtn onClick={() => setEditing(null)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={onSave} loading={saving}>Save</PrimaryBtn>
          </div>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {list.length === 0 && <p className="text-muted-foreground text-sm">No projects yet.</p>}
        {list.map((p) => (
          <Card key={p.id} className="!p-0 overflow-hidden">
            {p.image_url && <img src={p.image_url} alt="" className="w-full aspect-video object-cover" />}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold flex items-center gap-2">
                  {p.title}
                  {p.featured && <Star className="h-3.5 w-3.5 text-primary fill-primary" />}
                </h3>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditing(p)} className="p-1.5 rounded-lg hover:bg-white/5" aria-label="Edit">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => remove(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive" aria-label="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}