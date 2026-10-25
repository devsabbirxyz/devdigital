import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  CheckCircle2,
  Send,
  Loader2,
  Video,
  Shield,
  MessageCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { sendWhatsAppNotification } from "@/lib/whatsappNotify";
import { sendFormsubmit } from "@/lib/formsubmit";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function openBookingModal(defaultTopic?: string) {
  window.dispatchEvent(
    new CustomEvent("open-booking-modal", { detail: { topic: defaultTopic } })
  );
}

type BookingSettings = {
  calendly_url?: string;
  enabled?: boolean;
};

const DEFAULT_SETTINGS: BookingSettings = {
  calendly_url: "",
  enabled: true,
};

const TIME_SLOTS = [
  "10:00 AM - 10:30 AM",
  "02:00 PM - 02:30 PM",
  "04:30 PM - 05:00 PM",
  "08:00 PM - 08:30 PM",
  "10:00 PM - 10:30 PM",
];

const TOPICS = [
  "Paid Ads & Meta CAPI Scaling Audit",
  "Full-Stack Web Development & CRO",
  "AI Autonomous Workflows & Bot Pipelines",
  "Turnkey E-Commerce & Full Partnership",
];

export default function BookingModal() {
  const { data: settings } = useSiteSettings<BookingSettings>(
    "booking_settings",
    DEFAULT_SETTINGS
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>(TIME_SLOTS[1]);
  const [fullName, setFullName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Generate the next 5 business days for quick slot booking
  const availableDates = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      iso: d.toISOString().split("T")[0],
      display: d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      isTomorrow: i === 0,
    };
  });

  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      setSelectedDate(availableDates[0].display);
    }
  }, [availableDates, selectedDate]);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ topic?: string }>;
      if (customEvent.detail?.topic) {
        setSelectedTopic(customEvent.detail.topic);
      }
      setIsSuccess(false);
      setIsOpen(true);
    };

    window.addEventListener("open-booking-modal", handleOpen);
    return () => window.removeEventListener("open-booking-modal", handleOpen);
  }, []);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return toast.error("Please enter your name");
    if (!contactInfo.trim())
      return toast.error("Please enter your WhatsApp number or email");

    setSubmitting(true);
    const bookingSummary = `15-Min Strategy Audit (${selectedTopic}) | Scheduled: ${selectedDate} at ${selectedTime} | Website: ${
      websiteUrl || "N/A"
    }`;

    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: fullName.trim(),
        email: contactInfo.includes("@") ? contactInfo.trim() : "phone-booking@devdigital.xyz",
        phone: !contactInfo.includes("@") ? contactInfo.trim() : null,
        message: bookingSummary,
        plan: "15-Min Strategy Call",
      });

      if (error) throw error;

      // Send Instant WhatsApp & FormSubmit notifications
      sendWhatsAppNotification({
        name: fullName.trim(),
        email: contactInfo.trim(),
        phone: contactInfo.trim(),
        message: `📅 NEW STRATEGY CALL BOOKING:\n• Date: ${selectedDate}\n• Time: ${selectedTime}\n• Focus: ${selectedTopic}\n• Business: ${websiteUrl || "Not provided"}`,
        plan: "15-Min Strategy Call",
      });

      sendFormsubmit({
        name: fullName.trim(),
        email: contactInfo.trim(),
        phone: contactInfo.trim(),
        message: bookingSummary,
        plan: "15-Min Strategy Call",
      });

      setIsSuccess(true);
      toast.success("Strategy Call Scheduled Successfully!");
    } catch {
      toast.error("Booking could not be finalized. Please connect on WhatsApp directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => {
    setIsOpen(false);
    setIsSuccess(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl glass-strong rounded-3xl p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/20 my-auto text-left"
          >
            {/* Close Button */}
            <button
              onClick={close}
              aria-label="Close booking modal"
              className="absolute top-4 right-4 w-9 h-9 rounded-full glass hover:bg-white/20 flex items-center justify-center text-muted-foreground hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Embedded Calendly Mode (If Admin provided custom URL) */}
            {settings?.calendly_url ? (
              <div>
                <div className="mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-primary bg-primary/10 border border-primary/20 mb-2">
                    <Video className="w-3.5 h-3.5 text-primary" />
                    <span>GOOGLE MEET / ZOOM AUDIT</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold">
                    Schedule Your <span className="text-gradient">15-Min Growth Call</span>
                  </h3>
                </div>
                <div className="w-full h-[540px] rounded-2xl overflow-hidden bg-background/50 border border-white/10">
                  <iframe
                    src={settings.calendly_url}
                    width="100%"
                    height="100%"
                    title="Calendly Booking"
                    className="border-0"
                  />
                </div>
              </div>
            ) : isSuccess ? (
              /* Success State */
              <div className="text-center py-8 px-2">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-2">
                  Call Confirmed!
                </h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6 leading-relaxed">
                  Thank you, <span className="text-white font-semibold">{fullName}</span>. Sabbir has been alerted. We will connect on Google Meet on{" "}
                  <span className="text-primary font-bold">{selectedDate}</span> at{" "}
                  <span className="text-primary font-bold">{selectedTime}</span>.
                </p>

                <div className="glass rounded-2xl p-4 mb-6 border border-white/10 text-xs text-left max-w-md mx-auto space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Topic:</span>
                    <span className="text-white font-medium">{selectedTopic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact:</span>
                    <span className="text-white font-medium">{contactInfo}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/8801941130981?text=Hi%20Sabbir,%20I%20just%20scheduled%20a%2015-minute%20call%20for%20${encodeURIComponent(
                      selectedDate + " at " + selectedTime
                    )}%20regarding%20${encodeURIComponent(selectedTopic)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full transition shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Ping Sabbir on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={close}
                    className="glass px-6 py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-white/10 text-muted-foreground hover:text-white transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Native High-Converting 2-Step Scheduler */
              <form onSubmit={handleSubmitBooking} className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-primary bg-primary/10 border border-primary/20 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
                    <span>NO PITCH &bull; 100% TACTICAL AUDIT</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    Book a <span className="text-gradient">15-Min Strategy Call</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Direct 1-on-1 discovery session with Sabbir via Google Meet / Zoom. Zero obligation.
                  </p>
                </div>

                {/* 1. Date Selector */}
                <div>
                  <label className="block text-xs font-semibold text-foreground/90 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                    <span>Select Date</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                    {availableDates.map((d) => (
                      <button
                        key={d.iso}
                        type="button"
                        onClick={() => setSelectedDate(d.display)}
                        className={`p-2 rounded-xl text-center border transition-all text-xs font-semibold ${
                          selectedDate === d.display
                            ? "bg-gradient-primary text-white border-primary/50 shadow-neon"
                            : "glass hover:bg-white/10 text-muted-foreground hover:text-white border-white/10"
                        }`}
                      >
                        <div className="text-[10px] opacity-75">{d.display.split(",")[0]}</div>
                        <div className="font-bold">{d.display.split(",")[1]}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Time Window Selector */}
                <div>
                  <label className="block text-xs font-semibold text-foreground/90 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>Preferred Time Slot (GMT+6 / Flexible)</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                          selectedTime === slot
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "glass hover:bg-white/10 text-muted-foreground hover:text-white border-white/10"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Strategy Focus */}
                <div>
                  <label className="block text-xs font-semibold text-foreground/90 uppercase tracking-wider mb-1.5">
                    Primary Focus
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full bg-neutral-900/90 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none focus:border-primary transition"
                  >
                    {TOPICS.map((t) => (
                      <option key={t} value={t} className="bg-neutral-900 text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Contact Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full bg-neutral-900/90 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      WhatsApp or Email *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="+880 1... or name@company.com"
                      className="w-full bg-neutral-900/90 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Website or Store URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourbrand.com"
                    className="w-full bg-neutral-900/90 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="relative group w-full text-white font-bold py-3.5 px-6 rounded-2xl text-sm border border-white/30 hover:border-white/60 backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_25px_rgba(59,130,246,0.35)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_0_35px_rgba(14,165,233,0.55)] overflow-hidden flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
                        <Loader2 className="w-4 h-4 animate-spin relative z-10" />
                        <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">Reserving Slot...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-cyan-300 relative z-10" />
                        <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">Confirm 15-Min Strategy Call</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground mt-3">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-emerald-400" /> 100% Confidential
                    </span>
                    <span>&bull;</span>
                    <span>No Sales Pressure Guarantee</span>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
