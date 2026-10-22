import { motion } from "framer-motion";
import { wedding } from "../data/wedding";

/* ---------- தங்க நிறச் சிலுவை ---------- */
export function GoldCross({ className = "", size = 56 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 64 96"
      width={size * (2 / 3)}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="crossGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f8ecc9" />
          <stop offset="40%" stopColor="#e9cd7f" />
          <stop offset="70%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#a8811f" />
        </linearGradient>
      </defs>
      <path
        d="M32 3 L38 12 H50 L40 22 V82 L32 93 L24 82 V22 L14 12 H26 Z"
        fill="url(#crossGold)"
        stroke="#7c5a12"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M32 10 L34.5 14.5 H44 L37 21.5 V78 L32 85.5 L27 78 V21.5 L20 14.5 H29.5 Z"
        fill="none"
        stroke="#fdf6dd"
        strokeOpacity="0.55"
        strokeWidth="1"
      />
      <circle cx="32" cy="22" r="4.4" fill="#24060c" fillOpacity="0.9" stroke="#e9cd7f" strokeWidth="1.2" />
      <circle cx="32" cy="22" r="1.8" fill="#f2dfa6" />
    </svg>
  );
}

/* ---------- அலங்கார பிரிப்பான் ---------- */
export function Flourish({ className = "", width = 320 }: { className?: string; width?: number }) {
  return (
    <svg
      viewBox="0 0 320 28"
      width={width}
      height={Math.round((width / 320) * 28)}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="flGold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a8811f" />
          <stop offset="50%" stopColor="#e9cd7f" />
          <stop offset="100%" stopColor="#a8811f" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#flGold)" strokeWidth="1.4" strokeLinecap="round">
        <path d="M8 14 H112" />
        <path d="M208 14 H312" />
        <path d="M112 14 C124 14 132 8 140 8" />
        <path d="M208 14 C196 14 188 8 180 8" />
        <path d="M118 14 c6 -6 12 -8 18 -8 c-4 4 -8 8 -18 8Z" fill="url(#flGold)" stroke="none" opacity="0.9" />
        <path d="M202 14 c-6 -6 -12 -8 -18 -8 c4 4 8 8 18 8Z" fill="url(#flGold)" stroke="none" opacity="0.9" />
      </g>
      <path d="M160 6 L168 14 L160 22 L152 14 Z" fill="url(#flGold)" stroke="#7c5a12" strokeWidth="1" />
      <circle cx="160" cy="14" r="2" fill="#24060c" opacity="0.35" />
      <circle cx="100" cy="14" r="2.2" fill="url(#flGold)" />
      <circle cx="220" cy="14" r="2.2" fill="url(#flGold)" />
      <circle cx="8" cy="14" r="2.6" fill="url(#flGold)" />
      <circle cx="312" cy="14" r="2.6" fill="url(#flGold)" />
    </svg>
  );
}

/* ---------- மூலை அலங்காரம் ---------- */
export function Corner({ className = "", size = 72 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <linearGradient id="cornerGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e9cd7f" />
          <stop offset="100%" stopColor="#c9a227" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#cornerGold)" strokeLinecap="round">
        <path d="M6 42 Q6 6 42 6" strokeWidth="2" />
        <path d="M14 56 Q14 14 56 14" strokeWidth="1.2" opacity="0.85" />
        <path d="M6 42 Q30 42 42 30 Q42 16 42 6" strokeWidth="1.2" opacity="0.7" />
        <path d="M24 24 q10 -2 16 4 q2 -10 -4 -16" strokeWidth="1.2" opacity="0.8" />
      </g>
      <circle cx="42" cy="6" r="2.6" fill="url(#cornerGold)" />
      <circle cx="6" cy="42" r="2.6" fill="url(#cornerGold)" />
      <circle cx="56" cy="14" r="2" fill="url(#cornerGold)" />
      <circle cx="14" cy="56" r="2" fill="url(#cornerGold)" />
      <path d="M24 24 l5 5 -5 5 -5 -5Z" fill="url(#cornerGold)" opacity="0.9" />
    </svg>
  );
}

/* ---------- நுண் கோட்டு மூலைக் குறிகள் ---------- */
export function Tick({ className = "", size = 13 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} className={className} aria-hidden="true">
      <path d="M10 2 V18 M2 10 H18" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- சிறு தங்கப் பிரிப்பான் ---------- */
export function MiniRule({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const c = tone === "dark" ? "bg-gold-500/50" : "bg-maroon-700/30";
  const d = tone === "dark" ? "bg-gold-300" : "bg-gold-600";
  return (
    <div className={`flex items-center justify-center gap-2.5 ${className}`} aria-hidden="true">
      <span className={`h-px w-14 ${c}`} />
      <span className={`h-1.5 w-1.5 rotate-45 ${d}`} />
      <span className={`h-px w-14 ${c}`} />
    </div>
  );
}

/* ---------- மொனோகிராம் கிறெஸ்ட் ---------- */
export function MonogramCrest({
  size = 110,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <linearGradient id="crestGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f8ecc9" />
          <stop offset="50%" stopColor="#e9cd7f" />
          <stop offset="100%" stopColor="#a8811f" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="55" fill="none" stroke="url(#crestGold)" strokeWidth="1.3" />
      <circle cx="60" cy="60" r="48.5" fill="none" stroke="url(#crestGold)" strokeWidth="0.7" opacity="0.75" />
      {/* மேல் சிலுவை */}
      <path d="M60 13 v12 M55 19 h10" stroke="url(#crestGold)" strokeWidth="2" strokeLinecap="round" />
      {/* மொனோகிராம் எழுத்துகள் */}
      <text
        x="43"
        y="73"
        textAnchor="middle"
        fontFamily="'Tiro Tamil','Noto Serif Tamil',serif"
        fontSize="27"
        fill="url(#crestGold)"
      >
        {wedding.monogram.groom}
      </text>
      <text
        x="79"
        y="73"
        textAnchor="middle"
        fontFamily="'Tiro Tamil','Noto Serif Tamil',serif"
        fontSize="27"
        fill="url(#crestGold)"
      >
        {wedding.monogram.bride}
      </text>
      <path d="M60 56 l4.5 4.5 -4.5 4.5 -4.5 -4.5Z" fill="url(#crestGold)" />
      {/* கீழ் அலங்கார வளைவு */}
      <path d="M30 88 q30 14 60 0" fill="none" stroke="url(#crestGold)" strokeWidth="1" opacity="0.8" />
      <circle cx="30" cy="88" r="1.6" fill="url(#crestGold)" />
      <circle cx="90" cy="88" r="1.6" fill="url(#crestGold)" />
      <path d="M60 98 l3 3 -3 3 -3 -3Z" fill="url(#crestGold)" opacity="0.9" />
    </svg>
  );
}

/* ---------- எண்ணிக்கையிட்ட பகுதி தலைப்பு ---------- */
export function SectionHeading({
  num,
  overline,
  title,
  tone = "dark",
}: {
  num: string;
  overline: string;
  title: string;
  tone?: "dark" | "light";
}) {
  const isDark = tone === "dark";
  const hair = isDark ? "to-gold-400/60" : "to-maroon-700/40";
  const hairL = isDark ? "from-gold-400/60" : "from-maroon-700/40";
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center"
    >
      <div className="flex items-center gap-4">
        <span className={`h-px w-12 bg-gradient-to-l ${hair} from-transparent md:w-20`} />
        <span
          className={`text-[10px] font-semibold tracking-[0.5em] md:text-xs ${
            isDark ? "text-gold-400" : "text-gold-700"
          }`}
        >
          பகுதி {num}
        </span>
        <span className={`h-px w-12 bg-gradient-to-r ${hairL} to-transparent md:w-20`} />
      </div>
      <p
        className={`mt-4 text-[11px] font-medium tracking-[0.38em] md:text-sm ${
          isDark ? "text-gold-300/85" : "text-maroon-700/80"
        }`}
      >
        {overline}
      </p>
      <h2
        className={`mt-3 font-display text-4xl font-semibold leading-tight md:text-6xl lg:text-[4.3rem] ${
          isDark ? "gold-text" : "text-maroon-800"
        }`}
      >
        {title}
      </h2>
      <div className="mt-6 flex items-center gap-3.5">
        <span className={`h-px w-16 ${isDark ? "bg-gold-500/40" : "bg-maroon-700/25"}`} />
        <GoldCross size={26} className={isDark ? "opacity-95" : "opacity-90"} />
        <span className={`h-px w-16 ${isDark ? "bg-gold-500/40" : "bg-maroon-700/25"}`} />
      </div>
    </motion.div>
  );
}

/* ---------- கொக்கீய வளைவுப் புகைப்படச் சட்டம் ---------- */
export function ArchFrame({
  src,
  alt,
  className = "",
  imgClassName = "",
  eager = false,
  offset = true,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  offset?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      {offset && (
        <div
          aria-hidden
          className="arch-shape absolute -left-3.5 top-3.5 h-full w-full rounded-b-[20px] border border-gold-500/35 md:-left-5 md:top-5"
        />
      )}
      <div className="arch-shape relative rounded-b-[20px] bg-[linear-gradient(150deg,#f2dfa6,#c9a227_35%,#84641a_60%,#e9cd7f_85%,#a8811f)] p-[2.5px] shadow-[0_35px_70px_-28px_rgba(0,0,0,0.85)]">
        <div className="arch-shape rounded-b-[18px] bg-maroon-950 p-[7px]">
          <div className="arch-shape relative overflow-hidden rounded-b-[12px] border border-gold-400/40">
            <img
              src={src}
              alt={alt}
              loading={eager ? "eager" : "lazy"}
              className={`w-full object-cover ${imgClassName}`}
            />
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_55px_rgba(36,6,12,0.4)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- நேர்முக தங்கச் சட்டம் ---------- */
export function GoldFrame({
  src,
  alt,
  className = "",
  imgClassName = "",
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="rounded-[inherit] bg-[linear-gradient(140deg,#f2dfa6,#c9a227_30%,#84641a_55%,#e9cd7f_80%,#a8811f)] p-[3px] shadow-[0_24px_60px_-18px_rgba(0,0,0,0.75)]">
        <div className="w-full rounded-[inherit] bg-maroon-950 p-[6px]">
          <div className="relative w-full overflow-hidden rounded-[inherit] border border-gold-400/40">
            <img
              src={src}
              alt={alt}
              loading={eager ? "eager" : "lazy"}
              className={`w-full object-cover ${imgClassName}`}
            />
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(36,6,12,0.45)]" />
          </div>
        </div>
      </div>
      <Corner className="absolute -left-3 -top-3 z-10" size={56} />
      <Corner className="absolute -right-3 -top-3 z-10 -scale-x-100" size={56} />
      <Corner className="absolute -bottom-3 -left-3 z-10 -scale-y-100" size={56} />
      <Corner className="absolute -bottom-3 -right-3 z-10 -scale-100" size={56} />
    </div>
  );
}
