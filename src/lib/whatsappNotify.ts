import { supabase } from "@/integrations/supabase/client";

export async function sendWhatsAppNotification(payload: {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  plan?: string | null;
}) {
  try {
    // API key is server-side only — call edge function which reads it via service role.
    await supabase.functions.invoke("whatsapp-notify", { body: payload });
  } catch (e) {
    console.warn("WhatsApp notify failed", e);
  }
}
