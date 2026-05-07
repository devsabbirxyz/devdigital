import { PageHeader, Card, Field, inputCls } from "./_ui";
import { useSettingForm, SaveBar } from "./SettingsForm";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, Send } from "lucide-react";

type WAData = {
  enabled: boolean;
  phone_number: string;
  default_message: string;
  notify_enabled: boolean;
  notify_phone: string;
  callmebot_apikey: string;
};
const DEFAULT: WAData = {
  enabled: true,
  phone_number: "15551234567",
  default_message: "Hi! I am interested in your services.",
  notify_enabled: false,
  notify_phone: "",
  callmebot_apikey: "",
};

export default function WhatsAppAdmin() {
  const { data, setData, loading, saving, save } = useSettingForm<WAData>("whatsapp", DEFAULT);
  const [testing, setTesting] = useState(false);
  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  const sendTest = async () => {
    if (!data.notify_phone || !data.callmebot_apikey) {
      toast.error("Enter phone and API key first");
      return;
    }
    setTesting(true);
    try {
      const text = "✅ Test notification from your portfolio admin panel.";
      const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
        data.notify_phone
      )}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(data.callmebot_apikey)}`;
      await fetch(url, { method: "GET", mode: "no-cors" });
      toast.success("Test sent! Check your WhatsApp.");
    } catch {
      toast.error("Failed to send test");
    } finally {
      setTesting(false);
    }
  };

  return (
    <>
      <PageHeader title="WhatsApp" description="Floating button + form-submit notifications." />
      <Card className="space-y-4">
        <h3 className="font-semibold text-sm tracking-wider text-muted-foreground">FLOATING BUTTON</h3>
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

      <Card className="space-y-4 mt-6">
        <div>
          <h3 className="font-semibold text-sm tracking-wider text-muted-foreground">FORM SUBMIT NOTIFICATIONS</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Get a WhatsApp message when someone submits the contact form. Powered by CallMeBot (free).
            <br />
            Setup: Add the bot <strong>+34 644 87 17 79</strong> on WhatsApp and send <em>"I allow callmebot to send me messages"</em>. You'll receive your API key.
          </p>
        </div>
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={data.notify_enabled} onChange={(e) => setData({ ...data, notify_enabled: e.target.checked })} className="h-4 w-4 accent-primary" />
          <span className="text-sm font-medium">Enable form-submit WhatsApp notifications</span>
        </label>
        <Field label="Your WhatsApp Number" hint="Country code + number, no spaces. e.g. 15551234567">
          <input value={data.notify_phone} maxLength={20} onChange={(e) => setData({ ...data, notify_phone: e.target.value.replace(/\D/g, "") })} className={inputCls} />
        </Field>
        <Field label="CallMeBot API Key">
          <input value={data.callmebot_apikey} maxLength={50} onChange={(e) => setData({ ...data, callmebot_apikey: e.target.value.trim() })} className={inputCls} />
        </Field>
        <button
          type="button"
          onClick={sendTest}
          disabled={testing}
          className="inline-flex items-center gap-2 bg-gradient-primary text-white text-sm font-semibold px-4 py-2 rounded-xl neon-glow hover:scale-[1.02] transition-transform disabled:opacity-60"
        >
          {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send Test Notification
        </button>
      </Card>

      <SaveBar saving={saving} onSave={save} />
    </>
  );
}