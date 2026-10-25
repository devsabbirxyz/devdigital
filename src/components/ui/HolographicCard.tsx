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
  tiltStrength = 10,
  onClick,
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  // Detect touch devices to avoid unwanted continuous gyro tilt on mobile phones
  useEffect(() => {
    setIsTouchDevice(
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0
    );
  }, []);

  // Motion values for smooth 3D tilt
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 260, damping: 20, mass: 0.2 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D rotation transforms
  const rotateX = useTransform(smoothMouseY, [0, 1], [tiltStrength, -tiltStrength]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-tiltStrength, tiltStrength]);

  // Dynamic glare coordinates
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

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

      if (enableGlare) {
        setGlarePos({
          x: Math.round(x * 100),
          y: Math.round(y * 100),
        });
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

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!enableGlare) return;
    const el = cardRef.current;
    if (!el || !e.touches[0]) return;
    const rect = el.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));
    setGlarePos({ x: Math.round(x * 100), y: Math.round(y * 100) });
    setIsTouched(true);
  };

  const handleTouchEnd = () => {
    setIsTouched(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      whileTap={{ scale: 0.982 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      onClick={onClick}
      style={{
        perspective: 1000,
        rotateX: isHovered && !isTouchDevice ? rotateX : 0,
        rotateY: isHovered && !isTouchDevice ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      className={`relative rounded-3xl cursor-pointer will-change-transform ${className}`}
    >
      {/* 1. LASER BORDER BEAM (z-0: Behind content, shines through 1.5px border margin) */}
      {enableBorderBeam && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[1.5px] rounded-[inherit] overflow-hidden z-0"
        >
          <div
            className={`absolute inset-[-150%] animate-border-beam transition-opacity duration-500 ${
              isHovered || isTouched
                ? "opacity-100"
                : isTouchDevice
                ? "opacity-60 animate-pulse-glow"
                : "opacity-45"
            }`}
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0 310deg, #0099FF 330deg, #38bdf8 350deg, #ffffff 360deg)",
            }}
          />
        </div>
      )}

      {/* 2. CARD CONTENT CONTAINER (z-10: Sits cleanly in front of the laser beam track) */}
      <div className="relative z-10 h-full w-full rounded-[inherit] bg-[#10121A] border border-white/5 backdrop-blur-xl overflow-hidden pointer-events-auto">
        {children}
      </div>

      {/* 3. HOLOGRAPHIC GLARE / SHEEN (z-20: Pure visual pointer-events-none overlay, active on hover or mobile tap) */}
      {enableGlare && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-20 transition-opacity duration-300 overflow-hidden"
          style={{
            opacity: isHovered || isTouched ? 1 : 0,
            background: `radial-gradient(circle 240px at ${glarePos.x}% ${glarePos.y}%, rgba(0, 153, 255, 0.22) 0%, rgba(56, 189, 248, 0.15) 35%, transparent 70%)`,
          }}
        />
      )}
    </motion.div>
  );
}
