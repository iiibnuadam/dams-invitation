"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface GallerySectionProps {
  images: { url: string; focusY?: number; cols?: number; rows?: number }[];
  showPopup?: boolean;
}

interface ImageState {
  url: string;
  id: string;
}

export default function GallerySection({ images, showPopup = true }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<ImageState | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <section className="py-20 md:py-32 px-6 bg-transparent relative overflow-hidden">
      {/* Decorative radial gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="flex items-center justify-center gap-3 text-accent/80 mb-2">
            <div className="h-[1px] w-8 bg-accent/50" />
            <span className="font-heading text-lg tracking-widest uppercase">Our Moments</span>
            <div className="h-[1px] w-8 bg-accent/50" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground">
            Gallery Foto
          </h2>
          <p className="max-w-lg mx-auto text-muted-foreground font-light italic">
            "Mencintai bukan berarti saling memandang, tetapi memandang ke arah yang sama."
          </p>
        </motion.div>

        {/* Bento Grid: 2 columns on mobile, 3 columns on desktop */}
        <div className="grid gap-4 auto-rows-[160px] md:auto-rows-[250px] grid-flow-dense grid-cols-2 md:grid-cols-3">
          {images.map((item, idx) => {
             // Retrieve customized sizes (default to 1x1 if not set)
             const c = item.cols || 1;
             const r = item.rows || 1;
             const focusY = typeof item.focusY === "number" ? item.focusY : 50;

             // Map focusY to CSS objectPosition style
             const objectPositionStyle = { objectPosition: `center ${focusY}%` };
             
             // Dynamic spans for both mobile (2 cols) and desktop (3 cols)
             const colClass = c === 2 ? "col-span-2" : c === 3 ? "col-span-2 md:col-span-3" : "col-span-1";
             const rowClass = r === 2 ? "row-span-2" : "row-span-1";
             const spanClass = `${colClass} ${rowClass}`;
             const cardId = `gallery-card-${idx}-${item.url}`;

             return (
                <motion.div
                  key={cardId}
                  layout={true}
                  layoutId={showPopup ? cardId : undefined}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 150, 
                    damping: 25,
                    mass: 0.8
                  }}
                  className={cn(
                      "relative group overflow-hidden rounded-xl bg-muted border border-border/40",
                      showPopup ? "cursor-pointer" : "cursor-default",
                      spanClass
                  )}
                  onClick={() => showPopup && setSelectedImage({ url: item.url, id: cardId })}
                >
                  <motion.img
                    src={item.url}
                    alt="Wedding Moment"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={objectPositionStyle}
                    loading="lazy"
                  />
                  {showPopup && (
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                       <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-lg">
                          <Icon icon="ph:arrows-out-simple" className="w-6 h-6" />
                       </div>
                    </div>
                  )}
                </motion.div>
             );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
          {showPopup && selectedImage && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                onClick={() => setSelectedImage(null)}
            >
                <button 
                    className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2.5 z-[110] bg-white/10 hover:bg-white/20 rounded-full border border-white/10"
                    onClick={() => setSelectedImage(null)}
                >
                    <Icon icon="ph:x" className="w-6 h-6" />
                </button>
                
                <div 
                    className="relative w-full h-full flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <motion.div 
                        layoutId={selectedImage.id} // Match the layoutId
                        className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-lg shadow-2xl"
                        transition={{ type: "spring", stiffness: 220, damping: 26 }}
                    >
                        <motion.img 
                            src={selectedImage.url} 
                            alt="Gallery Preview" 
                            className="w-full h-full object-contain max-h-[85vh] select-none"
                        />
                    </motion.div>
                </div>
            </motion.div>
          )}
      </AnimatePresence>
    </section>
  );
}
