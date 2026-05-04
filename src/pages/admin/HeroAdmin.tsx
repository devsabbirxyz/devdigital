import { useEffect, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader, Card, Field, inputCls, GhostBtn, uploadToBucket } from "./_ui";
import { useSettingForm, SaveBar } from "./SettingsForm";

type HeroData = { title: string; description: string; primary_cta: string; secondary_cta: string };
const DEFAULT: HeroData = {
  title: "Crafting Digital Experiences That Inspire",
  description: "Premium portfolio showcasing innovative design, cutting-edge development, and AI-powered automation solutions.",
  primary_cta: "Hire Me",
  secondary_cta: "View Work",
};

type HeroImage = { id: string; image_url: string; sort_order: number };

export default function HeroAdmin() {
  const { data, setData, loading, saving, save } = useSettingForm<HeroData>("hero", DEFAULT);
  const [images, setImages] = useState<HeroImage[]>([]);
  const [uploading, setUploading] = useState(false);

  const loadImages = async () => {
    const { data } = await supabase.from("hero_images").select("*").order("sort_order");
    setImages((data as HeroImage[]) || []);
  };
  useEffect(() => { loadImages(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    for (const f of files) {
      const url = await uploadToBucket(f, "hero");
      if (!url) { toast.error(`Upload failed: ${f.name}`); continue; }
      const next = images.length;
      const { error } = await supabase.from("hero_images").insert({ image_url: url, sort_order: next });
      if (error) toast.error(error.message);
    }
    setUploading(false);
    e.target.value = "";
    await loadImages();
    toast.success("Images uploaded");
  };

  const removeImage = async (id: string) => {
    const { error } = await supabase.from("hero_images").delete().eq("id", id);
    if (error) return toast.error(error.message);
    await loadImages();
  };

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <>
      <PageHeader title="Hero Section" description="Headline, CTAs and the rotating images." />
      <Card className="space-y-4 mb-6">
        <Field label="Headline">
          <input value={data.title} maxLength={150} onChange={(e) => setData({ ...data, title: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Description">
          <textarea value={data.description} maxLength={500} rows={3} onChange={(e) => setData({ ...data, description: e.target.value })} className={inputCls + " resize-none"} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Primary CTA">
            <input value={data.primary_cta} maxLength={30} onChange={(e) => setData({ ...data, primary_cta: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Secondary CTA">
            <input value={data.secondary_cta} maxLength={30} onChange={(e) => setData({ ...data, secondary_cta: e.target.value })} className={inputCls} />
          </Field>
        </div>
      </Card>
      <SaveBar saving={saving} onSave={save} />

      <Card className="mt-8">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-lg">Carousel Images</h3>
            <p className="text-xs text-muted-foreground">Recommended: 7 portrait images. Fallback assets are used if empty.</p>
          </div>
          <label className="cursor-pointer bg-gradient-primary text-white font-semibold px-5 py-2.5 rounded-xl neon-glow hover:scale-[1.02] transition-transform inline-flex items-center gap-2 text-sm">
            <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : "Upload"}
            <input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading} className="hidden" />
          </label>
        </div>
        {images.length === 0 ? (
          <p className="text-muted-foreground text-sm">No custom images yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative aspect-[3/4] rounded-xl overflow-hidden glass group">
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 bg-destructive/90 text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
                  aria-label="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}