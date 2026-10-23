import { useMemo, useRef } from "react";
import type { MotionValue, ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { wedding } from "../data/wedding";
import { GoldCross, Flourish, Corner } from "./Ornaments";

const NAMES = {
  groom: "ஆண்ட்ரூ",
  bride: "மரியா",
};

const NAME_STYLE = {
  fontFamily: '"Noto Serif Tamil", "Tiro Tamil", serif',
  fontWeight: 700,
  letterSpacing: "0",
} as const;

const CONNECTOR_STYLE = {
  fontFamily: '"Noto Serif Tamil", "Tiro Tamil", serif',
  fontStyle: "normal",
  fontWeight: 600,
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

/** Number of scenes. Keep in sync with the layers below. */
const SCENES = 3;

/** Half-width of each cover window, as a fraction of the whole scroll. */
const COVER_SPAN = 0.12;

/** Vertical scroll distance that drives the story. */
const SCROLL_HEIGHT = "340svh";

/** Scroll window in which scene `index` slides up over the previous one. */
function coverWindow(index: number): [number, number] {
  const center = index / SCENES;
  return [center - COVER_SPAN, center + COVER_SPAN];
}

const MAX_MOTES = 6;

function GoldMotes({ count = 5 }: { count?: number }) {
  const motes = useMemo(
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
      {motes.slice(0, count).map((m) => (
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

/** Fades and rises content in once the hero is active. */
function Rise({
  active,
  delay = 0,
  className = "",
  children,
}: {
  active: boolean;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={active || reduce ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: reduce ? 0 : 1.2,
        delay: reduce ? 0 : delay,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

/** Reveals text from left to right with a clip. */
function Wipe({
  active,
  delay = 0,
  className = "",
  children,
}: {
  active: boolean;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={reduce ? false : { clipPath: "inset(0 100% 0 0)", opacity: 0 }}
      animate={
        active || reduce
          ? { clipPath: "inset(0 0% 0 0)", opacity: 1 }
          : undefined
      }
      transition={{
        duration: reduce ? 0 : 1.8,
        delay: reduce ? 0 : delay,
        ease: EASE,
      }}
    >
      {children}
    </motion.span>
  );
}

type LayerProps = {
  index: number;
  t: MotionValue<number>;
  src: string;
  alt: string;
  position?: string;
  reduce: boolean | null;
  active: boolean;
  opening?: boolean;
  align?: "center" | "bottom";
  children: ReactNode;
};

/**
 * One scene in the stack. Scene 0 is the base. Each later scene slides up
 * over the one before it, and the scene underneath dims as it's covered.
 * `align="bottom"` places the text in the lower part of the frame so it
 * doesn't cover faces in the photo.
 */
function Layer({
  index,
  t,
  src,
  alt,
  position = "center",
  reduce,
  active,
  opening = false,
  align = "center",
  children,
}: LayerProps) {
  const [enterStart, enterEnd] = coverWindow(index);
  const [nextStart, nextEnd] = coverWindow(index + 1);

  const y = useTransform(t, [enterStart, enterEnd], ["100%", "0%"]);
  const dim = useTransform(t, [nextStart, nextEnd], [0, 0.7]);
  const photoScale = useTransform(t, [enterStart, enterEnd], [1.12, 1]);
  const textY = useTransform(t, [enterStart, enterEnd], [50, 0]);

  const isBase = index === 0;
  const isLast = index === SCENES - 1;
  const introPlays = opening && !reduce;

  return (
    <motion.section
      className={
        reduce
          ? "relative min-h-[100svh] w-full overflow-hidden"
          : "absolute inset-0 overflow-hidden"
      }
      style={
        reduce
          ? undefined
          : {
              zIndex: index + 1,
              y: isBase ? 0 : y,
            }
      }
    >
      {/* Entering edge shadow, so the slide reads as a cut */}
      {!isBase && !reduce && (
        <div className="pointer-events-none absolute inset-x-0 -top-24 z-[5] h-24 bg-gradient-to-t from-transparent to-black/70" />
      )}

      {/* Opening pull-back: close zoom that eases out to normal */}
      <motion.div
        className="absolute inset-0"
        initial={introPlays ? { scale: 1.4 } : false}
        animate={introPlays ? { scale: active ? 1 : 1.4 } : undefined}
        transition={{ duration: 4.5, ease: EASE }}
      >
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={reduce ? undefined : { scale: isBase ? undefined : photoScale }}
        >
          <img
            src={src}
            alt={alt}
            loading="eager"
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: position }}
          />
        </motion.div>
      </motion.div>

      {/* Tone and vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-maroon-950/70 via-maroon-950/35 to-maroon-950/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,transparent_40%,rgba(20,4,8,0.7)_100%)]" />

      {/* Extra shade behind bottom-aligned text */}
      {align === "bottom" && !reduce && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[55%] bg-gradient-to-t from-maroon-950/95 via-maroon-950/60 to-transparent" />
      )}

      {/* Dim as the next scene covers this one */}
      {!reduce && !isLast && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[6] bg-black"
          style={{ opacity: dim }}
        />
      )}

      <motion.div
        className={`absolute inset-0 z-10 flex flex-col items-center px-6 text-center ${
          align === "bottom" ? "justify-end pb-28 sm:pb-32" : "justify-center"
        }`}
        style={reduce ? undefined : { y: textY }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
}

export default function Hero({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const engagement = wedding.engagement;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div
      id="home"
      ref={ref}
      className="relative w-full"
      style={{ height: reduce ? "auto" : SCROLL_HEIGHT }}
    >
      <div
        className={
          reduce
            ? "relative w-full bg-maroon-950"
            : "sticky top-0 h-[100svh] w-full overflow-hidden bg-maroon-950"
        }
      >
        {/* Scene 1: groom, base layer with the cinematic opening */}
        <Layer
          index={0}
          t={scrollYProgress}
          src={wedding.heroImage}
          alt={NAMES.groom}
          position="center 25%"
          reduce={reduce}
          active={active}
          opening
          align="bottom"
        >
          <Rise active={active} delay={0.9} className="mb-3">
            <GoldCross
              size={46}
              className="mx-auto drop-shadow-[0_0_12px_rgba(233,205,127,0.55)]"
            />
          </Rise>

          <motion.p
            initial={reduce ? false : { opacity: 0, letterSpacing: "0.6em" }}
            animate={
              active || reduce
                ? { opacity: 1, letterSpacing: "0.3em" }
                : undefined
            }
            transition={{
              duration: reduce ? 0 : 2.4,
              delay: reduce ? 0 : 1.1,
              ease: EASE,
            }}
            className="mb-4 text-[10px] font-semibold text-gold-300/90 sm:text-xs"
          >
            நிச்சயதார்த்த விழா அழைப்பிதழ்
          </motion.p>

          <h1
            className="flex w-full flex-col items-center"
            aria-label={`${NAMES.groom} மற்றும் ${NAMES.bride}`}
          >
            <Wipe active={active} delay={1.8} className="px-2 pb-2">
              <span
                aria-hidden
                style={NAME_STYLE}
                className="inline-block text-[clamp(2.9rem,min(13.5vw,9.5svh),5.8rem)] leading-[1.15] text-cream-200 drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
              >
                {NAMES.groom}
              </span>
            </Wipe>

            <Rise active={active} delay={2.6}>
              <span
                aria-hidden
                className="my-2 flex items-center justify-center gap-3 sm:gap-5"
              >
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold-400/80 sm:w-14" />
                <span
                  style={CONNECTOR_STYLE}
                  className="pl-[0.3em] text-[clamp(1rem,min(4.2vw,3.4svh),1.7rem)] lowercase tracking-[0.3em] text-gold-200"
                >
                  மற்றும்
                </span>
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold-400/80 sm:w-14" />
              </span>
            </Rise>

            <Wipe active={active} delay={2.9} className="px-2 pb-2">
              <span
                aria-hidden
                style={NAME_STYLE}
                className="inline-block text-[clamp(2.9rem,min(13.5vw,9.5svh),5.8rem)] leading-[1.15] text-cream-200 drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
              >
                {NAMES.bride}
              </span>
            </Wipe>
          </h1>

          <Rise active={active} delay={3.4}>
            <p className="mt-5 max-w-[18rem] font-display text-sm italic text-cream-200/90 sm:max-w-xs sm:text-base md:max-w-md">
              {wedding.tagline}
            </p>
          </Rise>

          <Rise
            active={active}
            delay={4.2}
            className="absolute top-10 left-0 right-0 text-center"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-cream-200/60">
              Chapter One
            </p>
          </Rise>
        </Layer>

        {/* Scene 2: bride, slides up over the groom */}
        <Layer
          index={1}
          t={scrollYProgress}
          src={wedding.journeyImage}
          alt={NAMES.bride}
          position="center 25%"
          reduce={reduce}
          active={active}
        >
          <Rise active={active} delay={0.2}>
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-gold-400/70" />
              <Flourish width={72} />
              <span className="h-px w-10 bg-gold-400/70" />
            </div>
          </Rise>

          <Rise active={active} delay={0.4}>
            <p className="max-w-[20rem] font-display text-xl italic leading-relaxed text-cream-100 sm:max-w-md sm:text-3xl">
              {wedding.heroLine}
            </p>
          </Rise>

          <Rise active={active} delay={0.7}>
            <p className="mt-6 text-xs uppercase tracking-[0.35em] text-gold-300/80">
              Frame by frame, moment by moment
            </p>
          </Rise>
        </Layer>

        {/* Scene 3: event details, slides up over the bride */}
        <Layer
          index={2}
          t={scrollYProgress}
          src="/images/gallery-3.jpg"
          alt=""
          reduce={reduce}
          active={active}
        >
          <Rise
            active={active}
            delay={0.2}
            className="relative w-full max-w-md px-6 py-8 sm:px-10 sm:py-10"
          >
            <Corner className="absolute -left-1 -top-1 opacity-90" size={28} />
            <Corner className="absolute -right-1 -top-1 -scale-x-100 opacity-90" size={28} />
            <Corner className="absolute -bottom-1 -left-1 -scale-y-100 opacity-90" size={28} />
            <Corner className="absolute -bottom-1 -right-1 -scale-100 opacity-90" size={28} />

            <p className="mb-5 text-[10px] font-semibold tracking-[0.25em] text-gold-300/90 sm:text-xs">
              நிச்சயதார்த்தம்
            </p>

            <div className="flex flex-col gap-3 text-cream-100">
              <p className="text-base sm:text-lg">
                {`நிச்சயதார்த்தம்: ${engagement.day}`}
              </p>
              <p className="text-base sm:text-lg">
                {`${engagement.venue}, ${wedding.city}`}
              </p>
              <p className="text-base sm:text-lg">
                {`விழா நேரம்: ${engagement.time}`}
              </p>
              <p className="text-sm text-cream-200/80 sm:text-base">
                {engagement.address}
              </p>
            </div>

            <p className="mt-6 font-display text-sm italic text-gold-200 sm:text-base">
              அன்புடன் வரவேற்கிறோம்
            </p>

            <p className="mt-8 font-display text-sm italic text-cream-200/70 sm:text-base">
              To be continued…
            </p>
          </Rise>
        </Layer>

        {!reduce && (
          <>
            {/* Scroll progress line */}
            <motion.div
              aria-hidden
              className="absolute left-0 top-0 z-[50] h-[2px] w-full origin-left bg-gold-400"
              style={{ scaleX: scrollYProgress }}
            />

            {/* Opening: fade up from black */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[60] bg-black"
              initial={{ opacity: 1 }}
              animate={{ opacity: active ? 0 : 1 }}
              transition={{ duration: 2.2, ease: EASE }}
            />

            {/* Letterbox bars */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-[55] bg-black"
              initial={{ height: "50svh" }}
              animate={{ height: active ? "0svh" : "12svh" }}
              transition={{ duration: 2.4, delay: 0.3, ease: EASE }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[55] bg-black"
              initial={{ height: "50svh" }}
              animate={{ height: active ? "0svh" : "12svh" }}
              transition={{ duration: 2.4, delay: 0.3, ease: EASE }}
            />

            {active && (
              <div className="pointer-events-none absolute inset-0 z-[45] overflow-hidden">
                <GoldMotes count={5} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}