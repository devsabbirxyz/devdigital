import { useEffect, useState } from "react";
import { Calculator, RotateCcw, Save, Sparkles, DollarSign, TrendingUp, HelpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader, Card, Field, inputCls, PrimaryBtn, GhostBtn } from "./_ui";

export type RoiSettings = {
  usd_to_bdt: number;
  section_title: string;
  section_subtitle: string;
  default_to_zero: boolean;
  conservative_mult: number;
  realistic_mult: number;
  optimistic_mult: number;
  whatsapp_number: string;
  disclaimer: string;
};

export const DEFAULT_ROI_SETTINGS: RoiSettings = {
  usd_to_bdt: 120,
  section_title: "Calculate Your ROI",
  section_subtitle: "See how much you can earn from investing in digital marketing, web development or AI automation.",
  default_to_zero: true,
  conservative_mult: 0.7,
  realistic_mult: 1.0,
  optimistic_mult: 1.3,
  whatsapp_number: "8801941130981",
  disclaimer: "*Estimates only. Actual results depend on your business and market.",
};

export default function RoiAdmin() {
  const [settings, setSettings] = useState<RoiSettings>(DEFAULT_ROI_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "roi_calculator_settings")
          .maybeSingle();

        if (data?.value && typeof data.value === "object") {
          setSettings({ ...DEFAULT_ROI_SETTINGS, ...(data.value as Partial<RoiSettings>) });
        }
      } catch {
        setSettings(DEFAULT_ROI_SETTINGS);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("site_settings").upsert({
        key: "roi_calculator_settings",
        value: settings as any,
      });

      if (error) {
        toast.error(`Error saving: ${error.message}`);
      } else {
        toast.success("ROI Calculator settings saved!");
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Reset ROI settings to default?")) return;
    setSettings(DEFAULT_ROI_SETTINGS);
    await supabase.from("site_settings").upsert({
      key: "roi_calculator_settings",
      value: DEFAULT_ROI_SETTINGS as any,
    });
    toast.success("Reset to defaults successfully!");
  };

  if (loading) {
    return <div className="py-12 text-center text-muted-foreground font-mono text-sm">Loading ROI configuration...</div>;
  }

  return (
    <>
      <PageHeader
        title="Interactive ROI Calculator Settings"
        description="Configure currency exchange rates, forecasting multipliers, copy, and zero-default behaviors."
        action={
          <div className="flex items-center gap-2">
            <GhostBtn onClick={handleReset} title="Restore standard defaults">
              <RotateCcw className="h-4 w-4" /> Reset
            </GhostBtn>
            <PrimaryBtn onClick={handleSave} loading={saving}>
              <Save className="h-4 w-4" /> Save Settings
            </PrimaryBtn>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Core Behavior Card */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
            <Calculator className="w-4 h-4" />
            <span>Core Calculation Engine</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="USD to BDT Exchange Rate (1 USD = ? BDT)">
              <input
                type="number"
                value={settings.usd_to_bdt}
                onChange={(e) => setSettings({ ...settings, usd_to_bdt: Number(e.target.value) || 120 })}
                className={inputCls}
                placeholder="120"
              />
            </Field>

            <Field label="Default State on First Visit">
              <label className="flex items-center gap-2 pt-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.default_to_zero}
                  onChange={(e) => setSettings({ ...settings, default_to_zero: e.target.checked })}
                  className="h-4 w-4 accent-cyan-500 rounded"
                />
                <span className="text-sm font-semibold text-white">
                  Default all inputs to 0 (Calculates dynamically upon user input)
                </span>
              </label>
            </Field>
          </div>
        </Card>

        {/* Multipliers & Forecasting Card */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Forecast Scenario Multipliers</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Conservative Multiplier" hint="Default: 0.7x">
              <input
                type="number"
                step="0.05"
                value={settings.conservative_mult}
                onChange={(e) => setSettings({ ...settings, conservative_mult: parseFloat(e.target.value) || 0.7 })}
                className={inputCls}
              />
            </Field>

            <Field label="Realistic Multiplier" hint="Default: 1.0x">
              <input
                type="number"
                step="0.05"
                value={settings.realistic_mult}
                onChange={(e) => setSettings({ ...settings, realistic_mult: parseFloat(e.target.value) || 1.0 })}
                className={inputCls}
              />
            </Field>

            <Field label="Optimistic Multiplier" hint="Default: 1.3x">
              <input
                type="number"
                step="0.05"
                value={settings.optimistic_mult}
                onChange={(e) => setSettings({ ...settings, optimistic_mult: parseFloat(e.target.value) || 1.3 })}
                className={inputCls}
              />
            </Field>
          </div>
        </Card>

        {/* Copy & CTA Settings */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Headlines & Direct WhatsApp CTA</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Section Heading Title">
              <input
                value={settings.section_title}
                onChange={(e) => setSettings({ ...settings, section_title: e.target.value })}
                className={inputCls}
              />
            </Field>

            <Field label="WhatsApp Contact Number (Without +)">
              <input
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className={inputCls}
                placeholder="8801941130981"
              />
            </Field>
          </div>

          <Field label="Section Subtitle">
            <textarea
              value={settings.section_subtitle}
              rows={2}
              onChange={(e) => setSettings({ ...settings, section_subtitle: e.target.value })}
              className={inputCls + " resize-none"}
            />
          </Field>

          <Field label="Disclaimer Footnote">
            <input
              value={settings.disclaimer}
              onChange={(e) => setSettings({ ...settings, disclaimer: e.target.value })}
              className={inputCls}
            />
          </Field>

          <div className="flex justify-end pt-3 border-t border-white/10">
            <PrimaryBtn onClick={handleSave} loading={saving}>
              <Save className="h-4 w-4" /> Save Settings
            </PrimaryBtn>
          </div>
        </Card>
      </div>
    </>
  );
}
