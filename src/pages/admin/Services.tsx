import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader, Card, Field, inputCls, PrimaryBtn, GhostBtn, DangerBtn } from "./_ui";

type Service = { id: string; title: string; description: string; icon: string; sort_order: number };

export default function ServicesAdmin() {
  const [list, setList] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    setList((data as Service[]) || []);
  };
  useEffect(() => { load(); }, []);

  const onSave = async () => {
    if (!editing?.title || !editing.description) return toast.error("Title and description required");
    setSaving(true);
    const payload = {
      title: editing.title,
      description: editing.description,
      icon: editing.icon || "Sparkles",
      sort_order: editing.sort_order ?? list.length,
    };
    const { error } = editing.id
      ? await supabase.from("services").update(payload).eq("id", editing.id)
      : await supabase.from("services").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <>
      <PageHeader
        title="Services"
        description="Manage your service cards."
        action={<PrimaryBtn onClick={() => setEditing({ title: "", description: "", icon: "Sparkles", sort_order: list.length })}>
          <Plus className="h-4 w-4" /> Add Service
        </PrimaryBtn>}
      />

      {editing && (
        <Card className="mb-6 space-y-4 ring-1 ring-primary/30">
          <h3 className="font-display font-semibold">{editing.id ? "Edit" : "New"} Service</h3>
          <Field label="Title">
            <input value={editing.title ?? ""} maxLength={100} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Description">
            <textarea value={editing.description ?? ""} maxLength={500} rows={3} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={inputCls + " resize-none"} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Icon (lucide-react name)" hint="e.g. Sparkles, Code, Zap, Bot, Palette">
              <input value={editing.icon ?? ""} maxLength={50} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Sort Order">
              <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={inputCls} />
            </Field>
          </div>
          <div className="flex justify-end gap-2">
            <GhostBtn onClick={() => setEditing(null)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={onSave} loading={saving}>Save</PrimaryBtn>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {list.length === 0 && <p className="text-muted-foreground text-sm">No services yet. Add your first one.</p>}
        {list.map((s) => (
          <Card key={s.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full glass text-primary">{s.icon}</span>
                  <h3 className="font-semibold truncate">{s.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setEditing(s)} className="p-2 rounded-lg hover:bg-white/5 text-foreground/70" aria-label="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => remove(s.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}