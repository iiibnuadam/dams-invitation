"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

interface CountdownProps {
  targetDate: string | Date; // Date string or Date object
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return timeLeft;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const handleAddToCalendar = () => {
    // Basic Google Calendar Link Generation
    const date = new Date(targetDate);
    const text = "The Wedding of Sasti & Adam";
    const dates = date.toISOString().replace(/-|:|\.\d\d\d/g, ""); // Basic ISO to YYYYMMDDTHHMMSSZ
    // Note: Needs end date. Assuming 2 hours duration.
    const endDate = new Date(date.getTime() + 2 * 60 * 60 * 1000);
    const datesEnd = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(text)}&dates=${dates}/${datesEnd}&details=We%20are%20getting%20married!&location=See%20Invitation`;
    window.open(url, "_blank");
  };

  return (
    <section className="py-20 px-6 bg-secondary/30">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-12"
        >
            <h2 className="font-heading text-4xl text-primary">Count the Days</h2>
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <TimeUnit value={timeLeft.days} label="Days" />
              <TimeUnit value={timeLeft.hours} label="Hours" />
              <TimeUnit value={timeLeft.minutes} label="Minutes" />
              <TimeUnit value={timeLeft.seconds} label="Seconds" />
            </div>

            <Button 
                onClick={handleAddToCalendar}
                variant="outline"
                className="rounded-full px-8 py-6 uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-colors"
            >
                <Icon icon="ph:calendar-plus" className="mr-2 text-lg" />
                Save to Calendar
            </Button>
        </motion.div>
      </div>
    </section>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <span className="font-heading text-5xl md:text-6xl text-primary leading-none">
                {String(value).padStart(2, '0')}
            </span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {label}
            </span>
        </div>
    )
}
