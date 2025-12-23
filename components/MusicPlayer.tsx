"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

interface MusicPlayerProps {
  autoPlayTrigger?: boolean;
}

export default function MusicPlayer({ autoPlayTrigger = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (autoPlayTrigger && audioRef.current) {
        // Attempt to play
        // Browser policy requires interaction. The 'autoPlayTrigger' typically comes
        // from the "Open Invitation" click, which counts as interaction.
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.log("Autoplay prevented:", error);
                setIsPlaying(false);
            });
        }
    }
  }, [autoPlayTrigger]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <audio ref={audioRef} src="/assets/music.mp3" loop />
      
      <Button
        onClick={togglePlay}
        size="icon"
        className={`rounded-full w-12 h-12 shadow-lg transition-all duration-300 ${
            isPlaying 
            ? 'bg-primary text-primary-foreground animate-spin-slow' // Custom spin class if needed, or stick to normal rotation
            : 'bg-white/80 text-primary hover:bg-white'
        }`}
      >
        <Icon 
            icon={isPlaying ? "ph:music-notes-simple-bold" : "ph:speaker-slash-bold"} 
            className="text-xl" 
        />
      </Button>

      {/* Floating Notes Animation (Optional, simple CSS based) */}
      {isPlaying && (
          <div className="absolute inset-0 -z-10 animate-ping opacity-20 bg-primary rounded-full" />
      )}
    </div>
  );
}
