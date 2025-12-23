"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface StickyHeaderProps {
  data: any;
  isOpened: boolean;
}

export default function StickyHeader({ data, isOpened }: StickyHeaderProps) {
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    // Show after scrolling down 600px (past hero)
    const unsubscribe = scrollY.on("change", (latest) => {
      if (latest > 600 && isOpened) {
        setShow(true);
      } else {
        setShow(false);
      }
    });
    return () => unsubscribe();
  }, [scrollY, isOpened]);

  if (!isOpened) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center"
        >
            {/* Animated Glow Background */}
            <div className="absolute -inset-8 bg-gradient-to-r from-[#C5A059]/30 to-[#F9F9F9]/30 rounded-full blur-2xl animate-pulse" />

            {/* Simulated Rings (Pulsing instead of rotating for Pill Shape) */}
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-1 rounded-full border border-[#C5A059]/30 border-dashed z-0"
            />
            <motion.div
              animate={{ scale: [1.05, 1, 1.05], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -inset-2 rounded-full border border-[#F9F9F9]/40 border-dotted z-0"
            />

            {/* Main Glass Pill */}
            <div className="w-[90vw] md:w-auto md:min-w-[400px] flex items-center justify-between px-6 py-3 bg-white/70 backdrop-blur-lg border border-white/20 shadow-xl rounded-full relative overflow-hidden group">
                {/* Overlay Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#C5A059]/10 via-transparent to-[#C5A059]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex flex-col relative z-20">
                    <span className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground font-medium">The Wedding of</span>
                    <span className="font-heading text-lg leading-none text-primary mt-0.5">{data.hero.names}</span>
                </div>
                
                <div className="flex items-center gap-3 relative z-20">
                    <div className="hidden md:block h-8 w-px bg-black/10"></div>
                    <span className="font-mono text-xs tracking-widest text-foreground font-medium">{data.hero.date}</span>
                </div>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
