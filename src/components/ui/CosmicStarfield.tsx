import { useMemo } from "react";

interface Star {
  id: number;
  top: string;
  left: string;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
}

export function CosmicStarfield({ count = 65 }: { count?: number }) {
  // Deterministic star placement so hydration is stable
  const stars = useMemo<Star[]>(() => {
    const starColors = ["#FFFFFF", "#E0C3FC", "#C8A2FF", "#9D6BFF", "#D8B4FE"];
    return Array.from({ length: count }, (_, i) => {
      // Seeded-like random
      const rand1 = ((i * 37 + 19) % 100) / 100;
      const rand2 = ((i * 73 + 43) % 100) / 100;
      const rand3 = ((i * 29 + 11) % 100) / 100;

      return {
        id: i,
        top: `${rand1 * 100}%`,
        left: `${rand2 * 100}%`,
        size: rand3 > 0.8 ? 2.5 : rand3 > 0.4 ? 1.5 : 1,
        opacity: 0.25 + rand3 * 0.65,
        duration: 2.5 + rand1 * 3.5,
        delay: rand2 * 4,
        color: starColors[i % starColors.length],
      };
    });
  }, [count]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 20%, #15102A 0%, #0D0A1C 45%, #08070C 100%)",
      }}
    >
      {/* Subtle deep-space ambient nebulae */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] sm:w-[900px] h-[450px] rounded-full blur-[160px] opacity-25"
        style={{
          background:
            "radial-gradient(circle, #9B5DE5 0%, #3C1E70 50%, transparent 75%)",
        }}
      />
      <div
        className="absolute bottom-10 right-10 w-[450px] h-[350px] rounded-full blur-[140px] opacity-20"
        style={{
          background:
            "radial-gradient(circle, #7000FF 0%, #1B0F33 60%, transparent 80%)",
        }}
      />

      {/* Tiny glowing starlight particles */}
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full animate-cosmic-twinkle"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow:
              star.size > 1.5
                ? `0 0 6px ${star.color}, 0 0 12px rgba(224, 195, 252, 0.4)`
                : undefined,
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default CosmicStarfield;
