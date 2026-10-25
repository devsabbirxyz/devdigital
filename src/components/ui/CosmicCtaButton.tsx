import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface CosmicCtaButtonProps {
  children?: React.ReactNode;
  text?: string;
  onClick?: () => void;
  className?: string;
  showSparkles?: boolean;
  showArrow?: boolean;
  size?: "sm" | "default" | "lg";
}

/**
 * Ultra-Modern Cosmic Animated Pill CTA Button
 * - Pill shape (border-radius: 9999px)
 * - Deep glossy indigo/dark-violet surface (#17122B -> #1E1638 -> #2A1F4D)
 * - Continuous rotating neon border beam (#9D6BFF -> #E0C3FC -> #B57BFF)
 * - Rich lavender/purple glowing aura (shadow: 0 0 25px rgba(157,107,255,0.6))
 * - Twinkling floating star sparkle particles inside
 * - Magnetic feel & hover interaction (scale 1.035, intensified aura)
 */
export function CosmicCtaButton({
  children,
  text = "Start a Project",
  onClick,
  className = "",
  showSparkles = true,
  showArrow = true,
  size = "default",
}: CosmicCtaButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const sizeClasses = {
    sm: "px-3 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs",
    default: "px-4 sm:px-8 py-2.5 sm:py-3.5 text-xs sm:text-base",
    lg: "px-6 sm:px-10 py-3 sm:py-4 text-sm sm:text-lg",
  }[size];

  return (
    <motion.div
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`relative inline-flex p-[1.5px] rounded-full group cursor-pointer ${className}`}
      style={{
        filter: "drop-shadow(0 0 16px rgba(37, 99, 235, 0.55))",
      }}
    >
      {/* 1. OUTER PULSING AMBIENT AURA GLOW */}
      <div
        aria-hidden="true"
        className="absolute -inset-1 rounded-full opacity-60 group-hover:opacity-100 blur-xl transition-all duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(37, 99, 235, 0.75) 0%, rgba(59, 130, 246, 0.35) 45%, transparent 75%)",
        }}
      />

      {/* 2. ROTATING CONIC BORDER BEAM (Continuous Laser Shimmer) */}
      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
        <div
          className="absolute -inset-[200%] animate-border-beam pointer-events-none"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, transparent 0deg 260deg, #1D4ED8 300deg, #93C5FD 340deg, #3B82F6 360deg)",
          }}
        />
      </div>

      {/* 3. STATIC BASE GLOWING BORDER (Cobalt / Neon Blue outline) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-[#3B82F6]/50 group-hover:border-[#93C5FD]/80 transition-colors duration-300 pointer-events-none"
      />

      {/* 4. BUTTON INNER SURFACE */}
      <button
        ref={buttonRef}
        type="button"
        onClick={onClick}
        className={`relative z-10 w-full rounded-full ${sizeClasses} font-semibold text-white tracking-wide transition-all duration-300 overflow-hidden flex items-center justify-center gap-1.5 sm:gap-2.5`}
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(37, 99, 235, 0.32) 50%, rgba(14, 165, 233, 0.20) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.35)",
          boxShadow:
            "inset 0 1px 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.25), 0 0 32px rgba(37, 99, 235, 0.45)",
        }}
      >
        {/* Subtle glossy top specular highlight */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#93C5FD]/70 to-transparent pointer-events-none"
        />

        {/* Shimmer light sweep on hover */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"
        />

        {/* LEFT SPARKLE (Twinkling star particle) */}
        {showSparkles && (
          <span
            aria-hidden="true"
            className="relative flex items-center justify-center text-[#93C5FD] group-hover:rotate-45 group-hover:scale-125 transition-transform duration-500"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#60A5FA]" />
            <span className="absolute w-1 h-1 rounded-full bg-white shadow-[0_0_8px_#60A5FA]" />
          </span>
        )}

        {/* BUTTON LABEL */}
        <span className="relative z-10 font-sans font-bold tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {children || text}
        </span>

        {/* RIGHT ARROW / SECONDARY SPARKLE */}
        {showArrow && (
          <span className="relative z-10 flex items-center text-[#93C5FD] group-hover:translate-x-1 transition-transform duration-300">
            <ArrowRight className="w-4 h-4 text-[#93C5FD] group-hover:text-white transition-colors" />
          </span>
        )}

        {/* RIGHT FLOATING ACCENT PARTICLE */}
        {showSparkles && (
          <span
            aria-hidden="true"
            className="absolute right-4 top-2 w-1 h-1 rounded-full bg-[#93C5FD] opacity-70 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300 animate-pulse pointer-events-none shadow-[0_0_6px_#3B82F6]"
          />
        )}
      </button>
    </motion.div>
  );
}

export default CosmicCtaButton;
