
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { wedding } from "../data/wedding";
import {
  GoldCross,
  Flourish,
  Corner,
  MonogramCrest,
} from "./Ornaments";

/* ---------- மலரும் தங்கத் தூசிகள் ---------- */
function GoldDust() {
  const dust = useMemo(
    () =>
      Array.from({ length: 22 }).map(() => {
        const duration = 10 + Math.random() * 9;

        return {
          left: `${3 + Math.random() * 94}%`,
          size: 2.5 + Math.random() * 3.5,
          delay: -Math.random() * duration,
          duration,
        };
      }),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {dust.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: -14,
            width: p.size,
            height: p.size,
            background:
              "radial-gradient(circle, #fdf6dd 0%, #e9cd7f 45%, #c9a227 100%)",
            boxShadow: "0 0 10px rgba(233,205,127,0.9)",
            animation: `dustfloat ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- கோதிக் வளைவுகள் கொண்ட அரண்மனைக் கதவு ---------- */
function Arch({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 480"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="#e9cd7f"
        strokeOpacity="0.22"
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
      >
        <path d="M30 480 V160 Q30 84 66 84 Q102 84 102 160 V480" />
        <path d="M120 480 V160 Q120 84 156 84 Q192 84 192 160 V480" />
      </g>

      <g
        fill="none"
        stroke="#e9cd7f"
        strokeOpacity="0.12"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
      >
        <path d="M44 480 V170 Q44 104 66 104 Q88 104 88 170 V480" />
        <path d="M134 480 V170 Q134 104 156 104 Q178 104 178 170 V480" />
      </g>
    </svg>
  );
}

function DoorPanel({ side }: { side: "left" | "right" }) {
  const inner = side === "left";

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ backfaceVisibility: "hidden" }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#520f1c_0%,#3a0a12_46%,#280610_100%)]" />

      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(233,205,127,0.07) 0 1px, transparent 1px 46px), repeating-linear-gradient(90deg, rgba(0,0,0,0.28) 0 2px, transparent 2px 92px)",
        }}
      />

      <Arch className="absolute inset-x-6 inset-y-10 h-[calc(100%-5rem)] w-[calc(100%-3rem)]" />

      <Arch className="absolute inset-x-14 inset-y-20 h-[calc(100%-10rem)] w-[calc(100%-7rem)] opacity-60" />

      <div
        className={`absolute inset-0 ${
          inner
            ? "bg-[linear-gradient(to_left,rgba(0,0,0,0.6),transparent_26%)]"
            : "bg-[linear-gradient(to_right,rgba(0,0,0,0.6),transparent_26%)]"
        }`}
      />

      <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(0,0,0,0.7)]" />

      <div
        className={`absolute inset-y-0 w-[3px] bg-gradient-to-b from-gold-500/70 via-gold-300/90 to-gold-600/70 ${
          inner ? "right-0" : "left-0"
        }`}
      />

      <div className="absolute left-1/2 top-[9%] -translate-x-1/2 opacity-80">
        <GoldCross
          size={40}
          className="drop-shadow-[0_0_12px_rgba(201,162,39,0.7)]"
        />
      </div>

      <div
        className={`absolute top-1/2 -translate-y-1/2 ${
          inner ? "right-5 md:right-9" : "left-5 md:left-9"
        }`}
      >
        <div className="h-16 w-16 animate-pulse rounded-full border-[3px] border-gold-300/90 bg-gradient-to-br from-gold-300/25 to-transparent shadow-[0_0_34px_rgba(201,162,39,0.55)]" />

        <div className="absolute inset-0 m-auto h-6 w-6 rounded-full bg-gradient-to-br from-gold-100 to-gold-600 shadow-inner" />
      </div>
    </div>
  );
}

/* =================================================================== */

export default function Intro({
  onStart,
  onComplete,
}: {
  onStart: () => void;
  onComplete: () => void;
}) {
  const [opening, setOpening] = useState(false);
  const [started, setStarted] = useState(false);

  // Prevent completion from being triggered more than once.
  const completedRef = useRef(false);

  const completeIntro = () => {
    if (completedRef.current) return;

    completedRef.current = true;
    onComplete();
  };

  const openGates = () => {
    if (started) return;

    setStarted(true);
    setOpening(true);
    onStart();
  };

  const skip = () => {
    if (started) return;

    setStarted(true);
    completeIntro();
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openGates();
      }

      if (event.key === "Escape") {
        skip();
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };

    // The handlers use the latest state through this effect's dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-hidden"
      exit={{
        opacity: 0,
        transition: { duration: 0.8 },
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9 }}
      style={{
        perspective: 1500,
        pointerEvents: opening ? "none" : "auto",
      }}
    >
      <motion.div
        className="absolute inset-0"
        animate={opening ? { scale: 1.07 } : { scale: 1 }}
        transition={{
          duration: 3,
          delay: 0.4,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* இடது கதவு */}
        <motion.div
          className="absolute left-0 top-0 h-full w-1/2 will-change-transform"
          style={{ transformOrigin: "left center" }}
          animate={opening ? { rotateY: -104 } : { rotateY: 0 }}
          transition={{
            duration: 2.3,
            delay: 0.55,
            ease: [0.72, 0, 0.24, 1],
          }}
        >
          <DoorPanel side="left" />

          <motion.div
            className="absolute inset-0 bg-[linear-gradient(105deg,transparent_30%,rgba(253,246,221,0.55)_50%,transparent_70%)]"
            initial={{ opacity: 0 }}
            animate={
              opening
                ? { opacity: [0, 0.8, 0] }
                : { opacity: 0 }
            }
            transition={{
              duration: 1.6,
              delay: 1.05,
              times: [0, 0.5, 1],
            }}
          />
        </motion.div>

        {/* வலது கதவு */}
        <motion.div
          className="absolute right-0 top-0 h-full w-1/2 will-change-transform"
          style={{ transformOrigin: "right center" }}
          animate={opening ? { rotateY: 104 } : { rotateY: 0 }}
          transition={{
            duration: 2.3,
            delay: 0.8,
            ease: [0.72, 0, 0.24, 1],
          }}
          onAnimationComplete={() => {
            if (opening) {
              completeIntro();
            }
          }}
        >
          <DoorPanel side="right" />

          <motion.div
            className="absolute inset-0 bg-[linear-gradient(-105deg,transparent_30%,rgba(253,246,221,0.55)_50%,transparent_70%)]"
            initial={{ opacity: 0 }}
            animate={
              opening
                ? { opacity: [0, 0.8, 0] }
                : { opacity: 0 }
            }
            transition={{
              duration: 1.6,
              delay: 1.3,
              times: [0, 0.5, 1],
            }}
          />
        </motion.div>

        {/* கதவுகளுக்கு இடையில் ஒளித் துளை */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-0 z-[6] h-full w-[70vw] -translate-x-1/2 blur-2xl"
          initial={{ opacity: 0, scaleX: 0.03 }}
          animate={
            opening
              ? {
                  opacity: [0, 0.95, 0.9, 0],
                  scaleX: [0.03, 1, 1, 1],
                }
              : { opacity: 0 }
          }
          transition={{
            duration: 2.5,
            delay: 0.4,
            times: [0, 0.3, 0.72, 1],
            ease: "easeInOut",
          }}
          style={{
            background:
              "radial-gradient(50% 62% at 50% 50%, rgba(255,244,214,0.95), rgba(233,205,127,0.55) 55%, transparent 80%)",
          }}
        />
      </motion.div>

      {/* திறக்கும் கணத்தியில் பொன்னிற மின்னல் */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[8]"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={
          opening
            ? {
                opacity: [0, 1, 0],
                scale: [0.5, 1.9, 2.4],
              }
            : { opacity: 0 }
        }
        transition={{
          duration: 1.5,
          delay: 0.1,
          ease: "easeOut",
        }}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,250,230,0.98), rgba(233,205,127,0.5) 32%, transparent 64%)",
        }}
      />

      <GoldDust />

      <div className="pointer-events-none absolute inset-0 z-[7] shadow-[inset_0_0_180px_rgba(0,0,0,0.55)]" />

      {/* மைய அழைப்பிதழ் */}
      <motion.div
        className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden px-4"
        style={{
          paddingTop: "max(env(safe-area-inset-top,0px), 10px)",
          paddingBottom: "max(env(safe-area-inset-bottom,0px), 10px)",
        }}
        animate={
          opening
            ? {
                opacity: 0,
                scale: 1.12,
                filter: "blur(10px)",
              }
            : {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              }
        }
        transition={{ duration: 0.55, ease: "easeIn" }}
      >
        <motion.div
          animate={opening ? {} : { y: [0, -7, 0] }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-full max-w-[460px]"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 1.15,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.45,
            }}
            className="relative rounded-[14px] bg-maroon-950/60 backdrop-blur-md gilded px-4 py-3 sm:px-7 sm:py-5 md:px-11 md:py-8"
          >
            {/* மூலை அலங்காரங்கள் */}
            <Corner className="absolute -left-2 -top-2" size={44} />
            <Corner className="absolute -right-2 -top-2 -scale-x-100" size={44} />
            <Corner className="absolute -bottom-2 -left-2 -scale-y-100" size={44} />
            <Corner className="absolute -bottom-2 -right-2 -scale-100" size={44} />

            <div className="flex flex-col items-center text-center">
              {/* தங்கச் சிலுவை */}
              <motion.div
                initial={{ opacity: 0, scale: 0.55 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 1.15,
                  delay: 0.85,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20 md:h-24 md:w-24"
              >
                <motion.div
                  className="gold-rays absolute inset-[-16px] rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.85 }}
                  transition={{ duration: 1.6, delay: 1.25 }}
                  style={{ animation: "rayspin 42s linear infinite" }}
                />

                <div className="absolute inset-2 rounded-full bg-gold-400/15 blur-2xl" />

                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 3.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <GoldCross
                    size={48}
                    className="relative drop-shadow-[0_0_20px_rgba(233,205,127,0.85)] sm:hidden"
                  />

                  <GoldCross
                    size={60}
                    className="relative hidden drop-shadow-[0_0_20px_rgba(233,205,127,0.85)] sm:block md:hidden"
                  />

                  <GoldCross
                    size={70}
                    className="relative hidden drop-shadow-[0_0_20px_rgba(233,205,127,0.85)] md:block"
                  />
                </motion.div>
              </motion.div>

              {/* அழைப்பிதழ் தலைப்பு */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 1.5 }}
                className="mt-2 text-[9px] font-semibold tracking-[0.38em] text-gold-300/90 sm:mt-3 sm:text-[10px] sm:tracking-[0.44em]"
              >
                நிச்சயதார்த்த விழா அழைப்பிதழ்
              </motion.p>

              {/* மொனோகிராம் */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 1.65 }}
                className="mt-2 sm:mt-3"
              >
                <MonogramCrest size={46} />
              </motion.div>

              {/* தங்கக் கோடு */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0.3 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.85 }}
                className="hairline-gold mt-2 h-px w-3/4 sm:mt-3"
              />

              {/* மணமகன் */}
              <motion.h1
                initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.95,
                  delay: 1.95,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="gold-text-shine mt-2 font-display font-semibold leading-tight text-[1.4rem] sm:text-[1.85rem] md:text-[2.4rem]"
              >
                {wedding.groom.name}
              </motion.h1>

              {/* அலங்கார flourish */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0.4 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.9, delay: 2.35 }}
                className="my-1"
              >
                <Flourish width={160} />
              </motion.div>

              {/* மணமகள் */}
              <motion.h2
                initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.95,
                  delay: 2.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="gold-text-shine font-display font-semibold leading-tight text-[1.4rem] sm:text-[1.85rem] md:text-[2.4rem]"
              >
                {wedding.bride.name}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, scaleX: 0.3 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 2.9 }}
                className="hairline-gold mt-2 h-px w-3/4 sm:mt-3"
              />

              {/* அழைப்பிதழ் வாசகம் */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 3.1 }}
                className="mt-2 font-display text-sm italic text-cream-200/95 sm:mt-3 sm:text-base"
              >
                {wedding.tagline}
              </motion.p>

              {/* திறக்கும் பொத்தான்கள் */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 3.5 }}
                className="mt-4 flex w-full flex-col items-center gap-2 sm:mt-5 sm:gap-3"
              >
                <motion.button
                  type="button"
                  onClick={openGates}
                  disabled={started}
                  animate={started ? {} : { scale: [1, 1.035, 1] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 4.4,
                  }}
                  className="animate-ring group relative w-full overflow-hidden rounded-full bg-gradient-to-b from-gold-200 via-gold-400 to-gold-600 px-6 py-3 text-sm font-semibold text-maroon-950 shadow-[0_10px_32px_-8px_rgba(201,162,39,0.85)] transition-transform duration-300 hover:scale-[1.04] active:scale-95 disabled:cursor-default sm:w-auto sm:px-10 sm:py-3.5 sm:text-base"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  <span className="relative tracking-wide">
                    அழைப்பிதழைத் திறக்கவும்
                  </span>
                </motion.button>

                <button
                  type="button"
                  onClick={skip}
                  disabled={started}
                  className="text-sm text-cream-300/70 underline decoration-gold-500/40 underline-offset-4 transition-colors hover:text-gold-300 disabled:cursor-default"
                >
                  தவிர்க்கவும்
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* தங்க எல்லைகள் */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: 1.6,
          delay: 0.25,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[3px] bg-gradient-to-r from-transparent via-gold-400/90 to-transparent"
      />

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: 1.6,
          delay: 0.25,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[3px] bg-gradient-to-r from-transparent via-gold-400/90 to-transparent"
      />
    </motion.div>
  );
}
