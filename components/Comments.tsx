"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
  name: string;
  message: string;
  timestamp: string | Date;
  isVisible?: boolean;
  isFavorite?: boolean;
}

interface CommentsProps {
  data: {
    slug: string;
    comments: Comment[];
  };
}

export default function Comments({ data }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(data.comments || []);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

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
      timestamp: new Date(),
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
          slug: data.slug,
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

    const sortedComments = comments
        .filter((c) => c.isVisible === true) // Filter out comments where isVisible is explicitly false
        .sort((a, b) => {
            // Sort by isFavorite first (favorites come first)
            if (a.isFavorite && !b.isFavorite) return -1;
            if (!a.isFavorite && b.isFavorite) return 1;

            // Then sort by timestamp (newest first)
            // Then sort by timestamp (newest first)
            const dateA = new Date(a.timestamp).getTime();
            const dateB = new Date(b.timestamp).getTime();
            return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
        });

  return (
    <section className="py-24 px-6 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl text-primary">Wishes & Prayers</h2>
            <p className="text-muted-foreground font-serif italic mt-2">
                Kirimkan doa dan ucapan hangat untuk kami
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white/80 p-8 rounded-xl border border-border/50 shadow-sm h-fit">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm uppercase tracking-wider text-muted-foreground mb-2">Nama</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-accent transition-colors"
                            placeholder="Nama Anda"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm uppercase tracking-wider text-muted-foreground mb-2">Ucapan</label>
                        <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-accent transition-colors resize-none"
                            placeholder="Tuliskan ucapan dan doa..."
                            required
                        />
                    </div>
                    <Button 
                        type="submit" 
                        disabled={isSubmitting || cooldown > 0}
                        className="w-full rounded-full"
                    >
                        {isSubmitting ? (
                            <Icon icon="ph:spinner-gap-light" className="animate-spin text-xl" />
                        ) : cooldown > 0 ? (
                             <span className="text-sm">Tunggu {cooldown}s</span>
                        ) : (
                            <>
                                <Icon icon="ph:paper-plane-right-light" className="mr-2 text-xl" />
                                Kirim Ucapan
                            </>
                        )}
                    </Button>
                </form>
            </div>
            {/* List */}
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {sortedComments.length === 0 && (
                        <p className="text-center text-muted-foreground italic">Belum ada ucapan. Jadilah yang pertama!</p>
                    )}
                    {sortedComments.map((comment, index) => (
                        <motion.div
                            key={index} // Ideally use ID, but generic fallback index
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                            className="bg-white p-6 rounded-lg border border-border shadow-sm"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-heading text-lg font-bold text-primary">{comment.name}</span>
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    {new Date(comment.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-muted-foreground font-serif italic text-sm leading-relaxed">
                                "{comment.message}"
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </section>
  );
}
