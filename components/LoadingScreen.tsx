"use client";
import React from "react";
import { motion } from "framer-motion";
import FloralOrnament from "./FloralOrnament";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F9F9F9] text-[#1A1A1A] overflow-hidden p-4">
      {/* Background vignette & radial light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.05),transparent_70%)] pointer-events-none" />
      
      {/* Responsive editorial borders */}
      <div className="absolute inset-3 sm:inset-6 border border-accent/20 pointer-events-none rounded-sm" />
      <div className="absolute inset-4 sm:inset-8 border border-dashed border-accent/10 pointer-events-none rounded-sm" />

      {/* Responsive corner floral decorations */}
      <FloralOrnament position="top-left" className="text-accent/30 z-10" />
      <FloralOrnament position="bottom-right" className="text-accent/30 z-10 scale-[-1]" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center gap-4 sm:gap-5 text-center px-4 max-w-sm w-full"
      >
        {/* Floating Pulsing Logo */}
        <motion.div
          animate={{ 
            opacity: [0.6, 1, 0.6],
            y: [0, -3, 0]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="mb-1"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/assets/logo-light.png" 
            alt="Wedding Logo" 
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain opacity-90 drop-shadow-md brightness-50" 
          />
        </motion.div>

        {/* Elegant typography */}
        <div className="space-y-1">
          <span className="uppercase tracking-[0.3em] text-[9px] sm:text-[10px] text-accent font-semibold font-sans">
              The Wedding of
          </span>
          <h2 className="font-heading text-xl sm:text-2xl md:text-3xl text-[#1A1A1A] tracking-wide font-light">
            Sasti <span className="font-serif italic text-accent font-light text-lg sm:text-xl md:text-2xl mx-1">&amp;</span> Adam
          </h2>
        </div>

        {/* Premium loading spinner */}
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 mt-3 flex items-center justify-center">
          <div className="absolute inset-0 border border-accent/20 rounded-full" />
          <motion.div 
            className="absolute inset-0 border-t border-accent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1 font-sans">
          Menyiapkan Undangan
        </p>
      </motion.div>
    </div>
  );
}
