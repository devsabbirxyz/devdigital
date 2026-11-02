import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  enableTilt?: boolean;
  enableGlare?: boolean;
  enableBorderBeam?: boolean;
  tiltStrength?: number;
  onClick?: () => void;
}

export default function HolographicCard({
  children,
  className = "",
  enableTilt = true,
  enableGlare = true,
  enableBorderBeam = true,
  tiltStrength = 8,
  onClick,
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch devices to avoid unwanted continuous gyro tilt or heavy animations on mobile
  useEffect(() => {
    setIsTouchDevice(
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0
    );
  }, []);

  // Motion values for smooth 3D tilt on desktop hover
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 240, damping: 25, mass: 0.15 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D rotation transforms
  const rotateX = useTransform(smoothMouseY, [0, 1], [tiltStrength, -tiltStrength]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-tiltStrength, tiltStrength]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchDevice || !enableTilt) return;
      const el = cardRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      mouseX.set(x);
      mouseY.set(y);

      // Pure CSS variable update: ZERO React re-renders for 60fps butter-smooth glare
      if (enableGlare) {
        el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
        el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
      }
    },
    [isTouchDevice, enableTilt, enableGlare, mouseX, mouseY]
  );

  const handleMouseEnter = () => {
    if (!isTouchDevice) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      onClick={onClick}
      style={{
        perspective: 1000,
        rotateX: isHovered && !isTouchDevice ? rotateX : 0,
        rotateY: isHovered && !isTouchDevice ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      className={`relative rounded-3xl cursor-pointer will-change-transform ${className}`}
    >
      {/* 1. LASER BORDER BEAM — Only mounts when hovered on desktop to save 100% idle GPU */}
      {enableBorderBeam && isHovered && !isTouchDevice && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[1.5px] rounded-[inherit] overflow-hidden z-0"
        >
          <div
            className="absolute inset-[-150%] animate-border-beam opacity-90 transition-opacity duration-300"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0 310deg, #0099FF 330deg, #38bdf8 350deg, #ffffff 360deg)",
            }}
          />
        </div>
      )}

      {/* 2. CARD CONTENT CONTAINER */}
      <div className="relative z-10 h-full w-full rounded-[inherit] bg-[#10121A] border border-white/10 hover:border-white/20 transition-colors backdrop-blur-xl overflow-hidden pointer-events-auto">
        {children}
      </div>

      {/* 3. HOLOGRAPHIC GLARE / SHEEN — GPU CSS variables */}
      {enableGlare && !isTouchDevice && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-20 transition-opacity duration-200 overflow-hidden"
          style={{
            opacity: isHovered ? 1 : 0,
            background:
              "radial-gradient(circle 240px at var(--gx, 50%) var(--gy, 50%), rgba(0, 153, 255, 0.22) 0%, rgba(56, 189, 248, 0.12) 35%, transparent 70%)",
          }}
        />
      )}
    </motion.div>
  );
}
