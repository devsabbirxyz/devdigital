import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import profileImg from "@/assets/profile.jpg";

type AboutData = { title: string; tagline: string; name: string; bio: string; image_url: string };
const DEFAULT: AboutData = {
  title: "About Me",
  tagline: "Designer · Developer · AI Specialist",
  name: "Your Name",
  bio: "I build modern, future-ready digital products that blend stunning design with powerful technology. From web platforms to AI automations — I deliver work that drives real results.",
  image_url: "",
};

export default function About() {
  const { data } = useSiteSettings<AboutData>("about", DEFAULT);
  const img = data.image_url || profileImg;

  return (
    <section id="about" className="relative py-24">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative flex justify-center"
          >
            <div className="absolute inset-0 bg-primary/30 blur-[80px] rounded-full animate-pulse-glow" />
            <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden glass-strong p-2 animate-float">
              <img src={img} alt="Profile" loading="lazy" className="w-full h-full object-cover rounded-full" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">
              {data.tagline}
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3 mb-6">
              {data.title.split(" ").map((w, i, arr) => (
                <span key={i} className={i === arr.length - 1 ? "text-gradient" : ""}>
                  {w}{" "}
                </span>
              ))}
            </h2>
            <h3 className="font-display text-3xl md:text-5xl font-extrabold mb-6 text-gradient drop-shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
              {data.name}
            </h3>
            <p className="text-muted-foreground leading-relaxed text-lg">{data.bio}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
