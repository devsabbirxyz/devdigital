import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Code2, Brain, Palette, Globe, Zap, Terminal, Cpu, BarChart3, Figma, Database, Layers, Smartphone
} from "lucide-react";

type SkillItem = {
  name: string;
  level: number;
  icon: React.ElementType;
};

type SkillCategory = {
  id: string;
  label: string;
  skills: SkillItem[];
};

const CATEGORIES: SkillCategory[] = [
  {
    id: "dev",
    label: "Development",
    skills: [
      { name: "React / Next.js", level: 95, icon: Code2 },
      { name: "TypeScript", level: 92, icon: Terminal },
      { name: "Node.js / Express", level: 88, icon: Database },
      { name: "Python", level: 80, icon: Cpu },
      { name: "REST & GraphQL APIs", level: 90, icon: Layers },
      { name: "Mobile (React Native)", level: 75, icon: Smartphone },
    ],
  },
  {
    id: "ai",
    label: "AI & Automation",
    skills: [
      { name: "LLM Integration (OpenAI, Claude)", level: 92, icon: Brain },
      { name: "AI Agent Development", level: 88, icon: Zap },
      { name: "n8n / Zapier Automation", level: 85, icon: Zap },
      { name: "Prompt Engineering", level: 90, icon: Terminal },
    ],
  },
  {
    id: "design",
    label: "Design & Marketing",
    skills: [
      { name: "UI/UX Design (Figma)", level: 90, icon: Figma },
      { name: "SEO & Content Strategy", level: 88, icon: Globe },
      { name: "Analytics & Data", level: 85, icon: BarChart3 },
      { name: "Brand Identity", level: 82, icon: Palette },
    ],
  },
];

function SkillBar({ skill, delay }: { skill: SkillItem; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const Icon = skill.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center neon-glow group-hover:scale-110 transition-transform">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 flex items-center justify-between">
          <span className="font-semibold text-sm">{skill.name}</span>
          <span className="text-xs font-bold text-primary tabular-nums">{skill.level}%</span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-primary"
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
          style={{ boxShadow: "0 0 12px hsl(271 91% 65% / 0.6)" }}
        />
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const [active, setActive] = useState("dev");
  const category = CATEGORIES.find((c) => c.id === active)!;

  return (
    <section id="skills" className="relative py-24 overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[360px] h-[360px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">
            What I Bring
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">
            Skills <span className="text-gradient">&amp;</span> Expertise
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            A blend of modern engineering, AI innovation, and strategic design built over years of hands-on work.
          </p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                active === c.id
                  ? "bg-gradient-primary text-white shadow-glow-soft"
                  : "glass text-foreground/70 hover:text-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid md:grid-cols-2 gap-x-10 gap-y-6 max-w-4xl mx-auto"
        >
          {category.skills.map((s, i) => (
            <SkillBar key={s.name} skill={s} delay={i * 0.08} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
