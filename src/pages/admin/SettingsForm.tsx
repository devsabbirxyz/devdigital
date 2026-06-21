import { useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PrimaryBtn } from "./_ui";
import { logActivity } from "@/lib/activityLog";

export function useSettingForm<T extends object>(key: string, defaults: T) {
  const [data, setData] = useState<T>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: row } = await supabase.from("site_settings").select("value").eq("key", key).maybeSingle();
      if (row?.value) setData({ ...defaults, ...(row.value as object) } as T);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert({ key, value: data as any });
    setSaving(false);
    if (error) toast.error("Could not save: " + error.message);
    else {
      toast.success("Saved!");
      logActivity("update", `site_settings:${key}`);
    }
  };

  return { data, setData, loading, saving, save };
}

export function SaveBar({ saving, onSave, children }: { saving: boolean; onSave: () => void; children?: ReactNode }) {
  return (
    <div className="mt-6 flex items-center justify-end gap-3">
      {children}
      <PrimaryBtn onClick={onSave} loading={saving}>Save Changes</PrimaryBtn>
    </div>
  );
}