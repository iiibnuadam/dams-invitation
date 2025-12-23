"use client";

import { motion } from "framer-motion";

export default function WaveEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Wave using shifting gradients */}
      <motion.div
        animate={{
          x: [-10, 10, -10],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        // Stronger Gold/Champagne
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#C5A059]/40 to-transparent blur-[15px] rounded-full"
      />
      
      <motion.div
        animate={{
          x: [5, -5, 5],
          y: [0, 5, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
         // Stronger Soft Pink/Pearl
        className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-l from-[#F9F9F9]/60 to-transparent blur-[15px] rounded-full"
      />
    </div>
  );
}
