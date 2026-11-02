import React from "react";

export interface SectionWatermarkProps {
  text: string;
  glowColor?: "purple" | "cyan" | "emerald" | "amber" | "brand";
  showCircuits?: boolean;
  topOffset?: string;
  className?: string;
}

const GLOW_CONFIG = {
  purple: {
    ambient: "rgba(168, 85, 247, 0.12)",
    textGradient: "from-white/[0.04] via-purple-400/[0.12] to-white/[0.03]",
    stroke: "1px rgba(168, 85, 247, 0.15)",
  },
  brand: {
    ambient: "rgba(0, 153, 255, 0.12)",
    textGradient: "from-white/[0.04] via-cyan-400/[0.12] to-white/[0.03]",
    stroke: "1px rgba(0, 153, 255, 0.15)",
  },
  cyan: {
    ambient: "rgba(6, 182, 212, 0.12)",
    textGradient: "from-white/[0.04] via-cyan-400/[0.12] to-white/[0.03]",
    stroke: "1px rgba(6, 182, 212, 0.15)",
  },
  emerald: {
    ambient: "rgba(16, 185, 129, 0.12)",
    textGradient: "from-white/[0.04] via-emerald-400/[0.12] to-white/[0.03]",
    stroke: "1px rgba(16, 185, 129, 0.15)",
  },
  amber: {
    ambient: "rgba(245, 158, 11, 0.12)",
    textGradient: "from-white/[0.04] via-amber-400/[0.12] to-white/[0.03]",
    stroke: "1px rgba(245, 158, 11, 0.15)",
  },
};

export default function SectionWatermark({
  text,
  glowColor = "purple",
  topOffset = "top-8 sm:top-12 md:top-16",
  className = "",
}: SectionWatermarkProps) {
  const conf = GLOW_CONFIG[glowColor as keyof typeof GLOW_CONFIG] || GLOW_CONFIG.purple;

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Soft hardware-accelerated ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] blur-[120px] opacity-40 pointer-events-none will-change-transform"
        style={{
          background: `radial-gradient(circle, ${conf.ambient} 0%, transparent 70%)`,
        }}
      />

      {/* Large aesthetic watermark typography */}
      <div
        className={`absolute ${topOffset} left-0 right-0 flex items-center justify-center w-full px-4 select-none pointer-events-none`}
      >
        <span
          className={`font-sans font-black text-[18vw] sm:text-[15vw] md:text-[13vw] lg:text-[12rem] leading-none tracking-tight uppercase select-none pointer-events-none whitespace-nowrap bg-gradient-to-r ${conf.textGradient} bg-clip-text text-transparent`}
          style={{
            WebkitTextStroke: conf.stroke,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
