"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Highlighter } from "@/components/ui/highlighter";
import FloralOrnament from "@/components/FloralOrnament";

interface HeroProps {
  isOpened?: boolean;
  data: {
    hero: {
      heading: string;
      names: string;
      date: string;
      image?: string;
      quote: {
        arabic: string;
        translation: string;
        source: string;
      };
    };
  };
}

export default function Hero({ data, isOpened = false }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-12 overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-white to-transparent opacity-50 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-6 w-full max-w-4xl"
      >
        <span className="uppercase tracking-[0.3em] text-xs md:text-sm text-muted-foreground mb-4">
           <Highlighter action="underline" play={isOpened}>
              {data.hero.heading}
           </Highlighter>
        </span>

        <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl text-foreground leading-none">
           <Highlighter action="highlight" play={isOpened}>
              {data.hero.names}
           </Highlighter>
        </h1>

        <div className="flex items-center gap-6 text-lg md:text-xl font-light text-muted-foreground my-2">
          <span className="w-12 h-[1px] bg-border" />
          <span className="tracking-widest">{data.hero.date}</span>
          <span className="w-12 h-[1px] bg-border" />
        </div>

        {/* Photo Frame with Arch Shape */}
        <div className="relative mt-8 mb-12 w-64 h-80 md:w-80 md:h-[30rem] border border-border/60 p-3 rounded-t-full shadow-lg bg-white/50 backdrop-blur-sm">
            <FloralOrnament 
                position="bottom-left" 
                className="-bottom-10 -left-10 w-40 h-40 opacity-50 z-20" 
                delay={0}
            />
             <FloralOrnament 
                position="top-right" 
                className="-top-10 -right-10 w-40 h-40 opacity-50 z-20" 
                delay={1}
            />
            
            <div className="w-full h-full rounded-t-full bg-muted overflow-hidden relative  transition-all duration-700">
                {data.hero.image ? (
                  <img 
                    src={data.hero.image} 
                    alt="Couple Photo" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-serif italic">
                      Couple Photo
                  </div>
                )}
            </div>
        </div>

        {/* Quote */}
        <div className="max-w-2xl space-y-4 px-4">
          <p className="font-serif text-2xl md:text-4xl text-foreground/80 leading-relaxed" dir="rtl">
            {data.hero.quote.arabic}
          </p>
          <div className="h-px w-12 bg-accent/50 mx-auto my-4" />
          <p className="text-sm md:text-base italic text-muted-foreground font-light">
            "{data.hero.quote.translation}"
          </p>
          <p className="text-xs font-bold tracking-widest uppercase text-accent">
            {data.hero.quote.source}
          </p>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <Icon icon="ph:mouse-simple-thin" className="text-3xl text-muted-foreground/50" />
      </motion.div>
    </section>
  );
}
