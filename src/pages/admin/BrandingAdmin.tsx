import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, Field, inputCls, uploadToBucket } from "./_ui";
import { useSettingForm, SaveBar } from "./SettingsForm";

type BrandingData = { favicon_url: string; logo_url: string };
const DEFAULT: BrandingData = { favicon_url: "", logo_url: "" };

export default function BrandingAdmin() {
  const { data, setData, loading, saving, save } = useSettingForm<BrandingData>("branding", DEFAULT);
  const [uploading, setUploading] = useState<"favicon" | "logo" | null>(null);

  const handleUpload = async (kind: "favicon" | "logo", file: File) => {
    setUploading(kind);
    const url = await uploadToBucket(file, "branding");
    setUploading(null);
    if (!url) return toast.error("Upload failed");
    setData({ ...data, [`${kind}_url`]: url } as BrandingData);
    toast.success("Uploaded — click Save Changes to apply");
  };

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <>
      <PageHeader title="Branding" description="Favicon and logo for the site." />
      <Card className="space-y-6">
        {(["favicon", "logo"] as const).map((kind) => {
          const url = kind === "favicon" ? data.favicon_url : data.logo_url;
          return (
            <Field key={kind} label={kind === "favicon" ? "Favicon" : "Logo"} hint={kind === "favicon" ? "Square PNG/ICO recommended (32x32 or larger)" : "Used wherever logo is displayed"}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl glass flex items-center justify-center overflow-hidden flex-shrink-0">
                  {url ? <img src={url} alt="" className="w-full h-full object-contain" /> : <span className="text-[10px] text-muted-foreground">None</span>}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    value={url}
                    onChange={(e) => setData({ ...data, [`${kind}_url`]: e.target.value } as BrandingData)}
                    placeholder="Paste URL or upload below"
                    className={inputCls}
                  />
                  <label className="cursor-pointer glass rounded-xl px-3 py-2 text-xs font-medium hover:bg-white/5 transition inline-flex items-center gap-1.5 w-fit">
                    {uploading === kind ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    {uploading === kind ? "Uploading…" : "Upload from device"}
                    <input
                      type="file"
                      accept={kind === "favicon" ? "image/png,image/x-icon,image/svg+xml,image/vnd.microsoft.icon" : "image/*"}
                      className="hidden"
                      disabled={uploading === kind}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleUpload(kind, f);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
            </Field>
          );
        })}
      </Card>
      <SaveBar saving={saving} onSave={save} />
    </>
  );
}