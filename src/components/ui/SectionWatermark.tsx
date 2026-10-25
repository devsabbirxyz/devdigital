import React, { useEffect, useRef, useState } from "react";

export interface SectionWatermarkProps {
  text: string;
  glowColor?: "purple" | "cyan" | "emerald" | "amber" | "brand";
  showCircuits?: boolean;
  topOffset?: string;
  className?: string;
}

// Configured with 50% base visibility and 80% cursor spotlight localized strictly to watermark text
const GLOW_CONFIG = {
  purple: {
    // Base 50% glow
    baseGlow:
      "radial-gradient(ellipse 65% 55% at 50% 28%, rgba(0, 153, 255, 0.25) 0%, rgba(14, 116, 144, 0.12) 38%, transparent 75%)",
    baseInnerGlow:
      "radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.18) 0%, transparent 70%)",
    baseTextGradient: "from-white/[0.035] via-cyan-400/[0.12] to-white/[0.035]",
    baseStroke: "1px rgba(56, 189, 248, 0.09)",
    baseShadow: "rgba(0, 153, 255, 0.12)",

    // Spotlight 80% hover brilliance (only on text)
    spotlightTextGradient: "from-white/[0.16] via-cyan-300/[0.80] to-white/[0.16]",
    spotlightStroke: "1.5px rgba(103, 232, 249, 0.65)",
    spotlightShadow: "rgba(0, 153, 255, 0.80)",
    spotlightLight: "rgba(0, 153, 255, 0.38)",
    spotlightInner: "rgba(56, 189, 248, 0.22)",

    circuitGlow: "#38bdf8",
  },
  brand: {
    baseGlow:
      "radial-gradient(ellipse 65% 55% at 50% 28%, rgba(0, 153, 255, 0.25) 0%, rgba(14, 116, 144, 0.12) 38%, transparent 75%)",
    baseInnerGlow:
      "radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.18) 0%, transparent 70%)",
    baseTextGradient: "from-white/[0.035] via-cyan-400/[0.12] to-white/[0.035]",
    baseStroke: "1px rgba(56, 189, 248, 0.09)",
    baseShadow: "rgba(0, 153, 255, 0.12)",

    spotlightTextGradient: "from-white/[0.16] via-cyan-300/[0.80] to-white/[0.16]",
    spotlightStroke: "1.5px rgba(103, 232, 249, 0.65)",
    spotlightShadow: "rgba(0, 153, 255, 0.80)",
    spotlightLight: "rgba(0, 153, 255, 0.38)",
    spotlightInner: "rgba(56, 189, 248, 0.22)",

    circuitGlow: "#0099ff",
  },
  cyan: {
    baseGlow:
      "radial-gradient(ellipse 65% 55% at 50% 28%, rgba(6, 182, 212, 0.25) 0%, rgba(14, 116, 144, 0.12) 38%, transparent 75%)",
    baseInnerGlow:
      "radial-gradient(ellipse at 50% 50%, rgba(34, 211, 238, 0.18) 0%, transparent 70%)",
    baseTextGradient: "from-white/[0.035] via-cyan-400/[0.12] to-white/[0.035]",
    baseStroke: "1px rgba(34, 211, 238, 0.09)",
    baseShadow: "rgba(6, 182, 212, 0.12)",

    spotlightTextGradient: "from-white/[0.16] via-cyan-300/[0.80] to-white/[0.16]",
    spotlightStroke: "1.5px rgba(103, 232, 249, 0.65)",
    spotlightShadow: "rgba(6, 182, 212, 0.80)",
    spotlightLight: "rgba(6, 182, 212, 0.38)",
    spotlightInner: "rgba(56, 189, 248, 0.22)",

    circuitGlow: "#06b6d4",
  },
  emerald: {
    baseGlow:
      "radial-gradient(ellipse 65% 55% at 50% 28%, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.12) 38%, transparent 75%)",
    baseInnerGlow:
      "radial-gradient(ellipse at 50% 50%, rgba(52, 211, 153, 0.18) 0%, transparent 70%)",
    baseTextGradient: "from-white/[0.035] via-emerald-400/[0.12] to-white/[0.035]",
    baseStroke: "1px rgba(52, 211, 153, 0.09)",
    baseShadow: "rgba(16, 185, 129, 0.12)",

    spotlightTextGradient: "from-white/[0.16] via-emerald-300/[0.80] to-white/[0.16]",
    spotlightStroke: "1.5px rgba(110, 231, 183, 0.65)",
    spotlightShadow: "rgba(16, 185, 129, 0.80)",
    spotlightLight: "rgba(16, 185, 129, 0.38)",
    spotlightInner: "rgba(52, 211, 153, 0.22)",

    circuitGlow: "#10b981",
  },
  amber: {
    baseGlow:
      "radial-gradient(ellipse 65% 55% at 50% 28%, rgba(245, 158, 11, 0.25) 0%, rgba(180, 83, 9, 0.12) 38%, transparent 75%)",
    baseInnerGlow:
      "radial-gradient(ellipse at 50% 50%, rgba(251, 191, 36, 0.18) 0%, transparent 70%)",
    baseTextGradient: "from-white/[0.035] via-amber-400/[0.12] to-white/[0.035]",
    baseStroke: "1px rgba(251, 191, 36, 0.09)",
    baseShadow: "rgba(245, 158, 11, 0.12)",

    spotlightTextGradient: "from-white/[0.16] via-amber-300/[0.80] to-white/[0.16]",
    spotlightStroke: "1.5px rgba(252, 211, 77, 0.65)",
    spotlightShadow: "rgba(245, 158, 11, 0.80)",
    spotlightLight: "rgba(245, 158, 11, 0.38)",
    spotlightInner: "rgba(251, 191, 36, 0.22)",

    circuitGlow: "#f59e0b",
  },
};

export default function SectionWatermark({
  text,
  glowColor = "purple", // Site signature brand purple
  showCircuits = true,
  topOffset = "top-8 sm:top-12 md:top-16",
  className = "",
}: SectionWatermarkProps) {
  const conf = GLOW_CONFIG[glowColor as keyof typeof GLOW_CONFIG] || GLOW_CONFIG.purple;
  const containerRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);

  // Mouse hover tracking relative to the watermark text element
  const [textRelativePos, setTextRelativePos] = useState<{ x: number; y: number }>({
    x: -1000,
    y: -1000,
  });
  const [isOverText, setIsOverText] = useState(false);

  useEffect(() => {
    const parentEl = containerRef.current?.parentElement;
    if (!parentEl) return;

    let rafId: number | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const textEl = textWrapperRef.current;
        if (!textEl) return;

        const textRect = textEl.getBoundingClientRect();
        // Strict boundary: ONLY active when cursor is directly over the actual text letters
        const marginX = 15;
        const marginY = 15;
        const inWatermarkZone =
          e.clientX >= textRect.left - marginX &&
          e.clientX <= textRect.right + marginX &&
          e.clientY >= textRect.top - marginY &&
          e.clientY <= textRect.bottom + marginY;

        if (inWatermarkZone) {
          setTextRelativePos({
            x: e.clientX - textRect.left,
            y: e.clientY - textRect.top,
          });
          setIsOverText(true);
        } else {
          setIsOverText(false);
        }
      });
    };

    const handlePointerLeave = () => {
      setIsOverText(false);
    };

    parentEl.addEventListener("pointermove", handlePointerMove, { passive: true });
    parentEl.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      parentEl.removeEventListener("pointermove", handlePointerMove);
      parentEl.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 z-0 select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* ================= 1. BASE 50% AMBIENT GLOW ================= */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] sm:w-[1200px] h-[450px] sm:h-[620px] blur-3xl opacity-50 pointer-events-none"
        style={{ background: conf.baseGlow }}
      />
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[450px] sm:w-[700px] h-[220px] sm:h-[300px] blur-2xl opacity-35 pointer-events-none"
        style={{ background: conf.baseInnerGlow }}
      />

      {/* ================= 2. WATERMARK TEXT CONTAINER ================= */}
      <div
        className={`absolute ${topOffset} left-0 right-0 flex items-center justify-center w-full px-4 select-none pointer-events-none`}
      >
        {/* Tightly-fitted text wrapper that matches the exact width & height of the text letters */}
        <div
          ref={textWrapperRef}
          className="relative inline-flex items-center justify-center select-none pointer-events-none overflow-hidden"
        >
          {/* Base 50% Watermark Layer */}
          <span
            className={`font-sans font-black text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[13rem] leading-none tracking-tight uppercase select-none pointer-events-none whitespace-nowrap bg-gradient-to-r ${conf.baseTextGradient} bg-clip-text text-transparent`}
            style={{
              WebkitTextStroke: conf.baseStroke,
              filter: `drop-shadow(0 0 35px ${conf.baseShadow})`,
            }}
          >
            {text}
          </span>

          {/* ================= A. AMBIENT AUTO-SWEEP SPOTLIGHT (MOBILE ONLY) ================= */}
          {/* Seamless light wave coming from left circuit, flowing across text, to right circuit - ONLY on mobile */}
          <div
            className={`md:hidden absolute inset-0 pointer-events-none transition-opacity duration-300 ${
              isOverText ? "opacity-0" : "opacity-100"
            }`}
          >
            {/* Ambient moving torch aura behind text */}
            <div
              className="absolute inset-y-0 w-64 sm:w-96 pointer-events-none animate-watermark-aura-sweep"
              style={{
                background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${conf.spotlightLight} 0%, ${conf.spotlightInner} 40%, transparent 75%)`,
                filter: "blur(32px)",
              }}
            />

            {/* Glowing Text Layer revealed by moving linear mask */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-watermark-mask-sweep">
              <span
                className={`font-sans font-black text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[13rem] leading-none tracking-tight uppercase select-none pointer-events-none whitespace-nowrap bg-gradient-to-r ${conf.spotlightTextGradient} bg-clip-text text-transparent`}
                style={{
                  WebkitTextStroke: conf.spotlightStroke,
                  filter: `drop-shadow(0 0 45px ${conf.spotlightShadow}) drop-shadow(0 0 15px ${conf.spotlightLight})`,
                }}
              >
                {text}
              </span>
            </div>
          </div>

          {/* ================= B. INTERACTIVE DESKTOP CURSOR SPOTLIGHT ================= */}
          {/* Active strictly when desktop pointer hovers over text */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-200 ease-out ${
              isOverText ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle 200px at ${textRelativePos.x}px ${textRelativePos.y}px, ${conf.spotlightLight} 0%, ${conf.spotlightInner} 35%, transparent 75%)`,
                filter: "blur(18px)",
              }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                WebkitMaskImage: `radial-gradient(circle 220px at ${textRelativePos.x}px ${textRelativePos.y}px, black 35%, transparent 85%)`,
                maskImage: `radial-gradient(circle 220px at ${textRelativePos.x}px ${textRelativePos.y}px, black 35%, transparent 85%)`,
              }}
            >
              <span
                className={`font-sans font-black text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[13rem] leading-none tracking-tight uppercase select-none pointer-events-none whitespace-nowrap bg-gradient-to-r ${conf.spotlightTextGradient} bg-clip-text text-transparent`}
                style={{
                  WebkitTextStroke: conf.spotlightStroke,
                  filter: `drop-shadow(0 0 45px ${conf.spotlightShadow}) drop-shadow(0 0 15px ${conf.spotlightLight})`,
                }}
              >
                {text}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. CYBER CIRCUIT TRACES WITH LIGHT PULSE ================= */}
      {showCircuits && (
        <>
          {/* Top-Left Glowing Cyber Circuit Line (Light flows from Left -> Center Text on Mobile) */}
          <div className="absolute left-0 top-6 sm:top-10 w-48 sm:w-80 md:w-[420px] pointer-events-none select-none opacity-85 sm:opacity-70">
            <svg className="w-full h-auto" viewBox="0 0 420 160" fill="none">
              {/* Circuit background route line */}
              <path
                d="M0,40 L120,40 L170,90 L290,90 L320,120 L370,120"
                stroke="#27272a"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
              />
              <path
                d="M0,40 L120,40 L170,90 L250,90"
                stroke={`url(#circuit-glow-left-${glowColor})`}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.3"
              />

              {/* Animated laser trail traveling through thin line from left into text (Mobile only) */}
              <path
                d="M0,40 L120,40 L170,90 L290,90 L320,120 L370,120"
                stroke={`url(#laser-gradient-left-${glowColor})`}
                strokeWidth="2.5"
                strokeLinecap="round"
                className="circuit-laser-left md:hidden"
                style={{
                  filter: `drop-shadow(0 0 6px ${conf.circuitGlow}) drop-shadow(0 0 12px ${conf.circuitGlow})`,
                }}
              />

              {/* Glowing photon bead running along the left circuit into text (Mobile only) */}
              <circle
                r="3.5"
                fill="#ffffff"
                className="circuit-bead-left md:hidden"
                style={{
                  filter: `drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 14px ${conf.circuitGlow})`,
                }}
              >
                <animateMotion
                  path="M0,40 L120,40 L170,90 L290,90 L320,120 L370,120"
                  dur="5.5s"
                  repeatCount="indefinite"
                  keyTimes="0;0.22;0.24;1"
                  keyPoints="0;1;1;0"
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1"
                />
                <animate
                  attributeName="opacity"
                  dur="5.5s"
                  repeatCount="indefinite"
                  keyTimes="0;0.02;0.20;0.24;1"
                  values="0;1;1;0;0"
                />
              </circle>

              <circle
                cx="250"
                cy="90"
                r="3"
                fill="#ffffff"
                className="drop-shadow-[0_0_8px_#ffffff]"
                opacity="0.7"
              />
              <circle
                cx="370"
                cy="120"
                r="3.5"
                fill="#09090b"
                stroke={conf.circuitGlow}
                strokeWidth="1.5"
                opacity="0.8"
              />
              <defs>
                <linearGradient
                  id={`circuit-glow-left-${glowColor}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                  <stop offset="70%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor={conf.circuitGlow} stopOpacity="0.7" />
                </linearGradient>
                <linearGradient
                  id={`laser-gradient-left-${glowColor}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                  <stop offset="65%" stopColor={conf.circuitGlow} stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Top-Right Glowing Cyber Circuit Line (Light continues from Center Text -> Right Edge on Mobile) */}
          <div className="absolute right-0 top-6 sm:top-10 w-48 sm:w-80 md:w-[420px] pointer-events-none select-none opacity-85 sm:opacity-70">
            <svg className="w-full h-auto" viewBox="0 0 420 160" fill="none">
              {/* Circuit background route line */}
              <path
                d="M420,40 L300,40 L250,90 L130,90 L100,120 L50,120"
                stroke="#27272a"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
              />
              <path
                d="M420,40 L300,40 L250,90 L170,90"
                stroke={`url(#circuit-glow-right-${glowColor})`}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.3"
              />

              {/* Animated laser trail traveling from near text outwards to screen edge (Mobile only) */}
              <path
                d="M50,120 L100,120 L130,90 L250,90 L300,40 L420,40"
                stroke={`url(#laser-gradient-right-${glowColor})`}
                strokeWidth="2.5"
                strokeLinecap="round"
                className="circuit-laser-right md:hidden"
                style={{
                  filter: `drop-shadow(0 0 6px ${conf.circuitGlow}) drop-shadow(0 0 12px ${conf.circuitGlow})`,
                }}
              />

              {/* Glowing photon bead running from text outwards along right circuit (Mobile only) */}
              <circle
                r="3.5"
                fill="#ffffff"
                className="circuit-bead-right md:hidden"
                style={{
                  filter: `drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 14px ${conf.circuitGlow})`,
                }}
              >
                <animateMotion
                  path="M50,120 L100,120 L130,90 L250,90 L300,40 L420,40"
                  dur="5.5s"
                  repeatCount="indefinite"
                  keyTimes="0;0.59;0.80;0.83;1"
                  keyPoints="0;0;1;1;0"
                  calcMode="spline"
                  keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1"
                />
                <animate
                  attributeName="opacity"
                  dur="5.5s"
                  repeatCount="indefinite"
                  keyTimes="0;0.58;0.61;0.78;0.82;1"
                  values="0;0;1;1;0;0"
                />
              </circle>

              <circle
                cx="170"
                cy="90"
                r="3"
                fill="#ffffff"
                className="drop-shadow-[0_0_8px_#ffffff]"
                opacity="0.7"
              />
              <circle
                cx="50"
                cy="120"
                r="3.5"
                fill="#09090b"
                stroke={conf.circuitGlow}
                strokeWidth="1.5"
                opacity="0.8"
              />
              <defs>
                <linearGradient
                  id={`circuit-glow-right-${glowColor}`}
                  x1="100%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                  <stop offset="70%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor={conf.circuitGlow} stopOpacity="0.7" />
                </linearGradient>
                <linearGradient
                  id={`laser-gradient-right-${glowColor}`}
                  x1="0%"
                  y1="100%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="35%" stopColor={conf.circuitGlow} stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
