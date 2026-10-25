import { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { sendWhatsAppNotification } from "@/lib/whatsappNotify";
import { sendFormsubmit } from "@/lib/formsubmit";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

export default function ContactPopup({
  open,
  onOpenChange,
  plan,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  plan?: string;
}) {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
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
    const { error } = await supabase.from("contact_submissions").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
      plan: plan ?? null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit. Please try again.");
      return;
    }
    sendWhatsAppNotification({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
      plan: plan ?? null,
    });
    sendFormsubmit({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
      plan: plan ?? null,
    });
    (e.currentTarget as HTMLFormElement).reset();
    toast.success("✓ Message sent successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-primary/30 max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {plan ? `Get Started with ${plan}` : "Get In Touch"}
          </DialogTitle>
          <DialogDescription>
            Fill out the form and I'll reach out within 24 hours.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-2">
          <input
            name="name"
            placeholder="Your name"
            required
            maxLength={100}
            className="w-full bg-input/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl px-4 py-3 outline-none transition"
          />
          <input
            name="email"
            type="email"
            placeholder="Email address"
            required
            maxLength={255}
            className="w-full bg-input/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl px-4 py-3 outline-none transition"
          />
          <input
            name="phone"
            placeholder="Phone (optional)"
            maxLength={50}
            className="w-full bg-input/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl px-4 py-3 outline-none transition"
          />
          <textarea
            name="message"
            placeholder="Tell me about your project..."
            rows={4}
            required
            maxLength={5000}
            className="w-full bg-input/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl px-4 py-3 outline-none transition resize-none"
          />
          {plan && (
            <input type="hidden" name="plan" value={plan} />
          )}
          <button
            type="submit"
            disabled={submitting}
            className="relative group w-full text-white font-bold py-3.5 rounded-xl border border-white/30 hover:border-white/60 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_25px_rgba(59,130,246,0.35)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_0_35px_rgba(14,165,233,0.55)] overflow-hidden flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
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
            {submitting && <Loader2 className="h-4 w-4 animate-spin relative z-10" />}
            <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">Submit Request</span>
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
