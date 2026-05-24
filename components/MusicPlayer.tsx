"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ChevronLeft, Music, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface MusicPlayerProps {
  autoPlayTrigger?: boolean;
  musicUrl?: string;
  musicTracks?: { name: string; url: string }[];
  coupleNames?: string;
  coupleImage?: string;
}

const MUSIC_PRESETS = [
  { name: "Can't Help Falling in Love", url: "" },
  { name: "Beautiful Piano Harmony", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { name: "Warm Acoustic Guitar", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { name: "Elegant Orchestral", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { name: "Sweet Lofi Beats", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
];

export default function MusicPlayer({ 
  autoPlayTrigger = false, 
  musicUrl,
  musicTracks = [],
  coupleNames = "Sasti & Adam",
  coupleImage,
  isOpened
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  // Auto-minimize when clicking outside of the expanded player
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        !isMinimized &&
        playerRef.current &&
        !playerRef.current.contains(event.target as Node)
      ) {
        setIsMinimized(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMinimized]);

  const audioSrc = musicUrl || "/assets/music.mp3";

  // Determine Track Name
  const getTrackName = () => {
    // If the URL is empty or matches the default local preset
    if (!musicUrl || musicUrl === "") {
      return "Can't Help Falling in Love";
    }

    // 1. Search in user's saved custom tracks
    if (musicTracks && musicTracks.length > 0) {
      const savedTrack = musicTracks.find(t => t.url === musicUrl);
      if (savedTrack) return savedTrack.name;
    }

    // 2. Search in system presets
    const preset = MUSIC_PRESETS.find(p => p.url === musicUrl);
    if (preset) return preset.name;

    // 3. Fallback to extracting from filename
    try {
      const filename = musicUrl.substring(musicUrl.lastIndexOf('/') + 1).split('?')[0];
      return decodeURIComponent(filename).replace(/\.[^/.]+$/, "") || "Custom Soundtrack";
    } catch {
      return "Custom Soundtrack";
    }
  };

  // Sync music source changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.log("Play on source change prevented:", error);
        });
      }
    }
  }, [audioSrc]);

  // Handle Autoplay Trigger (from overlay open)
  useEffect(() => {
    if (autoPlayTrigger && audioRef.current) {
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

  // Track progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.log("Play failed:", error);
        });
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressBarRef.current;
    if (!audio || !bar || !audio.duration) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * audio.duration;
    audio.currentTime = newTime;
  };

  return (
    <div className={cn("fixed bottom-4 left-4 z-50 flex items-center justify-center font-sans transition-all duration-500", !isOpened && "opacity-0 pointer-events-none")}>
      <audio ref={audioRef} src={audioSrc} loop />

      <AnimatePresence mode="wait">
        {isMinimized ? (
          /* MINIMIZED PLAYER (Floating Compact Disc) */
          <motion.button
            key="minimized"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMinimized(false)}
            className="w-12 h-12 rounded-full bg-[#1A1A1A]/95 hover:bg-[#1A1A1A] text-[#C5A059] border border-white/10 flex items-center justify-center shadow-2xl cursor-pointer relative"
          >
            {isPlaying && (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[#C5A059]/20 rounded-full"
              />
            )}
            {isPlaying ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 rounded-full border-2 border-dashed border-[#C5A059] flex items-center justify-center"
              >
                <Music className="w-4 h-4 text-[#C5A059]" />
              </motion.div>
            ) : (
              <Music className="w-5 h-5 text-white/85" />
            )}
          </motion.button>
        ) : (
          /* EXPANDED SPOTIFY-STYLE PLAYER */
          <motion.div
            key="expanded"
            ref={playerRef}
            initial={{ x: -50, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-72 sm:w-80 bg-[#1A1A1A]/95 text-white border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-md"
          >
            {/* Main Player Row */}
            <div className="flex items-center gap-3 p-3">
              {/* Spinning Vinyl Album Art */}
              <div className="w-12 h-12 rounded-lg bg-zinc-800/80 flex-shrink-0 relative overflow-hidden shadow-inner border border-white/5 flex items-center justify-center">
                {coupleImage ? (
                  <motion.img
                    src={coupleImage}
                    alt="Album Art"
                    className="w-full h-full object-cover rounded-lg"
                    animate={isPlaying ? { rotate: 360 } : {}}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <motion.div
                    className="w-full h-full rounded-full border-4 border-double border-[#C5A059]/80 flex items-center justify-center bg-black/40"
                    animate={isPlaying ? { rotate: 360 } : {}}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-3 h-3 rounded-full bg-[#1A1A1A]" />
                  </motion.div>
                )}
              </div>

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-xs text-zinc-100 truncate tracking-wide">
                  {getTrackName()}
                </h4>
                <p className="text-[10px] text-zinc-400 truncate mt-0.5 font-medium tracking-wider uppercase">
                  {coupleNames}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                {/* Mute Button */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-[#C5A059] transition-colors rounded-full hover:bg-white/5"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                {/* Play/Pause Button */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-full bg-[#C5A059] hover:bg-[#d6b26b] text-black flex items-center justify-center shadow-md transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-black text-black" />
                  ) : (
                    <Play className="w-4 h-4 fill-black text-black translate-x-[1px]" />
                  )}
                </motion.button>

                {/* Minimize Button */}
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
                  title="Minimize Player"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Spotify-like Interactive Progress Bar */}
            <div 
              ref={progressBarRef}
              onClick={handleSeek}
              className="h-1 bg-zinc-800 w-full cursor-pointer relative group transition-all hover:h-1.5"
            >
              <div 
                className="h-full bg-[#C5A059] transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${progress}% - 4px)` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
