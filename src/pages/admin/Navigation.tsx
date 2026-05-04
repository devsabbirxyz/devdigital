import { Trash2, Plus } from "lucide-react";
import { PageHeader, Card, Field, inputCls, GhostBtn, uploadToBucket } from "./_ui";
import { useSettingForm, SaveBar } from "./SettingsForm";
import { useState } from "react";
import { toast } from "sonner";

type NavData = {
  logo_url: string;
  brand_name: string;
  menu_items: { label: string; target: string }[];
};
const DEFAULT: NavData = {
  logo_url: "",
  brand_name: "PORTFOLIO",
  menu_items: [
    { label: "Home", target: "home" },
    { label: "Solutions", target: "services" },
    { label: "Plans", target: "pricing" },
    { label: "Contact", target: "contact" },
  ],
};

export default function Navigation() {
  const { data, setData, loading, saving, save } = useSettingForm<NavData>("navigation", DEFAULT);
  const [uploading, setUploading] = useState(false);

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  const updateItem = (i: number, patch: Partial<{ label: string; target: string }>) => {
    setData({ ...data, menu_items: data.menu_items.map((m, idx) => (idx === i ? { ...m, ...patch } : m)) });
  };

  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadToBucket(file, "logos");
    setUploading(false);
    if (!url) return toast.error("Upload failed");
    setData({ ...data, logo_url: url });
    toast.success("Logo uploaded");
  };

  return (
    <>
      <PageHeader title="Navigation" description="Customize your top navbar." />
      <Card className="space-y-4">
        <Field label="Brand Name">
          <input value={data.brand_name} maxLength={50} onChange={(e) => setData({ ...data, brand_name: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Logo" hint="Square image works best (e.g. 64×64).">
          <div className="flex items-center gap-4">
            {data.logo_url && <img src={data.logo_url} alt="logo" className="h-14 w-14 rounded-full object-cover glass" />}
            <input type="file" accept="image/*" onChange={handleLogo} className="text-sm" disabled={uploading} />
            {data.logo_url && <GhostBtn onClick={() => setData({ ...data, logo_url: "" })}>Remove</GhostBtn>}
          </div>
        </Field>

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Menu Items</span>
            <GhostBtn onClick={() => setData({ ...data, menu_items: [...data.menu_items, { label: "", target: "" }] })}>
              <Plus className="h-4 w-4 inline mr-1" /> Add
            </GhostBtn>
          </div>
          <div className="space-y-2">
            {data.menu_items.map((m, i) => (
              <div key={i} className="flex gap-2">
                <input value={m.label} maxLength={50} placeholder="Label" onChange={(e) => updateItem(i, { label: e.target.value })} className={inputCls} />
                <input value={m.target} maxLength={100} placeholder="Section id (e.g. services) or /path" onChange={(e) => updateItem(i, { target: e.target.value })} className={inputCls} />
                <button
                  onClick={() => setData({ ...data, menu_items: data.menu_items.filter((_, idx) => idx !== i) })}
                  className="p-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <SaveBar saving={saving} onSave={save} />
    </>
  );
}