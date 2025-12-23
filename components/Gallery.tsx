"use client";

import { motion } from "framer-motion";

export default function Gallery() {
  // Placeholder images
  const images = [
    "/gallery/1.jpg",
    "/gallery/2.jpg",
    "/gallery/3.jpg",
    "/gallery/4.jpg",
    "/gallery/5.jpg",
    "/gallery/6.jpg",
  ];

  return (
    <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl text-primary mb-4">Timeless Moments</h2>
            <p className="text-muted-foreground font-serif italic">Capturing our love story</p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4 px-2">
            {images.map((src, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="relative break-inside-avoid rounded-lg overflow-hidden group cursor-pointer"
                >
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-500" />
                    {/* Placeholder div if image fails */}
                    <div className="w-full bg-gray-200 min-h-[300px] flex items-center justify-center text-muted-foreground">
                        Photo {i + 1}
                    </div>
                </motion.div>
            ))}
        </div>
    </section>
  );
}
