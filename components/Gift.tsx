"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GiftProps {
  data: {
    paymentMethods: {
      bank?: string;
      number?: string;
      holder?: string;
      name?: string;
      address?: string;
      type: "bank" | "address";
    }[];
  };
}

export default function Gift({ data }: GiftProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="py-24 px-6 bg-background">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 space-y-4"
        >
            <h2 className="font-heading text-4xl md:text-5xl text-primary">Wedding Gift</h2>
            <p className="text-muted-foreground font-serif italic max-w-lg mx-auto">
                Doa restu Anda merupakan karunia yang sangat berarti bagi kami. 
                Namun jika memberi adalah ungkapan tanda kasih Anda, kami ucapkan terima kasih.
            </p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-center gap-6">
            {data.paymentMethods.filter((p:any) => p.enabled !== false).map((method, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative p-8 rounded-2xl border border-border bg-white shadow-xl hover:shadow-2xl transition-shadow w-full md:w-96 text-left"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Icon icon={method.type === 'bank' ? "ph:bank-light" : "ph:house-line-light"} className="text-6xl" />
                    </div>

                    <div className="mb-8">
                        <h3 className="font-heading text-2xl mb-1">{method.type === 'bank' ? method.bank : method.name}</h3>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider">
                            {method.type === 'bank' ? 'Bank Transfer' : 'Gift Address'}
                        </p>
                    </div>

                    <div className="space-y-1 mb-6">
                        {method.type === 'bank' ? (
                            <>
                                <p className="text-2xl font-mono tracking-wide text-foreground">{method.number}</p>
                                <p className="text-sm text-muted-foreground">a.n. {method.holder}</p>
                            </>
                        ) : (
                            <>
                                <p className="text-lg font-serif italic text-foreground leading-relaxed">
                                    {method.address}
                                </p>
                            </>
                        )}
                    </div>

                    <Button 
                        variant="outline" 
                        className="w-full rounded-full gap-2 border-primary/20 hover:bg-primary/5 group"
                        onClick={() => handleCopy(method.type === 'bank' ? method.number! : method.address!, index)}
                    >
                        <Icon 
                            icon={copiedIndex === index ? "ph:check-light" : "ph:copy-light"} 
                            className={`text-lg transition-all ${copiedIndex === index ? 'text-green-600' : ''}`} 
                        />
                        {copiedIndex === index ? "Copied!" : (method.type === 'bank' ? "Copy Number" : "Copy Address")}
                    </Button>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
