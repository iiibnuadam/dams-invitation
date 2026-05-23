"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

interface FooterProps {
  data: {
    hero: {
      names: string;
      date: string;
    };
  };
}

export default function Footer({ data }: FooterProps) {
  const weddingYear = data.hero.date.split(".").pop();
  const yearSuffix = weddingYear ? `20${weddingYear}` : "2026";

  return (
    <footer className="py-24 bg-[#1A1A1A] text-white relative overflow-hidden select-none border-t border-accent/10">
      {/* Background radial gradient to add depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(197,160,89,0.08),transparent_70%)] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center flex flex-col items-center">
        
        {/* Monogram emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-16 h-16 rounded-full border border-accent/20 flex items-center justify-center mb-8 relative bg-white/5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/assets/logo-light.png" 
            alt="Sasti & Adam Logo" 
            className="w-10 h-10 object-contain" 
          />
          {/* Subtle rotating ornament */}
          <div className="absolute inset-[-4px] border border-dashed border-accent/20 rounded-full animate-[spin_60s_linear_infinite]" />
        </motion.div>

        {/* Thank You Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-4 max-w-lg mx-auto"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">Sampai Jumpa di Hari Bahagia Kami</p>
          <p className="text-muted-foreground font-serif italic text-sm md:text-base leading-relaxed">
             "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai."
          </p>
        </motion.div>

        {/* Dynamic Names */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 mb-6"
        >
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-accent font-light tracking-wide">
            {data.hero.names}
          </h2>
        </motion.div>

        {/* Dynamic Date */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center gap-4 text-white/50 text-xs font-sans uppercase tracking-[0.35em] mb-12"
        >
          <div className="h-[1px] w-6 bg-white/20" />
          <span>{data.hero.date.split(".").join(" . ")}</span>
          <div className="h-[1px] w-6 bg-white/20" />
        </motion.div>

        {/* Separator Line */}
        <div className="w-full max-w-xs h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Copyright info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-2"
        >
          <p className="text-sm text-white/20 tracking-wider font-sans flex items-center justify-center gap-1">
             Made with <Icon icon="ph:heart-fill" className="text-red-500/60 inline" />
          </p>
        </motion.div>

      </div>
    </footer>
  );
}
