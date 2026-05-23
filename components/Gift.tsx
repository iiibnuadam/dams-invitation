"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface GiftProps {
  data: {
    paymentMethods: {
      bank?: string;
      number?: string;
      holder?: string;
      name?: string;
      address?: string;
      image?: string;
      type: "bank" | "address" | "qris";
      enabled?: boolean;
      bgColor?: string;
      textColor?: string;
    }[];
  };
}

export default function Gift({ data }: GiftProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const activeMethods = data.paymentMethods.filter((p) => p.enabled !== false);

  if (activeMethods.length === 0) return null;

  return (
    <section className="py-20 md:py-32 px-6 bg-[#F9F9F9] relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-accent/3 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/3 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 md:mb-20 space-y-4"
        >
          <div className="flex items-center justify-center gap-3 text-accent/80 mb-2">
            <div className="h-[1px] w-8 bg-accent/50" />
            <span className="font-heading text-lg tracking-widest uppercase">Wedding Gift</span>
            <div className="h-[1px] w-8 bg-accent/50" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[#1A1A1A]">
             Tanda Kasih
          </h2>
          <p className="text-muted-foreground font-serif italic max-w-lg mx-auto leading-relaxed text-sm md:text-base">
             Doa restu Anda merupakan karunia yang sangat berarti bagi kami. 
             Namun jika memberi adalah ungkapan tanda kasih Anda, kami ucapkan terima kasih.
          </p>
        </motion.div>

        {/* MOBILE LAYOUT: Interactive Stacked Card Deck */}
        <div className="block md:hidden relative w-full max-w-[325px] mx-auto h-[400px]">
          {activeMethods.map((method, index) => {
             const isCopied = copiedIndex === index;
             
             // Dynamic Colors
             const customBg = method.bgColor || (method.type === "bank" ? "#1A1A1A" : "#FFFFFF");
             const customText = method.textColor || (method.type === "bank" ? "#FFFFFF" : "#1A1A1A");
             
             // Calculate visual ordering relative to activeIndex
             const diff = (index - activeIndex + activeMethods.length) % activeMethods.length;
             
             const yOffset = diff * 15;
             const scaleOffset = 1 - diff * 0.05;
             const rotateOffset = diff === 0 ? 0 : diff === 1 ? -3 : 3;
             const zIndexVal = 30 - diff;
             const opacityVal = diff > 2 ? 0 : 1;

             return (
               <motion.div
                 key={index}
                 animate={{
                   y: yOffset,
                   scale: scaleOffset,
                   rotate: rotateOffset,
                   zIndex: zIndexVal,
                   opacity: opacityVal,
                 }}
                 transition={{ type: "spring", stiffness: 260, damping: 24 }}
                 onClick={() => setActiveIndex(index)}
                 className={cn(
                   "absolute inset-x-0 top-0 h-[340px] cursor-pointer origin-bottom",
                   diff > 0 && "pointer-events-auto"
                 )}
               >
                 {method.type === "bank" ? (
                   /* Bank Card */
                   <div 
                     style={{ backgroundColor: customBg, color: customText, borderColor: `${customText}15` }}
                     className="p-6 rounded-2xl border shadow-xl relative overflow-hidden flex flex-col justify-between h-full w-full select-none"
                   >
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_60%)] pointer-events-none" />
                     
                     <div className="flex justify-between items-start">
                       <div>
                         <p style={{ color: customText, opacity: 0.6 }} className="text-[9px] font-semibold tracking-widest uppercase">Bank Transfer</p>
                         <h3 className="font-heading text-xl mt-0.5 tracking-wide">{method.bank}</h3>
                       </div>
                       <Icon icon="ph:bank-fill" style={{ color: customText, opacity: 0.8 }} className="text-2xl" />
                     </div>

                     <div>
                       <div className="flex items-center gap-2 mb-3">
                         <Icon icon="ph:cpu-fill" style={{ color: customText, opacity: 0.7 }} className="text-2xl" />
                         <Icon icon="ph:broadcast" style={{ color: customText, opacity: 0.4 }} className="text-lg rotate-90" />
                       </div>
                       <p className="text-xl font-mono tracking-wider font-semibold">
                          {method.number?.replace(/(\d{4})(?=\d)/g, "$1  ")}
                       </p>
                     </div>

                     <div style={{ borderColor: `${customText}10` }} className="flex justify-between items-end pt-3 border-t">
                       <div>
                         <p style={{ color: customText, opacity: 0.4 }} className="text-[8px] uppercase tracking-widest">Card Holder</p>
                         <p className="text-xs font-sans tracking-wide uppercase font-semibold">{method.holder}</p>
                       </div>
                       
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           handleCopy(method.number || "", index);
                         }}
                         style={isCopied ? {} : { borderColor: `${customText}35`, color: customText, backgroundColor: `${customText}08` }}
                         className={cn(
                           "flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all cursor-pointer",
                           isCopied && "bg-emerald-600 border-emerald-600 text-white"
                         )}
                       >
                         <Icon icon={isCopied ? "ph:check-bold" : "ph:copy-bold"} />
                         <span>{isCopied ? "Copied!" : "Salin"}</span>
                       </button>
                     </div>
                   </div>
                 ) : method.type === "qris" ? (
                   /* QRIS Card */
                   <div 
                     style={{ backgroundColor: customBg, color: customText, borderColor: `${customText}15` }}
                     className="p-6 rounded-2xl border shadow-xl relative overflow-hidden flex flex-col items-center justify-between text-center h-full w-full select-none"
                   >
                     <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Icon icon="ph:qr-code-light" style={{ color: customText }} className="text-5xl" />
                     </div>

                     <div className="w-full text-center">
                       <p style={{ color: customText, opacity: 0.6 }} className="text-[9px] font-semibold tracking-widest uppercase">Scan QR Code</p>
                       <h3 className="font-heading text-xl mt-0.5">{method.bank || "QRIS"}</h3>
                     </div>

                     <div className="my-2 relative scale-90">
                       <div style={{ borderColor: customText }} className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 opacity-60" />
                       <div style={{ borderColor: customText }} className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 opacity-60" />
                       <div style={{ borderColor: customText }} className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 opacity-60" />
                       <div style={{ borderColor: customText }} className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 opacity-60" />
                       
                       {method.image ? (
                         <div className="w-32 h-32 bg-white p-1.5 rounded-lg shadow-sm overflow-hidden flex items-center justify-center">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img src={method.image} alt="QRIS" className="w-full h-full object-contain" />
                         </div>
                       ) : (
                         <div className="w-32 h-32 bg-muted flex items-center justify-center text-muted-foreground text-[10px] text-center p-3 rounded-lg">
                           QR Code Not Available
                         </div>
                       )}
                     </div>

                     <div style={{ borderColor: `${customText}10` }} className="w-full pt-3 border-t">
                       <p style={{ color: customText, opacity: 0.4 }} className="text-[8px] uppercase tracking-widest">Account Name</p>
                       <p className="text-xs font-semibold uppercase tracking-wide">{method.holder}</p>
                     </div>
                   </div>
                 ) : (
                   /* Shipping Address Card */
                   <div 
                     style={{ backgroundColor: customBg, color: customText, borderColor: `${customText}15` }}
                     className="p-6 rounded-2xl border shadow-xl relative overflow-hidden flex flex-col justify-between h-full w-full select-none"
                   >
                     <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Icon icon="ph:map-pin-line" style={{ color: customText }} className="text-5xl" />
                     </div>

                     <div>
                       <p style={{ color: customText, opacity: 0.6 }} className="text-[9px] font-semibold tracking-widest uppercase">Kirim Kado / Hadiah</p>
                       <h3 className="font-heading text-xl mt-0.5">Alamat Pengiriman</h3>
                     </div>

                     <div className="my-2">
                       <p style={{ color: customText, opacity: 0.8 }} className="text-xs font-serif leading-relaxed italic line-clamp-4">
                         {method.address}
                       </p>
                     </div>

                     <div style={{ borderColor: `${customText}10` }} className="flex justify-between items-end pt-3 border-t">
                       <div>
                         <p style={{ color: customText, opacity: 0.4 }} className="text-[8px] uppercase tracking-widest">Penerima</p>
                         <p className="text-xs font-semibold uppercase tracking-wide">{method.name}</p>
                       </div>

                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           handleCopy(method.address || "", index);
                         }}
                         style={isCopied ? {} : { borderColor: `${customText}35`, color: customText, backgroundColor: `${customText}08` }}
                         className={cn(
                           "flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all cursor-pointer",
                           isCopied && "bg-emerald-600 border-emerald-600 text-white"
                         )}
                       >
                         <Icon icon={isCopied ? "ph:check-bold" : "ph:copy-bold"} />
                         <span>{isCopied ? "Copied!" : "Salin"}</span>
                       </button>
                     </div>
                   </div>
                 )}
               </motion.div>
             );
          })}
        </div>

        {/* Mobile Pagination Indicator Dots & Carets */}
        <div className="flex md:hidden justify-center items-center gap-5 mt-2 mb-10">
          <button
            onClick={() => setActiveIndex((prev) => (prev - 1 + activeMethods.length) % activeMethods.length)}
            className="w-8 h-8 rounded-full border border-accent/20 flex items-center justify-center text-accent hover:bg-accent/5 transition-colors cursor-pointer"
            aria-label="Previous card"
          >
            <Icon icon="ph:caret-left-bold" className="text-sm" />
          </button>
          
          <div className="flex items-center gap-1.5">
            {activeMethods.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  activeIndex === index ? "bg-accent w-4" : "bg-accent/30"
                )}
              />
            ))}
          </div>

          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % activeMethods.length)}
            className="w-8 h-8 rounded-full border border-accent/20 flex items-center justify-center text-accent hover:bg-accent/5 transition-colors cursor-pointer"
            aria-label="Next card"
          >
            <Icon icon="ph:caret-right-bold" className="text-sm" />
          </button>
        </div>

        {/* DESKTOP LAYOUT: Beautiful Premium Grid */}
        <div className={cn(
             "hidden md:grid gap-8 justify-center items-stretch",
             activeMethods.length === 1 ? "grid-cols-1 max-w-md mx-auto" : 
             activeMethods.length === 2 ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto" : 
             "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        )}>
          {activeMethods.map((method, index) => {
             const isCopied = copiedIndex === index;

             // Dynamic Colors
             const customBg = method.bgColor || (method.type === "bank" ? "#1A1A1A" : "#FFFFFF");
             const customText = method.textColor || (method.type === "bank" ? "#FFFFFF" : "#1A1A1A");

             return (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.15, type: "spring", stiffness: 100, damping: 20 }}
                 className="flex flex-col"
               >
                 {method.type === "bank" ? (
                   /* Bank Card */
                   <div 
                     style={{ backgroundColor: customBg, color: customText, borderColor: `${customText}15` }}
                     className="p-8 rounded-2xl border shadow-xl relative overflow-hidden flex flex-col justify-between h-full min-h-[240px] group"
                   >
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_60%)] pointer-events-none" />
                     
                     <div className="flex justify-between items-start z-10 mb-6">
                       <div>
                         <p style={{ color: customText, opacity: 0.6 }} className="text-[10px] font-semibold tracking-widest uppercase">Bank Transfer</p>
                         <h3 className="font-heading text-2xl mt-1 tracking-wide">{method.bank}</h3>
                       </div>
                       <Icon icon="ph:bank-fill" style={{ color: customText, opacity: 0.8 }} className="text-3xl" />
                     </div>

                     <div className="z-10 mb-8">
                       <div className="flex items-center gap-3 mb-4">
                         <Icon icon="ph:cpu-fill" style={{ color: customText, opacity: 0.7 }} className="text-3xl" />
                         <Icon icon="ph:broadcast" style={{ color: customText, opacity: 0.4 }} className="text-xl rotate-90" />
                       </div>
                       <p className="text-2xl font-mono tracking-wider font-semibold selection:bg-accent/20">
                          {method.number?.replace(/(\d{4})(?=\d)/g, "$1  ")}
                       </p>
                     </div>

                     <div style={{ borderColor: `${customText}10` }} className="flex justify-between items-end z-10 mt-auto pt-4 border-t">
                       <div>
                         <p style={{ color: customText, opacity: 0.4 }} className="text-[8px] uppercase tracking-widest">Card Holder</p>
                         <p className="text-sm font-sans tracking-wide uppercase font-semibold">{method.holder}</p>
                       </div>
                       
                       <button
                         onClick={() => handleCopy(method.number || "", index)}
                         style={isCopied ? {} : { borderColor: `${customText}35`, color: customText, backgroundColor: `${customText}08` }}
                         className={cn(
                           "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer",
                           isCopied && "bg-emerald-600 border-emerald-600 text-white"
                         )}
                       >
                         <Icon icon={isCopied ? "ph:check-bold" : "ph:copy-bold"} />
                         <span>{isCopied ? "Copied!" : "Salin"}</span>
                       </button>
                     </div>
                   </div>
                 ) : method.type === "qris" ? (
                   /* QRIS Card */
                   <div 
                     style={{ backgroundColor: customBg, color: customText, borderColor: `${customText}15` }}
                     className="p-8 rounded-2xl border shadow-xl relative overflow-hidden flex flex-col items-center justify-between text-center h-full min-h-[340px]"
                   >
                     <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Icon icon="ph:qr-code-light" style={{ color: customText }} className="text-6xl" />
                     </div>

                     <div className="w-full text-center mb-4">
                       <p style={{ color: customText, opacity: 0.6 }} className="text-[10px] font-semibold tracking-widest uppercase mb-1">Scan QR Code</p>
                       <h3 className="font-heading text-2xl mb-1">{method.bank || "QRIS"}</h3>
                     </div>

                     <div className="my-4 relative">
                       <div style={{ borderColor: customText }} className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 opacity-60" />
                       <div style={{ borderColor: customText }} className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 opacity-60" />
                       <div style={{ borderColor: customText }} className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 opacity-60" />
                       <div style={{ borderColor: customText }} className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 opacity-60" />
                       
                       {method.image ? (
                         <div className="w-44 h-44 bg-white p-2 rounded-lg shadow-sm overflow-hidden flex items-center justify-center">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img src={method.image} alt="QRIS" className="w-full h-full object-contain" />
                         </div>
                       ) : (
                         <div className="w-44 h-44 bg-muted flex items-center justify-center text-muted-foreground text-xs text-center p-4 rounded-lg">
                           QR Code Not Available
                         </div>
                       )}
                     </div>

                     <div style={{ borderColor: `${customText}10` }} className="w-full mt-4 pt-4 border-t">
                       <p style={{ color: customText, opacity: 0.4 }} className="text-[8px] uppercase tracking-widest">Account Name</p>
                       <p className="text-sm font-semibold uppercase tracking-wide">{method.holder}</p>
                     </div>
                   </div>
                 ) : (
                   /* Shipping Address Card */
                   <div 
                     style={{ backgroundColor: customBg, color: customText, borderColor: `${customText}15` }}
                     className="p-8 rounded-2xl border shadow-xl relative overflow-hidden flex flex-col justify-between h-full min-h-[240px]"
                   >
                     <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Icon icon="ph:map-pin-line" style={{ color: customText }} className="text-6xl" />
                     </div>

                     <div className="mb-4">
                       <p style={{ color: customText, opacity: 0.6 }} className="text-[10px] font-semibold tracking-widest uppercase">Kirim Kado / Hadiah</p>
                       <h3 className="font-heading text-2xl mt-1">Alamat Pengiriman</h3>
                     </div>

                     <div className="mb-6">
                       <p style={{ color: customText, opacity: 0.8 }} className="text-sm font-serif leading-relaxed italic">
                         {method.address}
                       </p>
                     </div>

                     <div style={{ borderColor: `${customText}10` }} className="flex justify-between items-end mt-auto pt-4 border-t">
                       <div>
                         <p style={{ color: customText, opacity: 0.4 }} className="text-[8px] uppercase tracking-widest">Penerima</p>
                         <p className="text-sm font-semibold uppercase tracking-wide">{method.name}</p>
                       </div>

                       <button
                         onClick={() => handleCopy(method.address || "", index)}
                         style={isCopied ? {} : { borderColor: `${customText}35`, color: customText, backgroundColor: `${customText}08` }}
                         className={cn(
                           "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer",
                           isCopied && "bg-emerald-600 border-emerald-600 text-white"
                         )}
                       >
                         <Icon icon={isCopied ? "ph:check-bold" : "ph:copy-bold"} />
                         <span>{isCopied ? "Copied!" : "Salin"}</span>
                       </button>
                     </div>
                   </div>
                 )}
               </motion.div>
             );
          })}
        </div>
      </div>
    </section>
  );
}
