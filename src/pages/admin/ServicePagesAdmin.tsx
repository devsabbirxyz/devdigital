import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader, Card, Field, inputCls, PrimaryBtn, GhostBtn, uploadToBucket } from "./_ui";
import { Link } from "react-router-dom";

type Page = {
  slug: string;
  title: string;
  description: string;
  image_url: string | null;
  floating_icons: string[];
};

type CardT = {
  id: string;
  page_slug: string;
  title: string;
  description: string;
  image_url: string | null;
  price: string | null;
  sort_order: number;
};

const SLUGS = [
  { slug: "digital-marketing", label: "Digital Marketing", route: "/digitalmarketingservice" },
  { slug: "web-development", label: "Web Development", route: "/webdev" },
  { slug: "ai-automation", label: "AI Automation", route: "/aiautomation" },
];

export default function ServicePagesAdmin({ forcedSlug }: { forcedSlug?: string } = {}) {
  const [active, setActive] = useState(forcedSlug ?? SLUGS[0].slug);
  const [page, setPage] = useState<Page | null>(null);
  const [cards, setCards] = useState<CardT[]>([]);
  const [editing, setEditing] = useState<Partial<CardT> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (forcedSlug) setActive(forcedSlug);
  }, [forcedSlug]);

  const load = async () => {
    const { data: p } = await supabase.from("service_pages").select("*").eq("slug", active).maybeSingle();
    setPage((p as any) || null);
    const { data: c } = await supabase.from("service_page_cards").select("*").eq("page_slug", active).order("sort_order");
    setCards((c as any) || []);
  };

  useEffect(() => {
    load();
    /* eslint-disable-next-line */
  }, [active]);

  const savePage = async () => {
    if (!page) return;
    setSaving(true);
    const { error } = await supabase.from("service_pages").update({
      title: page.title,
      description: page.description,
      image_url: page.image_url,
      floating_icons: page.floating_icons,
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
    toast.success("Card saved");
  };

  const removeCard = async (id: string) => {
    if (!confirm("Delete this card?")) return;
    await supabase.from("service_page_cards").delete().eq("id", id);
    load();
    toast.success("Card removed");
  };

  const currentMeta = SLUGS.find((s) => s.slug === active) || SLUGS[0];

  if (!page) return <p className="text-muted-foreground p-4">Loading…</p>;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <PageHeader
          title={forcedSlug ? `${currentMeta.label} Page` : "Service Detail Pages"}
          description="Manage 3D ring gallery hero, capabilities, deliverables, and pricing cards."
        />
        <Link
          to={currentMeta.route}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass hover:bg-white/10 text-xs font-semibold text-primary transition-colors"
        >
          View Live 3D Ring Page <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {!forcedSlug && (
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
      )}

      {/* Main Page Settings */}
      <Card className="space-y-4 mb-6">
        <h3 className="font-display font-semibold text-lg">Hero & General Information</h3>
        <Field label="Hero Title">
          <input
            value={page.title}
            onChange={(e) => setPage({ ...page, title: e.target.value })}
            className={inputCls}
            placeholder="e.g. Digital Marketing Services"
          />
        </Field>
        <Field label="Hero Subheading & Description">
          <textarea
            value={page.description}
            rows={3}
            onChange={(e) => setPage({ ...page, description: e.target.value })}
            className={inputCls + " resize-none"}
            placeholder="Describe the value proposition for this service..."
          />
        </Field>
        <Field label="Service Icon / Profile Image">
          <div className="flex items-center gap-4">
            {page.image_url && <img src={page.image_url} alt="" className="h-20 w-20 rounded-full object-cover glass" />}
            <input type="file" accept="image/*" onChange={handlePageImage} disabled={uploading} className="text-sm" />
            {page.image_url && <GhostBtn onClick={() => setPage({ ...page, image_url: null })}>Remove</GhostBtn>}
          </div>
        </Field>
        <div className="flex justify-end">
          <PrimaryBtn onClick={savePage} loading={saving}>Save Page Details</PrimaryBtn>
        </div>
      </Card>

      {/* Deliverable Cards */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-display font-semibold text-lg">Service Cards & Deliverables</h2>
          <p className="text-xs text-muted-foreground">
            Cards appear in the 3D Ring Gallery and the Core Capabilities grid below the hero.
          </p>
        </div>
        <PrimaryBtn onClick={() => setEditing({ title: "", description: "", price: "", sort_order: cards.length })}>
          <Plus className="h-4 w-4" /> Add Card
        </PrimaryBtn>
      </div>

      {editing && (
        <Card className="mb-6 space-y-4 ring-1 ring-primary/40">
          <h3 className="font-display font-semibold">{editing.id ? "Edit" : "New"} Deliverable Card</h3>
          <Field label="Title">
            <input
              value={editing.title ?? ""}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              className={inputCls}
              placeholder="e.g. Meta & Instagram Ads Scale"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={editing.description ?? ""}
              rows={3}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              className={inputCls + " resize-none"}
              placeholder="Detailed description of what is included..."
            />
          </Field>
          <Field label="Price / Starting Investment">
            <input
              value={editing.price ?? ""}
              onChange={(e) => setEditing({ ...editing, price: e.target.value })}
              className={inputCls}
              placeholder="e.g. $499 or $99/mo"
            />
          </Field>
          <Field label="Cover Image">
            <div className="flex items-center gap-4">
              {editing.image_url && <img src={editing.image_url} alt="" className="h-20 w-28 rounded-lg object-cover glass" />}
              <input type="file" accept="image/*" onChange={handleCardImage} disabled={uploading} className="text-sm" />
              {editing.image_url && <GhostBtn onClick={() => setEditing({ ...editing, image_url: null })}>Remove</GhostBtn>}
            </div>
          </Field>
          <Field label="Sort Order">
            <input
              type="number"
              value={editing.sort_order ?? 0}
              onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
              className={inputCls}
            />
          </Field>
          <div className="flex justify-end gap-2">
            <GhostBtn onClick={() => setEditing(null)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={saveCard} loading={saving}>Save Card</PrimaryBtn>
          </div>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.length === 0 && <p className="text-muted-foreground text-sm col-span-full">No custom cards yet. Default 3D ring items will display on the live site.</p>}
        {cards.map((c) => (
          <Card key={c.id} className="!p-4 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                {c.image_url && (
                  <img src={c.image_url} alt="" className="w-full h-24 object-cover rounded-lg mb-2 glass" />
                )}
                <h3 className="font-semibold text-sm line-clamp-1">{c.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 my-1">{c.description}</p>
                {c.price && <span className="text-xs font-bold text-primary">{c.price}</span>}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => setEditing(c)} className="p-1.5 rounded-lg hover:bg-white/5" title="Edit">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => removeCard(c.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive" title="Delete">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}