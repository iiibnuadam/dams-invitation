"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

interface EventsProps {
  data: {
    acara: {
      title: string;
      tanggal: Date | string;
      tanggalEnd?: Date | string;
      jam?: string;
      showJam?: boolean;
      sampaiSelesai?: boolean;
      tempat: string;
      alamat?: string;
      maps: string;
      schedules?: {
        name: string;
        jam: string;
      }[];
    }[];
  };
}

export default function Events({ data }: EventsProps) {
  return (
    <section className="py-24 px-6 bg-[url('/patterns/arch.png')] bg-cover bg-fixed relative">
        <div className="absolute inset-0 bg-transparent" />
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

function formatEventDate(startDateStr: string | Date, endDateStr?: string | Date): string {
    const startDate = new Date(startDateStr);
    if (!endDateStr) {
        return startDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    const endDate = new Date(endDateStr);
    
    if (isNaN(endDate.getTime())) {
        return startDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    
    if (startDate.toDateString() === endDate.toDateString()) {
        return startDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    
    const startDay = startDate.getDate();
    const startWeekday = startDate.toLocaleDateString('id-ID', { weekday: 'long' });
    const endDay = endDate.getDate();
    const endWeekday = endDate.toLocaleDateString('id-ID', { weekday: 'long' });
    
    const startMonth = startDate.toLocaleDateString('id-ID', { month: 'long' });
    const endMonth = endDate.toLocaleDateString('id-ID', { month: 'long' });
    
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    
    if (startMonth === endMonth && startYear === endYear) {
        return `${startWeekday} - ${endWeekday}, ${startDay} - ${endDay} ${startMonth} ${startYear}`;
    } else if (startYear === endYear) {
        return `${startWeekday}, ${startDay} ${startMonth} - ${endWeekday}, ${endDay} ${endMonth} ${startYear}`;
    } else {
        return `${startDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })} - ${endDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    }
}

function EventCard({ event, index }: { event: any, index: number }) {
    const { title, location, mapsLink } = {
        title: event.title,
        location: event.tempat,
        mapsLink: event.maps
    };
    const delay = index * 0.2;
    
    const showTime = event.showJam !== false;
    const timeText = showTime 
        ? (event.jam 
            ? `${event.jam}${event.sampaiSelesai ? " - Selesai" : ""}` 
            : (event.sampaiSelesai ? "Selesai" : ""))
        : null;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full max-w-xl bg-white/60 dark:bg-black/40 backdrop-blur border border-border/80 p-8 md:p-12 rounded-t-full rounded-b-lg text-center shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
        >
            {/* Elegant Double Inner Border Frame */}
            <div className="absolute inset-2 border border-accent/25 rounded-t-full rounded-b-md pointer-events-none z-10" />
            <div className="absolute inset-[11px] border border-accent/10 rounded-t-full rounded-b-sm pointer-events-none z-10" />

            {/* Subtle Floral Watermarks in Corners */}
            <div className="absolute -bottom-8 -right-8 w-40 h-40 opacity-[0.06] dark:opacity-[0.15] pointer-events-none select-none z-0">
                <img 
                    src="/assets/floral-corner.png" 
                    alt=""
                    className="w-full h-full object-contain rotate-[-45deg] mix-blend-multiply dark:invert dark:mix-blend-screen" 
                />
            </div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 opacity-[0.06] dark:opacity-[0.15] pointer-events-none select-none z-0 scale-x-[-1]">
                <img 
                    src="/assets/floral-corner.png" 
                    alt=""
                    className="w-full h-full object-contain rotate-[-45deg] mix-blend-multiply dark:invert dark:mix-blend-screen" 
                />
            </div>

            {/* Content Container (Needs higher z-index to stay above background watermarks) */}
            <div className="relative z-20 space-y-6">
                <div className="space-y-3">
                    {/* Header Ornament */}
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-px w-6 bg-accent/30 group-hover:w-10 transition-all duration-500" />
                        <Icon icon="ph:flower-lotus-light" className="text-3xl text-accent" />
                        <div className="h-px w-6 bg-accent/30 group-hover:w-10 transition-all duration-500" />
                    </div>
                    <h3 className="font-heading text-3xl md:text-4xl text-primary">{title}</h3>
                    {/* Divider Ornament */}
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-6 h-px bg-accent/30" />
                        <div className="w-1.5 h-1.5 rotate-45 bg-accent" />
                        <div className="w-6 h-px bg-accent/30" />
                    </div>
                </div>

                <div className="space-y-4 mb-2">
                    <div>
                        <p className="font-serif text-lg font-medium text-primary/95 leading-relaxed">
                            {formatEventDate(event.tanggal, event.tanggalEnd)}
                        </p>
                    </div>
                    {event.schedules && event.schedules.length > 0 ? (
                        <div className="py-2 max-w-xs mx-auto space-y-3">
                            {event.schedules.map((schedule: any, sIdx: number) => (
                                <div key={sIdx} className="flex flex-col items-center justify-center border-t border-accent/15 pt-3 first:border-0 first:pt-0">
                                    <span className="font-heading text-xl text-accent tracking-wide">{schedule.name}</span>
                                    <span className="inline-flex items-center gap-1.5 text-muted-foreground font-sans text-sm tracking-wide mt-1">
                                        <Icon icon="ph:clock-light" className="text-accent text-base" />
                                        {schedule.jam}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        timeText && (
                            <div className="text-muted-foreground font-sans text-sm tracking-wide">
                                <p className="inline-flex items-center justify-center gap-1.5 mx-auto">
                                    <Icon icon="ph:clock-light" className="text-accent text-base" />
                                    {timeText}
                                </p>
                            </div>
                        )
                    )}
                    <div className="pt-4 px-4 overflow-hidden text-clip space-y-2">
                        <p className="font-serif italic text-xl text-primary">{location}</p>
                        {event.alamat && (
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto font-sans leading-relaxed">
                                {event.alamat}
                            </p>
                        )}
                    </div>
                </div>

                <Button 
                    variant="outline" 
                    className="rounded-full gap-2 hover:bg-primary hover:text-white transition-colors border-accent/40 text-primary hover:border-primary font-sans text-xs uppercase tracking-wider h-10 px-6 shadow-sm"
                    onClick={() => window.open(mapsLink, '_blank')}
                >
                    <Icon icon="ph:map-pin-light" className="text-base" />
                    View Location
                </Button>
            </div>
        </motion.div>
    )
}
