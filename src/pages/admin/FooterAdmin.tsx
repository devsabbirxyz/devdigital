import { Plus, Trash2 } from "lucide-react";
import { PageHeader, Card, Field, inputCls, GhostBtn } from "./_ui";
import { useSettingForm, SaveBar } from "./SettingsForm";

type FooterData = {
  brand_name: string;
  slogan: string;
  phone: string;
  email: string;
  location: string;
  copyright: string;
  socials: { platform: string; url: string }[];
};
const DEFAULT: FooterData = {
  brand_name: "PORTFOLIO",
  slogan: "Building the future, one pixel at a time.",
  phone: "+1 (555) 123-4567",
  email: "hello@portfolio.com",
  location: "New York, USA",
  copyright: "© 2026 Portfolio. All Rights Reserved.",
  socials: [
    { platform: "facebook", url: "" },
    { platform: "instagram", url: "" },
    { platform: "linkedin", url: "" },
    { platform: "whatsapp", url: "" },
  ],
};

export default function FooterAdmin() {
  const { data, setData, loading, saving, save } = useSettingForm<FooterData>("footer", DEFAULT);
  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <>
      <PageHeader title="Footer" />
      <Card className="space-y-4 mb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Brand Name"><input value={data.brand_name} maxLength={50} onChange={(e) => setData({ ...data, brand_name: e.target.value })} className={inputCls} /></Field>
          <Field label="Slogan"><input value={data.slogan} maxLength={150} onChange={(e) => setData({ ...data, slogan: e.target.value })} className={inputCls} /></Field>
          <Field label="Phone"><input value={data.phone} maxLength={50} onChange={(e) => setData({ ...data, phone: e.target.value })} className={inputCls} /></Field>
          <Field label="Email"><input value={data.email} maxLength={255} onChange={(e) => setData({ ...data, email: e.target.value })} className={inputCls} /></Field>
          <Field label="Location"><input value={data.location} maxLength={100} onChange={(e) => setData({ ...data, location: e.target.value })} className={inputCls} /></Field>
          <Field label="Copyright"><input value={data.copyright} maxLength={150} onChange={(e) => setData({ ...data, copyright: e.target.value })} className={inputCls} /></Field>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold">Social Links</h3>
          <GhostBtn onClick={() => setData({ ...data, socials: [...data.socials, { platform: "", url: "" }] })}>
            <Plus className="h-4 w-4 inline mr-1" /> Add
          </GhostBtn>
        </div>
        <div className="space-y-2">
          {data.socials.map((s, i) => (
            <div key={i} className="flex gap-2">
              <select
                value={s.platform}
                onChange={(e) => setData({ ...data, socials: data.socials.map((x, idx) => idx === i ? { ...x, platform: e.target.value } : x) })}
                className={inputCls + " max-w-[180px]"}
              >
                <option value="">Platform…</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="twitter">Twitter / X</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="github">GitHub</option>
              </select>
              <input
                value={s.url}
                placeholder="https://…"
                maxLength={500}
                onChange={(e) => setData({ ...data, socials: data.socials.map((x, idx) => idx === i ? { ...x, url: e.target.value } : x) })}
                className={inputCls}
              />
              <button
                onClick={() => setData({ ...data, socials: data.socials.filter((_, idx) => idx !== i) })}
                className="p-2.5 rounded-xl text-destructive hover:bg-destructive/10"
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>
      <SaveBar saving={saving} onSave={save} />
    </>
  );
}