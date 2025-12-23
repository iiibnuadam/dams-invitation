"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
    <div className="fixed bottom-4 left-4 z-50 flex items-center justify-center">
      <audio ref={audioRef} src="/assets/music.mp3" loop />
      
      {/* Speaker Pulse Effect (Subtle) */}
      {isPlaying && (
         <motion.div
            animate={{ scale: [1, 1.3], opacity: [0.2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 bg-primary rounded-full z-0"
        />
      )}

      <Button
        onClick={togglePlay}
        size="icon"
        asChild
        className={`rounded-full w-12 h-12 shadow-lg relative z-10 transition-colors duration-300 ${
            isPlaying 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-white/80 text-primary hover:bg-white'
        }`}
      >
        <motion.button
            whileTap={{ scale: 0.9 }}
            animate={isPlaying ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={isPlaying ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
            onClick={togglePlay}
            className={`rounded-full w-12 h-12 flex items-center justify-center ${isPlaying ? 'bg-primary text-primary-foreground' : 'bg-white/80 text-primary hover:bg-white'}`}
        >
            {isPlaying ? (
                <div className="flex items-center justify-center gap-[3px] h-4">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ height: [6, 16, 6] }}
                            transition={{ 
                                duration: 0.8, 
                                repeat: Infinity, 
                                ease: "easeInOut", 
                                delay: i * 0.1 // Sequential delay creates the wave
                            }}
                            className="w-[3px] bg-primary-foreground rounded-full"
                        />
                    ))}
                </div>
            ) : (
                <Icon 
                    icon="ph:speaker-slash-bold" 
                    className="text-xl" 
                />
            )}
        </motion.button>
      </Button>
    </div>
  );
}
