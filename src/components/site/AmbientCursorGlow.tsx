import { useEffect, useRef, useState } from "react";

export default function AmbientCursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
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
    let isMoving = false;
    let animId: number | null = null;
    let stopTimeout: NodeJS.Timeout | null = null;

    const render = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      // Smooth lerp
      currentX += dx * 0.15;
      currentY += dy * 0.15;

      const el = glowRef.current;
      if (el) {
        const scale = isHovered ? 1.25 : 1;
        const opacity = isHovered ? 0.35 : 0.22;
        el.style.transform = `translate3d(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = String(opacity);
      }

      // If nearly arrived and mouse stopped, sleep the loop to save 100% CPU/GPU
      if (Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3 && !isMoving) {
        animId = null;
        return;
      }

      animId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      isMoving = true;

      if (stopTimeout) clearTimeout(stopTimeout);
      stopTimeout = setTimeout(() => {
        isMoving = false;
      }, 80);

      const target = e.target as HTMLElement | null;
      if (target) {
        isHovered = Boolean(
          target.closest("button, a, input, select, textarea, [role='button'], .cursor-pointer")
        );
      }

      if (animId === null) {
        animId = requestAnimationFrame(render);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animId !== null) cancelAnimationFrame(animId);
      if (stopTimeout) clearTimeout(stopTimeout);
    };
  }, []);

  // On Mobile: No background cursor orb (eliminates scroll lag)
  if (!isDesktop) return null;

  // On Desktop: Ultra-light, GPU-accelerated cursor halo
  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 w-[300px] h-[300px] rounded-full blur-[65px] z-0 will-change-transform"
      style={{
        background:
          "radial-gradient(circle, rgba(168, 85, 247, 0.28) 0%, rgba(56, 189, 248, 0.15) 45%, transparent 70%)",
        opacity: 0.25,
      }}
    />
  );
}
