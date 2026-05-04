import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, Card, Field, inputCls, GhostBtn, uploadToBucket } from "./_ui";
import { useSettingForm, SaveBar } from "./SettingsForm";

type AboutData = { title: string; tagline: string; bio: string; image_url: string };
const DEFAULT: AboutData = {
  title: "About Me",
  tagline: "Designer · Developer · AI Specialist",
  bio: "I build modern, future-ready digital products that blend stunning design with powerful technology.",
  image_url: "",
};

export default function AboutAdmin() {
  const { data, setData, loading, saving, save } = useSettingForm<AboutData>("about", DEFAULT);
  const [uploading, setUploading] = useState(false);

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadToBucket(file, "about");
    setUploading(false);
    if (!url) return toast.error("Upload failed");
    setData({ ...data, image_url: url });
  };

  return (
    <>
      <PageHeader title="About Section" />
      <Card className="space-y-4">
        <Field label="Heading">
          <input value={data.title} maxLength={100} onChange={(e) => setData({ ...data, title: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Tagline">
          <input value={data.tagline} maxLength={150} onChange={(e) => setData({ ...data, tagline: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Bio">
          <textarea value={data.bio} maxLength={1000} rows={5} onChange={(e) => setData({ ...data, bio: e.target.value })} className={inputCls + " resize-none"} />
        </Field>
        <Field label="Profile Image">
          <div className="flex items-center gap-4">
            {data.image_url && <img src={data.image_url} alt="" className="h-20 w-20 rounded-full object-cover glass" />}
            <input type="file" accept="image/*" onChange={handleImage} disabled={uploading} className="text-sm" />
            {data.image_url && <GhostBtn onClick={() => setData({ ...data, image_url: "" })}>Remove</GhostBtn>}
          </div>
        </Field>
      </Card>
      <SaveBar saving={saving} onSave={save} />
    </>
  );
}