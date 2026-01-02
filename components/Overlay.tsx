"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

import FloralOrnament from "@/components/FloralOrnament";

interface OverlayProps {
  onOpen: () => void;
  data: {
    hero: {
      heading: string;
      names: string;
      date: string;
    };
    overlay?: {
      backgroundImage?: string;
      coupleImage?: string;
    };
    isLocked?: boolean;
  };
}

export default function Overlay({ onOpen, data }: OverlayProps) {
  const [isVisible, setIsVisible] = useState(true);
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Tamu Undangan";
  const isLocked = data.isLocked || false;

  const handleOpen = () => {
    if (isLocked) return;
    setIsVisible(false);
    // onOpen will be called after exit animation via AnimatePresence
  };

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  return (
    <AnimatePresence onExitComplete={onOpen}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-4 bg-cover bg-center"
          style={{
            backgroundImage: data.overlay?.backgroundImage 
              ? `url('${data.overlay.backgroundImage}')` 
              : "url('/patterns/paper.png')"
          }}
        >
            <div className={`absolute inset-0 ${data.overlay?.backgroundImage ? 'bg-black/40' : 'bg-background/90'}`} />
            
            <FloralOrnament 
                position="top-left" 
                className={data.overlay?.backgroundImage ? "text-white/40" : "text-foreground/20"} 
            />
            <FloralOrnament 
                position="bottom-right" 
                delay={1}
                className={data.overlay?.backgroundImage ? "text-white/40" : "text-foreground/20"} 
            />

            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative z-10 flex flex-col items-center gap-6 text-center"
            >
                {data.overlay?.coupleImage && (
                  <div className="w-48 h-64 md:w-60 md:h-80 mb-4 rounded-t-full border-4 border-white/20 overflow-hidden shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={data.overlay.coupleImage} 
                      alt="Couple" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <h3 className={`uppercase tracking-[0.2em] text-sm ${data.overlay?.backgroundImage ? 'text-white/80' : 'text-chart-3'}`}>
                    {data.hero.heading}
                </h3>
                
                <h1 className={`font-heading text-5xl md:text-7xl ${data.overlay?.backgroundImage ? 'text-white' : 'text-foreground'}`}>
                    {data.hero.names}
                </h1>

                {/* Date Display (Blurred if Locked) */}
                {isLocked && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-lg md:text-xl font-light tracking-widest my-2 blur-sm select-none ${data.overlay?.backgroundImage ? 'text-white/80' : 'text-muted-foreground'}`}
                    >
                        {data.hero.date}
                    </motion.div>
                )}

                <div className={`my-8 h-px w-24 ${data.overlay?.backgroundImage ? 'bg-white/30' : 'bg-border'}`} />

                <div className="space-y-2">
                    <p className={`font-serif italic ${data.overlay?.backgroundImage ? 'text-white/80' : 'text-muted-foreground'}`}>Kepada Yth. Bapak/Ibu/Saudara/i</p>
                    <h2 className={`text-xl font-medium ${data.overlay?.backgroundImage ? 'text-white' : 'text-foreground'}`}>{guestName}</h2>
                </div>

                <div className="mt-12">
                    <motion.button
                        onClick={handleOpen}
                        disabled={isLocked}
                        whileHover={!isLocked ? { scale: 1.05 } : {}}
                        whileTap={!isLocked ? { scale: 0.95 } : {}}
                        className={`group relative px-8 py-4 bg-white text-black rounded-full shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] transition-all ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {!isLocked && (
                            <>
                                {/* Ripple/Pulse Ring behind */}
                                <span className="absolute -inset-1 rounded-full border border-white/30 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                                <span className="absolute -inset-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700 delay-75" />
                            </>
                        )}
                        
                        <div className="relative flex items-center gap-3">
                            <motion.div
                                animate={!isLocked ? { 
                                    y: [0, -4, 0],
                                } : {}}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                {isLocked ? (
                                    <Icon icon="ph:lock-duotone" className="text-2xl text-muted-foreground" />
                                ) : (
                                    <Icon icon="ph:envelope-open-duotone" className="text-2xl text-chart-3" />
                                )}
                            </motion.div>
                            <span className="font-heading tracking-widest uppercase text-sm font-semibold">
                                {isLocked ? "Coming Soon" : "Buka Undangan"}
                            </span>
                        </div>
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
