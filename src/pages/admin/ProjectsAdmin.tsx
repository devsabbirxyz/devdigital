import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, ExternalLink, RotateCcw, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageHeader, Card, Field, inputCls, PrimaryBtn, GhostBtn, uploadToBucket } from "./_ui";
import { CURATED_SAMPLE_PROJECTS, EnrichedProject } from "@/components/sections/Projects";

export default function ProjectsAdmin() {
  const [list, setList] = useState<EnrichedProject[]>(CURATED_SAMPLE_PROJECTS);
  const [editing, setEditing] = useState<Partial<EnrichedProject> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "portfolio_projects")
        .maybeSingle();

      if (data?.value && Array.isArray(data.value) && data.value.length > 0) {
        setList(data.value as EnrichedProject[]);
      } else {
        setList(CURATED_SAMPLE_PROJECTS);
      }
    } catch {
      setList(CURATED_SAMPLE_PROJECTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveList = async (newList: EnrichedProject[]) => {
    setSaving(true);
    try {
      const { error } = await supabase.from("site_settings").upsert({
        key: "portfolio_projects",
        value: newList as any,
      });

      if (error) {
        toast.error(`Error saving: ${error.message}`);
      } else {
        toast.success("Portfolio projects updated successfully!");
        setList(newList);
        setEditing(null);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to save projects");
    } finally {
      setSaving(false);
    }
  };

  const onSave = async () => {
    if (!editing?.title || !editing.description) {
      return toast.error("Title and description required");
    }

    const updatedItem: EnrichedProject = {
      id: editing.id || `project-${Date.now()}`,
      title: editing.title,
      description: editing.description,
      image_url: editing.image_url ?? null,
      category: editing.category || "Web Development",
      subCategory: editing.subCategory || "",
      client: editing.client || "Client Project",
      live_url: editing.live_url || "",
      live_domain: editing.live_domain || (editing.live_url ? editing.live_url.replace(/https?:\/\//, "").replace(/\/.*$/, "") : ""),
      metrics: editing.metrics || { label: "Performance", value: "High ROI" },
      resultChip: editing.resultChip || "🚀 Scaled",
      timeline: editing.timeline || "2-4 Weeks",
      tags: editing.tags || ["Next.js", "CRO", "Tailwind CSS"],
      featured: editing.featured !== false,
      sort_order: editing.sort_order ?? list.length,
      caseStudyDetails: editing.caseStudyDetails || {
        challenge: "Client bottleneck...",
        solution: "High-performance architecture...",
        highlights: ["Instant speed", "High conversion"],
      },
    };

    let updatedList: EnrichedProject[];
    if (editing.id && list.some((p) => p.id === editing.id)) {
      updatedList = list.map((p) => (p.id === editing.id ? updatedItem : p));
    } else {
      updatedList = [...list, updatedItem];
    }

    await saveList(updatedList);
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const updated = list.filter((p) => p.id !== id);
    await saveList(updated);
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    const url = await uploadToBucket(file, "projects");
    setUploading(false);
    if (!url) return toast.error("Upload failed");
    setEditing({ ...editing, image_url: url });
  };

  const resetToDefault = async () => {
    if (!confirm("Reset to original 7 authentic showcase projects?")) return;
    await saveList(CURATED_SAMPLE_PROJECTS);
  };

  return (
    <>
      <PageHeader
        title="Projects & Showcase Manager"
        description="Add, edit, feature, and re-order portfolio projects, case studies, and live client domains."
        action={
          <div className="flex items-center gap-2">
            <GhostBtn onClick={resetToDefault} title="Restore 7 default showcase projects">
              <RotateCcw className="h-4 w-4" /> Reset Default
            </GhostBtn>
            <PrimaryBtn
              onClick={() =>
                setEditing({
                  title: "",
                  description: "",
                  category: "Web Development",
                  subCategory: "E-Commerce / Funnel",
                  client: "Client Brand",
                  live_url: "https://",
                  live_domain: "",
                  metrics: { label: "ROAS / Conversion", value: "3.5x ROAS • 0.5s Speed" },
                  resultChip: "🚀 3.5x ROAS",
                  timeline: "3 Weeks",
                  tags: ["Next.js", "Tailwind CSS", "TypeScript"],
                  featured: true,
                  sort_order: list.length,
                  caseStudyDetails: {
                    challenge: "Describe the core challenge faced by the client...",
                    solution: "Explain how you solved it with web development, ads, or AI...",
                    highlights: ["Highlight point 1", "Highlight point 2"],
                  },
                })
              }
            >
              <Plus className="h-4 w-4" /> Add Project
            </PrimaryBtn>
          </div>
        }
      />

      {editing && (
        <Card className="mb-8 space-y-4 ring-1 ring-primary/40 bg-card/90 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-display font-semibold text-lg text-white">
              {editing.id ? "Edit Project" : "Add New Project"}
            </h3>
            {editing.live_url && (
              <a
                href={editing.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Visit Live URL</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <Field label="Project Title">
            <input
              value={editing.title ?? ""}
              maxLength={150}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              className={inputCls}
              placeholder="e.g. Gorur Ghash — High-Converting E-Commerce Fashion Platform"
            />
          </Field>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Pillar Category">
              <select
                value={editing.category ?? "Web Development"}
                onChange={(e) => setEditing({ ...editing, category: e.target.value as any })}
                className={inputCls}
              >
                <option value="Web Development">Web Development</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="AI Automation">AI Automation</option>
              </select>
            </Field>

            <Field label="Sub-Category / Industry">
              <input
                value={editing.subCategory ?? ""}
                onChange={(e) => setEditing({ ...editing, subCategory: e.target.value })}
                className={inputCls}
                placeholder="e.g. Fashion E-Commerce"
              />
            </Field>

            <Field label="Client Name">
              <input
                value={editing.client ?? ""}
                onChange={(e) => setEditing({ ...editing, client: e.target.value })}
                className={inputCls}
                placeholder="e.g. Gorur Ghash BD"
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              value={editing.description ?? ""}
              rows={3}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              className={inputCls + " resize-none"}
              placeholder="Detailed description of the deliverables and transformation achieved..."
            />
          </Field>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Live Website URL">
              <input
                value={editing.live_url ?? ""}
                onChange={(e) => setEditing({ ...editing, live_url: e.target.value })}
                className={inputCls}
                placeholder="https://example.com"
              />
            </Field>

            <Field label="Result Badge Chip">
              <input
                value={editing.resultChip ?? ""}
                onChange={(e) => setEditing({ ...editing, resultChip: e.target.value })}
                className={inputCls}
                placeholder="e.g. 📈 4.2x ROAS | 0.5s Speed"
              />
            </Field>

            <Field label="Timeline">
              <input
                value={editing.timeline ?? ""}
                onChange={(e) => setEditing({ ...editing, timeline: e.target.value })}
                className={inputCls}
                placeholder="e.g. 3 Weeks"
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Metrics Label & Value">
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={editing.metrics?.label ?? "Outcome"}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      metrics: { ...editing.metrics!, label: e.target.value },
                    })
                  }
                  className={inputCls}
                  placeholder="Metric Label"
                />
                <input
                  value={editing.metrics?.value ?? ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      metrics: { ...editing.metrics!, value: e.target.value },
                    })
                  }
                  className={inputCls}
                  placeholder="e.g. 4.2x ROAS • ৳2.4M/mo"
                />
              </div>
            </Field>

            <Field label="Tags (Comma separated)">
              <input
                value={(editing.tags ?? []).join(", ")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                className={inputCls}
                placeholder="Next.js, Meta CAPI, Tailwind CSS, AI Bot"
              />
            </Field>
          </div>

          <Field label="Project Banner Image" hint="Upload file or enter image URL">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                {editing.image_url && (
                  <img
                    src={editing.image_url}
                    alt=""
                    className="h-20 w-32 rounded-lg object-cover border border-white/20 glass"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  disabled={uploading}
                  className="text-sm text-slate-300"
                />
                {editing.image_url && (
                  <GhostBtn onClick={() => setEditing({ ...editing, image_url: null })}>
                    Remove
                  </GhostBtn>
                )}
              </div>
              <input
                value={editing.image_url ?? ""}
                onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                className={inputCls}
                placeholder="Or paste direct image URL (e.g. /src/assets/... or https://...)"
              />
            </div>
          </Field>

          {/* Case Study Challenge & Solution */}
          <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10">
            <Field label="Case Study: Challenge">
              <textarea
                value={editing.caseStudyDetails?.challenge ?? ""}
                rows={3}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    caseStudyDetails: {
                      ...editing.caseStudyDetails!,
                      challenge: e.target.value,
                    },
                  })
                }
                className={inputCls + " resize-none text-xs"}
                placeholder="The business bottleneck or technical barrier..."
              />
            </Field>

            <Field label="Case Study: Solution">
              <textarea
                value={editing.caseStudyDetails?.solution ?? ""}
                rows={3}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    caseStudyDetails: {
                      ...editing.caseStudyDetails!,
                      solution: e.target.value,
                    },
                  })
                }
                className={inputCls + " resize-none text-xs"}
                placeholder="How our architecture and optimization solved it..."
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Sort Order">
              <input
                type="number"
                value={editing.sort_order ?? 0}
                onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
                className={inputCls}
              />
            </Field>
            <label className="flex items-end gap-2 pb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.featured ?? true}
                onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                className="h-4 w-4 accent-cyan-500 rounded"
              />
              <span className="text-sm font-semibold text-white">Featured (Shown on Homepage)</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <GhostBtn onClick={() => setEditing(null)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={onSave} loading={saving}>
              Save Project
            </PrimaryBtn>
          </div>
        </Card>
      )}

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-muted-foreground font-mono text-sm">
            Loading portfolio projects...
          </div>
        ) : list.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No projects configured.
          </div>
        ) : (
          list.map((p) => (
            <Card key={p.id} className="!p-0 overflow-hidden flex flex-col justify-between">
              <div>
                {p.image_url && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                    <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/80 border border-cyan-400/40 text-cyan-300">
                      {p.category}
                    </span>
                    {p.resultChip && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 border border-emerald-400/40 text-emerald-300">
                        {p.resultChip}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h3 className="font-bold text-white text-sm line-clamp-1">{p.title}</h3>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        {p.client} • {p.timeline}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {p.live_url && (
                        <a
                          href={p.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-white/10 text-cyan-400"
                          title="Open live website"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => setEditing(p)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                        title="Edit project"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => remove(p.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/15 text-destructive"
                        title="Delete project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {p.tags?.slice(0, 3).map((t, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/[0.04] text-slate-300 border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                    {p.tags && p.tags.length > 3 && (
                      <span className="text-[9px] font-mono text-slate-400">+{p.tags.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 flex justify-between items-center text-xs border-t border-white/5 mt-2">
                <span className="text-[10px] font-mono text-cyan-300">{p.live_domain || "Active Project"}</span>
                <button
                  onClick={() => setEditing(p)}
                  className="text-cyan-400 font-bold hover:underline"
                >
                  Edit Details →
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}