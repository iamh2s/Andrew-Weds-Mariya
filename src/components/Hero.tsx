
import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { wedding } from "../data/wedding";
import { GoldCross, Flourish, Corner, MonogramCrest } from "./Ornaments";
import LycorisSpecimen from "@/components/ui/lycoris-specimen";

const NAMES_EN = {
  groom: "ஆண்ட்ரூ",
  bride: "மரியா",
};

const NAME_STYLE = {
  fontFamily: '"Noto Serif Tamil", "Tiro Tamil", serif',
  fontWeight: 700,
  letterSpacing: "0",
} as const;

const WEDS_STYLE = {
  fontFamily: '"Noto Serif Tamil", "Tiro Tamil", serif',
  fontStyle: "normal",
  fontWeight: 600,
} as const;


const EASE = [0.22, 1, 0.36, 1] as const;

const PHOTO_LAYOUT: "stagger" | "overlap" | "side" = "stagger";

const THIRD_IMAGE = "/images/gallery-1.jpg";

const HERO_IMAGES = [
  { src: wedding.heroImage, alt: "நிச்சயதார்த்த ஜோடியின் அழகிய புகைப்படம்" },
  { src: wedding.journeyImage, alt: "நிச்சயதார்த்த ஜோடியின் இனிய தருணம்" },
  { src: THIRD_IMAGE, alt: "நிச்சயதார்த்த விழாவின் அழகிய தருணம்" },
].slice(0, 3);

const MAX_MOTES = 6;

function GoldMotes({ count = 5 }: { count?: number }) {
  const all = useMemo(
    () =>
      Array.from({ length: MAX_MOTES }, (_, i) => ({
        id: i,
        left: `${5 + Math.random() * 90}%`,
        size: 2 + Math.random() * 3,
        dur: 8 + Math.random() * 10,
        delay: -Math.random() * 12,
      })),
    [],
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[3] overflow-hidden"
      aria-hidden
    >
      {all.slice(0, count).map((m) => (
        <span
          key={m.id}
          className="absolute rounded-full will-change-transform"
          style={{
            left: m.left,
            bottom: -8,
            width: m.size,
            height: m.size,
            background:
              "radial-gradient(circle, #fdf6dd 0%, #e9cd7f 45%, #c9a22780 100%)",
            boxShadow: "0 0 4px rgba(233,205,127,0.55)",
            animation: `dustfloat ${m.dur}s linear ${m.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function AnimatedName({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      className="inline-block max-w-full px-2 pb-2"
      initial={reduce ? false : { opacity: 0, y: 22, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: reduce ? 0 : 0.75,
        delay: reduce ? 0 : delay,
        ease: EASE,
      }}
    >
      {text}
    </motion.span>
  );
}

function HeroPhoto({
  src,
  alt,
  delay = 0,
  flip = false,
  className = "",
}: {
  src: string;
  alt: string;
  delay?: number;
  flip?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 22, rotate: flip ? 3 : -3 }}
      animate={{ opacity: 1, y: 0, rotate: flip ? 2 : -2 }}
      transition={{ duration: reduce ? 0 : 0.8, delay, ease: EASE }}
      className={`relative z-10 w-[clamp(76px,min(24vw,19svh),190px)] shrink-0 will-change-transform ${className}`}
    >
      <Corner
        className="absolute -left-1.5 -top-1.5 z-10 opacity-90 sm:-left-2 sm:-top-2"
        size={28}
      />
      <Corner
        className="absolute -right-1.5 -top-1.5 z-10 -scale-x-100 opacity-90 sm:-right-2 sm:-top-2"
        size={28}
      />
      <Corner
        className="absolute -bottom-1.5 -left-1.5 z-10 -scale-y-100 opacity-90 sm:-bottom-2 sm:-left-2"
        size={28}
      />
      <Corner
        className="absolute -bottom-1.5 -right-1.5 z-10 -scale-100 opacity-90 sm:-bottom-2 sm:-right-2"
        size={28}
      />

      <div className="arch-shape rounded-b-[12px] bg-[linear-gradient(140deg,#f2dfa6,#c9a227_35%,#84641a_60%,#e9cd7f_85%,#a8811f)] p-[2px] shadow-[0_20px_44px_-14px_rgba(0,0,0,0.9)] sm:rounded-b-[14px] sm:p-[2.5px] sm:shadow-[0_28px_60px_-16px_rgba(0,0,0,0.9)]">
        <div className="arch-shape rounded-b-[10px] bg-maroon-950 p-[4px] sm:rounded-b-[12px] sm:p-[5px]">
          <div className="arch-shape relative overflow-hidden rounded-b-[7px] border border-gold-400/40 sm:rounded-b-[8px]">
            <img
              src={src}
              alt={alt}
              loading="eager"
              decoding="async"
              draggable={false}
              className="aspect-[3/4] w-full object-cover"
            />

            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_rgba(36,6,12,0.55)] sm:shadow-[inset_0_0_50px_rgba(36,6,12,0.55)]" />

          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Monogram({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div
      className={`flex shrink-0 flex-col items-center gap-1.5 sm:gap-2 ${className}`}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.4, rotate: -25 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{
          duration: reduce ? 0 : 1.1,
          delay: 0.75,
          ease: EASE,
        }}
      >
        <MonogramCrest
          size={56}
          className="drop-shadow-[0_0_14px_rgba(201,162,39,0.55)] sm:drop-shadow-[0_0_16px_rgba(201,162,39,0.55)]"
        />
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{
          duration: reduce ? 0 : 0.8,
          delay: 1.15,
          ease: EASE,
        }}
      >
        <Flourish width={72} />
      </motion.div>
    </div>
  );
}

export default function Hero({ active }: { active: boolean }) {
  const reduce = useReducedMotion();

  const engagement = wedding.engagement;

  return (
    <div id="home" className="relative w-full">
      <LycorisSpecimen
        name={`${NAMES_EN.groom} ${NAMES_EN.bride}`}
        studio="இரு குடும்பத்தினர்"
        hideText
        travel
        backgroundImage="/images/gallery-3.jpg"
        images={HERO_IMAGES}
        description={`${wedding.heroLine}. ${wedding.groom.name} மற்றும் ${wedding.bride.name} ஆகியோரின் நிச்சயதார்த்த விழாவிற்கு உங்கள் பிரசன்னத்துடன் ஆசீர்வாதம் பெற மரியாதையுடன் அழைக்கிறோம்.`}
        specs={[
          `நிச்சயதார்த்தம்: ${engagement.day}`,
          `${engagement.venue}, ${wedding.city}`,
          `விழா நேரம்: ${engagement.time}`,
          engagement.address,
          "அன்புடன் வரவேற்கிறோம்",
        ]}
        links={[
          { label: `நிச்சயதார்த்தம் · ${engagement.day}` },
          { label: `${engagement.time} · ${wedding.city}` },
        ]}
        sceneScroll={1}
        height="100svh"
      />

      {active && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20"
          style={{ opacity: 0.72 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-maroon-950/80 via-maroon-950/50 to-maroon-950/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_38%,rgba(140,42,59,0.38),transparent_70%)]" />
        </motion.div>
      )}

      {active && !reduce && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[21] h-[100svh] overflow-hidden">
          <GoldMotes count={5} />
        </div>
      )}

      {active && (
        <div
          className="absolute inset-x-0 top-0 z-[22] h-[100svh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col items-center justify-center px-4 pb-[max(5rem,env(safe-area-inset-bottom))] pt-[max(3.5rem,env(safe-area-inset-top))] sm:px-6 md:pb-14 md:pt-20">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: reduce ? 0 : 1.1,
                delay: 0.3,
                ease: EASE,
              }}
              className="relative mb-2 flex h-14 w-14 items-center justify-center sm:mb-3 sm:h-[72px] sm:w-[72px] [@media(max-height:560px)]:hidden"
            >
              <div
                className="gold-rays absolute inset-[-14px] rounded-full opacity-65 will-change-transform sm:inset-[-20px]"
                style={
                  reduce
                    ? undefined
                    : { animation: "rayspin 36s linear infinite" }
                }
              />
              <div className="absolute inset-1 rounded-full bg-gold-400/10 blur-xl" />
              <GoldCross
                size={46}
                className="drop-shadow-[0_0_10px_rgba(233,205,127,0.55)] sm:drop-shadow-[0_0_12px_rgba(233,205,127,0.55)]"
              />
            </motion.div>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduce ? 0 : 1.1,
                delay: 0.5,
                ease: EASE,
              }}
              className="mb-4 text-center text-[10px] font-semibold tracking-[0.18em] text-gold-300/90 sm:mb-5 sm:text-xs sm:tracking-[0.3em]"
            >
              நிச்சயதார்த்த விழா அழைப்பிதழ்
            </motion.p>

            {PHOTO_LAYOUT === "overlap" ? (
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <Monogram />
                <div className="flex items-start justify-center">
                  <HeroPhoto
                    src={wedding.heroImage}
                    alt={NAMES_EN.groom}
                    delay={0.55}
                  />
                  <HeroPhoto
                    src={wedding.journeyImage}
                    alt={NAMES_EN.bride}
                    delay={0.7}
                    flip
                    className="z-20 -ml-5 mt-[clamp(1.5rem,6svh,3.5rem)] sm:-ml-8"
                  />
                </div>
              </div>
            ) : (
              <div
                className={`flex justify-center gap-2 sm:gap-5 md:gap-8 ${
                  PHOTO_LAYOUT === "stagger" ? "items-start" : "items-end"
                }`}
              >
                <HeroPhoto
                  src={wedding.heroImage}
                  alt={NAMES_EN.groom}
                  delay={0.55}
                />

                <Monogram
                  className={
                    PHOTO_LAYOUT === "stagger" ? "self-center" : "self-end pb-2"
                  }
                />

                <HeroPhoto
                  src={wedding.journeyImage}
                  alt={NAMES_EN.bride}
                  delay={0.7}
                  flip
                  className={
                    PHOTO_LAYOUT === "stagger"
                      ? "mt-[clamp(1.5rem,7svh,4rem)]"
                      : ""
                  }
                />
              </div>
            )}

            <h1
              className="mt-5 flex w-full flex-col items-center text-center sm:mt-6"
              aria-label={`${NAMES_EN.groom} மற்றும் ${NAMES_EN.bride}`}
            >
              <span aria-hidden style={NAME_STYLE} className="text-[clamp(2.9rem,min(13.5vw,9.5svh),5.8rem)] leading-[1.15]">
                <AnimatedName text={NAMES_EN.groom} delay={0.45} />
              </span>

              <motion.span
                aria-hidden
                initial={reduce ? false : { opacity: 0, scaleX: 0.4 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{
                  duration: reduce ? 0 : 1,
                  delay: reduce ? 0 : 0.55,
                  ease: EASE,
                }}
                className="flex items-center justify-center gap-3 sm:gap-5"
              >
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold-400/80 sm:w-14" />
                <span
                  style={WEDS_STYLE}
                  className="pl-[0.3em] text-[clamp(1rem,min(4.2vw,3.4svh),1.7rem)] lowercase tracking-[0.3em] text-gold-200"
                >
                  மற்றும்
                </span>
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold-400/80 sm:w-14" />
              </motion.span>

              <span aria-hidden style={NAME_STYLE} className="text-[clamp(2.9rem,min(13.5vw,9.5svh),5.8rem)] leading-[1.15]">
                <AnimatedName text={NAMES_EN.bride} delay={0.7} />
              </span>
            </h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduce ? 0 : 0.9,
                delay: 0.9,
                ease: EASE,
              }}
              className="mt-4 max-w-[18rem] text-center font-display text-sm italic text-cream-200/90 sm:mt-5 sm:max-w-xs sm:text-base md:max-w-md [@media(max-height:560px)]:hidden"
            >
              {wedding.tagline}
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduce ? 0 : 0.9,
                delay: 1.2,
                ease: EASE,
              }}
              className="mt-5 flex flex-col items-center gap-2 sm:mt-6"
            >
              <div
                className="mt-1 flex flex-col items-center gap-1 [@media(max-height:640px)]:hidden"
                aria-hidden
              >
                <div className="h-6 w-px bg-gradient-to-b from-gold-400/80 to-transparent sm:h-7" />
                <svg
                  width="11"
                  height="7"
                  viewBox="0 0 12 7"
                  className="text-gold-400/70"
                  fill="none"
                >
                  <path
                    d="M1 1l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[23] h-20 bg-gradient-to-t from-maroon-950 to-transparent sm:h-24" />
    </div>
  );
}
