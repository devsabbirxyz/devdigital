import { PageHeader, Card, Field, inputCls } from "./_ui";
import { useSettingForm, SaveBar } from "./SettingsForm";

type WAData = { enabled: boolean; phone_number: string; default_message: string };
const DEFAULT: WAData = { enabled: true, phone_number: "15551234567", default_message: "Hi! I am interested in your services." };

export default function WhatsAppAdmin() {
  const { data, setData, loading, saving, save } = useSettingForm<WAData>("whatsapp", DEFAULT);
  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <>
      <PageHeader title="WhatsApp Button" description="Floating button on every page." />
      <Card className="space-y-4">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={data.enabled} onChange={(e) => setData({ ...data, enabled: e.target.checked })} className="h-4 w-4 accent-primary" />
          <span className="text-sm font-medium">Enable WhatsApp button</span>
        </label>
        <Field label="Phone Number" hint="Country code + number, no spaces. e.g. 15551234567">
          <input value={data.phone_number} maxLength={20} onChange={(e) => setData({ ...data, phone_number: e.target.value.replace(/\D/g, "") })} className={inputCls} />
        </Field>
        <Field label="Default Message">
          <textarea value={data.default_message} maxLength={500} rows={3} onChange={(e) => setData({ ...data, default_message: e.target.value })} className={inputCls + " resize-none"} />
        </Field>
      </Card>
      <SaveBar saving={saving} onSave={save} />
    </>
  );
}