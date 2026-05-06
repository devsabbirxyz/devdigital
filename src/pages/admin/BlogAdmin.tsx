import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader, Card, Field, inputCls, PrimaryBtn, GhostBtn, uploadToBucket } from "./_ui";

type Post = {
  id: string; slug: string; title: string; excerpt: string | null;
  content: string; cover_url: string | null; published: boolean; sort_order: number;
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

export default function BlogAdmin() {
  const [list, setList] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("sort_order");
    setList((data as Post[]) || []);
  };
  useEffect(() => { load(); }, []);

  const onSave = async () => {
    if (!editing?.title) return toast.error("Title required");
    setSaving(true);
    const slug = editing.slug || slugify(editing.title);
    const payload = {
      slug,
      title: editing.title!,
      excerpt: editing.excerpt ?? null,
      content: editing.content ?? "",
      cover_url: editing.cover_url ?? null,
      published: editing.published ?? true,
      sort_order: editing.sort_order ?? list.length,
    };
    const { error } = editing.id
      ? await supabase.from("blog_posts").update(payload).eq("id", editing.id)
      : await supabase.from("blog_posts").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    const url = await uploadToBucket(file, "blog");
    setUploading(false);
    if (!url) return toast.error("Upload failed");
    setEditing({ ...editing, cover_url: url });
  };

  return (
    <>
      <PageHeader
        title="Blog Manager"
        description="Add, edit, publish blog posts."
        action={
          <PrimaryBtn onClick={() => setEditing({ title: "", content: "", published: true, sort_order: list.length })}>
            <Plus className="h-4 w-4" /> New Post
          </PrimaryBtn>
        }
      />

      {editing && (
        <Card className="mb-6 space-y-4 ring-1 ring-primary/30">
          <h3 className="font-display font-semibold">{editing.id ? "Edit" : "New"} Post</h3>
          <Field label="Title">
            <input value={editing.title ?? ""} maxLength={200} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Slug" hint="URL slug — auto-generated from title if left empty">
            <input value={editing.slug ?? ""} maxLength={80} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className={inputCls} placeholder={editing.title ? slugify(editing.title) : ""} />
          </Field>
          <Field label="Excerpt (shown on hover)">
            <textarea value={editing.excerpt ?? ""} maxLength={300} rows={2} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} className={inputCls + " resize-none"} />
          </Field>
          <Field label="Cover Image">
            <div className="flex items-center gap-4">
              {editing.cover_url && <img src={editing.cover_url} alt="" className="h-20 w-28 rounded-lg object-cover glass" />}
              <input type="file" accept="image/*" onChange={handleImage} disabled={uploading} className="text-sm" />
              {editing.cover_url && <GhostBtn onClick={() => setEditing({ ...editing, cover_url: null })}>Remove</GhostBtn>}
            </div>
          </Field>
          <Field label="Content">
            <textarea value={editing.content ?? ""} rows={10} onChange={(e) => setEditing({ ...editing, content: e.target.value })} className={inputCls + " resize-y"} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Sort Order">
              <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={inputCls} />
            </Field>
            <label className="flex items-end gap-2 pb-2">
              <input type="checkbox" checked={editing.published ?? true} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="h-4 w-4 accent-primary" />
              <span className="text-sm">Published</span>
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <GhostBtn onClick={() => setEditing(null)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={onSave} loading={saving}>Save</PrimaryBtn>
          </div>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {list.length === 0 && <p className="text-muted-foreground text-sm">No posts yet.</p>}
        {list.map((p) => (
          <Card key={p.id} className="!p-0 overflow-hidden">
            {p.cover_url && <img src={p.cover_url} alt="" className="w-full aspect-video object-cover" />}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">/{p.slug} {p.published ? "" : "· draft"}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditing(p)} className="p-1.5 rounded-lg hover:bg-white/5"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => remove(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{p.excerpt}</p>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}