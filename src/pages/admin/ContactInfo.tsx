import { PageHeader, Card, Field, inputCls } from "./_ui";
import { useSettingForm, SaveBar } from "./SettingsForm";
import { FORMSUBMIT_NOTIFY_EMAIL } from "@/lib/formsubmit";

type ContactInfo = { email: string; phone: string; location: string };
const DEFAULT: ContactInfo = { email: "hello@portfolio.com", phone: "+1 (555) 123-4567", location: "New York, USA" };

export default function ContactInfoAdmin() {
  const { data, setData, loading, saving, save } = useSettingForm<ContactInfo>("contact", DEFAULT);
  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <>
      <PageHeader title="Contact Info" description="Shown in the contact section." />
      <Card className="mb-4">
        <p className="text-sm text-muted-foreground">
          Form submissions are emailed via Formsubmit.co to:
        </p>
        <p className="font-mono text-primary mt-1">{FORMSUBMIT_NOTIFY_EMAIL}</p>
      </Card>
      <Card className="space-y-4">
        <Field label="Email">
          <input type="email" value={data.email} maxLength={255} onChange={(e) => setData({ ...data, email: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Phone">
          <input value={data.phone} maxLength={50} onChange={(e) => setData({ ...data, phone: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Location">
          <input value={data.location} maxLength={100} onChange={(e) => setData({ ...data, location: e.target.value })} className={inputCls} />
        </Field>
      </Card>
      <SaveBar saving={saving} onSave={save} />
    </>
  );
}