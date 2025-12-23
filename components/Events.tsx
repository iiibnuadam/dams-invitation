"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

interface EventsProps {
  data: {
    acara: {
      title: string;
      tanggal: Date | string;
      jam: string;
      tempat: string;
      maps: string;
    }[];
  };
}

export default function Events({ data }: EventsProps) {
  return (
    <section className="py-24 px-6 bg-[url('/patterns/arch.png')] bg-cover bg-fixed relative">
        <div className="absolute inset-0 bg-background/90" />
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
        >
            <h2 className="font-heading text-4xl md:text-5xl text-primary">Wedding Events</h2>
        </motion.div>

        <div className="flex flex-col gap-8 items-center w-full max-w-4xl mx-auto">
            {data.acara.filter((e: any) => e.enabled !== false).map((event, index) => (
                <EventCard 
                    key={index}
                    event={event}
                    index={index}
                />
            ))}
        </div>
      </div>
    </section>
  );
}

function EventCard({ event, index }: { event: any, index: number }) {
    const { title, date, time, location, mapsLink } = {
        title: event.title,
        date: new Date(event.tanggal),
        time: event.jam,
        location: event.tempat,
        mapsLink: event.maps
    };
    const delay = index * 0.2;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/50 backdrop-blur border border-border p-8 md:p-12 rounded-t-full rounded-b-lg text-center shadow-lg hover:shadow-xl transition-all"
        >
            <div className="mb-6">
                <Icon icon="ph:heart-straight-light" className="text-4xl text-accent mx-auto mb-4" />
                <h3 className="font-heading text-3xl mb-2">{title}</h3>
                <div className="w-12 h-px bg-accent mx-auto" />
            </div>

            <div className="space-y-4 mb-8">
                <div>
                    <p className="font-serif text-lg font-medium">
                        {date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="text-muted-foreground">
                    <p>{time}</p>
                </div>
                <div className="pt-4 px-4 overflow-hidden text-clip">
                    <p className="font-serif italic text-lg">{location}</p>
                </div>
            </div>

            <Button 
                variant="outline" 
                className="rounded-full gap-2 hover:bg-primary hover:text-white transition-colors"
                onClick={() => window.open(mapsLink, '_blank')}
            >
                <Icon icon="ph:map-pin-light" className="text-lg" />
                View Location
            </Button>
        </motion.div>
    )
}
