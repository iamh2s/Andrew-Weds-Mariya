import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface ButterfliesProps {
  /** How many butterflies fly together. */
  count?: number;
  /** Largest butterfly size in px (they shrink on small screens). */
  maxSize?: number;
  /** Fade out over text, photos and buttons so they never hide content. */
  avoidContent?: boolean;
  /** Little hearts float up when two butterflies come close. */
  hearts?: boolean;
}

interface Palette {
  light: string;
  mid: string;
  dark: string;
  edge: string;
  spot: string;
  body: string;
}

/* Colours from the invitation: gold, maroon, rose, blush and champagne. */
const PALETTES: Palette[] = [
  { light: "#f7e3a6", mid: "#d4a93a", dark: "#7a1f33", edge: "#4a0f1c", spot: "#fff4d2", body: "#2a0a12" },
  { light: "#fff0e2", mid: "#f0a3b3", dark: "#a63a52", edge: "#6b1d2e", spot: "#fff8f0", body: "#3a0d18" },
  { light: "#fff6e0", mid: "#efd38a", dark: "#8a5a22", edge: "#4a2e12", spot: "#ffffff", body: "#2a1a0a" },
  { light: "#ffe3e8", mid: "#e8909f", dark: "#9c2f48", edge: "#5a1424", spot: "#fff1f3", body: "#2e0a14" },
  { light: "#fbf1dc", mid: "#e2c58a", dark: "#6b3a2a", edge: "#3a1c14", spot: "#fffaf0", body: "#24100a" },
];

/* Slightly different size and wingbeat for each butterfly, so they look natural. */
const SIZE_MULTS = [1, 0.88, 0.96, 0.8, 0.92];
const FLAP_HZ = [8.5, 9.5, 8.8, 10, 9.1];
const FLUTTER_HZ = [2.1, 2.6, 2.3, 2.8, 2.4];

const HEART_COLORS = ["#e8909f", "#f2dfa6", "#d4546f", "#fff0f3"];
const HEART_POOL = 100;

interface Bird {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  t: number;
  phase: number;
  amp: number;
  flapping: boolean;
  modeLeft: number;
  op: number;
  age: number;
  over: boolean;
}

interface Heart {
  x: number;
  y: number;
  life: number;
  max: number;
  sway: number;
  rot: number;
  alive: boolean;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const squeeze = (sx: number) => `translate(50 0) scale(${sx} 1) translate(-50 0)`;

/* ── Content detection: what a butterfly should not cover ────────────── */

/* Add data-keep-clear to any element you also want to keep uncovered. */
const CONTENT_SELECTOR =
  "h1,h2,h3,h4,h5,h6,p,li,a,button,input,textarea,select,label,img,video,blockquote,figcaption,td,th,[data-keep-clear]";

const TEXT_HOLDERS = new Set(["SPAN", "DIV", "STRONG", "EM", "B", "I", "SMALL"]);

function isContentEl(el: Element): boolean {
  if (el.matches(CONTENT_SELECTOR)) return true;

  /* A span or div counts only if it holds real text of its own. */
  if (TEXT_HOLDERS.has(el.tagName)) {
    return Array.from(el.childNodes).some(
      (node) => node.nodeType === 3 && !!node.textContent?.trim()
    );
  }
  return false;
}

/* True if something at (x, y) is sitting over text, a photo or a control. */
function coversContent(x: number, y: number, size: number): boolean {
  const r = size * 0.35;
  const points: [number, number][] = [
    [x, y],
    [x - r, y],
    [x + r, y],
    [x, y - r],
    [x, y + r],
  ];

  for (const [px, py] of points) {
    if (px < 0 || py < 0 || px > window.innerWidth || py > window.innerHeight) continue;
    const stack = document.elementsFromPoint(px, py).slice(0, 8);
    if (stack.some(isContentEl)) return true;
  }
  return false;
}

/* ── Right-hand wings (the left side is a mirror copy) ───────────────── */

function ForeWing({ id, p }: { id: string; p: Palette }) {
  return (
    <>
      <path
        d="M50 47 C55 25 78 3 93 12 C102 19 98 40 82 51 C72 57 59 55 52 51 Z"
        fill={`url(#${id})`}
        stroke={p.edge}
        strokeOpacity="0.7"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M52 50 C64 38 78 24 90 15 M52 50 C68 44 84 38 95 28 M52 51 C66 50 78 48 88 45"
        fill="none"
        stroke={p.edge}
        strokeOpacity="0.28"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
      <circle cx="90" cy="16" r="1.9" fill={p.spot} fillOpacity="0.9" />
      <circle cx="95" cy="25" r="1.6" fill={p.spot} fillOpacity="0.85" />
      <circle cx="93" cy="35" r="1.4" fill={p.spot} fillOpacity="0.8" />
      <circle cx="86" cy="44" r="1.2" fill={p.spot} fillOpacity="0.75" />
    </>
  );
}

function HindWing({ id, p }: { id: string; p: Palette }) {
  return (
    <>
      <path
        d="M52 53 C67 52 85 59 82 76 C80 90 63 93 56 80 C52 72 52 62 52 53 Z"
        fill={`url(#${id})`}
        stroke={p.edge}
        strokeOpacity="0.7"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M52 54 C66 60 75 70 78 82 M52 55 C64 58 76 62 82 70"
        fill="none"
        stroke={p.edge}
        strokeOpacity="0.28"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
      <circle cx="79" cy="80" r="1.6" fill={p.spot} fillOpacity="0.85" />
      <circle cx="72" cy="86" r="1.4" fill={p.spot} fillOpacity="0.8" />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */

/*
 * A flock of butterflies in love. An invisible "guide" point wanders slowly
 * across the screen, and the butterflies circle it together, spreading out
 * and swirling back in. When two of them come close, little hearts float
 * up between them.
 */
export default function Butterflies({
  count = 5,
  maxSize = 110,
  avoidContent = true,
  hearts = true,
}: ButterfliesProps) {
  const reduce = useReducedMotion();
  const n = Math.max(1, Math.round(count));

  const flock = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => ({
        palette: PALETTES[i % PALETTES.length],
        sizeMul: SIZE_MULTS[i % SIZE_MULTS.length],
        flapHz: FLAP_HZ[i % FLAP_HZ.length],
        flutterHz: FLUTTER_HZ[i % FLUTTER_HZ.length],
        ringMul: 0.85 + 0.3 * Math.abs(Math.sin(i * 1.7 + 0.4)),
      })),
    [n]
  );

  const boxes = useRef<(HTMLDivElement | null)[]>([]);
  const fores = useRef<(SVGGElement | null)[]>([]);
  const hinds = useRef<(SVGGElement | null)[]>([]);
  const heartEls = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reduce) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let base = clamp(Math.min(w, h) * 0.14, 40, maxSize);

    const sizeOf = (i: number) => base * flock[i].sizeMul;

    const applySizes = () => {
      flock.forEach((_, i) => {
        const el = boxes.current[i];
        if (!el) return;
        const s = sizeOf(i);
        el.style.width = `${s}px`;
        el.style.height = `${s}px`;
      });
    };
    applySizes();

    /* The invisible guide the flock circles around. */
    const guide = { x: w * 0.5, y: h * 0.45, vx: 0, vy: 0, tx: w * 0.5, ty: h * 0.45 };

    const pickGuideTarget = () => {
      const m = Math.min(base * 3.6, w / 2 - 1, h / 2 - 1);
      for (let k = 0; k < 6; k += 1) {
        guide.tx = m + Math.random() * Math.max(1, w - m * 2);
        guide.ty = m + Math.random() * Math.max(1, h - m * 2);
        if (Math.hypot(guide.tx - guide.x, guide.ty - guide.y) > Math.min(w, h) * 0.3) break;
      }
    };
    pickGuideTarget();

    const birds: Bird[] = flock.map((_, i) => ({
      x: guide.x + Math.cos((i / n) * Math.PI * 2) * base,
      y: guide.y + Math.sin((i / n) * Math.PI * 2) * base,
      vx: 0,
      vy: 0,
      angle: Math.random() * 360,
      t: Math.random() * 10,
      phase: Math.random() * Math.PI * 2,
      amp: 1,
      flapping: true,
      modeLeft: 0.8 + Math.random() * 1.5,
      op: 0,
      age: 0,
      over: false,
    }));

    const heartPool: Heart[] = Array.from({ length: HEART_POOL }, () => ({
      x: 0,
      y: 0,
      life: 0,
      max: 1,
      sway: 0,
      rot: 0,
      alive: false,
    }));
    let heartTimer = 1.5;
    let heartIndex = 0;

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      base = clamp(Math.min(w, h) * 0.14, 40, maxSize);
      applySizes();
      pickGuideTarget();
    };

    let last = performance.now();
    const onVisibility = () => {
      last = performance.now();
    };

    /* Check what is under each butterfly a few times a second. */
    const sampler = window.setInterval(() => {
      if (document.hidden) return;
      birds.forEach((b, i) => {
        b.over = avoidContent && coversContent(b.x, b.y, sizeOf(i));
      });
    }, 140);

    let t = 0;
    let orbit = Math.random() * Math.PI * 2;
    let raf = 0;

    const frame = (now: number) => {
      /* Cap the step so a background tab never makes them jump. */
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      /* 1. The guide drifts slowly to a new spot now and then. */
      const gdx = guide.tx - guide.x;
      const gdy = guide.ty - guide.y;
      const gdist = Math.hypot(gdx, gdy) || 1;
      if (gdist < 80) pickGuideTarget();
      const gspeed = clamp(Math.max(w, h) * 0.045, 28, 80);
      const gk = 1 - Math.exp(-dt * 0.8);
      guide.vx += ((gdx / gdist) * gspeed - guide.vx) * gk;
      guide.vy += ((gdy / gdist) * gspeed - guide.vy) * gk;
      guide.x += guide.vx * dt;
      guide.y += guide.vy * dt;

      /* 2. The flock spreads out and swirls back in together. */
      const spread = 0.5 + 0.5 * Math.sin(t * 0.55 - 1.2);
      const radius = base * (0.85 + 2.1 * spread);
      orbit += dt * (0.8 + 0.3 * Math.sin(t * 0.4));

      birds.forEach((b, i) => {
        const el = boxes.current[i];
        if (!el) return;

        const cfg = flock[i];
        const s = sizeOf(i);
        b.t += dt;

        /* Alternate between a burst of flapping and a calm glide. */
        b.modeLeft -= dt;
        if (b.modeLeft <= 0) {
          b.flapping = !b.flapping;
          b.modeLeft = b.flapping ? 1 + Math.random() * 1.6 : 0.4 + Math.random() * 0.9;
        }
        b.amp += ((b.flapping ? 1 : 0.12) - b.amp) * (1 - Math.exp(-dt * 5));
        b.phase += dt * cfg.flapHz * Math.PI * 2 * (0.3 + 0.7 * b.amp);

        /* Forewings lead; hindwings follow a beat behind. */
        const openFore = (1 + Math.cos(b.phase)) / 2;
        const openHind = (1 + Math.cos(b.phase - 0.7)) / 2;
        fores.current[i]?.setAttribute("transform", squeeze(1 - 0.78 * b.amp * (1 - openFore)));
        hinds.current[i]?.setAttribute("transform", squeeze(1 - 0.7 * b.amp * (1 - openHind)));

        /* Each butterfly takes its own place around the circle. */
        const ang = orbit + (i / n) * Math.PI * 2;
        const px = clamp(
          guide.x + Math.cos(ang) * radius * 1.15 * cfg.ringMul,
          s,
          Math.max(s, w - s)
        );
        const py = clamp(
          guide.y + Math.sin(ang) * radius * 0.8 * cfg.ringMul +
            Math.sin(t * 1.3 + i * 2) * base * 0.18,
          s,
          Math.max(s, h - s)
        );

        const dx = px - b.x;
        const dy = py - b.y;
        const dist = Math.hypot(dx, dy) || 1;

        /* Chase that spot, with a gentle flutter so the path weaves. */
        const maxSpeed = clamp(Math.max(w, h) * 0.2, 120, 320);
        const speed = Math.min(maxSpeed, dist * 3.2);
        const flutter = Math.sin(b.t * cfg.flutterHz + i * 1.7) * speed * 0.22;
        const desiredVx = (dx / dist) * speed + (-dy / dist) * flutter;
        const desiredVy = (dy / dist) * speed + (dx / dist) * flutter;

        const k = 1 - Math.exp(-dt * 3.4);
        b.vx += (desiredVx - b.vx) * k;
        b.vy += (desiredVy - b.vy) * k;
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        /* Face the way it travels, turning the short way round. */
        if (Math.hypot(b.vx, b.vy) > 10) {
          const heading = (Math.atan2(b.vy, b.vx) * 180) / Math.PI + 90;
          const delta = ((heading - b.angle + 540) % 360) - 180;
          b.angle += delta * (1 - Math.exp(-dt * 3.2));
        }

        /* A little lift with each downstroke. */
        const bob = -Math.sin(b.phase) * s * 0.05 * b.amp;

        el.style.transform = `translate3d(${b.x - s / 2}px, ${
          b.y + bob - s / 2
        }px, 0) rotate(${b.angle}deg)`;

        /* Fade in one by one at the start, and fade out over content. */
        b.age += dt;
        const target = b.age < i * 0.4 ? 0 : b.over ? 0.08 : 1;
        b.op += (target - b.op) * (1 - Math.exp(-dt * (b.over ? 7 : 2.5)));
        el.style.opacity = b.op.toFixed(3);
      });

      /* 3. Hearts drift up when two butterflies are close together. */
      if (hearts) {
        heartTimer -= dt;

        let bestI = -1;
        let bestJ = -1;
        let bestD = Infinity;
        for (let i = 0; i < birds.length; i += 1) {
          for (let j = i + 1; j < birds.length; j += 1) {
            const a = birds[i];
            const c = birds[j];
            if (a.over || c.over || a.op < 0.8 || c.op < 0.8) continue;
            const d = Math.hypot(a.x - c.x, a.y - c.y);
            if (d < bestD) {
              bestD = d;
              bestI = i;
              bestJ = j;
            }
          }
        }

        if (heartTimer <= 0 && bestI >= 0 && bestD < base * 2.8) {
          const a = birds[bestI];
          const c = birds[bestJ];
          const hp = heartPool[heartIndex % HEART_POOL];
          heartIndex += 1;
          hp.x = (a.x + c.x) / 2 + (Math.random() - 0.5) * base * 0.5;
          hp.y = (a.y + c.y) / 2 - base * 0.2;
          hp.life = 0;
          hp.max = 2.2 + Math.random() * 1.2;
          hp.sway = Math.random() * Math.PI * 2;
          hp.rot = (Math.random() - 0.5) * 30;
          hp.alive = true;
          heartTimer = 0.45 + Math.random() * 0.45;
        }

        const heartScale = clamp(base * 0.3, 10, 16) / 16;
        heartPool.forEach((hp, i) => {
          const el = heartEls.current[i];
          if (!el) return;

          if (!hp.alive) {
            el.style.opacity = "0";
            return;
          }

          hp.life += dt;
          const p = hp.life / hp.max;
          if (p >= 1) {
            hp.alive = false;
            el.style.opacity = "0";
            return;
          }

          hp.y -= dt * (22 + 18 * p);
          const x = hp.x + Math.sin(hp.life * 2.2 + hp.sway) * 8;
          const grow = (0.55 + 0.6 * Math.min(1, p * 2.5)) * heartScale;

          el.style.transform = `translate3d(${x - 8}px, ${hp.y - 8}px, 0) rotate(${hp.rot}deg) scale(${grow})`;
          el.style.opacity = (Math.sin(Math.PI * p) * 0.9).toFixed(3);
        });
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(sampler);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce, flock, n, maxSize, avoidContent, hearts]);

  if (reduce) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[45] overflow-hidden"
    >
      {/* Hearts */}
      {hearts &&
        Array.from({ length: HEART_POOL }, (_, i) => (
          <div
            key={`heart-${i}`}
            ref={(el) => {
              heartEls.current[i] = el;
            }}
            className="absolute left-0 top-0 h-4 w-4 will-change-transform"
            style={{ opacity: 0, color: HEART_COLORS[i % HEART_COLORS.length] }}
          >
            <svg viewBox="0 0 24 24" className="h-full w-full" fill="currentColor">
              <path d="M12 21s-7-4.6-9.3-9C1.2 9 2.4 5.5 5.7 5.2c2-.2 3.6.8 4.3 2.1.7-1.3 2.3-2.3 4.3-2.1 3.3.3 4.5 3.8 3 6.8C19 16.4 12 21 12 21z" />
            </svg>
          </div>
        ))}

      {/* The flock */}
      {flock.map((cfg, i) => {
        const p = cfg.palette;
        const foreId = `bf${i}-fore`;
        const hindId = `bf${i}-hind`;

        return (
          <div
            key={i}
            ref={(el) => {
              boxes.current[i] = el;
            }}
            className="absolute left-0 top-0 will-change-transform"
            style={{ opacity: 0 }}
          >
            <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
              <defs>
                <radialGradient id={foreId} cx="52" cy="50" r="52" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={p.light} />
                  <stop offset="45%" stopColor={p.mid} />
                  <stop offset="100%" stopColor={p.dark} />
                </radialGradient>
                <radialGradient id={hindId} cx="52" cy="55" r="42" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={p.light} />
                  <stop offset="50%" stopColor={p.mid} />
                  <stop offset="100%" stopColor={p.dark} />
                </radialGradient>
              </defs>

              {/* Hindwings sit behind the forewings */}
              <g
                ref={(el) => {
                  hinds.current[i] = el;
                }}
              >
                <HindWing id={hindId} p={p} />
                <g transform="translate(100 0) scale(-1 1)">
                  <HindWing id={hindId} p={p} />
                </g>
              </g>

              <g
                ref={(el) => {
                  fores.current[i] = el;
                }}
              >
                <ForeWing id={foreId} p={p} />
                <g transform="translate(100 0) scale(-1 1)">
                  <ForeWing id={foreId} p={p} />
                </g>
              </g>

              {/* Body and antennae stay still */}
              <ellipse cx="50" cy="55" rx="2.6" ry="16" fill={p.body} />
              <circle cx="50" cy="42" r="3.6" fill={p.body} />
              <circle cx="50" cy="33" r="3" fill={p.body} />
              <path
                d="M49 31 Q44 20 37 15 M51 31 Q56 20 63 15"
                fill="none"
                stroke={p.body}
                strokeWidth="1"
                strokeLinecap="round"
              />
              <circle cx="37" cy="15" r="1.5" fill={p.body} />
              <circle cx="63" cy="15" r="1.5" fill={p.body} />
            </svg>
          </div>
        );
      })}
    </div>
  );
}