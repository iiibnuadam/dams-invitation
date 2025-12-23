"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface GallerySectionProps {
  images: string[];
}

export default function GallerySection({ images }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

        {/* Masonry-style Grid */}
        <div className="columns-1 md:columns-3 gap-4 space-y-4">
          {images.map((url, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl bg-muted"
              onClick={() => setSelectedImage(url)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Wedding Moment ${index + 1}`}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                 <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <Icon icon="ph:magnifying-glass-plus" className="w-5 h-5" />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
        >
            <button 
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-2"
                onClick={() => setSelectedImage(null)}
            >
                <Icon icon="ph:x" className="w-8 h-8" />
            </button>
            <div 
                className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src={selectedImage} 
                    alt="Gallery Preview" 
                    className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl"
                />
            </div>
        </div>
      )}
    </section>
  );
}
