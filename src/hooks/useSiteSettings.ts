import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const CACHE_PREFIX = "site_settings_cache:";

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeCache(key: string, value: unknown) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function useSiteSettings<T = any>(key: string, defaults: T) {
  const [data, setData] = useState<T>(() => {
    const cached = readCache<T>(key);
    if (!cached) return defaults;
    if (Array.isArray(defaults)) {
      return (Array.isArray(cached) ? cached : defaults) as T;
    }
    return (typeof cached === "object" && cached !== null
      ? { ...defaults, ...cached }
      : cached) as T;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data: row } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", key)
          .maybeSingle();

        if (active && row?.value) {
          if (Array.isArray(defaults)) {
            setData((Array.isArray(row.value) ? row.value : defaults) as T);
          } else if (typeof row.value === "object" && row.value !== null) {
            setData({ ...defaults, ...row.value } as T);
          } else {
            setData(row.value as T);
          }
          writeCache(key, row.value);
        }
      } catch (err) {
        console.warn(`useSiteSettings[${key}] error:`, err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, loading };
}
