"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

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
          exit={{ y: "-100%", opacity: 0, filter: "blur(12px)", scale: 1.05 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1A1A1A] px-4 overflow-hidden select-none"
        >
            {/* Background Image with Ken Burns animation */}
            <motion.div 
              className="absolute inset-0 bg-cover bg-center origin-center"
              style={{
                backgroundImage: data.overlay?.backgroundImage 
                  ? `url('${data.overlay.backgroundImage}')` 
                  : "url('/patterns/paper.png')"
              }}
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Overlay Shading mask */}
            <div className={cn(
              "absolute inset-0 transition-opacity duration-500",
              data.overlay?.backgroundImage ? "bg-black/55 backdrop-blur-[1px]" : "bg-[#1A1A1A]/95"
            )} />
            
            {/* Editorial Dual Borders */}
            <div className="absolute inset-6 border border-accent/20 pointer-events-none z-10 rounded-sm" />
            <div className="absolute inset-8 border border-dashed border-accent/10 pointer-events-none z-10 rounded-sm" />
            
            <FloralOrnament 
                position="top-left" 
                className="text-accent/30 z-10" 
            />
            <FloralOrnament 
                position="bottom-right" 
                delay={1}
                className="text-accent/30 z-10 scale-[-1]" 
            />

            {/* Content Container */}
            <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex flex-col items-center gap-6 text-center max-w-lg w-full"
            >
                {/* Logo Light */}
                <motion.div 
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.8 }}
                  className="mb-1"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/assets/logo-light.png" 
                    alt="Logo" 
                    className="w-14 h-14 object-contain opacity-90 drop-shadow-md" 
                  />
                </motion.div>

                {/* Couple Card Photo (Optional) */}
                {data.overlay?.coupleImage && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="w-36 h-48 md:w-44 md:h-60 mb-2 rounded-t-full border border-accent/30 p-1 bg-black/10 overflow-hidden shadow-2xl"
                  >
                    <div className="w-full h-full rounded-t-full overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={data.overlay.coupleImage} 
                        alt="Couple" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                )}

                <div className="space-y-1">
                  <h3 className="uppercase tracking-[0.3em] text-[10px] md:text-xs text-accent font-semibold font-sans">
                      {data.hero.heading}
                  </h3>
                  
                  <h1 className="font-heading text-4xl md:text-6xl text-white tracking-wide font-light">
                      {data.hero.names.split(" & ").map((name, i) => (
                        <span key={name}>
                          {i > 0 && <span className="font-serif italic text-accent font-light text-3xl md:text-5xl mx-2">&amp;</span>}
                          {name}
                        </span>
                      ))}
                  </h1>
                </div>

                {/* Wedding Date */}
                {isLocked && !showPasswordInput ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs font-sans uppercase tracking-[0.35em] text-white/40 blur-[3px] select-none my-1"
                    >
                        {data.hero.date}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xs font-sans uppercase tracking-[0.35em] text-white/70 flex items-center gap-3 my-1"
                    >
                      <span className="w-4 h-[1px] bg-accent/30" />
                      <span>{data.hero.date.split(".").join(" . ")}</span>
                      <span className="w-4 h-[1px] bg-accent/30" />
                    </motion.div>
                )}

                {/* Premium Glass Guest Card */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="bg-white/5 border border-white/10 backdrop-blur-md px-8 py-5 rounded-2xl max-w-[290px] md:max-w-xs w-full mx-auto shadow-2xl relative overflow-hidden group select-none mt-2"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.06),transparent_50%)] pointer-events-none" />
                  <span className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold mb-2.5 block border border-accent/20 bg-accent/5 py-0.5 rounded-full max-w-[140px] mx-auto">
                    VIP Invitation
                  </span>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider font-sans mb-1">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                  <h2 className="text-base md:text-lg font-heading text-white font-medium tracking-wide mt-1 truncate">
                    {guestName}
                  </h2>
                </motion.div>

                {/* Password / Buka Button Controller */}
                <div className="mt-6 h-20 flex items-center justify-center w-full">
                    <AnimatePresence mode="wait">
                        {showPasswordInput ? (
                             <motion.form
                                key="password-form"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1, x: errorShake ? [-8, 8, -8, 8, 0] : 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                onSubmit={handleUnlockAttempt}
                                className="flex items-center gap-2.5"
                             >
                                <div className="relative">
                                    <input
                                        autoFocus={true}
                                        type={showPasswordInputType ? "text" : "password"}
                                        placeholder="Ketik Password..."
                                        value={passwordInput}
                                        onChange={(e) => setPasswordInput(e.target.value)}
                                        className="pl-4 pr-10 py-3 bg-white/5 backdrop-blur border border-white/10 rounded-xl text-center text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/40 w-44 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordInputType(!showPasswordInputType)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                                    >
                                        <Icon icon={showPasswordInputType ? "ph:eye-slash-fill" : "ph:eye-fill"} className="w-4 h-4" />
                                    </button>
                                </div>
                                <Button 
                                    type="submit" 
                                    size="icon" 
                                    className="bg-accent text-[#1A1A1A] hover:bg-[#FAF6EE] rounded-xl h-[46px] w-[46px] shadow-md transition-colors"
                                >
                                    <Icon icon="ph:arrow-right-bold" className="text-base" />
                                </Button>
                             </motion.form>
                        ) : (
                            <motion.button
                                key="open-button"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={handleOpen}
                                disabled={isLocked && !correctPassword}
                                whileHover={(!isLocked || correctPassword) ? { scale: 1.03 } : {}}
                                whileTap={(!isLocked || correctPassword) ? { scale: 0.97 } : {}}
                                className={cn(
                                  "group relative px-9 py-4 rounded-full font-sans text-[11px] uppercase tracking-[0.25em] font-semibold flex items-center gap-3 transition-all select-none shadow-xl border cursor-pointer",
                                  isLocked && !correctPassword
                                    ? "bg-white/10 border-white/5 text-white/30 cursor-not-allowed"
                                    : "bg-accent border-accent text-[#1A1A1A] hover:bg-transparent hover:text-accent hover:border-accent shadow-[0_6px_25px_rgba(197,160,89,0.25)] hover:shadow-[0_8px_30px_rgba(197,160,89,0.4)]"
                                )}
                            >
                                {(!isLocked || correctPassword) && (
                                    <>
                                        {/* Golden Pulsing circles around button */}
                                        <span className="absolute -inset-1 rounded-full border border-accent/30 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none" />
                                        <span className="absolute -inset-2.5 rounded-full border border-accent/10 opacity-0 group-hover:opacity-100 group-hover:scale-115 transition-all duration-750 delay-75 pointer-events-none" />
                                        <span className="absolute inset-0 rounded-full bg-accent/20 animate-ping opacity-75 group-hover:opacity-0 transition-opacity pointer-events-none" />
                                    </>
                                )}
                                
                                <div className="relative flex items-center gap-2.5">
                                    <motion.div
                                        animate={(!isLocked || (isLocked && correctPassword)) ? { 
                                            y: [0, -4, 0],
                                        } : {}}
                                        transition={{
                                            duration: 2.2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        {isLocked ? (
                                            <Icon icon="ph:lock-fill" className="text-base" />
                                        ) : (
                                            <Icon icon="ph:envelope-open-fill" className="text-base" />
                                        )}
                                    </motion.div>
                                    <span>
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
