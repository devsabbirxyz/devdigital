import { useEffect, useState } from "react";
import { Plus, Trash2, Star, ArrowUp, ArrowDown, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader, Card, Field, inputCls, PrimaryBtn, GhostBtn, uploadToBucket } from "./_ui";

type Testimonial = {
  id: string;
  client_name: string;
  client_image: string | null;
  rating: number;
  feedback: string;
  show_desktop: boolean;
  show_mobile: boolean;
  sort_order: number;
};

export default function TestimonialsAdmin() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order");
    setItems((data as Testimonial[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const addNew = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .insert({
        client_name: "New Client",
        rating: 5,
        feedback: "Great work!",
        sort_order: items.length,
      })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setItems([...items, data as Testimonial]);
    toast.success("Added");
  };

  const update = (id: string, patch: Partial<Testimonial>) => {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const save = async (t: Testimonial) => {
    setSavingId(t.id);
    const { error } = await supabase
      .from("testimonials")
      .update({
        client_name: t.client_name,
        client_image: t.client_image,
        rating: t.rating,
        feedback: t.feedback,
        show_desktop: t.show_desktop,
        show_mobile: t.show_mobile,
        sort_order: t.sort_order,
      })
      .eq("id", t.id);
    setSavingId(null);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setItems((p) => p.filter((t) => t.id !== id));
  };

  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const a = items[i], b = items[j];
    const next = [...items];
    next[i] = { ...b, sort_order: i };
    next[j] = { ...a, sort_order: j };
    setItems(next);
    await Promise.all([
      supabase.from("testimonials").update({ sort_order: i }).eq("id", b.id),
      supabase.from("testimonials").update({ sort_order: j }).eq("id", a.id),
    ]);
  };

  const onUpload = async (id: string, file: File) => {
    const url = await uploadToBucket(file, "testimonials");
    if (!url) return toast.error("Upload failed");
    update(id, { client_image: url });
    await supabase.from("testimonials").update({ client_image: url }).eq("id", id);
    toast.success("Image updated");
  };

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Client feedback shown on the homepage carousel."
        action={
          <PrimaryBtn onClick={addNew}>
            <Plus className="h-4 w-4" /> Add Testimonial
          </PrimaryBtn>
        }
      />

      <div className="space-y-4">
        {items.map((t, i) => (
          <Card key={t.id} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Client Name">
                <input
                  className={inputCls}
                  value={t.client_name}
                  maxLength={100}
                  onChange={(e) => update(t.id, { client_name: e.target.value })}
                />
              </Field>
              <Field label="Star Rating (1-5)">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => update(t.id, { rating: n })}
                      aria-label={`${n} stars`}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          n <= t.rating ? "fill-primary text-primary" : "text-muted-foreground/40"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <Field label="Feedback Text">
              <textarea
                className={inputCls + " min-h-[80px]"}
                value={t.feedback}
                maxLength={500}
                onChange={(e) => update(t.id, { feedback: e.target.value })}
              />
            </Field>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Client Image">
                <div className="flex items-center gap-3">
                  {t.client_image && (
                    <img src={t.client_image} alt="" className="h-12 w-12 rounded-full object-cover" />
                  )}
                  <label className="glass rounded-xl px-3 py-2 text-sm font-medium hover:bg-white/5 cursor-pointer inline-flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && onUpload(t.id, e.target.files[0])}
                    />
                  </label>
                  {t.client_image && (
                    <button
                      onClick={() => update(t.id, { client_image: null })}
                      className="text-xs text-destructive"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </Field>
              <Field label="Visibility">
                <div className="flex gap-4 items-center pt-1.5">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={t.show_desktop}
                      onChange={(e) => update(t.id, { show_desktop: e.target.checked })}
                    />
                    Desktop
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={t.show_mobile}
                      onChange={(e) => update(t.id, { show_mobile: e.target.checked })}
                    />
                    Mobile
                  </label>
                </div>
              </Field>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/30">
              <div className="flex gap-1">
                <GhostBtn onClick={() => move(i, -1)} disabled={i === 0}>
                  <ArrowUp className="h-4 w-4" />
                </GhostBtn>
                <GhostBtn onClick={() => move(i, 1)} disabled={i === items.length - 1}>
                  <ArrowDown className="h-4 w-4" />
                </GhostBtn>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => remove(t.id)}
                  className="p-2 rounded-xl text-destructive hover:bg-destructive/10"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <PrimaryBtn onClick={() => save(t)} loading={savingId === t.id}>
                  Save
                </PrimaryBtn>
              </div>
            </div>
          </Card>
        ))}

        {items.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No testimonials yet.</p>
        )}
      </div>
    </>
  );
}
