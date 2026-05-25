"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import FloralOrnament from "@/components/FloralOrnament";
import OrbitingCircles from "./OrbitingCircles";

interface CoupleProps {
  data: {
    mempelai: {
      pria: {
        namaLengkap: string;
        putraDari: string;
        fotoUrl: string;
        putraKe?: string;
        asal?: string;
      };
      wanita: {
        namaLengkap: string;
        putriDari: string;
        fotoUrl: string;
        putriKe?: string;
        asal?: string;
      };
    };
  };
}

export default function Couple({ data }: CoupleProps) {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="container mx-auto max-w-5xl">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
        >
            {/* <h2 className="font-heading text-4xl md:text-5xl text-primary">The Happy Couple</h2> */}
            <img src="/assets/bismillah.png" className="w-70 md:w-120 mx-auto" alt="Title" />
            <div className="w-16 h-px bg-accent mx-auto" />
            <p className="text-muted-foreground italic font-serif">
                Assalamu'alaikum Warahmatullahi Wabarakatuh,
                <br />
                Dengan segenap cinta dan kebahagiaan, serta memohon rahmat dan ridho Allah Subhanahu wa Ta’ala, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan menjadi bagian dari hari istimewa kami.
            </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 relative">
             {/* Bride */}
             <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center space-y-6"
            >


                <div className="relative w-64 h-80 flex items-center justify-center mb-12">
                   <FloralOrnament 
                        position="bottom-left" 
                        className="-bottom-6 md:-bottom-12 -left-6 md:-left-12 w-48 h-48 opacity-30 rotate-[-15deg] z-20"
                        delay={0.5}
                   />
                    {/* Orbiting Circles Foreground */}
                    <div className="absolute inset-0 z-30 pointer-events-none hidden md:block">
                         <OrbitingCircles radius={190} duration={20} delay={0}>
                            <Icon icon="ph:heart-fill" className="text-3xl text-rose-400" />
                         </OrbitingCircles>
                         <OrbitingCircles radius={190} duration={20} delay={10} reverse>
                            <Icon icon="ph:heart-duotone" className="text-2xl text-pink-300" />
                         </OrbitingCircles>
                    </div>

                    <div className="relative z-10 w-64 h-80 rounded-full overflow-hidden border border-border shadow-xl bg-background">
                        {data.mempelai.wanita.fotoUrl ? (
                             <img 
                                src={data.mempelai.wanita.fotoUrl} 
                                alt={data.mempelai.wanita.namaLengkap} 
                                className="w-full h-full object-cover"
                             />
                        ) : (
                            <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground italic">
                                 {/* Placeholder */}
                                 Bride Photo
                            </div>
                        )}
                    </div>
                </div>


                <div className="space-y-2">
                    <h3 className="font-heading text-3xl md:text-4xl">{data.mempelai.wanita.namaLengkap}</h3>
                    <p className="text-sm uppercase tracking-wider text-muted-foreground">The Bride</p>
                    <div className="h-px w-8 bg-accent mx-auto my-2" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {data.mempelai.wanita.putriKe ? `${data.mempelai.wanita.putriKe} dari` : "Putri dari"} {data.mempelai.wanita.putriDari}
                    </p>
                    {data.mempelai.wanita.asal && (
                        <p className="text-xs tracking-wider text-muted-foreground uppercase flex items-center justify-center gap-1 mt-1 font-sans">
                            <Icon icon="ph:map-pin" className="text-accent text-sm" />
                            {data.mempelai.wanita.asal}
                        </p>
                    )}
                </div>
            </motion.div>

             {/* Groom */}
            <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center space-y-6 md:mt-24" // Offset for layout interest
            >
                <div className="relative w-64 h-80 flex items-center justify-center mb-12">
                    <FloralOrnament 
                        position="top-right" 
                        className="-top-6 md:-top-12 -right-6 md:-right-12 w-48 h-48 opacity-30 rotate-[15deg] z-20"
                        delay={1.5}
                   />
                    {/* Orbiting Circles Foreground */}
                    <div className="absolute inset-0 z-30 pointer-events-none hidden md:block">
                         <OrbitingCircles radius={190} duration={25} delay={5}>
                            <Icon icon="ph:heart-fill" className="text-3xl text-blue-400" />
                         </OrbitingCircles>
                         <OrbitingCircles radius={190} duration={25} delay={15} reverse>
                            <Icon icon="ph:heart-duotone" className="text-2xl text-sky-300" />
                         </OrbitingCircles>
                    </div>

                    <div className="relative z-10 w-64 h-80 rounded-full overflow-hidden border border-border shadow-xl bg-background">
                        {data.mempelai.pria.fotoUrl ? (
                             <img 
                                src={data.mempelai.pria.fotoUrl} 
                                alt={data.mempelai.pria.namaLengkap} 
                                className="w-full h-full object-cover"
                             />
                        ) : (
                            <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground italic">
                                Groom Photo
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="font-heading text-3xl md:text-4xl">{data.mempelai.pria.namaLengkap}</h3>
                    <p className="text-sm uppercase tracking-wider text-muted-foreground">The Groom</p>
                    <div className="h-px w-8 bg-accent mx-auto my-2" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {data.mempelai.pria.putraKe ? `${data.mempelai.pria.putraKe} dari` : "Putra dari"} {data.mempelai.pria.putraDari}
                    </p>
                    {data.mempelai.pria.asal && (
                        <p className="text-xs tracking-wider text-muted-foreground uppercase flex items-center justify-center gap-1 mt-1 font-sans">
                            <Icon icon="ph:map-pin" className="text-accent text-sm" />
                            {data.mempelai.pria.asal}
                        </p>
                    )}
                </div>
            </motion.div>

            {/* Ampersand in Middle (Hidden on mobile maybe, or absolute center) */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center w-20 h-20 bg-background rounded-full border border-border z-10">
                <span className="font-script text-4xl text-accent">&</span>
            </div>
        </div>
      </div>
    </section>
  );
}
