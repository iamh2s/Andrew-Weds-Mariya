import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { Quote } from "lucide-react";
import { wedding } from "../data/wedding";
import { SectionHeading, ArchFrame, GoldCross } from "./Ornaments";

const ease = [0.22, 1, 0.36, 1] as const;
const VIEW = { once: true, amount: 0.15 } as const;

/* Tracks a CSS media query. Starts with the correct value on first render. */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/* Variants for two levels: "full" on desktop, "lite" on mobile and tablets.
   Lite uses only opacity and transform, which the GPU handles cheaply. */
function buildVariants(full: boolean) {
  const dur = full ? 0.9 : 0.6;

  const intro: Variants = {
    hidden: { opacity: 0, y: full ? 28 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: dur, ease } },
  };

  const chapter = (fromLeft: boolean): Variants => ({
    hidden: { opacity: 0, x: full ? (fromLeft ? -48 : 48) : 0, y: full ? 0 : 22 },
    show: { opacity: 1, x: 0, y: 0, transition: { duration: dur, ease } },
  });

  const textBlock: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: full ? 0.08 : 0.05,
        delayChildren: full ? 0.2 : 0.1,
      },
    },
  };

  const textItem: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  };

  const numeral: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 1, ease, delay: 0.1 } },
  };

  const marker: Variants = {
    hidden: { scale: 0 },
    show: {
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 16, delay: 0.15 },
    },
  };

  const ring: Variants = {
    hidden: { opacity: 0, scale: 1 },
    show: {
      opacity: [0, 0.7, 0],
      scale: [1, 2.4, 2.4],
      transition: { duration: 1.2, delay: 0.4, ease: "easeOut" },
    },
  };

  const photo: Variants = {
    hidden: { opacity: 0, y: 28, scale: 1.04, rotate: -4 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: -1.8,
      transition: { duration: 1, ease },
    },
  };

  const quote: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1, ease } },
  };

  const quoteIcon: Variants = {
    hidden: { scale: 0, rotate: -60 },
    show: {
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 240, damping: 16, delay: 0.1 },
    },
  };

  const quoteWords: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.04, delayChildren: 0.25 } },
  };

  const quoteWord: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
  };

  const fade: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const rule: Variants = {
    hidden: { scaleX: 0 },
    show: { scaleX: 1, transition: { duration: 1, ease, delay: 0.15 } },
  };

  const cross: Variants = {
    hidden: { opacity: 0, scale: 0, rotate: -120 },
    show: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 120, damping: 14, delay: 0.3 },
    },
  };

  return { intro, chapter, textBlock, textItem, numeral, marker, ring, photo, quote, quoteIcon, quoteWords, quoteWord, fade, rule, cross };
}

export default function Journey() {
  const reduce = useReducedMotion();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const full = desktop && !reduce;

  const v = useMemo(() => buildVariants(full), [full]);
  const init = reduce ? "show" : "hidden";

  const steps = wedding.journey.steps;
  const words = wedding.journey.familyMessage.split(" ");

  /* Timeline: the gold line fills and a bead travels with the scroll.
     The bead moves with transform (not top), so it doesn't trigger layout. */
  const timelineRef = useRef<HTMLDivElement>(null);
  const [trackH, setTrackH] = useState(0);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setTrackH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.8", "end 0.7"],
  });
  const beadY = useTransform(timelineProgress, (p) => p * trackH);

  /* Photo parallax: desktop only, to avoid extra scroll work on phones */
  const photoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: photoProgress } = useScroll({
    target: photoRef,
    offset: ["start end", "end start"],
  });
  const photoY = useTransform(photoProgress, [0, 1], [-18, 18]);

  return (
    <section id="payanam" className="paper relative overflow-hidden py-20 md:py-28 lg:py-32">
      {/* Ambient glow: desktop only, and static on phones */}
      {full && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute left-1/2 top-1/3 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(226,185,80,.18),transparent_65%)]"
        />
      )}

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading num="02" overline="இறைவன் எழுதிய காதல் கதை" title="அன்பின் அழகிய பயணம்" tone="light" />

        {/* அறிமுகம் */}
        <motion.p
          initial={init}
          whileInView="show"
          viewport={VIEW}
          variants={v.intro}
          className="mx-auto mt-8 max-w-2xl px-1 text-center leading-relaxed text-maroon-800/90 md:mt-10 md:leading-loose"
        >
          {wedding.journey.intro}
        </motion.p>

        <div className="mt-12 grid items-start gap-12 md:mt-16 lg:grid-cols-12 lg:gap-10">
          {/* டைம்லைன் */}
          <div ref={timelineRef} className="relative lg:col-span-7">
            <div
              aria-hidden
              className="absolute bottom-6 left-[13px] top-2 w-px bg-gold-600/15 md:left-1/2"
            />
            <motion.div
              aria-hidden
              style={{ scaleY: timelineProgress }}
              className="absolute bottom-6 left-[13px] top-2 w-px origin-top bg-gradient-to-b from-gold-300 via-gold-600 to-gold-600/40 md:left-1/2"
            />
            <motion.div
              aria-hidden
              style={{ y: beadY }}
              className="absolute top-0 z-10 -ml-[5px] -mt-[5px] h-2.5 w-2.5 rounded-full bg-gold-200 shadow-[0_0_10px_3px_rgba(226,185,80,.55)] left-[13px] md:left-1/2"
            />

            {steps.map((s, i) => {
              const left = i % 2 === 0;
              return (
                <motion.div
                  key={s.title}
                  initial={init}
                  whileInView="show"
                  viewport={VIEW}
                  variants={v.chapter(left)}
                  className={`relative mb-9 pl-12 md:mb-14 md:w-1/2 md:pl-0 ${
                    left ? "md:pr-14 md:text-right" : "md:ml-auto md:pl-14"
                  }`}
                >
                  {/* Outlined numeral: desktop only */}
                  {full && (
                    <motion.span
                      aria-hidden
                      variants={v.numeral}
                      className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[5.5rem] font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgba(132,100,26,.22)] md:-top-8"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </motion.span>
                  )}

                  {/* மையக் குறி */}
                  <motion.span
                    variants={v.marker}
                    className={`absolute top-2 flex h-7 w-7 items-center justify-center ${
                      left ? "left-0 md:left-auto md:-right-3.5" : "left-0 md:-left-3.5"
                    }`}
                  >
                    <motion.span
                      aria-hidden
                      variants={v.ring}
                      className="absolute inset-0 rounded-full border border-gold-500/70"
                    />
                    <span className="absolute inset-0 rotate-45 border border-gold-600/60 bg-cream-50" />
                    <span className="relative h-1.5 w-1.5 rotate-45 bg-gold-600" />
                  </motion.span>

                  <motion.div variants={v.textBlock} className="relative">
                    <motion.p variants={v.textItem} className="text-[10px] font-semibold tracking-[0.4em] text-gold-700">
                      அத்தியாயம் {String(i + 1).padStart(2, "0")}
                    </motion.p>
                    <motion.h3
                      variants={v.textItem}
                      className="mt-1.5 font-display text-2xl font-semibold text-maroon-900 md:text-[1.7rem]"
                    >
                      {s.title}
                    </motion.h3>
                    <motion.p variants={v.textItem} className="mt-2 leading-relaxed text-maroon-800/85">
                      {s.text}
                    </motion.p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* புகைப்படங்கள் + குடும்பச் செய்தி */}
          <div className="lg:col-span-5">
            <div ref={photoRef} className="mx-auto w-[82%] max-w-[420px]">
              <motion.div
                initial={init}
                whileInView="show"
                viewport={VIEW}
                variants={v.photo}
                className="overflow-hidden"
              >
                <motion.div style={full ? { y: photoY } : undefined} className={full ? "scale-[1.1]" : ""}>
                  <ArchFrame
                    src={wedding.journeyImage}
                    alt="நிச்சயதார்த்த ஜோடியின் இனிய தருணம்"
                    imgClassName="aspect-[3/3.6]"
                  />
                </motion.div>
              </motion.div>
            </div>

            <motion.blockquote
  initial={init}
  whileInView="show"
  viewport={VIEW}
  variants={v.quote}
  className="relative mt-10 border border-gold-600/35 bg-cream-50/80 p-6 shadow-[0_18px_40px_-24px_rgba(132,100,26,0.6)] md:mt-12 md:p-9"
>
              <motion.span
                aria-hidden
                variants={v.rule}
                className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-gold-600 via-gold-300 to-transparent"
              />

              <motion.span aria-hidden variants={v.quoteIcon} className="absolute -top-3.5 left-6 block md:left-7">
                <Quote size={26} className="border border-gold-500/50 bg-maroon-800 p-1.5 text-gold-200" />
              </motion.span>

              {full ? (
                <motion.p
                  variants={v.quoteWords}
                  className="font-display text-lg italic leading-loose text-maroon-900"
                >
                  <span>“</span>
                  {words.map((w, idx) => (
                    <motion.span key={idx} variants={v.quoteWord} className="mr-[0.3em] inline-block">
                      {w}
                    </motion.span>
                  ))}
                  <span>”</span>
                </motion.p>
              ) : (
                <motion.p variants={v.fade} className="font-display text-base italic leading-loose text-maroon-900 md:text-lg">
                  “{wedding.journey.familyMessage}”
                </motion.p>
              )}

              <motion.footer variants={v.fade} className="mt-4 flex items-center gap-3">
                <span className="h-px w-10 bg-gold-600/60" />
                <cite className="text-sm not-italic text-maroon-700/90">{wedding.journey.familySign}</cite>
              </motion.footer>
            </motion.blockquote>

            <motion.div
              initial={init}
              whileInView="show"
              viewport={VIEW}
              variants={v.fade}
              className="mt-8 flex items-center justify-center gap-4 md:mt-10"
            >
              <motion.span
                variants={v.rule}
                className="h-px w-14 origin-right bg-gradient-to-r from-transparent to-gold-600/60 md:w-16"
              />
              <motion.div variants={v.cross}>
                <GoldCross size={32} />
              </motion.div>
              <motion.span
                variants={v.rule}
                className="h-px w-14 origin-left bg-gradient-to-l from-transparent to-gold-600/60 md:w-16"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}