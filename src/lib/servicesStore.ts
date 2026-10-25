import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { services as defaultServices, ServiceSection } from "@/data/services";
import { toast } from "sonner";

const STORAGE_KEY = "services_content";
const EVENT_NAME = "services_content_updated";

/**
 * Fetch the latest services list from Supabase or fallback to localStorage / defaultServices
 */
export async function getServicesContent(): Promise<ServiceSection[]> {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", STORAGE_KEY)
      .maybeSingle();

    if (!error && data?.value && Array.isArray(data.value) && data.value.length > 0) {
      const parsed = data.value as unknown as ServiceSection[];
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch (err) {
    console.warn("Failed to fetch services_content from Supabase, checking local cache", err);
  }

  // Fallback to localStorage
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as ServiceSection[];
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
  }

  return defaultServices;
}

/**
 * Persist updated services list to Supabase and localStorage
 */
export async function saveServicesContent(updatedServices: ServiceSection[]): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Save to local storage for instant offline/client responsiveness
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedServices));
      window.dispatchEvent(new Event(EVENT_NAME));
    }

    // 2. Persist to Supabase site_settings
    const { error } = await supabase
      .from("site_settings")
      .upsert({
        key: STORAGE_KEY,
        value: updatedServices as any,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.warn("Supabase upsert warning:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Failed to save services_content", err);
    return { success: false, error: err?.message || "Unknown error occurred" };
  }
}

/**
 * Reset services back to default factory starter copy
 */
export async function resetServicesContent(): Promise<{ success: boolean; error?: string }> {
  const result = await saveServicesContent(defaultServices);
  return result;
}

/**
 * React hook to consume and reactively update services across the site
 */
export function useServicesContent() {
  const [servicesData, setServicesData] = useState<ServiceSection[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return defaultServices;
  });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getServicesContent();
    setServicesData(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();

    const handleUpdate = () => {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) setServicesData(parsed);
        }
      } catch {}
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [load]);

  const save = async (newData: ServiceSection[]) => {
    setServicesData(newData);
    const res = await saveServicesContent(newData);
    if (!res.success) {
      toast.error(res.error || "Failed to persist to database, saved locally");
    } else {
      toast.success("Services content saved successfully");
    }
    return res;
  };

  const reset = async () => {
    setServicesData(defaultServices);
    const res = await resetServicesContent();
    if (res.success) {
      toast.success("Reset to default starter content");
    } else {
      toast.error(res.error || "Failed to reset");
    }
    return res;
  };

  return {
    services: servicesData,
    loading,
    saveServices: save,
    resetServices: reset,
    reload: load,
  };
}
