import { supabase } from "@/integrations/supabase/client";

export async function logActivity(action: string, entity?: string, details?: Record<string, unknown>) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await supabase.from("activity_logs").insert({
      user_id: session.user.id,
      user_email: session.user.email,
      action,
      entity: entity ?? null,
      details: (details as never) ?? null,
    });
  } catch {
    // silent
  }
}