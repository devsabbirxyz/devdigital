import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Star, RotateCcw, CheckCircle2, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader, Card, Field, inputCls, PrimaryBtn, GhostBtn } from "./_ui";
import { PRICING_PLANS, PricingPlan } from "@/components/sections/Pricing";

export default function PricingAdmin() {
  const [plans, setPlans] = useState<PricingPlan[]>(PRICING_PLANS);
  const [editing, setEditing] = useState<Partial<PricingPlan> | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load plans from site_settings (key: "pricing_plans") or fallback to PRICING_PLANS
  const load = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "pricing_plans")
        .maybeSingle();

      if (data?.value && Array.isArray(data.value) && data.value.length > 0) {
        setPlans(data.value as PricingPlan[]);
      } else {
        setPlans(PRICING_PLANS);
      }
    } catch {
      setPlans(PRICING_PLANS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveToSettings = async (newPlans: PricingPlan[]) => {
    setSaving(true);
    try {
      const { error } = await supabase.from("site_settings").upsert({
        key: "pricing_plans",
        value: newPlans as any,
      });

      if (error) {
        toast.error(`Error saving: ${error.message}`);
      } else {
        toast.success("Pricing plans saved successfully!");
        setPlans(newPlans);
        setEditing(null);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to save plans");
    } finally {
      setSaving(false);
    }
  };

  const onSavePlan = async () => {
    if (!editing?.name) return toast.error("Plan name is required");

    const updatedPlan: PricingPlan = {
      id: editing.id || `plan-${Date.now()}`,
      name: editing.name,
      description: editing.description || "",
      priceUSD: {
        monthly: editing.priceUSD?.monthly || "$0",
        annual: editing.priceUSD?.annual || "$0",
        period: editing.priceUSD?.period || "Per month",
      },
      priceBDT: {
        monthly: editing.priceBDT?.monthly || "৳০",
        annual: editing.priceBDT?.annual || "৳০",
        period: editing.priceBDT?.period || "প্রতি মাসে",
      },
      isPopular: !!editing.isPopular,
      ctaText: editing.ctaText || "Book Strategy Call",
      ctaVariant: editing.isPopular ? "popular" : editing.priceUSD?.monthly === "$0" ? "free" : "standard",
      bookingTopic: editing.bookingTopic || `${editing.name} Consultation`,
      coreDeliverables: editing.coreDeliverables || [],
      features: editing.features || [],
    };

    let newPlans: PricingPlan[];
    if (editing.id && plans.some((p) => p.id === editing.id)) {
      newPlans = plans.map((p) => (p.id === editing.id ? updatedPlan : p));
    } else {
      newPlans = [...plans, updatedPlan];
    }

    await saveToSettings(newPlans);
  };

  const removePlan = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pricing plan?")) return;
    const newPlans = plans.filter((p) => p.id !== id);
    await saveToSettings(newPlans);
  };

  const resetToDefault = async () => {
    if (!confirm("Reset all pricing plans to original 4 expert packages?")) return;
    await saveToSettings(PRICING_PLANS);
  };

  return (
    <>
      <PageHeader
        title="Pricing & Investment Packages"
        description="Configure pricing tiers, deliverables, USD/BDT rates, and call-to-action booking topics."
        action={
          <div className="flex items-center gap-2">
            <GhostBtn onClick={resetToDefault} title="Restore original 4 default plans">
              <RotateCcw className="h-4 w-4" /> Reset Default
            </GhostBtn>
            <PrimaryBtn
              onClick={() =>
                setEditing({
                  name: "New Tier",
                  description: "Package description",
                  priceUSD: { monthly: "$500", annual: "$400", period: "Per month" },
                  priceBDT: { monthly: "৳৬০,০০০", annual: "৳৪৮,০০০", period: "প্রতি মাসে" },
                  isPopular: false,
                  ctaText: "Get Started",
                  bookingTopic: "Custom Package Consultation",
                  coreDeliverables: ["Core deliverable 1", "Core deliverable 2", "Core deliverable 3"],
                  features: ["Feature 1", "Feature 2", "Feature 3"],
                })
              }
            >
              <Plus className="h-4 w-4" /> Add Package
            </PrimaryBtn>
          </div>
        }
      />

      {editing && (
        <Card className="mb-8 space-y-5 ring-1 ring-primary/40 bg-card/90 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-display font-bold text-lg text-white">
              {editing.id ? "Edit Package" : "Create New Package"}
            </h3>
            <span className="text-xs text-muted-foreground font-mono">ID: {editing.id || "auto"}</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Package Name">
              <input
                value={editing.name ?? ""}
                maxLength={60}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className={inputCls}
                placeholder="e.g. Growth Engine"
              />
            </Field>

            <label className="flex items-center gap-2 pt-6 cursor-pointer">
              <input
                type="checkbox"
                checked={!!editing.isPopular}
                onChange={(e) => setEditing({ ...editing, isPopular: e.target.checked })}
                className="h-4 w-4 accent-cyan-500 rounded"
              />
              <span className="text-sm font-semibold text-white">Highlight as "Most Popular" (Neon Laser Glow)</span>
            </label>
          </div>

          <Field label="Tagline / Short Description">
            <textarea
              value={editing.description ?? ""}
              rows={2}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              className={inputCls + " resize-none"}
              placeholder="e.g. Scale your revenue with high-ROAS Meta & Google ad management, CAPI tracking..."
            />
          </Field>

          {/* Pricing Grid USD & BDT */}
          <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" /> USD Pricing
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Monthly ($)">
                  <input
                    value={editing.priceUSD?.monthly ?? "$0"}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        priceUSD: { ...editing.priceUSD!, monthly: e.target.value },
                      })
                    }
                    className={inputCls}
                    placeholder="$490"
                  />
                </Field>
                <Field label="Annual ($)">
                  <input
                    value={editing.priceUSD?.annual ?? "$0"}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        priceUSD: { ...editing.priceUSD!, annual: e.target.value },
                      })
                    }
                    className={inputCls}
                    placeholder="$365"
                  />
                </Field>
              </div>
              <Field label="USD Period Text">
                <input
                  value={editing.priceUSD?.period ?? "Per month"}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      priceUSD: { ...editing.priceUSD!, period: e.target.value },
                    })
                  }
                  className={inputCls}
                  placeholder="Per month"
                />
              </Field>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <span>৳</span> BDT Pricing
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Monthly (৳)">
                  <input
                    value={editing.priceBDT?.monthly ?? "৳০"}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        priceBDT: { ...editing.priceBDT!, monthly: e.target.value },
                      })
                    }
                    className={inputCls}
                    placeholder="৳৫৮,০০০"
                  />
                </Field>
                <Field label="Annual (৳)">
                  <input
                    value={editing.priceBDT?.annual ?? "৳০"}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        priceBDT: { ...editing.priceBDT!, annual: e.target.value },
                      })
                    }
                    className={inputCls}
                    placeholder="৳৪৪,০০০"
                  />
                </Field>
              </div>
              <Field label="BDT Period Text">
                <input
                  value={editing.priceBDT?.period ?? "প্রতি মাসে"}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      priceBDT: { ...editing.priceBDT!, period: e.target.value },
                    })
                  }
                  className={inputCls}
                  placeholder="প্রতি মাসে"
                />
              </Field>
            </div>
          </div>

          {/* CTA & Booking Settings */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Button CTA Text">
              <input
                value={editing.ctaText ?? "Book Strategy Call"}
                onChange={(e) => setEditing({ ...editing, ctaText: e.target.value })}
                className={inputCls}
                placeholder="e.g. Book Free Meeting"
              />
            </Field>

            <Field label="Booking Calendar Topic" hint="Auto-fills the 30-min booking modal with this title">
              <input
                value={editing.bookingTopic ?? ""}
                onChange={(e) => setEditing({ ...editing, bookingTopic: e.target.value })}
                className={inputCls}
                placeholder="e.g. Growth Engine Plan Strategy Call"
              />
            </Field>
          </div>

          {/* Core Deliverables (Highlighted Box on Card) */}
          <Field
            label="Top 3 Core Deliverables"
            hint="Enter 1 deliverable per line. These appear prominently in the middle section of the card."
          >
            <textarea
              value={(editing.coreDeliverables ?? []).join("\n")}
              rows={3}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  coreDeliverables: e.target.value.split("\n").filter((l) => l.trim()),
                })
              }
              className={inputCls + " resize-none font-sans text-xs"}
              placeholder="High-ROAS Meta & Google Ad Campaign Scaling&#10;Server-Side Meta CAPI (99% Match) + Speed CRO&#10;Automated Instant CRM & WhatsApp Lead Routing"
            />
          </Field>

          {/* Detailed Features List */}
          <Field
            label="Detailed Feature Checklist"
            hint="Enter 1 feature per line. Shown as bullet points with checkmarks."
          >
            <textarea
              value={(editing.features ?? []).join("\n")}
              rows={5}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  features: e.target.value.split("\n").filter((l) => l.trim()),
                })
              }
              className={inputCls + " resize-y font-sans text-xs"}
              placeholder="Everything in Free Discovery&#10;Meta & Google Ads campaign scaling&#10;Server-side Meta CAPI (99% match rate)&#10;Weekly video report with Sabbir"
            />
          </Field>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <GhostBtn onClick={() => setEditing(null)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={onSavePlan} loading={saving}>
              Save Package
            </PrimaryBtn>
          </div>
        </Card>
      )}

      {/* Package List Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-muted-foreground font-mono text-sm">
            Loading pricing packages...
          </div>
        ) : plans.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No pricing plans configured.
          </div>
        ) : (
          plans.map((p) => (
            <Card
              key={p.id}
              className={`flex flex-col justify-between transition-all duration-200 ${
                p.isPopular ? "border-cyan-400/50 bg-[#101726]/90 shadow-[0_0_25px_rgba(6,182,212,0.2)]" : ""
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-white uppercase">{p.name}</span>
                    {p.isPopular && (
                      <span className="ml-2 inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditing(p)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                      title="Edit plan"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => removePlan(p.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/15 text-destructive"
                      title="Delete plan"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="my-2 p-2 rounded-lg bg-black/40 border border-white/5 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">USD:</span>
                    <span className="font-bold text-cyan-300">
                      {p.priceUSD.monthly} / {p.priceUSD.annual}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">BDT:</span>
                    <span className="font-bold text-emerald-300">
                      {p.priceBDT.monthly} / {p.priceBDT.annual}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground line-clamp-2 mb-3">{p.description}</p>

                {/* Core deliverables */}
                {p.coreDeliverables && p.coreDeliverables.length > 0 && (
                  <div className="mb-3 p-2 rounded bg-white/[0.02] border border-white/5">
                    <span className="text-[9px] font-mono text-cyan-400 font-bold block mb-1">KEY DELIVERABLES:</span>
                    <ul className="text-[10px] text-slate-300 space-y-0.5">
                      {p.coreDeliverables.map((d, i) => (
                        <li key={i} className="truncate">• {d}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Features Count */}
                <span className="text-[10px] text-muted-foreground font-mono">
                  {p.features?.length || 0} features included
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono">{p.ctaText}</span>
                <button
                  onClick={() => setEditing(p)}
                  className="text-cyan-400 font-bold hover:underline"
                >
                  Edit Package →
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}