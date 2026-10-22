import { motion } from "framer-motion";
import { ArrowUp, CalendarDays, ExternalLink, MapPin, Phone } from "lucide-react";
import { wedding } from "../data/wedding";
import { MonogramCrest } from "./Ornaments";
import { lenisRef } from "../lib/smooth";

const DEVELOPER = {
  name: "Hariharasudhan",
  portfolio: "https://hariharasudhan-portfolio-iota.vercel.app/",
  phone: "7010458527",
};

export default function Footer({ className = "" }: { className?: string }) {
  const scrollTop = () => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 1.8 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={`relative overflow-hidden border-t border-gold-500/20 bg-[#170309] ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/70 to-transparent" />
      {/* நீர்க்குறி வளைவு */}
      <svg
        viewBox="0 0 300 620"
        className="pointer-events-none absolute -left-24 bottom-0 hidden h-[80%] opacity-[0.07] lg:block"
        aria-hidden="true"
      >
        <path d="M40 620 V210 Q40 60 150 60 Q260 60 260 210 V620" fill="none" stroke="#e9cd7f" strokeWidth="1.4" />
      </svg>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center md:px-8 md:py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 -m-8 rounded-full bg-gold-400/12 blur-3xl" />
          <MonogramCrest size={116} className="relative drop-shadow-[0_0_20px_rgba(201,162,39,0.4)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-8"
        >
          <div className="flex flex-col items-center gap-2 md:flex-row md:gap-5">
            <span className="gold-text font-display text-3xl font-semibold md:text-[2.6rem]">{wedding.groom.name}</span>
            <span className="hidden h-8 w-px bg-gold-500/40 md:block" />
            <span className="h-px w-10 bg-gold-500/40 md:hidden" />
            <span className="gold-text font-display text-3xl font-semibold md:text-[2.6rem]">{wedding.bride.name}</span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-6 max-w-xl leading-loose text-cream-200/80"
        >
          {wedding.footer.thanks}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 flex w-full max-w-xl flex-col gap-4 border-y border-gold-500/20 py-6 sm:flex-row sm:gap-0"
        >
          <div className="flex flex-1 items-start justify-center gap-3">
            <CalendarDays size={17} className="mt-1 text-gold-300" />
            <div className="text-left">
              <p className="text-[10px] tracking-[0.32em] text-cream-300/55">நிச்சயதார்த்த நாள்</p>
              <p className="mt-1 font-display font-semibold text-gold-100">{wedding.engagement.day}</p>
            </div>
          </div>
          <div className="hidden w-px bg-gold-500/20 sm:block" />
          <div className="flex flex-1 items-start justify-center gap-3">
            <MapPin size={17} className="mt-1 text-gold-300" />
            <div className="text-left">
              <p className="text-[10px] tracking-[0.32em] text-cream-300/55">நிச்சயதார்த்த இடம்</p>
              <p className="mt-1 font-display font-semibold text-gold-100">{wedding.engagement.venue}</p>
              <p className="text-xs text-cream-300/70">{wedding.city}</p>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-8 font-display text-lg italic text-gold-200 md:text-xl"
        >
          “{wedding.footer.motto}”
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          onClick={scrollTop}
          aria-label="மேலே செல்லவும்"
          className="group mt-10 flex flex-col items-center gap-2.5"
        >
          <span className="flex h-12 w-12 items-center justify-center border border-gold-400/60 bg-gradient-to-b from-maroon-700 to-maroon-900 text-gold-200 shadow-[0_12px_30px_-12px_rgba(201,162,39,0.7)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-gold-300">
            <ArrowUp size={19} />
          </span>
          <span className="text-[11px] font-medium tracking-[0.3em] text-gold-300/90 transition-colors group-hover:text-gold-200">
            மேலே செல்லவும்
          </span>
        </motion.button>

        <div className="mt-14 flex w-full flex-col items-center gap-2 border-t border-gold-500/15 pt-6 text-[11px] tracking-[0.22em] text-cream-300/45 sm:flex-row sm:justify-between">
          <span>அன்புடன், இரு குடும்பத்தினர்</span>
          <span>{wedding.city} • 2026</span>
        </div>

        {/* Developer credit */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-10 flex w-full flex-col items-center gap-3 border-t border-dashed border-gold-500/20 pt-8"
        >
          <p className="text-[10px] font-semibold tracking-[0.4em] text-gold-400/80">
            WEBSITE CRAFTED &amp; DEVELOPED BY
          </p>
          <p className="font-display text-xl font-semibold text-gold-100">{DEVELOPER.name}</p>
          <p className="max-w-md text-xs leading-relaxed text-cream-300/60">
            Designed with creativity, elegance, and love to celebrate this beautiful beginning.
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={DEVELOPER.portfolio}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-gold-500/50 bg-gold-500/10 px-5 py-2.5 text-[11px] font-semibold tracking-[0.2em] text-gold-100 transition-colors duration-300 hover:border-gold-300 hover:bg-gold-500/20"
            >
              <ExternalLink size={14} />
              VIEW PORTFOLIO
            </a>
            <a
              href={`tel:+91${DEVELOPER.phone}`}
              className="inline-flex items-center gap-2 border border-gold-500/50 px-5 py-2.5 text-[11px] font-semibold tracking-[0.2em] text-gold-100 transition-colors duration-300 hover:border-gold-300 hover:bg-gold-500/10"
            >
              <Phone size={14} />
              CALL DEVELOPER
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}