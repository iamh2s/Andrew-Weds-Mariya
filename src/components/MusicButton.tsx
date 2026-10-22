import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { musicEngine } from "../audio/musicEngine";

export default function MusicButton({ visible }: { visible: boolean }) {
  const [playing, setPlaying] = useState(musicEngine.isPlaying());

  useEffect(() => musicEngine.subscribe(setPlaying), []);

  return (
    <motion.button
      initial={{ opacity: 0, y: -14, scale: 0.92 }}
      animate={visible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -14, scale: 0.92 }}
      transition={{ duration: 0.5, delay: visible ? 1.2 : 0, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => void musicEngine.toggle()}
      aria-label={playing ? "இசையை நிறுத்தவும்" : "இசையை இயக்கவும்"}
      className={`fixed right-4 top-4 z-[52] flex items-center gap-2.5 rounded-full border border-gold-500/45 bg-[#170309]/92 py-2.5 pl-3 pr-4 text-[11px] font-medium tracking-[0.18em] text-gold-100 shadow-[0_16px_40px_-14px_rgba(0,0,0,0.95)] backdrop-blur-md transition-all duration-300 hover:border-gold-300 hover:bg-[#170309]/99 md:right-5 md:top-5 ${
        visible ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-gold-200 to-gold-500 text-maroon-950">
        {playing ? <Volume2 size={15} /> : <VolumeX size={15} />}
      </span>
      <span className="hidden sm:inline whitespace-nowrap">
        {playing ? "இசை நிறுத்து" : "இசை இயக்கு"}
      </span>
      {playing && (
        <span className="flex items-end gap-[2.5px]" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-[2.5px] rounded-full bg-gold-300"
              animate={{ height: [4, 11, 4] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
            />
          ))}
        </span>
      )}
    </motion.button>
  );
}
