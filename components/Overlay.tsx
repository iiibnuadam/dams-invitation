"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

interface OverlayProps {
  onOpen: () => void;
  data: {
    hero: {
      heading: string;
      names: string;
    };
    overlay?: {
      backgroundImage?: string;
      coupleImage?: string;
    };
  };
}

export default function Overlay({ onOpen, data }: OverlayProps) {
  const [isVisible, setIsVisible] = useState(true);
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Tamu Undangan";

  const handleOpen = () => {
    setIsVisible(false);
    // Trigger parent callback after animation starts or finishes?
    // Let's call it immediately so parent can start mounting/animating other things underneath if needed,
    // or wait for exit. Better to wait for exit completes?
    // AnimatePresence handles the remove from DOM.
    // We can call onOpen immediately if we want Hero to animate IN while this animates OUT (parallax).
    onOpen(); 
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
    <AnimatePresence>
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

                <div className={`my-8 h-px w-24 ${data.overlay?.backgroundImage ? 'bg-white/30' : 'bg-border'}`} />

                <div className="space-y-2">
                    <p className={`font-serif italic ${data.overlay?.backgroundImage ? 'text-white/80' : 'text-muted-foreground'}`}>Kepada Yth. Bapak/Ibu/Saudara/i</p>
                    <h2 className={`text-xl font-medium ${data.overlay?.backgroundImage ? 'text-white' : 'text-foreground'}`}>{guestName}</h2>
                </div>

                <div className="mt-8">
                    <Button 
                        onClick={handleOpen}
                        className="rounded-full px-8 py-6 text-base font-light transition-all hover:scale-105 bg-white text-black hover:bg-white/90"
                    >
                        <Icon icon="ph:envelope-open-light" className="mr-2 text-xl" />
                        Buka Undangan
                    </Button>
                </div>
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
