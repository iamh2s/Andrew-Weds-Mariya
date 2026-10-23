import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface ButterfliesProps {
  /** How many butterflies fly around the screen. */
  count?: number;
  /** Largest butterfly size in px (they shrink on small screens). */
  maxSize?: number;
  /** Fade out over text, photos and buttons so they never hide content. */
  avoidContent?: boolean;
  /** Hearts float up from the butterflies. */
  hearts?: boolean;
  /** 0 to 2. Higher values release more hearts. */
  heartRate?: number;
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

/* Each butterfly gets its own size, wingbeat, speed and wobble. */
const SIZE_MULTS = [1, 0.88, 0.96, 0.8, 0.92, 1.05];
const FLAP_HZ = [8.5, 9.5, 8.8, 10, 9.1, 9.6];
const SPEED_MULTS = [1, 0.8, 1.15, 0.9, 1.3, 0.95];
const WOBBLE_HZ = [1.9, 2.4, 2.1, 2.8, 2.3, 2.6];

const HEART_COLORS = ["#e8909f", "#f2dfa6", "#d4546f", "#fff0f3", "#f5b5c2"];
const HEART_POOL = 160;

const HEART_PATH =
  "M12 21s-7-4.6-9.3-9C1.2 9 2.4 5.5 5.7 5.2c2-.2 3.6.8 4.3 2.1.7-1.3 2.3-2.3 4.3-2.1 3.3.3 4.5 3.8 3 6.8C19 16.4 12 21 12 21z";

interface Bird {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  retargetIn: number;
  angle: number;
  t: number;
  phase: number;
  amp: number;
  flapping: boolean;
  modeLeft: number;
  op: number;
  age: number;
  over: boolean;
  heartIn: number;
}

interface Heart {
  x: number;
  y: number;
  life: number;
  max: number;
  sway: number;
  rot: number;
  scale: number;
  alive: boolean;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const squeeze = (sx: number) =>
  `translate(50 0) scale(${sx} 1) translate(-50 0)`;

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

/* ── Wings (the left side is a mirror copy of the right) ─────────────── */

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
 * A flock of butterflies in love. Each one wanders across the whole screen
 * on its own winding path, pausing to flutter now and then. It releases
 * hearts as it flies, and when two meet, a burst of hearts floats up.
 */
export default function Butterflies({
  count = 6,
  maxSize = 110,
  avoidContent = true,
  hearts = true,
  heartRate = 1,
}: ButterfliesProps) {
  const reduce = useReducedMotion();
  const n = Math.max(1, Math.round(count));
  const rate = clamp(heartRate, 0, 2);

  const flock = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => ({
        palette: PALETTES[i % PALETTES.length],
        sizeMul: SIZE_MULTS[i % SIZE_MULTS.length],
        flapHz: FLAP_HZ[i % FLAP_HZ.length],
        speedMul: SPEED_MULTS[i % SPEED_MULTS.length],
        wobbleHz: WOBBLE_HZ[i % WOBBLE_HZ.length],
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

    /* A random point inside the screen, kept away from the edges. */
    const randomSpot = (s: number): [number, number] => {
      const m = Math.min(s, w / 2 - 1, h / 2 - 1);
      return [
        m + Math.random() * Math.max(1, w - m * 2),
        m + Math.random() * Math.max(1, h - m * 2),
      ];
    };

    const birds: Bird[] = flock.map((_, i) => {
      const [x, y] = randomSpot(base);
      const [tx, ty] = randomSpot(base);
      return {
        x,
        y,
        vx: 0,
        vy: 0,
        tx,
        ty,
        retargetIn: 2 + Math.random() * 3,
        angle: 0,
        t: Math.random() * 10,
        phase: Math.random() * Math.PI * 2,
        amp: 1,
        flapping: true,
        modeLeft: 0.8 + Math.random() * 1.5,
        op: 0,
        age: -i * 0.35, // staggered entrance
        over: false,
        heartIn: 0.3 + Math.random() * 1.2,
      };
    });

    const heartPool: Heart[] = Array.from({ length: HEART_POOL }, () => ({
      x: 0,
      y: 0,
      life: 0,
      max: 1,
      sway: 0,
      rot: 0,
      scale: 1,
      alive: false,
    }));
    let heartIndex = 0;
    let pairCooldown = 0.5;

    const spawnHeart = (x: number, y: number, scale: number, life: number) => {
      const hp = heartPool[heartIndex % HEART_POOL];
      heartIndex += 1;
      hp.x = x;
      hp.y = y;
      hp.life = 0;
      hp.max = life;
      hp.sway = Math.random() * Math.PI * 2;
      hp.rot = (Math.random() - 0.5) * 40;
      hp.scale = scale;
      hp.alive = true;
    };

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      base = clamp(Math.min(w, h) * 0.14, 40, maxSize);
      applySizes();
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

    let raf = 0;

    const frame = (now: number) => {
      /* Cap the step so a background tab never makes them jump. */
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const baseSpeed = clamp(Math.min(w, h) * 0.16, 60, 220);

      /* 1. Each butterfly flies toward its own wandering target. */
      birds.forEach((b, i) => {
        const el = boxes.current[i];
        if (!el) return;

        const cfg = flock[i];
        const s = sizeOf(i);
        b.t += dt;
        b.age += dt;

        /* Pick a new destination when one is reached, times out, or is over content. */
        const toTargetX = b.tx - b.x;
        const toTargetY = b.ty - b.y;
        const toTarget = Math.hypot(toTargetX, toTargetY);
        b.retargetIn -= dt;
        if (toTarget < s * 0.6 || b.retargetIn <= 0 || (b.over && b.retargetIn < 1)) {
          [b.tx, b.ty] = randomSpot(s);
          b.retargetIn = 2 + Math.random() * 3.5;
        }

        /* Alternate between a burst of flapping and a calm glide. */
        b.modeLeft -= dt;
        if (b.modeLeft <= 0) {
          b.flapping = !b.flapping;
          b.modeLeft = b.flapping ? 1 + Math.random() * 1.6 : 0.4 + Math.random() * 0.9;
        }
        b.amp += ((b.flapping ? 1 : 0.15) - b.amp) * (1 - Math.exp(-dt * 5));
        b.phase += dt * cfg.flapHz * Math.PI * 2 * (0.3 + 0.7 * b.amp);

        /* Forewings lead; hindwings follow a beat behind. */
        const openFore = (1 + Math.cos(b.phase)) / 2;
        const openHind = (1 + Math.cos(b.phase - 0.7)) / 2;
        fores.current[i]?.setAttribute("transform", squeeze(1 - 0.78 * b.amp * (1 - openFore)));
        hinds.current[i]?.setAttribute("transform", squeeze(1 - 0.7 * b.amp * (1 - openHind)));

        /* Steer toward the target, with a sideways wobble so the path weaves. */
        const speed = baseSpeed * cfg.speedMul * (b.over ? 1.4 : 1) * (0.5 + 0.5 * b.amp);
        const dist = toTarget || 1;
        const dirX = toTargetX / dist;
        const dirY = toTargetY / dist;
        const wobble = Math.sin(b.t * cfg.wobbleHz + i * 1.9) * speed * 0.45;
        const desiredVx = dirX * speed + -dirY * wobble;
        const desiredVy = dirY * speed + dirX * wobble;

        const k = 1 - Math.exp(-dt * 2.2);
        b.vx += (desiredVx - b.vx) * k;
        b.vy += (desiredVy - b.vy) * k;
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        /* Keep inside the screen. */
        if (b.x < s / 2) { b.x = s / 2; b.vx = Math.abs(b.vx); }
        if (b.x > w - s / 2) { b.x = w - s / 2; b.vx = -Math.abs(b.vx); }
        if (b.y < s / 2) { b.y = s / 2; b.vy = Math.abs(b.vy); }
        if (b.y > h - s / 2) { b.y = h - s / 2; b.vy = -Math.abs(b.vy); }

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
        const target = b.age < 0 ? 0 : b.over ? 0.08 : 1;
        b.op += (target - b.op) * (1 - Math.exp(-dt * (b.over ? 7 : 2.5)));
        el.style.opacity = b.op.toFixed(3);

        /* Each butterfly releases its own hearts while it is visible. */
        if (hearts && rate > 0 && b.op > 0.5 && !b.over) {
          b.heartIn -= dt;
          if (b.heartIn <= 0) {
            spawnHeart(
              b.x + (Math.random() - 0.5) * s * 0.4,
              b.y - s * 0.2,
              clamp(s * 0.22, 9, 22) / 16 * (0.7 + Math.random() * 0.6),
              2.4 + Math.random() * 1.6
            );
            b.heartIn = (0.5 + Math.random() * 0.9) / rate;
          }
        }
      });

      /* 2. Two butterflies meeting release a burst of hearts. */
      if (hearts && rate > 0) {
        pairCooldown -= dt;
        if (pairCooldown <= 0) {
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

          if (bestI >= 0 && bestD < base * 2) {
            const a = birds[bestI];
            const c = birds[bestJ];
            const mx = (a.x + c.x) / 2;
            const my = (a.y + c.y) / 2;
            const burst = 3 + Math.floor(Math.random() * 3);
            for (let k = 0; k < burst; k += 1) {
              spawnHeart(
                mx + (Math.random() - 0.5) * base * 0.8,
                my + (Math.random() - 0.5) * base * 0.5,
                clamp(base * 0.3, 10, 24) / 16 * (0.8 + Math.random() * 0.6),
                2.6 + Math.random() * 1.4
              );
            }
          }
          pairCooldown = (0.9 + Math.random() * 1.2) / rate;
        }
      }

      /* 3. Hearts drift up, sway and fade. */
      if (hearts) {
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

          hp.y -= dt * (26 + 22 * p);
          const x = hp.x + Math.sin(hp.life * 2.4 + hp.sway) * 10;
          const grow = (0.5 + 0.7 * Math.min(1, p * 2.5)) * hp.scale;

          el.style.transform = `translate3d(${x - 8}px, ${hp.y - 8}px, 0) rotate(${hp.rot}deg) scale(${grow})`;
          el.style.opacity = (Math.sin(Math.PI * p) * 0.95).toFixed(3);
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
  }, [reduce, flock, n, maxSize, avoidContent, hearts, rate]);

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
              <path d={HEART_PATH} />
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