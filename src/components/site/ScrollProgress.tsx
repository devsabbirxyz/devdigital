import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#9B5DE5] via-[#B57BFF] to-[#E0C3FC] z-[9999] origin-left shadow-[0_0_14px_rgba(157,107,255,0.85)] pointer-events-none"
    />
  );
}
