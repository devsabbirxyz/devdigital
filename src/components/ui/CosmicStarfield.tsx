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

export function CosmicStarfield({ count = 28 }: { count?: number }) {
  const stars = useMemo<Star[]>(() => {
    const starColors = ["#FFFFFF", "#E0C3FC", "#C8A2FF", "#9D6BFF", "#D8B4FE"];
    return Array.from({ length: count }, (_, i) => {
      const rand1 = ((i * 37 + 19) % 100) / 100;
      const rand2 = ((i * 73 + 43) % 100) / 100;
      const rand3 = ((i * 29 + 11) % 100) / 100;

      return {
        id: i,
        top: `${rand1 * 100}%`,
        left: `${rand2 * 100}%`,
        size: rand3 > 0.8 ? 2 : rand3 > 0.4 ? 1.5 : 1,
        opacity: 0.2 + rand3 * 0.5,
        duration: 3 + rand1 * 3,
        delay: rand2 * 3,
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
      {/* Subtle deep-space ambient nebulae — static, hardware-accelerated */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, #9B5DE5 0%, #3C1E70 50%, transparent 75%)",
        }}
      />

      {/* Lightweight starlight particles */}
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
