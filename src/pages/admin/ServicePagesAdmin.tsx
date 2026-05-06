import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader, Card, Field, inputCls, PrimaryBtn, GhostBtn, uploadToBucket } from "./_ui";

type Page = { slug: string; title: string; description: string; image_url: string | null; floating_icons: string[] };
type CardT = { id: string; page_slug: string; title: string; description: string; image_url: string | null; price: string | null; sort_order: number };

const SLUGS = [
  { slug: "digital-marketing", label: "Digital Marketing" },
  { slug: "web-development", label: "Web Development" },
  { slug: "ai-automation", label: "AI Automation" },
];

export default function ServicePagesAdmin() {
  const [active, setActive] = useState(SLUGS[0].slug);
  const [page, setPage] = useState<Page | null>(null);
  const [cards, setCards] = useState<CardT[]>([]);
  const [editing, setEditing] = useState<Partial<CardT> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data: p } = await supabase.from("service_pages").select("*").eq("slug", active).maybeSingle();
    setPage((p as any) || null);
    const { data: c } = await supabase.from("service_page_cards").select("*").eq("page_slug", active).order("sort_order");
    setCards((c as any) || []);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [active]);

  const savePage = async () => {
    if (!page) return;
    setSaving(true);
    const { error } = await supabase.from("service_pages").update({
      title: page.title, description: page.description, image_url: page.image_url, floating_icons: page.floating_icons,
    }).eq("slug", active);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Page saved");
  };

  const handlePageImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !page) return;
    setUploading(true);
    const url = await uploadToBucket(file, "service-pages");
    setUploading(false);
    if (!url) return toast.error("Upload failed");
    setPage({ ...page, image_url: url });
  };

  const handleCardImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    const url = await uploadToBucket(file, "service-cards");
    setUploading(false);
    if (!url) return toast.error("Upload failed");
    setEditing({ ...editing, image_url: url });
  };

  const saveCard = async () => {
    if (!editing?.title) return toast.error("Title required");
    setSaving(true);
    const payload = {
      page_slug: active,
      title: editing.title!,
      description: editing.description ?? "",
      image_url: editing.image_url ?? null,
      price: editing.price ?? null,
      sort_order: editing.sort_order ?? cards.length,
    };
    const { error } = editing.id
      ? await supabase.from("service_page_cards").update(payload).eq("id", editing.id)
      : await supabase.from("service_page_cards").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    setEditing(null);
    load();
  };

  const removeCard = async (id: string) => {
    if (!confirm("Delete this card?")) return;
    await supabase.from("service_page_cards").delete().eq("id", id);
    load();
  };

  if (!page) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <>
      <PageHeader title="Service Pages" description="Edit each service detail page and its service cards." />

      <div className="flex flex-wrap gap-2 mb-6">
        {SLUGS.map((s) => (
          <button
            key={s.slug}
            onClick={() => setActive(s.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              active === s.slug ? "bg-gradient-primary text-white neon-glow" : "glass hover:bg-white/5"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <Card className="space-y-4 mb-6">
        <Field label="Title">
          <input value={page.title} onChange={(e) => setPage({ ...page, title: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Description">
          <textarea value={page.description} rows={4} onChange={(e) => setPage({ ...page, description: e.target.value })} className={inputCls + " resize-none"} />
        </Field>
        <Field label="Profile / Service Image">
          <div className="flex items-center gap-4">
            {page.image_url && <img src={page.image_url} alt="" className="h-20 w-20 rounded-full object-cover glass" />}
            <input type="file" accept="image/*" onChange={handlePageImage} disabled={uploading} className="text-sm" />
            {page.image_url && <GhostBtn onClick={() => setPage({ ...page, image_url: null })}>Remove</GhostBtn>}
          </div>
        </Field>
        <Field label="Floating Icons (comma-separated lucide names)" hint="e.g. Bot, Zap, Workflow, Brain, Sparkles">
          <input
            value={(page.floating_icons || []).join(", ")}
            onChange={(e) => setPage({ ...page, floating_icons: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })}
            className={inputCls}
          />
        </Field>
        <div className="flex justify-end">
          <PrimaryBtn onClick={savePage} loading={saving}>Save Page</PrimaryBtn>
        </div>
      </Card>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-semibold">Service Cards</h2>
        <PrimaryBtn onClick={() => setEditing({ title: "", description: "", price: "", sort_order: cards.length })}>
          <Plus className="h-4 w-4" /> Add Card
        </PrimaryBtn>
      </div>

      {editing && (
        <Card className="mb-6 space-y-4 ring-1 ring-primary/30">
          <h3 className="font-display font-semibold">{editing.id ? "Edit" : "New"} Card</h3>
          <Field label="Title"><input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inputCls} /></Field>
          <Field label="Description"><textarea value={editing.description ?? ""} rows={3} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={inputCls + " resize-none"} /></Field>
          <Field label="Price"><input value={editing.price ?? ""} onChange={(e) => setEditing({ ...editing, price: e.target.value })} className={inputCls} placeholder="$299" /></Field>
          <Field label="Image">
            <div className="flex items-center gap-4">
              {editing.image_url && <img src={editing.image_url} alt="" className="h-20 w-28 rounded-lg object-cover glass" />}
              <input type="file" accept="image/*" onChange={handleCardImage} disabled={uploading} className="text-sm" />
              {editing.image_url && <GhostBtn onClick={() => setEditing({ ...editing, image_url: null })}>Remove</GhostBtn>}
            </div>
          </Field>
          <Field label="Sort Order"><input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={inputCls} /></Field>
          <div className="flex justify-end gap-2">
            <GhostBtn onClick={() => setEditing(null)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={saveCard} loading={saving}>Save</PrimaryBtn>
          </div>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {cards.length === 0 && <p className="text-muted-foreground text-sm">No cards yet.</p>}
        {cards.map((c) => (
          <Card key={c.id} className="!p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">{c.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                {c.price && <span className="text-sm text-primary font-semibold">{c.price}</span>}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => setEditing(c)} className="p-1.5 rounded-lg hover:bg-white/5"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => removeCard(c.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}