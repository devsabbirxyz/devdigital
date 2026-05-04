import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader, Card, Field, inputCls, PrimaryBtn, GhostBtn } from "./_ui";

type Plan = { id: string; name: string; price: string; features: string[]; highlighted: boolean; sort_order: number };

export default function PricingAdmin() {
  const [list, setList] = useState<Plan[]>([]);
  const [editing, setEditing] = useState<Partial<Plan> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("pricing_plans").select("*").order("sort_order");
    setList(((data as any[]) || []).map((p) => ({ ...p, features: Array.isArray(p.features) ? p.features : [] })));
  };
  useEffect(() => { load(); }, []);

  const onSave = async () => {
    if (!editing?.name || !editing.price) return toast.error("Name and price required");
    setSaving(true);
    const payload = {
      name: editing.name,
      price: editing.price,
      features: editing.features ?? [],
      highlighted: editing.highlighted ?? false,
      sort_order: editing.sort_order ?? list.length,
    };
    const { error } = editing.id
      ? await supabase.from("pricing_plans").update(payload as any).eq("id", editing.id)
      : await supabase.from("pricing_plans").insert(payload as any);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    const { error } = await supabase.from("pricing_plans").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <>
      <PageHeader
        title="Pricing Plans"
        action={
          <PrimaryBtn onClick={() => setEditing({ name: "", price: "", features: [], highlighted: false, sort_order: list.length })}>
            <Plus className="h-4 w-4" /> Add Plan
          </PrimaryBtn>
        }
      />

      {editing && (
        <Card className="mb-6 space-y-4 ring-1 ring-primary/30">
          <h3 className="font-display font-semibold">{editing.id ? "Edit" : "New"} Plan</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Plan Name">
              <input value={editing.name ?? ""} maxLength={50} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Price" hint='e.g. "$499", "$1,200/mo", or "Custom"'>
              <input value={editing.price ?? ""} maxLength={50} onChange={(e) => setEditing({ ...editing, price: e.target.value })} className={inputCls} />
            </Field>
          </div>
          <Field label="Features" hint="One per line">
            <textarea
              value={(editing.features ?? []).join("\n")}
              rows={6}
              onChange={(e) => setEditing({ ...editing, features: e.target.value.split("\n").filter((l) => l.trim()) })}
              className={inputCls + " resize-none"}
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Sort Order">
              <input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={inputCls} />
            </Field>
            <label className="flex items-end gap-2 pb-2">
              <input type="checkbox" checked={editing.highlighted ?? false} onChange={(e) => setEditing({ ...editing, highlighted: e.target.checked })} className="h-4 w-4 accent-primary" />
              <span className="text-sm">Mark as Most Popular</span>
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <GhostBtn onClick={() => setEditing(null)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={onSave} loading={saving}>Save</PrimaryBtn>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-3">
        {list.length === 0 && <p className="text-muted-foreground text-sm">No plans yet.</p>}
        {list.map((p) => (
          <Card key={p.id} className={p.highlighted ? "ring-1 ring-primary/40" : ""}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs text-muted-foreground">{p.name}</p>
                <p className="text-2xl font-display font-bold">{p.price}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(p)} className="p-1.5 rounded-lg hover:bg-white/5" aria-label="Edit">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => remove(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive" aria-label="Delete">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 mt-2">
              {p.features.slice(0, 5).map((f, i) => <li key={i}>• {f}</li>)}
              {p.features.length > 5 && <li>+ {p.features.length - 5} more</li>}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}