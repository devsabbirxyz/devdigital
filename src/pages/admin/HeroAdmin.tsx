import { useEffect, useState } from "react";
import { Trash2, Upload, Plus, Link2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader, Card, Field, inputCls, uploadToBucket } from "./_ui";
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
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const loadImages = async () => {
    const { data } = await supabase.from("hero_images").select("*").order("sort_order");
    setImages((data as HeroImage[]) || []);
  };
  useEffect(() => { loadImages(); }, []);

  const addRow = async () => {
    const { error } = await supabase.from("hero_images").insert({ image_url: "", sort_order: images.length });
    if (error) return toast.error(error.message);
    await loadImages();
  };

  const updateUrl = async (id: string, image_url: string) => {
    setImages((prev) => prev.map((i) => (i.id === id ? { ...i, image_url } : i)));
  };

  const saveUrl = async (id: string, image_url: string) => {
    const { error } = await supabase.from("hero_images").update({ image_url }).eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  };

  const handleRowUpload = async (id: string, file: File) => {
    setUploadingId(id);
    const url = await uploadToBucket(file, "hero");
    setUploadingId(null);
    if (!url) return toast.error("Upload failed");
    const { error } = await supabase.from("hero_images").update({ image_url: url }).eq("id", id);
    if (error) return toast.error(error.message);
    setImages((prev) => prev.map((i) => (i.id === id ? { ...i, image_url: url } : i)));
    toast.success("Image uploaded");
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
            <p className="text-xs text-muted-foreground">Recommended: 7 portrait images. Paste a URL or upload from device per row.</p>
          </div>
          <button
            onClick={addRow}
            className="bg-gradient-primary text-white font-semibold px-5 py-2.5 rounded-xl neon-glow hover:scale-[1.02] transition-transform inline-flex items-center gap-2 text-sm"
          >
            <Plus className="h-4 w-4" /> Add Image
          </button>
        </div>
        {images.length === 0 ? (
          <p className="text-muted-foreground text-sm">No custom images yet. Click "Add Image" to start.</p>
        ) : (
          <div className="space-y-3">
            {images.map((img, idx) => (
              <div key={img.id} className="flex items-center gap-3 glass rounded-xl p-3">
                <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted/30 flex items-center justify-center">
                  {img.image_url ? (
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-muted-foreground">No image</span>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Image {idx + 1}</div>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        value={img.image_url}
                        onChange={(e) => updateUrl(img.id, e.target.value)}
                        onBlur={(e) => saveUrl(img.id, e.target.value)}
                        placeholder="Paste image URL…"
                        className={inputCls + " pl-9"}
                      />
                    </div>
                    <label className="cursor-pointer glass rounded-xl px-3 py-2 text-xs font-medium hover:bg-white/5 transition inline-flex items-center gap-1.5 flex-shrink-0">
                      <Upload className="h-3.5 w-3.5" />
                      {uploadingId === img.id ? "Uploading…" : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingId === img.id}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleRowUpload(img.id, f);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>
                <button
                  onClick={() => removeImage(img.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive flex-shrink-0"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}