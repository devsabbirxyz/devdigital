import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Loader2, ArrowUpRight } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "sonner";

type ContactInfo = { email: string; phone: string; location: string };
const DEFAULT: ContactInfo = { email: "hello@portfolio.com", phone: "+1 (555) 123-4567", location: "New York, USA" };

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

export default function Contact() {
  const { data } = useSiteSettings<ContactInfo>("contact", DEFAULT);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
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
      message: parsed.data.message,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not send. Please try again.");
      return;
    }
    toast.success("Message sent! I'll get back to you soon.");
    (e.target as HTMLFormElement).reset();
  };

  const cards = [
    { icon: Mail, label: "Email us", value: data.email, href: `mailto:${data.email}` },
    { icon: Phone, label: "Call us", value: data.phone, href: `tel:${data.phone.replace(/\s/g, "")}` },
    { icon: MapPin, label: "Our location", value: data.location, href: "#" },
  ];

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      {/* CONTACT watermark */}
      <div className="absolute inset-x-0 top-12 text-center pointer-events-none select-none">
        <span className="font-display font-black text-[120px] md:text-[200px] leading-none text-white/[0.03] tracking-tighter">
          CONTACT
        </span>
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">Contact</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">
            Get in <span className="text-gradient">touch</span>
          </h2>
          <p className="text-muted-foreground max-w-md mt-3">
            Have questions or ready to start your next project? Let's build something amazing together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {cards.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="group glass-strong rounded-2xl p-5 flex items-center gap-4 transition-all hover:shadow-glow-soft hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center flex-shrink-0 group-hover:bg-gradient-primary transition-colors">
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{c.label}</p>
                  <p className="text-sm text-muted-foreground truncate">{c.value}</p>
                </div>
                <div className="w-9 h-9 rounded-full glass flex items-center justify-center flex-shrink-0 group-hover:rotate-45 transition-transform">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </a>
            ))}

            <div className="rounded-2xl overflow-hidden glass-strong glow-border shadow-glow-soft border border-primary/30">
              <iframe
                title="Location map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(data.location)}&output=embed`}
                className="w-full h-64 grayscale-[40%] contrast-110"
                style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-strong rounded-3xl p-6 md:p-8 space-y-4 flex flex-col"
          >
            <input
              name="name"
              placeholder="Name"
              required
              maxLength={100}
              className="w-full bg-input/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl px-4 py-3 outline-none transition"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              maxLength={255}
              className="w-full bg-input/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl px-4 py-3 outline-none transition"
            />
            <textarea
              name="message"
              placeholder="Message"
              rows={6}
              required
              maxLength={5000}
              className="flex-1 w-full bg-input/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-xl px-4 py-3 outline-none transition resize-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-white text-background font-semibold py-4 rounded-xl hover:scale-[1.01] transition-transform disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Submit
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
