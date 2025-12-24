"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface GallerySectionProps {
  images: string[];
}

interface ImageState {
  url: string;
  index: number;
}

export default function GallerySection({ images }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<ImageState | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <section className="py-20 md:py-32 px-6 bg-background relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
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

        {/* Bento Grid */}
        <div className={cn(
             "grid gap-4 auto-rows-[250px]",
             // Dynamic columns based on count
             images.length === 4 || images.length === 5 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-4"
        )}>
          {images.map((url, index) => {
             // Layout Logic
             let patterns: string[] = [];
             const count = images.length;
             
             if (count === 4) {
                 // 4 Items: 3 Columns
                 // Ref: [Tall] [Small] [Tall]
                 //      [Tall] [Small] [Tall]
                 // DOM Order: 0(Tall), 1(Small), 2(Tall), 3(Small) -> fills center hole
                 // But standard grid auto-placement might vary if we don't specify order.
                 // We rely on standard Row-major filling.
                 // Slot 1: Item 0 (1x2)
                 // Slot 2: Item 1 (1x1)
                 // Slot 3: Item 2 (1x2)
                 // Slot 4: Item 3 (1x1) -> goes to (Row 2, Col 2) naturally because (2,1) and (2,3) are blocked.
                 patterns = [
                    "md:row-span-2", // 0
                    "md:col-span-1", // 1
                    "md:row-span-2", // 2
                    "md:col-span-1", // 3
                 ];
             } else if (count === 5) {
                // 5 Items: 3 Columns, 3 Rows - Symmetric "Seimbang"
                // Col 1: Medium (2r) + Kecil (1r)
                // Col 2: Panjang (3r)
                // Col 3: Medium (2r) + Kecil (1r)
                // Placing:
                // 0 (Med) -> (0,0)-(1,0)
                // 1 (Panjang) -> (0,1)-(2,1)
                // 2 (Med) -> (0,2)-(1,2)
                // 3 (Small) -> (2,0)
                // 4 (Small) -> (2,2)
                patterns = [
                    "md:row-span-2", // 0 (Left Top)
                    "md:row-span-3", // 1 (Center)
                    "md:col-span-1", // 4 (Right Bottom)
                    "md:row-span-2", // 2 (Right Top)
                    "md:col-span-1", // 3 (Left Bottom)
                ];
             } else if (count === 6) {
                // 6 Items
                patterns = [
                    "md:col-span-2 md:row-span-2", 
                    "md:col-span-2 md:row-span-1", 
                    "md:col-span-2 md:row-span-1", 
                    "md:col-span-1 md:row-span-1", 
                    "md:col-span-1 md:row-span-1", 
                    "md:col-span-2 md:row-span-1", 
                ];
             } else if (count === 7) {
                // 7 Items
                patterns = [
                    "md:col-span-2 md:row-span-2",
                    "md:col-span-1 md:row-span-1",
                    "md:col-span-1 md:row-span-1",
                    "md:col-span-1 md:row-span-1",
                    "md:col-span-1 md:row-span-1",
                    "md:col-span-2 md:row-span-1",
                    "md:col-span-2 md:row-span-1",
                ];
             } else {
                 // Default 8
                 patterns = [
                    "md:col-span-2 md:row-span-2", 
                    "md:col-span-1 md:row-span-1", 
                    "md:col-span-1 md:row-span-1", 
                    "md:col-span-1 md:row-span-1", 
                    "md:col-span-1 md:row-span-1", 
                    "md:col-span-2 md:row-span-1", 
                    "md:col-span-1 md:row-span-1", 
                    "md:col-span-1 md:row-span-1", 
                 ];
             }
             
             const spanClass = patterns[index % patterns.length];

             return (
                <motion.div
                  key={index}
                  layoutId={`gallery-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={cn(
                      "relative group cursor-pointer overflow-hidden rounded-xl bg-muted",
                      spanClass
                  )}
                  onClick={() => setSelectedImage({ url, index })}
                >
                  <motion.img
                    src={url}
                    alt={`Wedding Moment ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                     <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/40">
                        <Icon icon="ph:arrows-out-simple" className="w-6 h-6" />
                     </div>
                  </div>
                </motion.div>
             );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
          {selectedImage && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
                onClick={() => setSelectedImage(null)}
            >
                <button 
                    className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 z-50 bg-black/20 rounded-full"
                    onClick={() => setSelectedImage(null)}
                >
                    <Icon icon="ph:x" className="w-8 h-8" />
                </button>
                
                <div 
                    className="relative w-full h-full flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <motion.div 
                        layoutId={`gallery-${selectedImage.index}`} // Match the layoutId
                        className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-lg shadow-2xl"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <motion.img 
                            src={selectedImage.url} 
                            alt="Gallery Preview" 
                            className="w-full h-full object-contain max-h-[90vh]"
                        />
                    </motion.div>
                </div>
            </motion.div>
          )}
      </AnimatePresence>
    </section>
  );
}
