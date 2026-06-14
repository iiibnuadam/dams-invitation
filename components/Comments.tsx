"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Comment {
  name: string;
  message: string;
  timestamp: string | Date;
  isVisible?: boolean;
  isFavorite?: boolean;
}

interface CommentsProps {
  data: {
    comments: Comment[];
  };
}

function formatRelativeTime(dateInput: string | Date): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 5) return "Baru saja";
  if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`;
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
  
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColor(name: string): string {
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const styles = [
    "bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] text-[#C5A059]", // Slate Gold
    "bg-gradient-to-br from-[#C5A059] to-[#D8B673] text-white",      // Champagne Gold
    "bg-gradient-to-br from-[#1E352F] to-[#2D4E45] text-[#EBE3D5]", // Sage Forest
    "bg-gradient-to-br from-[#5C3D2E] to-[#865439] text-[#FFF5EE]", // Bronze Earth
    "bg-gradient-to-br from-[#2B3E4A] to-[#3B5767] text-[#E8EFF3]", // Soft Navy
  ];
  return styles[hash % styles.length];
}

export default function Comments({ data }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(data.comments || []);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Time triggers a re-render of timestamps every 30 seconds
  const [timeTick, setTimeTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTimeTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check local storage for cooldown
    const lastPost = localStorage.getItem("lastCommentTime");
    if (lastPost) {
        const timeSince = (Date.now() - parseInt(lastPost)) / 1000;
        if (timeSince < 60) {
            setCooldown(Math.ceil(60 - timeSince));
        }
    }
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
        const timer = setInterval(() => setCooldown(c => c - 1), 1000);
        return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    const newComment: Comment = {
      name,
      message,
      timestamp: new Date().toISOString(),
      isVisible: true,
      isFavorite: false,
    };

    // Optimistic Update
    setComments((prev) => [newComment, ...prev]);
    setName("");
    setMessage("");
    
    // Start cooldown
    setCooldown(60);
    localStorage.setItem("lastCommentTime", Date.now().toString());

    try {
      const res = await fetch("/api/invitation/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newComment.name,
          message: newComment.message,
          isVisible: newComment.isVisible,
          isFavorite: newComment.isFavorite,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }
      
      const responseData = await res.json();
      
      // Update with real data from server (synced)
      if (responseData.comments) {
          setComments(responseData.comments);
      }
    } catch (error) {
      console.error(error);
      // Rollback on error
      setComments((prev) => prev.filter((c) => c !== newComment));
      alert("Gagal mengirim ucapan. Silakan coba lagi.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const sortedComments = useMemo(() => {
    return comments
      .filter((c) => c.isVisible === true)
      .sort((a, b) => {
          // Sort by isFavorite first
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;

          // Then sort by timestamp (newest first)
          const dateA = new Date(a.timestamp).getTime();
          const dateB = new Date(b.timestamp).getTime();
          return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
      });
  }, [comments]);

  return (
    <section className="py-24 md:py-32 px-6 bg-transparent relative overflow-hidden">
      {/* Background Ornamentations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/2 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/2 rounded-full blur-3xl opacity-50" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20 space-y-4"
        >
          <div className="flex items-center justify-center gap-3 text-accent/80 mb-2">
            <div className="h-[1px] w-8 bg-accent/50" />
            <span className="font-heading text-lg tracking-widest uppercase">Guest Book</span>
            <div className="h-[1px] w-8 bg-accent/50" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[#1A1A1A]">Wishes & Prayers</h2>
          <p className="text-muted-foreground font-serif italic max-w-md mx-auto leading-relaxed text-sm md:text-base">
             Kirimkan ucapan selamat serta untaian doa restu terbaik Anda untuk membimbing perjalanan cinta kami.
          </p>
        </motion.div>

        {/* Guestbook Board Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Input Form Card (Spans 5 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 bg-white/70 backdrop-blur-md p-8 rounded-2xl border border-border/80 shadow-[0_15px_40px_rgba(0,0,0,0.03)]"
            >
                <div className="mb-6 pb-4 border-b border-border/60">
                  <h3 className="font-heading text-xl text-primary font-bold">Kirim Doa Restu</h3>
                  <p className="text-xs text-muted-foreground mt-1">Gunakan formulir di bawah untuk menitip ucapan hangat.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="block text-[10px] font-semibold uppercase tracking-widest text-accent">Nama Anda</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-transparent border-b border-border/80 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors font-sans"
                            placeholder="Tulis nama panggilan/lengkap..."
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[10px] font-semibold uppercase tracking-widest text-accent">Ucapan & Doa</label>
                        <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            className="w-full bg-transparent border-b border-border/80 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors resize-none font-serif italic leading-relaxed"
                            placeholder="Tulis ucapan selamat dan doa tulus Anda di sini..."
                            required
                        />
                    </div>

                    <Button 
                        type="submit" 
                        disabled={isSubmitting || cooldown > 0}
                        className="w-full rounded-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white hover:text-accent font-sans text-xs uppercase tracking-widest transition-all duration-300 h-11 shadow-md hover:shadow-lg"
                    >
                        {isSubmitting ? (
                            <Icon icon="ph:spinner-gap-bold" className="animate-spin text-lg" />
                        ) : cooldown > 0 ? (
                             <span className="text-xs font-semibold">Tunggu {cooldown} Detik</span>
                        ) : (
                            <>
                                <Icon icon="ph:paper-plane-right-fill" className="mr-2 text-sm text-accent" />
                                Kirim Ucapan
                            </>
                        )}
                    </Button>
                </form>
            </motion.div>

            {/* Right: Comments Stream (Spans 7 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 flex flex-col"
            >
                {/* Header Stream Info */}
                <div className="flex items-center justify-between mb-4 px-2 select-none">
                  <div className="flex items-center gap-2">
                    <Icon icon="ph:chats-circle-fill" className="text-accent text-lg" />
                    <span className="font-heading text-sm font-bold text-primary">Daftar Ucapan</span>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border/40">
                     {sortedComments.length} Doa Restu
                  </span>
                </div>

                {/* Messages Box */}
                <div className="space-y-4 max-h-[510px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
                    <AnimatePresence mode="popLayout">
                        {sortedComments.length === 0 && (
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-center text-muted-foreground italic py-16 text-sm"
                            >
                              Belum ada ucapan. Jadilah yang pertama menitipkan doa restu!
                            </motion.p>
                        )}
                        {sortedComments.map((comment, index) => {
                            const initials = getInitials(comment.name);
                            const avatarStyle = getAvatarColor(comment.name);
                            const isFavorite = comment.isFavorite === true;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    layout
                                    transition={{ type: "spring", stiffness: 220, damping: 22 }}
                                    className={cn(
                                      "bg-white p-5 rounded-2xl border transition-all relative overflow-hidden flex gap-4 items-start shadow-[0_4px_12px_rgba(0,0,0,0.015)]",
                                      isFavorite 
                                        ? "border-accent/40 bg-gradient-to-b from-white to-[#FAF6EE] shadow-[0_8px_20px_rgba(197,160,89,0.03)]" 
                                        : "border-border/60 hover:border-accent/20 hover:shadow-[0_8px_20px_rgba(0,0,0,0.03)]"
                                    )}
                                >
                                    {/* Star / Favorite Sticker badge */}
                                    {isFavorite && (
                                      <div className="absolute top-0 right-0 bg-accent text-[#1A1A1A] px-2 py-0.5 rounded-bl-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-sm select-none z-10">
                                        <Icon icon="ph:star-fill" className="text-[10px]" />
                                        <span>Pinned</span>
                                      </div>
                                    )}

                                    {/* Elegant Avatar Initials */}
                                    <div className={cn("w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-sans text-xs font-bold shadow-sm select-none", avatarStyle)}>
                                        {initials}
                                    </div>

                                    {/* Message Text */}
                                    <div className="space-y-1.5 flex-1 min-w-0 pr-8">
                                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                            <span className="font-heading text-base font-bold text-primary truncate leading-tight">
                                              {comment.name}
                                            </span>
                                            <span style={{ contentVisibility: "auto" }} className="text-[10px] text-muted-foreground font-sans uppercase tracking-wider font-semibold whitespace-nowrap">
                                                {formatRelativeTime(comment.timestamp)}
                                            </span>
                                        </div>
                                        <p className="text-muted-foreground font-serif italic text-[13px] leading-relaxed break-words whitespace-pre-wrap">
                                            "{comment.message}"
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
