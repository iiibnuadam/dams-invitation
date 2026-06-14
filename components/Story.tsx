"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { Icon } from "@iconify/react";

interface StoryProps {
  data: {
    weddingStory: {
      year: string;
      title: string;
      content: string;
      enabled?: boolean;
    }[];
  };
}

// Framer Motion Animation Variants for scroll-highlight effect
const dotVariants = {
  inactive: {
    scale: 0.85,
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(197, 160, 89, 0.3)",
    boxShadow: "0 0px 0px rgba(0,0,0,0)",
    transition: { duration: 0.4, ease: "easeInOut" }
  },
  active: {
    scale: 1.3,
    backgroundColor: "#C5A059",
    borderColor: "#C5A059",
    boxShadow: "0 0px 10px rgba(197, 160, 89, 0.4)",
    transition: { duration: 0.4, ease: "easeInOut" }
  }
} as const;

const cardVariants = {
  inactive: {
    opacity: 0.45,
    scale: 0.97,
    borderColor: "rgba(226, 232, 240, 0.5)",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.01)",
    transition: { duration: 0.5, ease: "easeOut" }
  },
  active: {
    opacity: 1,
    scale: 1.03,
    borderColor: "rgba(197, 160, 89, 0.5)",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    boxShadow: "0 12px 30px -8px rgba(197, 160, 89, 0.15), 0 4px 12px -4px rgba(197, 160, 89, 0.08)",
    transition: { duration: 0.5, ease: "easeOut" }
  }
} as const;

const titleVariants = {
  inactive: {
    color: "#1A1A1A",
    transition: { duration: 0.4 }
  },
  active: {
    color: "#C5A059",
    transition: { duration: 0.4 }
  }
} as const;

const textVariants = {
  inactive: {
    color: "rgba(113, 113, 122, 0.6)",
    transition: { duration: 0.4 }
  },
  active: {
    color: "#27272A",
    transition: { duration: 0.4 }
  }
} as const;

const yearVariants = {
  inactive: {
    opacity: 0.1,
    scale: 0.95,
    color: "rgba(197, 160, 89, 0.06)",
    transition: { duration: 0.5 }
  },
  active: {
    opacity: 1,
    scale: 1.05,
    color: "rgba(197, 160, 89, 0.16)",
    transition: { duration: 0.5 }
  }
} as const;

export default function Story({ data }: StoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of the container to animate the central vertical line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 80%"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  const activeStories = data.weddingStory?.filter((item) => item.enabled !== false) || [];

  return (
    <section className="py-24 px-6 bg-transparent relative overflow-hidden">
      {/* Decorative background flowers */}
      <div className="absolute top-10 left-10 w-48 h-48 opacity-[0.03] pointer-events-none select-none">
        <img src="/assets/floral-corner.png" alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute bottom-10 right-10 w-48 h-48 opacity-[0.03] pointer-events-none select-none scale-[-1]">
        <img src="/assets/floral-corner.png" alt="" className="w-full h-full object-contain" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-px bg-accent/40" />
            <Icon icon="ph:heart-thin" className="text-xl text-accent" />
            <div className="w-8 h-px bg-accent/40" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl text-primary">Our Love Story</h2>
          <p className="font-serif italic text-muted-foreground/80 mt-2 text-sm">"Sebuah kisah cinta yang dimulai dari pertemuan tak sengaja"</p>
        </motion.div>

        {activeStories.length > 0 && (
          <div ref={containerRef} className="relative ml-4 md:ml-0 space-y-16 py-8">
            {/* Background Line (Gray/Light Gold) */}
            <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-accent/15" />

            {/* Active Line (Gold, filled on scroll) */}
            <motion.div
              style={{ scaleY, originY: 0 }}
              className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-accent"
            />

            {activeStories.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  initial="inactive"
                  whileInView="active"
                  viewport={{ once: false, margin: "-30% 0px -30% 0px" }}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Dot on the Timeline Line */}
                  <motion.div
                    variants={dotVariants}
                    className="absolute left-[-7px] md:left-1/2 md:-translate-x-1/2 top-2 md:top-1/2 md:-translate-y-1/2 w-4.5 h-4.5 rounded-full border z-30 flex items-center justify-center shadow-sm cursor-default"
                  >
                    <div className="w-1.5 h-1.5 bg-background rounded-full" />
                  </motion.div>

                  {/* Spacer or empty side on Desktop */}
                  <div className="hidden md:block w-1/2" />

                  {/* Card Content Side */}
                  <div
                    className={`w-full md:w-1/2 pl-8 md:pl-0 ${
                      isEven ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"
                    }`}
                  >
                    {/* Container with relative position for the year overlay */}
                    <div className="relative group">
                      {/* Year Indicator (Big faint background font) */}
                      <motion.span
                        variants={yearVariants}
                        className={`font-heading text-7xl md:text-8xl absolute -top-8 select-none pointer-events-none ${
                          isEven ? "left-0 md:left-auto md:right-0" : "left-0"
                        }`}
                      >
                        {item.year}
                      </motion.span>

                      {/* Card Box */}
                      <motion.div 
                        variants={cardVariants}
                        className="p-6 md:p-8 rounded-2xl border transition-all duration-300 relative z-10"
                      >
                        {/* Little top gold highlight */}
                        <div className={`absolute top-0 w-12 h-0.5 bg-accent/40 rounded-full ${
                          isEven ? "left-6 md:left-auto md:right-6" : "left-6"
                        }`} />
                        
                        <motion.h3 
                          variants={titleVariants}
                          className="font-heading text-2xl mb-3 text-primary transition-colors duration-300"
                        >
                          {item.title}
                        </motion.h3>
                        <motion.p 
                          variants={textVariants}
                          className="font-serif italic text-[15px] leading-relaxed transition-colors duration-300"
                        >
                          {item.content}
                        </motion.p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
