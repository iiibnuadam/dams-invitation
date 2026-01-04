"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

import FloralOrnament from "@/components/FloralOrnament";

interface OverlayProps {
  onOpen: () => void;
  data: {
    hero: {
      heading: string;
      names: string;
      date: string;
    };
    overlay?: {
      backgroundImage?: string;
      coupleImage?: string;
    };
    isLocked?: boolean;
    password?: string;
  };
}

export default function Overlay({ onOpen, data }: OverlayProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showPasswordInputType, setShowPasswordInputType] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorShake, setErrorShake] = useState(false);
  
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || "Tamu Undangan";
  const isLocked = data.isLocked || false;
  const correctPassword = data.password;

  const handleOpen = () => {
    if (isLocked) {
        if (correctPassword) {
            setShowPasswordInput(true);
        }
        return;
    }
    setIsVisible(false);
  };

  const handleUnlockAttempt = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (passwordInput === correctPassword) {
        setIsVisible(false);
    } else {
        setErrorShake(true);
        setTimeout(() => setErrorShake(false), 500);
        toast.error("Password salah");
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  return (
    <AnimatePresence onExitComplete={onOpen}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-4 bg-cover bg-center"
          style={{
            backgroundImage: data.overlay?.backgroundImage 
              ? `url('${data.overlay.backgroundImage}')` 
              : "url('/patterns/paper.png')"
          }}
        >
            <div className={`absolute inset-0 ${data.overlay?.backgroundImage ? 'bg-black/40' : 'bg-background/90'}`} />
            
            <FloralOrnament 
                position="top-left" 
                className={data.overlay?.backgroundImage ? "text-white/40" : "text-foreground/20"} 
            />
            <FloralOrnament 
                position="bottom-right" 
                delay={1}
                className={data.overlay?.backgroundImage ? "text-white/40" : "text-foreground/20"} 
            />

            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative z-10 flex flex-col items-center gap-6 text-center"
            >
                {data.overlay?.coupleImage && (
                  <div className="w-48 h-64 md:w-60 md:h-80 mb-4 rounded-t-full border-4 border-white/20 overflow-hidden shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={data.overlay.coupleImage} 
                      alt="Couple" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <h3 className={`uppercase tracking-[0.2em] text-sm ${data.overlay?.backgroundImage ? 'text-white/80' : 'text-chart-3'}`}>
                    {data.hero.heading}
                </h3>
                
                <h1 className={`font-heading text-5xl md:text-7xl ${data.overlay?.backgroundImage ? 'text-white' : 'text-foreground'}`}>
                    {data.hero.names}
                </h1>

                {/* Date Display (Blurred if Locked) */}
                {isLocked && !showPasswordInput && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-lg md:text-xl font-light tracking-widest my-2 blur-sm select-none ${data.overlay?.backgroundImage ? 'text-white/80' : 'text-muted-foreground'}`}
                    >
                        {data.hero.date}
                    </motion.div>
                )}

                <div className={`my-8 h-px w-24 ${data.overlay?.backgroundImage ? 'bg-white/30' : 'bg-border'}`} />

                <div className="space-y-2">
                    <p className={`font-serif italic ${data.overlay?.backgroundImage ? 'text-white/80' : 'text-muted-foreground'}`}>Kepada Yth. Bapak/Ibu/Saudara/i</p>
                    <h2 className={`text-xl font-medium ${data.overlay?.backgroundImage ? 'text-white' : 'text-foreground'}`}>{guestName}</h2>
                </div>

                <div className="mt-12 h-20 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {showPasswordInput ? (
                             <motion.form
                                key="password-form"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1, x: errorShake ? [-10, 10, -10, 10, 0] : 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                onSubmit={handleUnlockAttempt}
                                className="flex items-center gap-2"
                             >
                                <div className="relative">
                                    <input
                                        autoFocus={true}
                                        type={showPasswordInputType ? "text" : "password"}
                                        placeholder="Enter Password"
                                        value={passwordInput}
                                        onChange={(e) => setPasswordInput(e.target.value)}
                                        className="pl-4 pr-10 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-lg text-center text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 w-48"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordInputType(!showPasswordInputType)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                                    >
                                        <Icon icon={showPasswordInputType ? "ph:eye-slash" : "ph:eye"} className="w-5 h-5" />
                                    </button>
                                </div>
                                <Button 
                                    type="submit" 
                                    size="icon" 
                                    variant="secondary"
                                    className="rounded-lg h-[46px] w-[46px]"
                                >
                                    <Icon icon="ph:arrow-right-bold" />
                                </Button>
                             </motion.form>
                        ) : (
                            <motion.button
                                key="open-button"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={handleOpen}
                                disabled={isLocked && !correctPassword}
                                whileHover={(!isLocked || correctPassword) ? { scale: 1.05 } : {}}
                                whileTap={(!isLocked || correctPassword) ? { scale: 0.95 } : {}}
                                className={`group relative px-8 py-4 bg-white text-black rounded-full shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] transition-all ${isLocked && !correctPassword ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                {(!isLocked || correctPassword) && (
                                    <>
                                        {/* Ripple/Pulse Ring behind */}
                                        <span className="absolute -inset-1 rounded-full border border-white/30 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                                        <span className="absolute -inset-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700 delay-75" />
                                    </>
                                )}
                                
                                <div className="relative flex items-center gap-3">
                                    <motion.div
                                        animate={(!isLocked || (isLocked && correctPassword)) ? { 
                                            y: [0, -4, 0],
                                        } : {}}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        {isLocked ? (
                                            <Icon icon="ph:lock-duotone" className="text-2xl text-muted-foreground" />
                                        ) : (
                                            <Icon icon="ph:envelope-open-duotone" className="text-2xl text-chart-3" />
                                        )}
                                    </motion.div>
                                    <span className="font-heading tracking-widest uppercase text-sm font-semibold">
                                        {isLocked ? (correctPassword ? "Unlock Invitation" : "Coming Soon") : "Buka Undangan"}
                                    </span>
                                </div>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
