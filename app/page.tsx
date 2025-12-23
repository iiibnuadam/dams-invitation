"use client";

import { useEffect, useState } from "react";
import Overlay from "@/components/Overlay";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import Couple from "@/components/Couple";
import Events from "@/components/Events";
import Story from "@/components/Story";
import GallerySection from "@/components/GallerySection";
import Gift from "@/components/Gift";
import Comments from "@/components/Comments";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import StickyHeader from "@/components/StickyHeader";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    // Fetch default main invitation
    fetch("/api/invitation")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background text-foreground">
        Loading...
      </div>
    );
  }

  if (!data || data.error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background text-foreground">
        <h1>Invitation not found</h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-white relative">
      {/* Mega Mendung Background Overlay */}
      <div 
        className="fixed inset-0 z-10 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "url('/patterns/megamendung.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "400px",
        }}
      />
      
      <Overlay onOpen={() => setIsOpened(true)} data={data} />
      
      <StickyHeader isOpened={isOpened} data={data} />
      
      {/* 
          We render the main content but maybe hidden or underneath until opened?
          If Overlay is z-50 and fixed, content below is visible but covered.
          Once Overlay removes, content is revealed.
          However, to prevent scroll, we handled that in Overlay.
      */}
      <div>
        <Hero data={data} />
        <Countdown targetDate={data.acara.find((e: any) => e.title.includes("Akad"))?.tanggal || data.acara[0]?.tanggal} />
        <Couple data={data} />
        <Events data={data} />
        <Story data={data} />
      {/* Gallery */}
      {data.gallery && data.gallery.length > 0 && (
        <GallerySection images={data.gallery} />
      )}
      
      <Gift data={data} />
        <Comments data={data} />
        <Footer />
        <MusicPlayer autoPlayTrigger={isOpened} />
      </div>
    </main>
  );
}
