"use client";

import { motion } from "framer-motion";

export default function SmokeEffect() {
  // Use theme colors for the smoke: some white/pearl, some champagne
  const variants = {
    animate: (i: number) => ({
      x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
      y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
      scale: [1, 1.2, 0.8, 1],
      opacity: [0.3, 0.5, 0.3],
      transition: {
        duration: 10 + Math.random() * 10,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Blob 1: Champagne */}
      <motion.div
        custom={1}
        variants={variants}
        animate="animate"
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent/20 blur-[100px]"
      />
      {/* Blob 2: Soft White */}
      <motion.div
        custom={2}
        variants={variants}
        animate="animate"
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary-foreground/30 blur-[120px]"
      />
      {/* Blob 3: Center Accent */}
      <motion.div
        custom={3}
        variants={variants}
        animate="animate"
        className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-accent/10 blur-[80px]"
      />
    </div>
  );
}
