"use client";
import React from "react";
import { motion } from "framer-motion";
import FloralOrnament from "./FloralOrnament";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground">
      {/* Background Ornaments */}
      <FloralOrnament position="top-left" className="opacity-50" />
      <FloralOrnament position="bottom-right" className="opacity-50" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="relative z-10 flex flex-col items-center gap-4 text-center"
      >
        <span className="uppercase tracking-[0.2em] text-xs text-muted-foreground animate-pulse">
            The Wedding of
        </span>
        <h1 className="font-heading text-4xl md:text-5xl">
          Sasti & Adam
        </h1>
        
        {/* Loading Spinner */}
        <div className="mt-6 flex gap-2">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-accent"
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
      </motion.div>
    </div>
  );
}
