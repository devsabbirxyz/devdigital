import { supabase } from "@/integrations/supabase/client";

type WANotifySettings = {
  notify_enabled?: boolean;
  notify_phone?: string;
  callmebot_apikey?: string;
};

export async function sendWhatsAppNotification(payload: {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  plan?: string | null;
}) {
  try {
    const { data: row } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "whatsapp")
      .maybeSingle();
    const cfg = (row?.value as WANotifySettings) || {};
    if (!cfg.notify_enabled || !cfg.notify_phone || !cfg.callmebot_apikey) return;

    const text =
      `New Contact Form Submission!\n` +
      `Name: ${payload.name}\n` +
      `Email: ${payload.email}\n` +
      `Phone: ${payload.phone || "-"}\n` +
      `Message: ${payload.message}` +
      (payload.plan ? `\nPlan: ${payload.plan}` : "");

    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
      cfg.notify_phone
    )}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(cfg.callmebot_apikey)}`;
    // no-cors: CallMeBot accepts simple GET; we don't need response
    await fetch(url, { method: "GET", mode: "no-cors" });
  } catch (e) {
    console.warn("WhatsApp notify failed", e);
  }
}
