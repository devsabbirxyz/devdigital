import { useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  RotateCcw,
  Save,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Sparkles,
  Layers,
  HelpCircle,
  TrendingUp,
  Wrench,
  CheckCircle2,
  Upload,
  Clock,
  X,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Card, Field, inputCls, PrimaryBtn, GhostBtn, DangerBtn, uploadToBucket } from "./_ui";
import { useServicesContent } from "@/lib/servicesStore";
import { ServiceSection, ServiceItem, ServiceProcessStep, ServiceStat, ServiceFaq } from "@/data/services";

export default function ServicesContentAdmin() {
  const { services, loading, saveServices, resetServices } = useServicesContent();
  const [activeSectionId, setActiveSectionId] = useState<string>("digital-marketing");
  const [editingItem, setEditingItem] = useState<{ sectionId: string; item: ServiceItem; isNew?: boolean } | null>(null);
  const [editingSectionHeader, setEditingSectionHeader] = useState<ServiceSection | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const currentSection = services.find((s) => s.id === activeSectionId) || services[0];

  // Helper to update state and save
  const handleUpdateSections = async (newSections: ServiceSection[]) => {
    setSaving(true);
    await saveServices(newSections);
    setSaving(false);
  };

  // Section Header Save
  const handleSaveSectionHeader = () => {
    if (!editingSectionHeader) return;
    const updated = services.map((s) => (s.id === editingSectionHeader.id ? editingSectionHeader : s));
    handleUpdateSections(updated);
    setEditingSectionHeader(null);
    toast.success("Section header updated");
  };

  // Add Item to current section
  const handleStartAddItem = () => {
    if (!currentSection) return;
    const nextNumber = (currentSection.items.length || 0) + 1;
    const newItem: ServiceItem = {
      id: `service-${Date.now().toString(36)}`,
      number: nextNumber,
      title: "",
      short: "",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
      details: {
        valueLine: "",
        overview: ["Comprehensive solution engineered for measurable results."],
        deliverables: ["Deliverable 1", "Deliverable 2"],
        process: [
          { step: "Audit", text: "Initial discovery and evaluation of requirements." },
          { step: "Execution", text: "Production-grade execution and deployment." },
        ],
        tools: ["Tool 1", "Tool 2"],
        stats: [{ value: 100, suffix: "%", label: "Client satisfaction" }],
        timeline: "2 to 4 weeks",
        faq: [{ q: "How do we get started?", a: "Book a consultation or message directly on WhatsApp." }],
        cta: { label: "Start this project", href: "https://wa.me/8801700000000" },
      },
    };

    setEditingItem({ sectionId: currentSection.id, item: newItem, isNew: true });
  };

  // Save Item
  const handleSaveItem = () => {
    if (!editingItem) return;
    const { sectionId, item, isNew } = editingItem;
    if (!item.title.trim()) {
      return toast.error("Title is required");
    }

    const updated = services.map((sec) => {
      if (sec.id !== sectionId) return sec;
      let newItems = [...sec.items];
      if (isNew) {
        newItems.push(item);
      } else {
        newItems = newItems.map((it) => (it.id === item.id ? item : it));
      }
      return { ...sec, items: newItems };
    });

    handleUpdateSections(updated);
    setEditingItem(null);
    toast.success(`Service "${item.title}" saved`);
  };

  // Delete Item
  const handleDeleteItem = (sectionId: string, itemId: string, itemTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${itemTitle}"?`)) return;
    const updated = services.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return { ...sec, items: sec.items.filter((it) => it.id !== itemId) };
    });
    handleUpdateSections(updated);
    toast.success("Service deleted");
  };

  // Reorder Item
  const handleMoveItem = (sectionId: string, index: number, direction: "up" | "down") => {
    const updated = services.map((sec) => {
      if (sec.id !== sectionId) return sec;
      const newItems = [...sec.items];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newItems.length) return sec;
      const temp = newItems[index];
      newItems[index] = newItems[targetIndex];
      newItems[targetIndex] = temp;
      // Re-index item numbers
      newItems.forEach((item, idx) => {
        item.number = idx + 1;
      });
      return { ...sec, items: newItems };
    });
    handleUpdateSections(updated);
  };

  // Handle image upload to Supabase storage
  const handleUploadImage = async (file: File) => {
    if (!editingItem) return;
    setUploading(true);
    const url = await uploadToBucket(file, "services");
    setUploading(false);
    if (!url) return toast.error("Image upload failed");
    setEditingItem({
      ...editingItem,
      item: { ...editingItem.item, image: url },
    });
    toast.success("Image uploaded");
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        <Sparkles className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
        Loading services content...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        title="Services Content Manager"
        description="Add, edit, reorder and manage all service packages, deliverables, process steps, and FAQs."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <GhostBtn
              onClick={() => {
                if (confirm("Reset all services back to original starter copy? Any custom edits will be reverted.")) {
                  resetServices();
                }
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset to Defaults
            </GhostBtn>
            <PrimaryBtn onClick={handleStartAddItem} disabled={!currentSection}>
              <Plus className="w-4 h-4 mr-1" /> Add Service
            </PrimaryBtn>
          </div>
        }
      />

      {/* SECTION TABS */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl glass border border-white/10">
        {services.map((sec) => {
          const isSelected = sec.id === (currentSection?.id || activeSectionId);
          return (
            <button
              key={sec.id}
              onClick={() => {
                setActiveSectionId(sec.id);
                setEditingItem(null);
                setEditingSectionHeader(null);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                isSelected
                  ? "bg-primary text-white shadow-neon"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <span className="text-[11px] opacity-75 font-mono">{sec.index}</span>
              {sec.subheading || sec.id}
              <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                sec.accent === "pink" ? "bg-pink-500/20 text-pink-300" : "bg-teal-500/20 text-teal-300"
              }`}>
                {sec.items.length} items
              </span>
            </button>
          );
        })}
      </div>

      {/* CURRENT SECTION HEADER INFO */}
      {currentSection && (
        <Card className="border border-white/10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-primary glass mb-2">
                <Sparkles className="w-3 h-3 text-primary" />
                SECTION {currentSection.index} · ACCENT: {currentSection.accent.toUpperCase()}
              </div>
              <h2 className="text-xl md:text-2xl font-bold font-display text-foreground">
                {currentSection.heading}: <span className="text-gradient">{currentSection.subheading}</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-1">{currentSection.introTitle}</p>
            </div>
            <GhostBtn onClick={() => setEditingSectionHeader({ ...currentSection })}>
              <Pencil className="w-3.5 h-3.5 mr-1" /> Edit Section Info
            </GhostBtn>
          </div>
        </Card>
      )}

      {/* EDIT SECTION HEADER MODAL */}
      {editingSectionHeader && (
        <Card className="ring-1 ring-primary/40 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-display font-semibold text-base">Edit Section Header ({editingSectionHeader.id})</h3>
            <button onClick={() => setEditingSectionHeader(null)} className="p-1 hover:bg-white/10 rounded">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Section Heading">
              <input
                value={editingSectionHeader.heading}
                onChange={(e) => setEditingSectionHeader({ ...editingSectionHeader, heading: e.target.value })}
                className={inputCls}
                placeholder="WHAT I DO"
              />
            </Field>
            <Field label="Subheading / Title">
              <input
                value={editingSectionHeader.subheading}
                onChange={(e) => setEditingSectionHeader({ ...editingSectionHeader, subheading: e.target.value })}
                className={inputCls}
                placeholder="Digital Marketing"
              />
            </Field>
            <Field label="Intro Title">
              <input
                value={editingSectionHeader.introTitle}
                onChange={(e) => setEditingSectionHeader({ ...editingSectionHeader, introTitle: e.target.value })}
                className={inputCls}
                placeholder="Welcome to Digital Marketing"
              />
            </Field>
            <Field label="Accent Color (pink / teal)">
              <input
                value={editingSectionHeader.accent}
                onChange={(e) => setEditingSectionHeader({ ...editingSectionHeader, accent: e.target.value })}
                className={inputCls}
                placeholder="pink"
              />
            </Field>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <GhostBtn onClick={() => setEditingSectionHeader(null)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={handleSaveSectionHeader} loading={saving}>Save Section Info</PrimaryBtn>
          </div>
        </Card>
      )}

      {/* ITEM EDITOR MODAL / FORM */}
      {editingItem && (
        <Card className="ring-2 ring-primary/60 border-primary/40 space-y-6 shadow-2xl bg-neutral-950/95">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono text-primary uppercase font-bold">
                {editingItem.isNew ? "Creating New Item" : `Editing #${editingItem.item.number}`}
              </span>
              <h3 className="text-xl font-bold font-display text-foreground mt-0.5">
                {editingItem.item.title || "Untitled Service"}
              </h3>
            </div>
            <button
              onClick={() => setEditingItem(null)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* BASIC INFORMATION */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider font-bold text-muted-foreground">1. Basic Information</h4>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Service Title">
                <input
                  value={editingItem.item.title}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, title: e.target.value },
                    })
                  }
                  className={inputCls}
                  placeholder="e.g. SEO, E-commerce Stores"
                />
              </Field>
              <Field label="Item ID (Slug)">
                <input
                  value={editingItem.item.id}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, id: e.target.value },
                    })
                  }
                  className={inputCls}
                  placeholder="e.g. seo, web-apps"
                />
              </Field>
              <Field label="Display Number">
                <input
                  type="number"
                  value={editingItem.item.number}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, number: Number(e.target.value) },
                    })
                  }
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Short One-Liner Description">
              <input
                value={editingItem.item.short}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    item: { ...editingItem.item, short: e.target.value },
                  })
                }
                className={inputCls}
                placeholder="Rank higher on Google and win customers who are already searching."
              />
            </Field>

            <Field label="Featured Image URL" hint="Direct link or upload from your device below">
              <div className="flex gap-2">
                <input
                  value={editingItem.item.image}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, image: e.target.value },
                    })
                  }
                  className={inputCls}
                  placeholder="https://images.unsplash.com/..."
                />
                <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass cursor-pointer hover:bg-white/10 text-xs font-semibold whitespace-nowrap">
                  <Upload className="w-3.5 h-3.5 text-primary" />
                  {uploading ? "Uploading..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUploadImage(f);
                    }}
                  />
                </label>
              </div>
            </Field>
            {editingItem.item.image && (
              <div className="w-32 h-20 rounded-xl overflow-hidden glass border border-white/10">
                <img src={editingItem.item.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* DETAILS: VALUE LINE & OVERVIEW */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h4 className="text-xs uppercase tracking-wider font-bold text-muted-foreground">2. Value Proposition & Overview</h4>
            <Field label="Value Line (Catchy Benefit)">
              <input
                value={editingItem.item.details.valueLine}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    item: {
                      ...editingItem.item,
                      details: { ...editingItem.item.details, valueLine: e.target.value },
                    },
                  })
                }
                className={inputCls}
                placeholder="Capture high-intent buyers exactly when they search for your solutions."
              />
            </Field>

            <Field label="Overview Paragraphs (One per line)">
              <textarea
                rows={3}
                value={editingItem.item.details.overview.join("\n")}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    item: {
                      ...editingItem.item,
                      details: {
                        ...editingItem.item.details,
                        overview: e.target.value.split("\n").filter((p) => p.trim() !== ""),
                      },
                    },
                  })
                }
                className={inputCls}
                placeholder="Paragraph 1&#10;Paragraph 2"
              />
            </Field>

            <Field label="Deliverables List (One item per line)">
              <textarea
                rows={4}
                value={editingItem.item.details.deliverables.join("\n")}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    item: {
                      ...editingItem.item,
                      details: {
                        ...editingItem.item.details,
                        deliverables: e.target.value.split("\n").filter((p) => p.trim() !== ""),
                      },
                    },
                  })
                }
                className={inputCls}
                placeholder="Deliverable 1&#10;Deliverable 2&#10;Deliverable 3"
              />
            </Field>
          </div>

          {/* PROCESS STEPS */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase tracking-wider font-bold text-muted-foreground">3. Step-by-Step Process</h4>
              <button
                type="button"
                onClick={() => {
                  const currentProc = editingItem.item.details.process || [];
                  setEditingItem({
                    ...editingItem,
                    item: {
                      ...editingItem.item,
                      details: {
                        ...editingItem.item.details,
                        process: [...currentProc, { step: "Step Name", text: "Detailed description of this step." }],
                      },
                    },
                  });
                }}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Step
              </button>
            </div>

            <div className="space-y-2">
              {editingItem.item.details.process.map((step, sIdx) => (
                <div key={sIdx} className="p-3 rounded-xl glass border border-white/10 flex items-start gap-2">
                  <div className="w-1/4">
                    <input
                      value={step.step}
                      placeholder="Audit / Launch"
                      onChange={(e) => {
                        const newProc = [...editingItem.item.details.process];
                        newProc[sIdx].step = e.target.value;
                        setEditingItem({
                          ...editingItem,
                          item: {
                            ...editingItem.item,
                            details: { ...editingItem.item.details, process: newProc },
                          },
                        });
                      }}
                      className={inputCls + " text-xs font-semibold"}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      value={step.text}
                      placeholder="Step description..."
                      onChange={(e) => {
                        const newProc = [...editingItem.item.details.process];
                        newProc[sIdx].text = e.target.value;
                        setEditingItem({
                          ...editingItem,
                          item: {
                            ...editingItem.item,
                            details: { ...editingItem.item.details, process: newProc },
                          },
                        });
                      }}
                      className={inputCls + " text-xs"}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newProc = editingItem.item.details.process.filter((_, idx) => idx !== sIdx);
                      setEditingItem({
                        ...editingItem,
                        item: {
                          ...editingItem.item,
                          details: { ...editingItem.item.details, process: newProc },
                        },
                      });
                    }}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* TOOLS, STATS & TIMELINE */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h4 className="text-xs uppercase tracking-wider font-bold text-muted-foreground">4. Tools, Stats & Timeline</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Tools & Tech (Comma-separated)">
                <input
                  value={editingItem.item.details.tools.join(", ")}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      item: {
                        ...editingItem.item,
                        details: {
                          ...editingItem.item.details,
                          tools: e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        },
                      },
                    })
                  }
                  className={inputCls}
                  placeholder="Ahrefs, Google Search Console, Semrush"
                />
              </Field>

              <Field label="Estimated Timeline">
                <input
                  value={editingItem.item.details.timeline}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      item: {
                        ...editingItem.item,
                        details: { ...editingItem.item.details, timeline: e.target.value },
                      },
                    })
                  }
                  className={inputCls}
                  placeholder="4 to 8 weeks for initial momentum"
                />
              </Field>
            </div>

            {/* STATS */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-foreground">Verified Stats / Impact Metrics</label>
                <button
                  type="button"
                  onClick={() => {
                    const currentStats = editingItem.item.details.stats || [];
                    setEditingItem({
                      ...editingItem,
                      item: {
                        ...editingItem.item,
                        details: {
                          ...editingItem.item.details,
                          stats: [...currentStats, { value: 100, suffix: "%", label: "Metric Label" }],
                        },
                      },
                    });
                  }}
                  className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Stat
                </button>
              </div>
              <div className="space-y-2">
                {editingItem.item.details.stats.map((st, stIdx) => (
                  <div key={stIdx} className="grid grid-cols-12 gap-2 p-2 rounded-xl glass border border-white/10 items-center">
                    <div className="col-span-3">
                      <input
                        type="number"
                        value={st.value}
                        onChange={(e) => {
                          const newStats = [...editingItem.item.details.stats];
                          newStats[stIdx].value = Number(e.target.value);
                          setEditingItem({
                            ...editingItem,
                            item: { ...editingItem.item, details: { ...editingItem.item.details, stats: newStats } },
                          });
                        }}
                        className={inputCls + " text-xs"}
                        placeholder="180"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        value={st.suffix}
                        onChange={(e) => {
                          const newStats = [...editingItem.item.details.stats];
                          newStats[stIdx].suffix = e.target.value;
                          setEditingItem({
                            ...editingItem,
                            item: { ...editingItem.item, details: { ...editingItem.item.details, stats: newStats } },
                          });
                        }}
                        className={inputCls + " text-xs"}
                        placeholder="%, X, M+"
                      />
                    </div>
                    <div className="col-span-6">
                      <input
                        value={st.label}
                        onChange={(e) => {
                          const newStats = [...editingItem.item.details.stats];
                          newStats[stIdx].label = e.target.value;
                          setEditingItem({
                            ...editingItem,
                            item: { ...editingItem.item, details: { ...editingItem.item.details, stats: newStats } },
                          });
                        }}
                        className={inputCls + " text-xs"}
                        placeholder="Metric description..."
                      />
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          const newStats = editingItem.item.details.stats.filter((_, idx) => idx !== stIdx);
                          setEditingItem({
                            ...editingItem,
                            item: { ...editingItem.item, details: { ...editingItem.item.details, stats: newStats } },
                          });
                        }}
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQS & CTA */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase tracking-wider font-bold text-muted-foreground">5. Service FAQs</h4>
              <button
                type="button"
                onClick={() => {
                  const currentFaq = editingItem.item.details.faq || [];
                  setEditingItem({
                    ...editingItem,
                    item: {
                      ...editingItem.item,
                      details: {
                        ...editingItem.item.details,
                        faq: [...currentFaq, { q: "Frequently asked question?", a: "Detailed answer..." }],
                      },
                    },
                  });
                }}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add FAQ
              </button>
            </div>

            <div className="space-y-3">
              {editingItem.item.details.faq.map((fq, fqIdx) => (
                <div key={fqIdx} className="p-3 rounded-xl glass border border-white/10 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      value={fq.q}
                      onChange={(e) => {
                        const newFaq = [...editingItem.item.details.faq];
                        newFaq[fqIdx].q = e.target.value;
                        setEditingItem({
                          ...editingItem,
                          item: { ...editingItem.item, details: { ...editingItem.item.details, faq: newFaq } },
                        });
                      }}
                      className={inputCls + " text-xs font-semibold"}
                      placeholder="Question..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newFaq = editingItem.item.details.faq.filter((_, idx) => idx !== fqIdx);
                        setEditingItem({
                          ...editingItem,
                          item: { ...editingItem.item, details: { ...editingItem.item.details, faq: newFaq } },
                        });
                      }}
                      className="p-1.5 text-destructive hover:bg-destructive/10 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={fq.a}
                    onChange={(e) => {
                      const newFaq = [...editingItem.item.details.faq];
                      newFaq[fqIdx].a = e.target.value;
                      setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, details: { ...editingItem.item.details, faq: newFaq } },
                      });
                    }}
                    className={inputCls + " text-xs"}
                    placeholder="Answer..."
                  />
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-2 grid sm:grid-cols-2 gap-4">
              <Field label="CTA Button Label">
                <input
                  value={editingItem.item.details.cta?.label || "Start this project"}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      item: {
                        ...editingItem.item,
                        details: {
                          ...editingItem.item.details,
                          cta: { ...editingItem.item.details.cta, label: e.target.value },
                        },
                      },
                    })
                  }
                  className={inputCls}
                />
              </Field>
              <Field label="CTA Destination Link (WhatsApp / URL)">
                <input
                  value={editingItem.item.details.cta?.href || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      item: {
                        ...editingItem.item,
                        details: {
                          ...editingItem.item.details,
                          cta: { ...editingItem.item.details.cta, href: e.target.value },
                        },
                      },
                    })
                  }
                  className={inputCls}
                  placeholder="https://wa.me/8801700000000"
                />
              </Field>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <GhostBtn onClick={() => setEditingItem(null)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={handleSaveItem} loading={saving}>
              <Save className="w-4 h-4 mr-1.5" /> Save Service
            </PrimaryBtn>
          </div>
        </Card>
      )}

      {/* ITEMS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            {currentSection?.items.length || 0} Deliverables & Packages in {currentSection?.subheading}
          </h3>
          <span className="text-xs text-muted-foreground">Changes persist to Supabase & live site</span>
        </div>

        {currentSection?.items.length === 0 ? (
          <Card className="py-12 text-center text-muted-foreground">
            <p>No services yet in this section.</p>
            <PrimaryBtn onClick={handleStartAddItem} className="mt-4">
              <Plus className="w-4 h-4 mr-1" /> Add Your First Service
            </PrimaryBtn>
          </Card>
        ) : (
          <div className="grid gap-4">
            {currentSection?.items.map((it, idx) => (
              <Card
                key={it.id}
                className="group border border-white/10 hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Info */}
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden glass flex-shrink-0 border border-white/10">
                    <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-primary">#{it.number}</span>
                      <h4 className="font-display font-bold text-base text-foreground">{it.title}</h4>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full glass text-muted-foreground">
                        {it.id}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">{it.short}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {it.details.deliverables?.length || 0} Deliverables
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {it.details.timeline || "2-4 weeks"}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Wrench className="w-3 h-3 text-amber-400" />
                        {it.details.tools?.slice(0, 3).join(", ")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                  <button
                    onClick={() => handleMoveItem(currentSection.id, idx, "up")}
                    disabled={idx === 0}
                    className="p-2 rounded-lg glass hover:bg-white/10 disabled:opacity-30 text-muted-foreground hover:text-white"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveItem(currentSection.id, idx, "down")}
                    disabled={idx === currentSection.items.length - 1}
                    className="p-2 rounded-lg glass hover:bg-white/10 disabled:opacity-30 text-muted-foreground hover:text-white"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setEditingItem({ sectionId: currentSection.id, item: { ...it } })}
                    className="px-3 py-1.5 rounded-lg glass hover:bg-primary/20 text-xs font-semibold text-primary inline-flex items-center gap-1"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(currentSection.id, it.id, it.title)}
                    className="p-2 rounded-lg glass hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                    title="Delete service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
