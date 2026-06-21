import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Payload {
  name?: string;
  email?: string;
  phone?: string | null;
  message?: string;
  plan?: string | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as Payload;
    if (!body?.name || !body?.email || !body?.message) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: row } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "whatsapp")
      .maybeSingle();

    const cfg = (row?.value ?? {}) as {
      notify_enabled?: boolean;
      notify_phone?: string;
      callmebot_apikey?: string;
    };

    if (!cfg.notify_enabled || !cfg.notify_phone || !cfg.callmebot_apikey) {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const text =
      `New Contact Form Submission!\n` +
      `Name: ${body.name}\n` +
      `Email: ${body.email}\n` +
      `Phone: ${body.phone || "-"}\n` +
      `Message: ${body.message}` +
      (body.plan ? `\nPlan: ${body.plan}` : "");

    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
      cfg.notify_phone
    )}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(cfg.callmebot_apikey)}`;

    await fetch(url, { method: "GET" }).catch(() => {});

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("whatsapp-notify error", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});