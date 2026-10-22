import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { wedding } from "../data/wedding";
import { MonogramCrest } from "./Ornaments";
import { RevealText, Magnetic } from "./fx";

export default function Interlude() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], [-70, 70]);
  const yFg = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} className="relative flex min-h-[62vh] items-center justify-center overflow-hidden border-y border-gold-500/25">
      {/* பராலாக்ஸ் பின்னணி */}
      <motion.div
        className="absolute -inset-y-20 inset-x-0 bg-cover bg-center"
        style={{ y: yBg, backgroundImage: "url(/images/gallery-3.jpg)" }}
      />
      <div className="absolute inset-0 bg-[#1c040a]/72" />
      <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_50%_50%,rgba(201,162,39,0.14),transparent_70%)]" />

      <motion.div style={{ y: yFg }} className="relative z-10 flex flex-col items-center px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="rounded-full border border-gold-500/40 bg-[#1c040a]/85 p-2 shadow-2xl backdrop-blur"
        >
          <MonogramCrest size={82} />
        </motion.div>

        <p className="mt-7 text-[10px] font-medium tracking-[0.5em] text-gold-300/90 md:text-xs">
          எங்கள் பொன்னான நாள்
        </p>

        <h2 className="gold-text-shine mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl">
          <RevealText text={wedding.engagement.day} stagger={0.08} />
        </h2>

        <p className="mt-3 font-display text-base italic text-cream-100/85 md:text-lg">
          {wedding.engagement.time} • {wedding.engagement.venue}
        </p>

        <div className="mt-8">
          <Magnetic strength={16}>
            <a
              href="#countdown"
              className="inline-block border border-gold-300/70 bg-gold-500/10 px-9 py-3.5 text-[13px] font-semibold tracking-[0.25em] text-gold-100 backdrop-blur-sm transition-all duration-300 hover:border-gold-200 hover:bg-gold-500/20"
            >
              கவுண்ட்டவுனைப் பார்க்கவும்
            </a>
          </Magnetic>
        </div>
      </motion.div>
    </section>
  );
}
