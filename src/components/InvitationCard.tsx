import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { MapPin } from "lucide-react";
import { wedding, mapsLink } from "../data/wedding";
import { GoldCross, Corner, Flourish } from "./Ornaments";
import { Magnetic } from "./fx";

const GOLD =
  "bg-[linear-gradient(150deg,#f2dfa6,#c9a227_32%,#84641a_58%,#e9cd7f_82%,#a8811f)]";
const PAPER =
  "bg-[linear-gradient(175deg,#fdfaf1_0%,#f8f1df_42%,#f3e8cd_100%)]";
const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23p)' opacity='.06'/%3E%3C/svg%3E\")";

const UNROLL_SECONDS = 4;

const glowStyles = `
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 14px 2px rgba(226,185,80,.35), 0 0 0 0 rgba(226,185,80,0); }
  50%      { box-shadow: 0 0 30px 8px rgba(226,185,80,.6), 0 0 0 6px rgba(226,185,80,.12); }
}
@keyframes shineSweep {
  0%   { transform: translateX(0); opacity: 0; }
  15%  { opacity: 1; }
  60%  { transform: translateX(420%); opacity: 0; }
  100% { transform: translateX(420%); opacity: 0; }
}
.glow-btn { animation: glowPulse 2.6s ease-in-out infinite; }
.glow-shine { animation: shineSweep 3.2s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .glow-btn, .glow-shine { animation: none; }
}
`;

/* ---------- Corner ornaments ---------- */

function Corners() {
  return (
    <>
      <div className="pointer-events-none absolute left-2 top-2 opacity-85">
        <Corner size={58} />
      </div>
      <div className="pointer-events-none absolute right-2 top-2 -scale-x-100 opacity-85">
        <Corner size={58} />
      </div>
      <div className="pointer-events-none absolute bottom-2 left-2 -scale-y-100 opacity-85">
        <Corner size={58} />
      </div>
      <div className="pointer-events-none absolute bottom-2 right-2 -scale-100 opacity-85">
        <Corner size={58} />
      </div>
    </>
  );
}

/* ---------- The invitation card ---------- */

function CardInside() {
  const e = wedding.engagement;

  return (
    <div className={`${GOLD} relative p-[2.5px] shadow-[0_40px_90px_-32px_rgba(60,15,22,.6)]`}>
      <style>{glowStyles}</style>

      <div className={`${PAPER} relative overflow-hidden px-6 py-12 sm:px-12 md:px-16 md:py-16`}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{ backgroundImage: GRAIN_URL }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 50% 18%, rgba(255,255,255,.75), transparent 62%)",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-3 border border-gold-600/35" />
        <div aria-hidden className="pointer-events-none absolute inset-[18px] border border-maroon-700/12" />
        <Corners />

        <div className="relative text-center">
          <div className="flex justify-center">
            <GoldCross size={52} className="drop-shadow-[0_4px_10px_rgba(132,100,26,.35)]" />
          </div>

          <p className="mt-5 font-display text-[12px] italic leading-relaxed text-maroon-700/80 sm:text-[13px]">
            “கர்த்தர் தந்த நாள் இதுவே; இதில் களிகூர்ந்து மகிழ்வோமாக”
          </p>
          <p className="mt-1 text-[9px] tracking-[0.3em] text-gold-700">சங்கீதம் 118:24</p>

          <Flourish width={220} className="mx-auto mt-5 opacity-80" />

          <p className="mt-6 text-[10px] font-semibold tracking-[0.46em] text-maroon-700/70 sm:text-[11px]">
            நிச்சயதார்த்த
          </p>
          <h3 className="mt-1.5 font-display text-4xl font-semibold tracking-wide text-maroon-800 sm:text-5xl">
            அழைப்பிதழ்
          </h3>

          <p className="mx-auto mt-8 max-w-md text-[13px] leading-loose text-maroon-800/85 sm:text-sm">
            {e.invite}
          </p>

          <div className="mt-9">
            <p className="font-display text-[2.1rem] font-semibold leading-tight text-maroon-900 sm:text-[2.6rem]">
              {wedding.groom.name}
            </p>
            <p className="mx-auto mt-1.5 max-w-xs text-[11px] leading-relaxed text-maroon-700/70">
              {wedding.groom.parents}
            </p>

            <div className="my-4 flex items-center justify-center gap-4">
              <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold-600/60 sm:w-20" />
              <span className="font-display text-[15px] italic tracking-[0.2em] text-gold-700">மற்றும்</span>
              <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold-600/60 sm:w-20" />
            </div>

            <p className="font-display text-[2.1rem] font-semibold leading-tight text-maroon-900 sm:text-[2.6rem]">
              {wedding.bride.name}
            </p>
            <p className="mx-auto mt-1.5 max-w-xs text-[11px] leading-relaxed text-maroon-700/70">
              {wedding.bride.parents}
            </p>
          </div>

          <Flourish width={240} className="mx-auto mt-8 opacity-80" />

          <div className="mx-auto mt-8 flex max-w-sm items-stretch justify-center">
            <div className="flex flex-1 flex-col items-center justify-center border-y border-gold-600/35 py-3.5">
              <span className="text-[9px] tracking-[0.3em] text-maroon-700/65">கிழமை</span>
              <span className="mt-1 font-display text-sm font-semibold text-maroon-900">
                {e.day.split(",")[0]}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center border-y-2 border-gold-600/60 bg-gold-100/45 px-5 py-2.5">
              <span className="font-display text-[2.4rem] font-bold leading-none text-maroon-800">
                {e.day.match(/\d+/)?.[0] ?? ""}
              </span>
              <span className="mt-1 text-[10px] font-semibold tracking-[0.18em] text-maroon-700">
                {e.day.replace(/^[^,]*,\s*/, "").replace(/^\d+\s*/, "")}
              </span>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center border-y border-gold-600/35 py-3.5">
              <span className="text-[9px] tracking-[0.3em] text-maroon-700/65">நேரம்</span>
              <span className="mt-1 font-display text-sm font-semibold text-maroon-900">{e.time}</span>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-[9px] tracking-[0.34em] text-maroon-700/65">விழா நடைபெறும் இடம்</p>
            <p className="mt-2 font-display text-xl font-semibold text-maroon-900 sm:text-2xl">{e.venue}</p>
            <p className="mx-auto mt-1.5 max-w-sm text-[12px] leading-relaxed text-maroon-800/75">
              {e.address}
            </p>
          </div>

          {/* Directions button with glow */}
          <div className="mt-8">
            <Magnetic strength={14}>
              <a
                href={mapsLink(e.venue, e.address)}
                target="_blank"
                rel="noreferrer"
                className="glow-btn group relative inline-flex items-center gap-2.5 overflow-hidden border-2 border-gold-600/65 bg-gradient-to-b from-gold-100 to-gold-300/70 px-8 py-3 text-[12px] font-semibold tracking-[0.2em] text-maroon-900 transition-all duration-300 hover:border-gold-500 hover:from-gold-50 hover:shadow-[0_0_34px_8px_rgba(226,185,80,.55)]"
              >
                {/* Shine sweep */}
                <span
                  aria-hidden
                  className="glow-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                />
                <MapPin size={15} className="relative transition-transform duration-300 group-hover:-translate-y-0.5" />
                <span className="relative">வழியைக் காண்க</span>
              </a>
            </Magnetic>
          </div>

          <div className="mt-9 border-t border-dashed border-gold-600/35 pt-6">
            <p className="font-display text-[13px] italic leading-relaxed text-maroon-800/85">
              தங்களின் வருகையும் பிரார்த்தனையும் எங்கள் மகிழ்ச்சியை நிறைவாக்கும்
            </p>
            <p className="mt-3 text-[10px] tracking-[0.3em] text-maroon-700/65">அன்புடன், இரு குடும்பத்தினர்</p>
          </div>
        </div>

        {/* Wax seal */}
        <div className="absolute -right-1 bottom-6 sm:right-3">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-gold-500/55 bg-[radial-gradient(circle_at_34%_30%,#8a2134,#4d0e1b_72%)] shadow-[0_14px_30px_-10px_rgba(60,10,20,.75)] sm:h-20 sm:w-20">
            <div className="flex h-[84%] w-[84%] flex-col items-center justify-center rounded-full border border-gold-300/40">
              <GoldCross size={24} />
              <span className="mt-0.5 text-[6.5px] font-semibold tracking-[0.26em] text-gold-200/90">
                அழைப்பு
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main: the card unrolls like a mat, once, over 4 seconds ---------- */

export default function InvitationCard() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Starts when the card is clearly on screen
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });

  // 0 = rolled up at the top, 1 = fully unrolled
  const progress = useMotionValue(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(progress, 1, {
      duration: UNROLL_SECONDS,
      ease: [0.45, 0, 0.25, 1],
    });
    return () => controls.stop();
  }, [inView, reduce, progress]);

  const clipPath = useTransform(progress, (v) => `inset(0 0 ${(1 - v) * 100}% 0)`);
  const rollerTop = useTransform(progress, (v) => `${v * 100}%`);
  const rollerOpacity = useTransform(progress, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);

  if (reduce) {
    return (
      <div className="relative mx-auto mt-14 w-full max-w-[640px]">
        <CardInside />
      </div>
    );
  }

  return (
    <div className="relative mx-auto mt-14 w-full max-w-[640px]">
      <div ref={ref} className="relative">
        {/* The paper, revealed from the top as the roller moves down */}
        <motion.div style={{ clipPath }} className="relative">
          <CardInside />
        </motion.div>

        {/* The roller on the leading edge */}
        <motion.div
          aria-hidden
          style={{ top: rollerTop, opacity: rollerOpacity }}
          className="pointer-events-none absolute inset-x-[-6px] z-30 h-9 -translate-y-1/2 rounded-full bg-[linear-gradient(to_bottom,#5c3d0c_0%,#c9a227_18%,#fff6d6_34%,#e9cd7f_50%,#a8811f_72%,#4d3108_100%)] shadow-[0_12px_24px_-8px_rgba(60,15,22,.5)]"
        />
      </div>
    </div>
  );
}