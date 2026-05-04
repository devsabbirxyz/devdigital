import { PageHeader, Card, Field, inputCls, GhostBtn } from "./_ui";
import { useSettingForm, SaveBar } from "./SettingsForm";

type IntroData = { enabled: boolean; video_url: string; show_once: boolean };
const DEFAULT: IntroData = { enabled: false, video_url: "", show_once: true };

export default function IntroVideoAdmin() {
  const { data, setData, loading, saving, save } = useSettingForm<IntroData>("intro_video", DEFAULT);
  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <>
      <PageHeader title="Intro Video" description="Popup that plays for visitors." />
      <Card className="space-y-4">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={data.enabled} onChange={(e) => setData({ ...data, enabled: e.target.checked })} className="h-4 w-4 accent-primary" />
          <span className="text-sm font-medium">Show intro video popup</span>
        </label>
        <Field label="Video URL" hint="YouTube, Vimeo or direct .mp4 URL">
          <input value={data.video_url} maxLength={500} onChange={(e) => setData({ ...data, video_url: e.target.value })} className={inputCls} />
        </Field>
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={data.show_once} onChange={(e) => setData({ ...data, show_once: e.target.checked })} className="h-4 w-4 accent-primary" />
          <span className="text-sm font-medium">Show only once per visitor</span>
        </label>
        <div className="pt-2">
          <GhostBtn onClick={() => { localStorage.removeItem("intro_video_seen_v1"); }}>Reset "seen" flag (this browser)</GhostBtn>
        </div>
      </Card>
      <SaveBar saving={saving} onSave={save} />
    </>
  );
}