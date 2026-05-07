import { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { sendWhatsAppNotification } from "@/lib/whatsappNotify";

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
    toast.success("Thanks! I'll get back to you shortly.");
    onOpenChange(false);
    (e.target as HTMLFormElement).reset();
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
            className="w-full bg-gradient-primary text-white font-semibold py-3 rounded-xl neon-glow hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
