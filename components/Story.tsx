"use client";

import { motion } from "framer-motion";

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

export default function Story({ data }: StoryProps) {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="container mx-auto max-w-4xl">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
        >
            <h2 className="font-heading text-4xl md:text-5xl text-primary">Our Journey</h2>
            <div className="h-px w-16 bg-accent mx-auto mt-4" />
        </motion.div>

        <div className="relative border-l border-accent/30 ml-4 md:ml-1/2 md:-translate-x-px space-y-12 pl-8 md:pl-0">
            {data.weddingStory?.filter(item => item.enabled !== false).map((item, index) => (
                <div key={index} className={`relative flex flex-col md:flex-row items-start md:items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    {/* Dot */}
                    <div className="absolute left-[-37px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-accent rounded-full border-4 border-background" />

                    {/* Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className={`w-full md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}
                    >
                        <span className="font-heading text-6xl text-muted-foreground/20 absolute -z-10 -mt-8 select-none">
                            {item.year}
                        </span>
                        <div className="bg-white/50 backdrop-blur p-6 rounded-lg border border-border/50 shadow-sm relative overflow-hidden">
                            <h3 className="font-heading text-2xl mb-2 text-primary">{item.title}</h3>
                            <p className="font-serif italic text-muted-foreground text-sm leading-relaxed">
                                {item.content}
                            </p>
                        </div>
                    </motion.div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
