"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  isOpened: boolean;
  hasGallery: boolean;
}

const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "couple", label: "Mempelai" },
  { id: "events", label: "Acara" },
  { id: "story", label: "Cerita" },
  { id: "gallery", label: "Galeri" },
  { id: "gift", label: "Hadiah" },
  { id: "comments", label: "Ucapan" },
];

export default function SidebarNav({ isOpened, hasGallery }: SidebarNavProps) {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    if (!isOpened) return;

    const sections = SECTIONS.filter(s => s.id !== "gallery" || hasGallery).map(s => s.id);
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger once on mount to set initial active section
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpened, hasGallery]);

  if (!isOpened) return null;

  const visibleSections = SECTIONS.filter(s => s.id !== "gallery" || hasGallery);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      className={cn(
        "fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-6 items-end select-none transition-all duration-700 ease-out",
        isOpened ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
      )}
    >
      {/* Decorative vertical line */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[60%] w-[1px] bg-foreground/5 -z-10" />

      {visibleSections.map((sec) => {
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            type="button"
            onClick={() => scrollToSection(sec.id)}
            className="group flex items-center gap-3 bg-transparent border-0 p-1 cursor-pointer focus:outline-none"
            aria-label={`Scroll to ${sec.label}`}
          >
            {/* Label */}
            <span
              className={cn(
                "text-[9px] uppercase tracking-[0.25em] transition-all duration-300 font-sans font-medium",
                isActive 
                  ? "text-accent font-semibold opacity-100 translate-x-0" 
                  : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-accent text-muted-foreground/60"
              )}
            >
              {sec.label}
            </span>

            {/* Premium Editorial Dash */}
            <div className="w-8 flex justify-end items-center">
              <span
                className={cn(
                  "h-[1.5px] transition-all duration-500 rounded-full",
                  isActive
                    ? "w-8 bg-accent"
                    : "w-2.5 bg-foreground/20 group-hover:w-5 group-hover:bg-accent/60"
                )}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
