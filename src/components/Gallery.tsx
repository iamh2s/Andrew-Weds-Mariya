import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import { wedding } from "../data/wedding";
import { SectionHeading, Tick } from "./Ornaments";
import PolaroidLineCarousel, { type Slide } from "./ui/polaroid-line-carousel";

/* ஒவ்வொரு அச்சின் கீழும் கையெழுத்துக் குறிப்புப் போலத் துணை விளக்கங்கள் */
const NOTES = [
  "தேவாலய ஒளியில் இணைந்த இரு இதயங்கள்",
  "வெள்ளை ரோஜாக்களுக்கிடையே பொன் மோதிரங்கள்",
  "மெழுகுவர்த்திகள் நிறைந்த புனித வழி",
  "ஒரே வாக்குறுதி, என்றென்றும் இணைவு",
  "அன்பின் தூய்மையே நிலையானது",
  "மாலை வெண்மையிலும் தங்க ஒளிர்வு",
];

export default function Gallery() {
  const reduce = useReducedMotion();

  const slides: Slide[] = useMemo(
    () =>
      wedding.gallery.map((g, i) => ({
        image: g.src,
        title: g.caption,
        caption: NOTES[i % NOTES.length],
        alt: g.caption,
      })),
    []
  );

  return (
    <section
      id="padangal"
      className="paper relative overflow-hidden py-16 sm:py-24 md:py-28"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <SectionHeading
          num="04"
          overline="கயிற்றில் தொங்கும் தருணங்கள்"
          title="இனிய நினைவுகள்"
          tone="light"
        />

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: reduce ? 0 : 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-10 sm:mt-14"
        >
          <div className="relative border border-gold-600/35 bg-[linear-gradient(175deg,#f9f3e2,#f1e4c6_55%,#ecd9ae)] shadow-[0_30px_60px_-30px_rgba(60,15,22,.6)] sm:shadow-[0_45px_95px_-38px_rgba(60,15,22,.6)]">
            <Tick className="absolute left-1.5 top-1.5 z-10 text-gold-700/70 sm:left-2 sm:top-2" />
            <Tick className="absolute right-1.5 top-1.5 z-10 text-gold-700/70 sm:right-2 sm:top-2" />
            <Tick className="absolute bottom-1.5 left-1.5 z-10 text-gold-700/70 sm:bottom-2 sm:left-2" />
            <Tick className="absolute bottom-1.5 right-1.5 z-10 text-gold-700/70 sm:bottom-2 sm:right-2" />
            <div className="pointer-events-none absolute inset-1.5 z-10 border border-gold-600/20 sm:inset-2" />

            <PolaroidLineCarousel
              slides={slides}
              height="clamp(420px, 80svh, 700px)"
              cardWidth={300}
              sag={46}
              swing={1}
              ink="#33090f"
              string="#a8811f"
              background="linear-gradient(180deg,transparent 0%,rgba(132,100,26,0.07) 100%)"
              autoplay={reduce ? 0 : 4600}
              ariaLabel="இனிய நினைவுகள் — புகைப்படச் சரம்"
            />
          </div>
        </motion.div>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduce ? 0 : 0.9, delay: 0.25 }}
          className="mt-5 flex items-center justify-center gap-2 text-center text-[10px] font-medium tracking-[0.2em] text-maroon-700/70 sm:mt-7 sm:gap-3 sm:text-[11px] sm:tracking-[0.3em]"
        >
          <MoveHorizontal size={15} className="shrink-0 text-gold-700" />
          <span>சரத்தை இழுத்துப் பார்க்கவும்</span>
        </motion.p>
      </div>
    </section>
  );
}