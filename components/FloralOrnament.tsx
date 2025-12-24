"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloralOrnamentProps {
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  variant?: "corner" | "branch";
  delay?: number;
}

export default function FloralOrnament({
  className,
  position,
  variant = "corner",
  delay = 0,
}: FloralOrnamentProps) {
  // Default positioning styles based on position prop
  const positionStyles = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 scale-x-[-1]", // Mirror for right side
    "bottom-left": "bottom-0 left-0 scale-y-[-1]",
    "bottom-right": "bottom-0 right-0 scale-[-1]",
    "center": "",
  };

  const selectedPositionClass = position ? positionStyles[position] : "";

  // Sway animation
  const swayAnimation = {
    rotate: [0, 2, 0, -1, 0],
    x: [0, 2, 0, -1, 0],
    y: [0, -2, 0, 1, 0],
  };

  return (
    <motion.div
      className={cn("absolute pointer-events-none z-0", selectedPositionClass, className)}
      initial={{ opacity: 0.8 }}
      animate={{ 
        opacity: 0.8,
        ...swayAnimation
      }}
      transition={{
        duration: 8,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
        delay: delay,
      }}
    >
      <div className="w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] relative">
         <img 
            src="/assets/floral-corner.png" 
            alt="Floral Ornament" 
            className="w-full h-full object-contain mix-blend-multiply dark:invert dark:mix-blend-screen" 
            style={{
                // If the parent wants dark mode (white flowers), they should apply a class or we can assume based on props.
                // Since Tailwind 'dark' mode is global, we might need manual override.
                // For now, let's rely on mix-blend-multiply for light backgrounds.
                // If the user uses this on a dark background, they likely need to pass "filter: invert(1) mix-blend-screen" via className.
            }}
         />
      </div>
    </motion.div>
  );
}
