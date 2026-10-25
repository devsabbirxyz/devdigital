import { useEffect, useRef, useState } from "react";

export default function AmbientCursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Detect desktop fine pointer vs mobile coarse pointer
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) {
      setIsDesktop(false);
      return;
    }

    setIsDesktop(true);

    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;
    let isHovered = false;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        isHovered = Boolean(
          target.closest("button, a, input, select, textarea, [role='button'], .cursor-pointer")
        );
      }
    };

    const render = () => {
      // Smooth liquid spring lerp
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      const el = glowRef.current;
      if (el) {
        const scale = isHovered ? 1.35 : 1;
        const opacity = isHovered ? 0.45 : 0.3;
        el.style.transform = `translate3d(calc(-50% + ${currentX.toFixed(1)}px), calc(-50% + ${currentY.toFixed(1)}px), 0) scale(${scale})`;
        el.style.opacity = String(opacity);
      }

      animId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // On Mobile: Gentle GPU-accelerated ambient glowing nebula orb
  if (!isDesktop) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-1/4 left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full blur-[100px] z-0 animate-mobile-glow opacity-30 will-change-transform"
        style={{
          background:
            "radial-gradient(circle, hsl(205 100% 55% / 0.4) 0%, hsl(271 91% 65% / 0.25) 45%, transparent 70%)",
        }}
      />
    );
  }

  // On Desktop: Interactive liquid cursor spotlight
  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 w-[420px] h-[420px] rounded-full blur-[90px] z-0 transition-[opacity] duration-300 will-change-transform"
      style={{
        background:
          "radial-gradient(circle, hsl(271 91% 65% / 0.32) 0%, hsl(328 86% 60% / 0.20) 45%, transparent 70%)",
        opacity: 0.3,
      }}
    />
  );
}
