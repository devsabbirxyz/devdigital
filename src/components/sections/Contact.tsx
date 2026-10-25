import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Loader2,
  ArrowUpRight,
  CheckCircle2,
  Check,
} from "lucide-react";
import SectionWatermark from "@/components/ui/SectionWatermark";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "sonner";
import { sendWhatsAppNotification } from "@/lib/whatsappNotify";
import { sendFormsubmit } from "@/lib/formsubmit";

type ContactInfo = { email: string; phone: string; location: string };
const DEFAULT: ContactInfo = {
  email: "developersabbir.x@gmail.com",
  phone: "+880 1941-130981",
  location: "Dhaka, Bangladesh",
};

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Please enter your message").max(5000),
});

export default function Contact() {
  const { data } = useSiteSettings<ContactInfo>("contact", DEFAULT);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const displayEmail =
    data.email && data.email !== "johnnykyorov@gmail.com" && data.email !== "hello@portfolio.com"
      ? data.email
      : DEFAULT.email;
  const displayPhone =
    data.phone && !data.phone.includes("501") && !data.phone.includes("555")
      ? data.phone
      : DEFAULT.phone;
  const displayLocation =
    data.location && !data.location.includes("Crosby") && !data.location.includes("New York")
      ? data.location
      : DEFAULT.location;

  const copyToClipboard = (text: string, key: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${key} copied to clipboard! 📋`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const formatWhatsAppNumber = (phoneStr: string) => {
    let cleaned = phoneStr.replace(/\D/g, "");
    if (cleaned.startsWith("01")) {
      cleaned = "88" + cleaned;
    }
    return cleaned || "8801941130981";
  };

  const cleanPhone = formatWhatsAppNumber(displayPhone);
  const whatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    "Hi Sabbir! I saw your portfolio and I want to discuss a project for my business."
  )}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    displayLocation
  )}`;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone") || "",
      message: fd.get("message"),
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setSubmitting(true);

    const payload = {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
      plan: "General Contact / AI Automation Inquiry",
    };

    const { error } = await supabase.from("contact_submissions").insert(payload);

    setSubmitting(false);

    if (error) {
      toast.error("Could not send message. Please reach out via email or phone directly.");
      return;
    }

    sendWhatsAppNotification(payload);
    sendFormsubmit(payload);

    toast.success("✓ Message sent successfully!");
    setSubmittedSuccess(true);
    formEl.reset();
  };

  return (
    <section
      id="contact"
      className="relative py-10 sm:py-16 md:py-32 overflow-hidden bg-[#0A0C11] text-foreground isolate"
    >
      {/* ================= BACKGROUND AMBIENT GLOW & WATERMARK ================= */}
      <SectionWatermark text="CONTACT" glowColor="cyan" />

      {/* Subtle Ambient Radial Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[160px] opacity-20"
          style={{ background: "radial-gradient(circle, #0099FF 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full blur-[140px] opacity-15"
          style={{ background: "radial-gradient(circle, #38BDF8 0%, transparent 70%)" }}
        />
      </div>

      <div className="container max-w-6xl px-4 sm:px-6 mx-auto relative z-10 pt-0 sm:pt-6 md:pt-12">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          {/* ================= LEFT COLUMN: INFO & BADGES (5 COLS) ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 flex flex-col justify-start"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#131518] border border-white/10 shadow-sm w-fit mb-3 sm:mb-5">
              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-white/30 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-neutral-300">Contact</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-2 sm:mb-3">
              Get in touch
            </h2>

            {/* Subtitle */}
            <p className="text-neutral-400 text-xs sm:text-base leading-relaxed max-w-md mb-5 sm:mb-8">
              Have questions or ready to transform your business with AI automation?
            </p>

            {/* 3 Contact Info Pill Cards */}
            <div className="space-y-3.5 w-full">
              {/* 1. Email Us Card */}
              <div
                onClick={(e) => copyToClipboard(displayEmail, "Email", e)}
                className="group w-full p-3.5 sm:p-4 rounded-2xl bg-[#121417]/90 hover:bg-[#16191f] border border-white/[0.08] hover:border-white/20 transition-all duration-200 flex items-center justify-between cursor-pointer shadow-lg"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[#1a1d23] border border-white/[0.06] flex items-center justify-center text-neutral-300 group-hover:text-white group-hover:scale-105 transition-all shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-white block">Email us</span>
                    <span className="text-xs sm:text-sm text-neutral-400 block truncate mt-0.5">
                      {displayEmail}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {copiedKey === "Email" ? (
                    <span className="p-2 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center gap-1 font-mono">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <a
                      href={`mailto:${displayEmail}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-9 h-9 rounded-full bg-[#1b1e24] border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:bg-[#252a33] group-hover:border-white/20 transition-all"
                      title="Send Email"
                      aria-label="Send Email"
                    >
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </div>

              {/* 2. Call Us Card */}
              <div
                onClick={(e) => copyToClipboard(displayPhone, "Phone", e)}
                className="group w-full p-3.5 sm:p-4 rounded-2xl bg-[#121417]/90 hover:bg-[#16191f] border border-white/[0.08] hover:border-white/20 transition-all duration-200 flex items-center justify-between cursor-pointer shadow-lg"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[#1a1d23] border border-white/[0.06] flex items-center justify-center text-neutral-300 group-hover:text-white group-hover:scale-105 transition-all shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-white block">Call us</span>
                    <span className="text-xs sm:text-sm text-neutral-400 block truncate mt-0.5">
                      {displayPhone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {copiedKey === "Phone" ? (
                    <span className="p-2 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center gap-1 font-mono">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-9 h-9 rounded-full bg-[#1b1e24] border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:bg-[#252a33] group-hover:border-white/20 transition-all"
                      title="Call or WhatsApp"
                      aria-label="Call or WhatsApp"
                    >
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </div>

              {/* 3. Our Location Card with Compact Sleek Mini Map */}
              <div className="group w-full p-3.5 sm:p-4 rounded-2xl bg-[#121417]/90 border border-white/[0.08] hover:border-white/20 transition-all duration-200 shadow-lg space-y-3">
                <div
                  onClick={(e) => copyToClipboard(displayLocation, "Location", e)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#1a1d23] border border-white/[0.06] flex items-center justify-center text-neutral-300 group-hover:text-white group-hover:scale-105 transition-all shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-white block">Our location</span>
                      <span className="text-xs sm:text-sm text-neutral-400 block truncate mt-0.5">
                        {displayLocation}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {copiedKey === "Location" ? (
                      <span className="p-2 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center gap-1 font-mono">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-9 h-9 rounded-full bg-[#1b1e24] border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:bg-[#252a33] group-hover:border-white/20 transition-all"
                        title="View on Google Maps"
                        aria-label="View on Google Maps"
                      >
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Sleek Dark-Themed Interactive Mini Map */}
                <div className="relative w-full h-28 sm:h-32 rounded-xl overflow-hidden border border-white/[0.08] bg-[#0c0e12]">
                  <iframe
                    title="Location Mini Map"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      displayLocation
                    )}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-0 filter grayscale invert contrast-[1.3] brightness-90 opacity-75 hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/85 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 pointer-events-none shadow-md">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="font-medium truncate max-w-[200px]">{displayLocation}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ================= RIGHT COLUMN: SLEEK DARK FORM (7 COLS) ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-7"
          >
            <div className="rounded-2xl sm:rounded-[32px] bg-[#121418]/90 border border-white/[0.08] backdrop-blur-2xl p-4 sm:p-7 md:p-9 shadow-2xl relative">
              <AnimatePresence mode="wait">
                {submittedSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-10 sm:py-16 text-center space-y-3 sm:space-y-4"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                      <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-white">Message Dispatched</h3>
                    <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
                      Thank you for reaching out. We have received your message and will review it promptly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmittedSuccess(false)}
                      className="mt-3 sm:mt-4 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-[#1b1e24] hover:bg-[#252932] border border-white/10 text-xs sm:text-sm font-semibold text-white transition-all hover:scale-105"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
                    {/* Name Input */}
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        required
                        maxLength={100}
                        className="w-full bg-[#181a1f] border border-white/[0.08] focus:border-white/25 focus:bg-[#1a1d24] rounded-xl sm:rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-xs sm:text-base text-white placeholder:text-neutral-500 transition-all outline-none"
                      />
                    </div>

                    {/* Email Input */}
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        maxLength={255}
                        className="w-full bg-[#181a1f] border border-white/[0.08] focus:border-white/25 focus:bg-[#1a1d24] rounded-xl sm:rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-xs sm:text-base text-white placeholder:text-neutral-500 transition-all outline-none"
                      />
                    </div>

                    {/* WhatsApp / Phone Input */}
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="WhatsApp Number"
                        maxLength={50}
                        className="w-full bg-[#181a1f] border border-white/[0.08] focus:border-white/25 focus:bg-[#1a1d24] rounded-xl sm:rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-xs sm:text-base text-white placeholder:text-neutral-500 transition-all outline-none"
                      />
                    </div>

                    {/* Message Textarea */}
                    <div>
                      <textarea
                        name="message"
                        placeholder="Message"
                        rows={4}
                        required
                        maxLength={5000}
                        className="w-full bg-[#181a1f] border border-white/[0.08] focus:border-white/25 focus:bg-[#1a1d24] rounded-xl sm:rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-xs sm:text-base text-white placeholder:text-neutral-500 transition-all outline-none resize-none min-h-[120px] sm:min-h-[180px]"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="relative group w-full text-white font-bold text-xs sm:text-base py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-white/30 hover:border-white/60 backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_25px_rgba(59,130,246,0.35)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_0_35px_rgba(14,165,233,0.55)] overflow-hidden flex items-center justify-center gap-2 cursor-pointer mt-1 sm:mt-2 disabled:opacity-60"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255, 255, 255, 0.20) 0%, rgba(37, 99, 235, 0.35) 50%, rgba(14, 165, 233, 0.22) 100%)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                      />
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin relative z-10" />
                          <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">Submitting...</span>
                        </>
                      ) : (
                        <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">Send Message</span>
                      )}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
