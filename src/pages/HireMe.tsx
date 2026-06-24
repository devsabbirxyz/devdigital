import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Palette, Bot, ShoppingCart, Smartphone, Wrench, Plug, Package,
  Check, ArrowLeft, ArrowRight, Loader2, Send, Shield, Clock, MapPin, Zap, Star, Briefcase,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import Navbar from "@/components/site/Navbar";
import Seo from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import { sendWhatsAppNotification } from "@/lib/whatsappNotify";
import { sendFormsubmit } from "@/lib/formsubmit";
import { Button } from "@/components/ui/button";

const SERVICES = [
  { id: "web", label: "Web Development", icon: Globe },
  { id: "uiux", label: "UI/UX Design", icon: Palette },
  { id: "ai", label: "AI Automation", icon: Bot },
  { id: "ecom", label: "E-commerce Store", icon: ShoppingCart },
  { id: "mobile", label: "Mobile Responsive Design", icon: Smartphone },
  { id: "maint", label: "Website Maintenance", icon: Wrench },
  { id: "api", label: "API Integration", icon: Plug },
  { id: "full", label: "Full Package (All-in-One)", icon: Package },
];

const PROJECT_TYPES = ["Brand New Project", "Redesign Existing Site", "Add Features to Existing Site", "Fix Bugs / Issues"];
const PLATFORMS = ["React", "Next.js", "WordPress", "Webflow", "Lovable", "No Preference", "Other"];
const PAGES = ["1–3 pages", "4–7 pages", "8–15 pages", "15+ pages", "Not Sure"];
const DESIGN_STATUS = ["Yes, I have Figma/design files", "No, I need design too", "I have rough ideas only"];
const REVISIONS = ["1 revision", "2 revisions", "3 revisions", "Unlimited revisions"];
const BUDGETS = [
  { id: "b1", label: "$100 – $500", sub: "Small Project", icon: "💰", min: 100, max: 500 },
  { id: "b2", label: "$500 – $1,000", sub: "Medium Project", icon: "💰💰", min: 500, max: 1000 },
  { id: "b3", label: "$1,000 – $2,000", sub: "Large Project", icon: "💰💰💰", min: 1000, max: 2000 },
  { id: "b4", label: "$2,000+", sub: "Enterprise / Complex", icon: "🚀", min: 2000, max: 5000 },
  { id: "b5", label: "Let's Discuss", sub: "Flexible", icon: "🤝", min: 0, max: 0 },
];
const DEADLINES = [
  { label: "ASAP (Rush)", icon: "⚡" },
  { label: "Within 1 Week", icon: "📅" },
  { label: "2–4 Weeks", icon: "🗓️" },
  { label: "1–2 Months", icon: "📆" },
  { label: "No Fixed Deadline", icon: "🕐" },
];
const REFERRALS = ["Google Search", "Fiverr", "LinkedIn", "GitHub", "Friend/Referral", "Social Media", "Other"];
const TOTAL_STEPS = 5;

const contactSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  whatsapp: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  role: z.string().trim().max(120).optional().or(z.literal("")),
  referral: z.string().max(80).optional().or(z.literal("")),
  description: z.string().trim().min(10, "Please describe your project (min 10 chars)").max(5000),
  fileNote: z.string().max(500).optional().or(z.literal("")),
});

type FormState = {
  services: string[];
  projectType: string;
  platform: string;
  pages: string;
  designStatus: string;
  referenceLinks: string;
  revisions: string;
  budgetId: string;
  deadline: string;
  fullName: string;
  email: string;
  whatsapp: string;
  company: string;
  role: string;
  referral: string;
  description: string;
  fileNote: string;
};

const INITIAL: FormState = {
  services: [], projectType: "", platform: "", pages: "", designStatus: "", referenceLinks: "",
  revisions: "", budgetId: "", deadline: "", fullName: "", email: "", whatsapp: "",
  company: "", role: "", referral: "", description: "", fileNote: "",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">{children}</h2>;
}

function OptionCard({
  active, onClick, children, className = "",
}: { active: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-2xl border p-4 transition-all duration-200 ${
        active
          ? "border-primary bg-primary/10 shadow-glow-soft"
          : "border-border bg-card/40 hover:border-primary/50 hover:bg-card/60"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export default function HireMe() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [maxReached, setMaxReached] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((p) => ({ ...p, [k]: v }));

  const toggleService = (id: string) =>
    setForm((p) => ({
      ...p,
      services: p.services.includes(id) ? p.services.filter((s) => s !== id) : [...p.services, id],
    }));

  const estimate = useMemo(() => {
    const b = BUDGETS.find((x) => x.id === form.budgetId);
    const count = Math.max(1, form.services.length);
    if (!b || b.id === "b5") return null;
    const multiplier = 1 + (count - 1) * 0.25;
    return { min: Math.round(b.min * multiplier), max: Math.round(b.max * multiplier) };
  }, [form.budgetId, form.services]);

  const canNext = useMemo(() => {
    if (step === 1) return form.services.length > 0;
    if (step === 2) return form.projectType && form.platform && form.pages && form.designStatus && form.revisions;
    if (step === 3) return form.budgetId && form.deadline;
    if (step === 4) {
      const parsed = contactSchema.safeParse(form);
      return parsed.success;
    }
    return true;
  }, [step, form]);

  const goNext = () => {
    if (!canNext) return;
    const next = Math.min(TOTAL_STEPS, step + 1);
    setStep(next);
    setMaxReached((m) => Math.max(m, next));
  };
  const goBack = () => setStep((s) => Math.max(1, s - 1));
  const goTo = (n: number) => { if (n <= maxReached) setStep(n); };

  const submit = async () => {
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      setStep(4);
      return;
    }
    setSubmitting(true);
    const budget = BUDGETS.find((b) => b.id === form.budgetId);
    const selectedServices = form.services.map((id) => SERVICES.find((s) => s.id === id)?.label).filter(Boolean).join(", ");
    const summary = `🚀 NEW HIRE REQUEST

Services: ${selectedServices}
Project Type: ${form.projectType}
Platform: ${form.platform}
Pages: ${form.pages}
Design: ${form.designStatus}
Revisions: ${form.revisions}
References: ${form.referenceLinks || "—"}
Budget: ${budget?.label || "—"} (${budget?.sub || ""})
Deadline: ${form.deadline}
Estimated: ${estimate ? `$${estimate.min} – $${estimate.max}` : "To discuss"}

Name: ${form.fullName}
Email: ${form.email}
WhatsApp: ${form.whatsapp || "—"}
Company: ${form.company || "—"}
Role: ${form.role || "—"}
Found via: ${form.referral || "—"}

Description:
${form.description}

Attachments note: ${form.fileNote || "—"}`;

    const { error } = await supabase.from("contact_submissions").insert({
      name: form.fullName, email: form.email, message: summary,
    });
    if (error) {
      setSubmitting(false);
      toast.error("Could not send. Please try again.");
      return;
    }
    sendWhatsAppNotification({ name: form.fullName, email: form.email, message: summary });
    sendFormsubmit({ name: form.fullName, email: form.email, message: summary });
    setSubmitting(false);
    setDone(true);
  };

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-bg">
        <Seo path="/hire-me" defaultTitle="Hire Me — Project Request Sent" defaultDescription="Thanks for your project request." />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong rounded-3xl p-10 md:p-14 max-w-lg w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center shadow-neon"
          >
            <Check className="h-12 w-12 text-primary-foreground" strokeWidth={3} />
          </motion.div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Request Sent Successfully!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you! I've received your project request and will get back to you within 24 hours.
          </p>
          <Button asChild size="lg" className="rounded-full bg-gradient-primary text-primary-foreground">
            <Link to="/">Go Back to Home</Link>
          </Button>
        </motion.div>
      </main>
    );
  }

  const progressPct = (step / TOTAL_STEPS) * 100;

  return (
    <main className="relative min-h-screen pb-24">
      <Seo path="/hire-me" defaultTitle="Hire Me — Start Your Project" defaultDescription="Send a detailed project request and get a response within 24 hours." />
      <Navbar />

      <section className="pt-28 md:pt-32 pb-8 px-4">
        <div className="container max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass-strong rounded-full px-4 py-1.5 mb-5 text-xs font-medium"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            Currently Available for Work
          </motion.div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
            Let's Work <span className="text-gradient">Together</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Fill out the form below and I'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      <div className="container max-w-6xl px-4 grid lg:grid-cols-[1fr_300px] gap-8">
        <div>
          {/* Progress */}
          <div className="glass-strong rounded-2xl p-4 md:p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Step {step} of {TOTAL_STEPS}</span>
              <span className="text-xs text-muted-foreground">{Math.round(progressPct)}% complete</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
              <motion.div
                className="h-full bg-gradient-primary"
                initial={false}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex gap-1.5 md:gap-2">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
                const n = i + 1;
                const reached = n <= maxReached;
                const current = n === step;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => goTo(n)}
                    disabled={!reached}
                    className={`flex-1 h-8 rounded-lg text-xs font-semibold transition ${
                      current
                        ? "bg-gradient-primary text-primary-foreground"
                        : reached
                        ? "bg-card/60 hover:bg-card text-foreground"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Steps */}
          <div className="glass-strong rounded-3xl p-5 md:p-8 min-h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 && (
                  <>
                    <SectionTitle>What can I help you with?</SectionTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {SERVICES.map((s) => {
                        const active = form.services.includes(s.id);
                        const Icon = s.icon;
                        return (
                          <OptionCard key={s.id} active={active} onClick={() => toggleService(s.id)}>
                            <div className="flex items-center gap-3">
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${active ? "bg-gradient-primary" : "bg-muted"}`}>
                                <Icon className={`h-5 w-5 ${active ? "text-primary-foreground" : "text-foreground"}`} />
                              </div>
                              <span className="font-medium">{s.label}</span>
                              {active && <Check className="h-4 w-4 ml-auto text-primary" />}
                            </div>
                          </OptionCard>
                        );
                      })}
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <SectionTitle>Tell me about your project</SectionTitle>
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm font-semibold mb-2">Project Type</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {PROJECT_TYPES.map((t) => (
                            <OptionCard key={t} active={form.projectType === t} onClick={() => set("projectType", t)}>
                              <span className="text-sm font-medium">{t}</span>
                            </OptionCard>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2">Preferred Platform / Tech</p>
                        <select
                          value={form.platform}
                          onChange={(e) => set("platform", e.target.value)}
                          className="w-full bg-input/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl px-4 py-3 outline-none"
                        >
                          <option value="">Select a platform…</option>
                          {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2">Number of Pages Needed</p>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {PAGES.map((p) => (
                            <OptionCard key={p} active={form.pages === p} onClick={() => set("pages", p)} className="text-center">
                              <span className="text-sm font-medium">{p}</span>
                            </OptionCard>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2">Is your design ready?</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {DESIGN_STATUS.map((d) => (
                            <OptionCard key={d} active={form.designStatus === d} onClick={() => set("designStatus", d)}>
                              <span className="text-sm font-medium">{d}</span>
                            </OptionCard>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2">Reference Website Links <span className="text-muted-foreground font-normal">(optional)</span></p>
                        <input
                          value={form.referenceLinks}
                          onChange={(e) => set("referenceLinks", e.target.value)}
                          placeholder="Paste any websites you like for reference..."
                          maxLength={500}
                          className="w-full bg-input/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl px-4 py-3 outline-none"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2">How many revisions do you expect?</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {REVISIONS.map((r) => (
                            <OptionCard key={r} active={form.revisions === r} onClick={() => set("revisions", r)} className="text-center">
                              <span className="text-sm font-medium">{r}</span>
                            </OptionCard>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <SectionTitle>Budget & Deadline</SectionTitle>
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm font-semibold mb-2">Budget Range</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {BUDGETS.map((b) => (
                            <OptionCard key={b.id} active={form.budgetId === b.id} onClick={() => set("budgetId", b.id)}>
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{b.icon}</span>
                                <div>
                                  <p className="font-semibold text-sm">{b.label}</p>
                                  <p className="text-xs text-muted-foreground">{b.sub}</p>
                                </div>
                              </div>
                            </OptionCard>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2">Project Deadline</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {DEADLINES.map((d) => (
                            <OptionCard key={d.label} active={form.deadline === d.label} onClick={() => set("deadline", d.label)}>
                              <span className="text-sm font-medium"><span className="mr-2">{d.icon}</span>{d.label}</span>
                            </OptionCard>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-primary/40 bg-gradient-glow p-5 text-center">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Estimated Project Cost</p>
                        <p className="font-display text-2xl md:text-3xl font-bold text-gradient">
                          {estimate ? `$${estimate.min.toLocaleString()} – $${estimate.max.toLocaleString()}` : "Let's Discuss"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Based on your selected services and budget range</p>
                      </div>
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <SectionTitle>How can I reach you?</SectionTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Full Name *">
                        <input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} maxLength={100} className={inputCls} />
                      </Field>
                      <Field label="Email Address *">
                        <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} maxLength={255} className={inputCls} />
                      </Field>
                      <Field label="WhatsApp Number">
                        <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+1 555 123 4567" maxLength={40} className={inputCls} />
                      </Field>
                      <Field label="Company or Brand Name">
                        <input value={form.company} onChange={(e) => set("company", e.target.value)} maxLength={120} className={inputCls} />
                      </Field>
                      <Field label="Your Role / Position">
                        <input value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="Founder, Marketing Manager…" maxLength={120} className={inputCls} />
                      </Field>
                      <Field label="How did you find me?">
                        <select value={form.referral} onChange={(e) => set("referral", e.target.value)} className={inputCls}>
                          <option value="">Select…</option>
                          {REFERRALS.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </Field>
                      <div className="sm:col-span-2">
                        <Field label="Project Description *">
                          <textarea
                            value={form.description}
                            onChange={(e) => set("description", e.target.value)}
                            rows={5}
                            maxLength={5000}
                            placeholder="Describe your project in detail. What problem are you solving? Who is your target audience? Any specific features you want?"
                            className={`${inputCls} resize-none`}
                          />
                        </Field>
                      </div>
                      <div className="sm:col-span-2">
                        <Field label="Attach any documents, mockups or briefs (PDF, PNG, JPG, Figma link)">
                          <input
                            value={form.fileNote}
                            onChange={(e) => set("fileNote", e.target.value)}
                            placeholder="Paste Figma/Drive link or describe attachments…"
                            maxLength={500}
                            className={inputCls}
                          />
                        </Field>
                      </div>
                    </div>
                    <p className="mt-5 text-xs text-muted-foreground flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5" />
                      Your information is safe and will never be shared with third parties.
                    </p>
                  </>
                )}

                {step === 5 && (
                  <>
                    <SectionTitle>Review Your Request</SectionTitle>
                    <div className="space-y-4">
                      <SummaryRow label="Selected Services" value={form.services.map((id) => SERVICES.find((s) => s.id === id)?.label).join(", ") || "—"} />
                      <SummaryRow label="Project Type" value={form.projectType} />
                      <SummaryRow label="Platform" value={form.platform} />
                      <SummaryRow label="Pages" value={form.pages} />
                      <SummaryRow label="Design Status" value={form.designStatus} />
                      <SummaryRow label="Revisions" value={form.revisions} />
                      <SummaryRow label="Reference Links" value={form.referenceLinks || "—"} />
                      <SummaryRow label="Budget" value={BUDGETS.find((b) => b.id === form.budgetId)?.label || "—"} />
                      <SummaryRow label="Deadline" value={form.deadline} />
                      <SummaryRow label="Estimated Price" value={estimate ? `$${estimate.min.toLocaleString()} – $${estimate.max.toLocaleString()}` : "To discuss"} highlight />
                      <SummaryRow label="Name" value={form.fullName} />
                      <SummaryRow label="Email" value={form.email} />
                      <SummaryRow label="WhatsApp" value={form.whatsapp || "—"} />
                      <SummaryRow label="Description" value={form.description} />
                    </div>

                    <div className="mt-6 rounded-2xl border border-border bg-card/40 p-5 flex flex-wrap items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground">
                        S
                      </div>
                      <div className="flex-1 min-w-[180px]">
                        <p className="font-semibold">You'll be working with Sabbir</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />50+ Projects</span>
                          <span className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500" />5.0 Rating</span>
                          <span className="flex items-center gap-1"><Zap className="h-3 w-3" />Replies in 2–4 hrs</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />Worldwide</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={submit}
                      disabled={submitting}
                      size="lg"
                      className="w-full mt-6 rounded-full bg-gradient-primary text-primary-foreground text-base font-semibold py-6 shadow-neon hover:scale-[1.01]"
                    >
                      {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-5 w-5" /> Send Request 🚀</>}
                    </Button>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Nav */}
            {step < 5 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                {step > 1 ? (
                  <Button type="button" variant="ghost" onClick={goBack} className="rounded-full">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                ) : <span />}
                <Button
                  type="button"
                  onClick={goNext}
                  disabled={!canNext}
                  className="rounded-full bg-gradient-primary text-primary-foreground px-6"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            {step === 5 && (
              <div className="flex items-center justify-start mt-6">
                <Button type="button" variant="ghost" onClick={goBack} className="rounded-full">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-4">
            <div className="glass-strong rounded-2xl p-5">
              <div className="inline-flex items-center gap-2 text-xs font-medium mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                Available for work
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /><span>Replies in 2–4 hours</span></div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /><span>GMT+6 · Worldwide</span></div>
                <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /><span>NDA on request</span></div>
              </div>
            </div>

            <div className="glass-strong rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Trusted stack</p>
              <div className="flex flex-wrap gap-2">
                {["React", "Next.js", "Tailwind", "Node.js", "Figma", "Supabase"].map((t) => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-muted border border-border">{t}</span>
                ))}
              </div>
            </div>

            <div className="glass-strong rounded-2xl p-5">
              <p className="text-sm italic text-foreground/80 leading-relaxed">
                "I don't just build websites — I build experiences."
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

const inputCls =
  "w-full bg-input/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl px-4 py-3 outline-none transition";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 rounded-xl p-3 ${highlight ? "bg-gradient-glow border border-primary/40" : "bg-card/40 border border-border"}`}>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:w-44 shrink-0">{label}</span>
      <span className={`text-sm ${highlight ? "font-bold text-gradient" : "text-foreground"} break-words flex-1`}>{value || "—"}</span>
    </div>
  );
}