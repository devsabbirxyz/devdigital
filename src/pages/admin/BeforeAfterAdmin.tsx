import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, ArrowUp, ArrowDown, Save, X, Upload } from "lucide-react";
import { PageHeader, Card, Field, inputCls, PrimaryBtn, GhostBtn, DangerBtn, uploadToBucket } from "./_ui";
import { logActivity } from "@/lib/activityLog";

type Result = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  before_image: string;
  after_image: string;
  sort_order: number;
  active: boolean;
};

const EMPTY: Omit<Result, "id"> = {
  title: "",
  description: "",
  category: "general",
  before_image: "",
  after_image: "",
  sort_order: 0,
  active: true,
};

export default function BeforeAfterAdmin() {
  const [items, setItems] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Result | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [uploading, setUploading] = useState<"before" | "after" | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("before_after_results")
      .select("*")
      .order("sort_order", { ascending: true });
    setItems((data ?? []) as Result[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const startCreate = () => {
    setForm({ ...EMPTY, sort_order: (items.at(-1)?.sort_order ?? 0) + 1 });
    setEditing(null);
    setCreating(true);
  };
  const startEdit = (r: Result) => {
    setForm({
      title: r.title, description: r.description ?? "", category: r.category ?? "general",
      before_image: r.before_image, after_image: r.after_image,
      sort_order: r.sort_order, active: r.active,
    });
    setEditing(r);
    setCreating(false);
  };
  const cancel = () => { setEditing(null); setCreating(false); };

  const handleUpload = async (file: File, which: "before" | "after") => {
    setUploading(which);
    const url = await uploadToBucket(file, "before-after");
    setUploading(null);
    if (!url) return toast.error("Upload failed");
    setForm((f) => ({ ...f, [`${which}_image`]: url } as typeof f));
  };

  const save = async () => {
    if (!form.title.trim() || !form.before_image || !form.after_image) {
      toast.error("Title, before image and after image are required");
      return;
    }
    if (editing) {
      const { error } = await supabase.from("before_after_results").update(form).eq("id", editing.id);
      if (error) return toast.error(error.message);
      await logActivity("before_after.update", "before_after_results", { id: editing.id });
      toast.success("Result updated");
    } else {
      const { error } = await supabase.from("before_after_results").insert(form);
      if (error) return toast.error(error.message);
      await logActivity("before_after.create", "before_after_results", { title: form.title });
      toast.success("Result created");
    }
    cancel();
    load();
  };

  const remove = async (r: Result) => {
    if (!confirm("Delete this result?")) return;
    const { error } = await supabase.from("before_after_results").delete().eq("id", r.id);
    if (error) return toast.error(error.message);
    await logActivity("before_after.delete", "before_after_results", { id: r.id });
    toast.success("Deleted");
    load();
  };

  const move = async (r: Result, dir: -1 | 1) => {
    const idx = items.findIndex((x) => x.id === r.id);
    const swap = items[idx + dir];
    if (!swap) return;
    await supabase.from("before_after_results").update({ sort_order: swap.sort_order }).eq("id", r.id);
    await supabase.from("before_after_results").update({ sort_order: r.sort_order }).eq("id", swap.id);
    load();
  };

  const toggleActive = async (r: Result) => {
    await supabase.from("before_after_results").update({ active: !r.active }).eq("id", r.id);
    load();
  };

  const showForm = creating || editing;

  const ImagePicker = ({ which }: { which: "before" | "after" }) => {
    const key = `${which}_image` as "before_image" | "after_image";
    const url = form[key];
    return (
      <Field label={`${which === "before" ? "Before" : "After"} image`}>
        <div className="flex items-start gap-3">
          {url ? (
            <img src={url} alt={which} className="h-24 w-32 object-cover rounded-lg border border-border/40" />
          ) : (
            <div className="h-24 w-32 rounded-lg bg-white/5 border border-dashed border-border/60 flex items-center justify-center text-xs text-muted-foreground">
              No image
            </div>
          )}
          <div className="flex-1 space-y-2">
            <input
              className={inputCls}
              placeholder="https://… or upload below"
              value={url}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
            <label className="inline-flex items-center gap-2 text-xs cursor-pointer glass rounded-lg px-3 py-2 hover:bg-white/5 transition">
              <Upload className="h-3 w-3" />
              {uploading === which ? "Uploading…" : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f, which);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
      </Field>
    );
  };

  return (
    <div>
      <PageHeader
        title="Before &amp; After Results"
        description="Manage transformation showcases with before/after image comparisons."
        action={!showForm && <PrimaryBtn onClick={startCreate}><Plus className="h-4 w-4" /> Add Result</PrimaryBtn>}
      />

      {showForm && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">{editing ? "Edit Result" : "New Result"}</h3>
            <GhostBtn onClick={cancel}><X className="h-4 w-4" /></GhostBtn>
          </div>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="Title">
                <input className={inputCls} value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </Field>
              <Field label="Category">
                <input className={inputCls} value={form.category ?? ""}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="web, design, branding…" />
              </Field>
              <Field label="Sort order">
                <input type="number" className={inputCls} value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
              </Field>
            </div>
            <Field label="Description">
              <textarea rows={3} className={inputCls} value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
            <div className="grid md:grid-cols-2 gap-4">
              <ImagePicker which="before" />
              <ImagePicker which="after" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })} />
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
        <h3 className="font-display font-bold text-base mb-3">Results</h3>
        {loading ? (
          <div className="text-muted-foreground text-sm">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-muted-foreground text-sm">No results yet. Click "Add Result".</div>
        ) : (
          <div className="space-y-2">
            {items.map((r, i) => (
              <div key={r.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-border/40">
                <div className="flex gap-1 flex-shrink-0">
                  <img src={r.before_image} alt="" className="h-14 w-20 object-cover rounded-md" />
                  <img src={r.after_image} alt="" className="h-14 w-20 object-cover rounded-md ring-1 ring-primary/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{r.title}</div>
                  {r.description && (
                    <div className="text-xs text-muted-foreground line-clamp-2 mt-1">{r.description}</div>
                  )}
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {r.category} · order {r.sort_order} {r.active ? "" : "· hidden"}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => move(r, -1)} disabled={i === 0}
                    className="p-2 rounded-lg hover:bg-white/5 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                  <button onClick={() => move(r, 1)} disabled={i === items.length - 1}
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