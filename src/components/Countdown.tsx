import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wedding } from "../data/wedding";
import { SectionHeading, Tick } from "./Ornaments";

interface Left {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function compute(target: number): Left {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: diff <= 0,
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-3 md:gap-4">
      <div className="relative h-[1.05em] overflow-hidden font-display text-[2.6rem] font-bold leading-none sm:text-6xl md:text-7xl lg:text-[5.4rem]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            initial={{ y: "60%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-60%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="gold-text tabular block"
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="h-px w-9 bg-gold-500/45 md:w-12" />
      <p className="text-[10px] font-medium tracking-[0.32em] text-gold-200/85 md:text-xs">{label}</p>
    </div>
  );
}

function Dot() {
  return (
    <motion.span
      animate={{ opacity: [0.35, 1, 0.35], scale: [0.8, 1.15, 0.8] }}
      transition={{ duration: 1.6, repeat: Infinity }}
      className="mb-8 hidden h-1.5 w-1.5 rotate-45 bg-gold-300 sm:block md:mb-10"
      aria-hidden
    />
  );
}

export default function Countdown() {
  const target = useMemo(() => new Date(wedding.engagement.iso).getTime(), []);
  const [left, setLeft] = useState<Left>(() => compute(target));

  useEffect(() => {
    const id = window.setInterval(() => setLeft(compute(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return (
    <section id="countdown" className="velvet relative overflow-hidden py-24 md:py-28">
      {/* நீர்க்குறித் தங்க எழுத்து */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[26vw] font-bold text-gold-500/[0.04]"
      >
        13
      </div>

      <div className="relative mx-auto max-w-5xl px-5 md:px-8">
        <SectionHeading num="03" overline="பொன்னான தருணம் நெருங்குகிறது" title="நிச்சயதார்த்த நாளை நோக்கி" tone="dark" />

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="relative mt-14 border border-gold-500/25 bg-maroon-900/35 px-5 py-10 backdrop-blur-sm md:px-10 md:py-14"
        >
          {/* மூலைக் குறிகள் */}
          <Tick className="absolute left-2.5 top-2.5 text-gold-400/70" />
          <Tick className="absolute right-2.5 top-2.5 text-gold-400/70" />
          <Tick className="absolute bottom-2.5 left-2.5 text-gold-400/70" />
          <Tick className="absolute bottom-2.5 right-2.5 text-gold-400/70" />
          <div className="pointer-events-none absolute inset-2 border border-gold-500/15" />

          <div className="flex items-start justify-center gap-4 sm:gap-8 md:gap-12">
            <Unit value={left.days} label="நாட்கள்" />
            <Dot />
            <Unit value={left.hours} label="மணிநேரம்" />
            <Dot />
            <Unit value={left.minutes} label="நிமிடங்கள்" />
            <Dot />
            <Unit value={left.seconds} label="விநாடிகள்" />
          </div>

          <div className="mx-auto mt-10 max-w-md border-t border-gold-500/20 pt-6 text-center">
            <p className="font-display text-lg text-gold-100 md:text-xl">
              {wedding.engagement.day} • {wedding.engagement.time}
            </p>
            <p className="mt-1 text-sm text-cream-300/75">{wedding.engagement.venue}, {wedding.city}</p>
          </div>

          {left.done && (
            <p className="mt-6 text-center font-display text-lg italic text-gold-200">
              இறையருளால் விழா மகிழ்ச்சியுடன் நடைபெற்றது — உங்கள் ஆசீர்வாதத்திற்கு நன்றி
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
