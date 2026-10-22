"use client"

import * as React from "react"

/*
 * Polaroid Line Carousel: an endless loop of instant photos pegged to a
 * sagging string. Drag the line or use the arrows and the prints slide along
 * it, swinging on their pegs and settling with a little overshoot. The card in
 * the middle is the one you're looking at. The track wraps forever in both
 * directions.
 *
 * தமிழ் திருமண அழைப்பிதழுக்காக மொழிபெயர்க்கப்பட்டது.
 */

export type LandPalette = "dawn" | "alpine" | "dusk" | "mist"

export type Slide = {
  image?: string
  title?: string
  caption?: string
  alt?: string
  palette?: LandPalette
  seed?: number
}

export type PolaroidLineCarouselProps = {
  slides?: Slide[]
  /** How many times the photo set repeats around the track */
  loops?: number
  height?: number | string
  cardWidth?: number
  sag?: number
  swing?: number
  autoplay?: number
  string?: string
  background?: string
  ink?: string
  onChange?: (index: number) => void
  className?: string
  style?: React.CSSProperties
  ariaLabel?: string
}

/* Wrap an integer into [0, n) */
export function wrapInt(i: number, n: number): number {
  return n ? ((i % n) + n) % n : 0
}

/* Wrap a position into [-L/2, L/2) so cards loop around the track */
export function wrapPos(v: number, L: number): number {
  return ((((v + L / 2) % L) + L) % L) - L / 2
}

export function clamp(v: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, v))
}

export function stringY(x: number, w: number, y0: number, sag: number): number {
  const t = clamp(x / w, 0, 1)
  return y0 + 4 * sag * t * (1 - t)
}

export function springStep(x: number, v: number, target: number, dt: number, k = 70): [number, number] {
  const c = 2 * Math.sqrt(k)
  const nv = v + (k * (target - x) - c * v) * dt
  return [x + nv * dt, nv]
}

export function swingStep(a: number, w: number, lineVel: number, dt: number, gain: number): [number, number] {
  const nw = w + (-38 * a - 4.2 * w + lineVel * 0.0034 * gain) * dt
  return [clamp(a + nw * dt, -0.6, 0.6), nw]
}

export function pad2(n: number): string {
  return n < 10 ? "0" + n : String(n)
}

/*
 * Fit the cards inside the stage. Card height is about 1.2x its width (photo,
 * note and padding). The string's lowest point sits at y0 + sag, so cards
 * must fit below it.
 */
export function layoutFor(w: number, h: number, cardWidth: number, sag: number) {
  const y0 = Math.max(24, Math.round(h * 0.1))
  const fitH = (h - y0 - sag - 16) / 1.2
  const cw = Math.round(Math.max(140, Math.min(cardWidth, w * 0.7, fitH)))
  return { y0, cw }
}

const PALETTES = {
  dawn: { top: "#e7b7a5", bottom: "#f8e8d6", sun: "#fff4df", far: "#d2b2bb", near: "#3a2a3b", mist: "255,240,232" },
  alpine: { top: "#7ea5c8", bottom: "#e3ecf2", sun: "#ffffff", far: "#a9bfd0", near: "#1c3044", mist: "236,244,250" },
  dusk: { top: "#2a2450", bottom: "#ef8d60", sun: "#ffd9a6", far: "#93607c", near: "#18121f", mist: "255,196,160" },
  mist: { top: "#c4d0cb", bottom: "#eef1ec", sun: "#ffffff", far: "#aebcb5", near: "#2c3a33", mist: "246,248,245" },
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function hexRgb(h: string): [number, number, number] {
  const v = parseInt(h.replace("#", ""), 16)
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
}
function mixRgb(a: string, b: string, t: number): string {
  const A = hexRgb(a)
  const B = hexRgb(b)
  return "rgb(" + A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",") + ")"
}

function paintLandscape(seed: number, palette: LandPalette, w = 1600, h = 1000): string {
  if (typeof document === "undefined") return ""
  const c = document.createElement("canvas")
  c.width = w
  c.height = h
  const g = c.getContext("2d")
  if (!g) return ""
  const P = PALETTES[palette] ?? PALETTES.dawn
  const r = mulberry32(seed * 104729 + 7)

  const sky = g.createLinearGradient(0, 0, 0, h * 0.72)
  sky.addColorStop(0, P.top)
  sky.addColorStop(1, P.bottom)
  g.fillStyle = sky
  g.fillRect(0, 0, w, h)
  const sx = w * (0.22 + r() * 0.56)
  const sy = h * (0.26 + r() * 0.16)
  const halo = g.createRadialGradient(sx, sy, 0, sx, sy, w * 0.45)
  halo.addColorStop(0, "rgba(" + hexRgb(P.sun).join(",") + ",.85)")
  halo.addColorStop(0.08, "rgba(" + hexRgb(P.sun).join(",") + ",.55)")
  halo.addColorStop(1, "rgba(" + hexRgb(P.sun).join(",") + ",0)")
  g.fillStyle = halo
  g.fillRect(0, 0, w, h)
  g.fillStyle = P.sun
  g.beginPath()
  g.arc(sx, sy, h * 0.045, 0, Math.PI * 2)
  g.fill()

  const layers = 5
  for (let L = 0; L < layers; L++) {
    const k = L / (layers - 1)
    const base = h * (0.42 + k * 0.4)
    const amp = h * (0.07 + k * 0.1)
    const ph = [r(), r(), r(), r()].map((v) => v * Math.PI * 2)
    const fr = [1.3 + r(), 3.1 + r() * 2, 7 + r() * 4, 17 + r() * 8]
    const ridge = (x: number) => {
      const u = x / w
      return (
        base -
        amp *
          (0.55 * Math.sin(u * fr[0] + ph[0]) +
            0.28 * Math.sin(u * fr[1] + ph[1]) +
            0.12 * Math.abs(Math.sin(u * fr[2] + ph[2])) +
            0.05 * Math.sin(u * fr[3] + ph[3]))
      )
    }
    const mist = g.createLinearGradient(0, base - amp * 1.4, 0, base + amp * 0.4)
    mist.addColorStop(0, "rgba(" + P.mist + ",0)")
    mist.addColorStop(1, "rgba(" + P.mist + "," + (0.55 - k * 0.35).toFixed(2) + ")")
    g.fillStyle = mist
    g.fillRect(0, base - amp * 1.4, w, amp * 1.8)
    const body = g.createLinearGradient(0, base - amp, 0, h)
    body.addColorStop(0, mixRgb(P.far, P.near, Math.pow(k, 1.3)))
    body.addColorStop(1, mixRgb(P.far, P.near, Math.min(1, Math.pow(k, 1.3) + 0.18)))
    g.fillStyle = body
    g.beginPath()
    g.moveTo(0, h)
    for (let x = 0; x <= w; x += 6) g.lineTo(x, ridge(x))
    g.lineTo(w, h)
    g.closePath()
    g.fill()
    if (L >= layers - 2) {
      g.fillStyle = mixRgb(P.far, P.near, Math.min(1, Math.pow(k, 1.3) + 0.08))
      for (let x = 0; x < w; x += 7 + r() * 9) {
        if (r() < 0.35) continue
        const y = ridge(x) + 2
        const th = h * (0.025 + r() * 0.035) * (0.6 + k)
        const tw = th * 0.32
        g.beginPath()
        g.moveTo(x, y - th)
        g.lineTo(x + tw, y)
        g.lineTo(x - tw, y)
        g.closePath()
        g.fill()
      }
    }
  }

  const vig = g.createRadialGradient(w / 2, h * 0.45, h * 0.3, w / 2, h / 2, w * 0.78)
  vig.addColorStop(0, "rgba(0,0,0,0)")
  vig.addColorStop(1, "rgba(0,0,0,.32)")
  g.fillStyle = vig
  g.fillRect(0, 0, w, h)
  const grain = g.getImageData(0, 0, w, h)
  const d = grain.data
  for (let i = 0; i < d.length; i += 4) {
    const v = (r() - 0.5) * 14
    d[i] += v
    d[i + 1] += v
    d[i + 2] += v
  }
  g.putImageData(grain, 0, 0)
  return c.toDataURL("image/jpeg", 0.88)
}

const DEFAULT_SLIDES: Slide[] = [
  { title: "முதல் ஒளி", caption: "மலைகள் மீது மேலேறும் முழுக்கு", palette: "dawn", seed: 3 },
  { title: "உயர்ந்த பாதை", caption: "தள்ளாடும் வானம், தொலைவான மலைகள்.", palette: "alpine", seed: 8 },
  { title: "மாலை நேரம்", caption: "பள்ளத்தாக்கின் கடைசி வெயில்.", palette: "dusk", seed: 14 },
  { title: "அமைதியான பள்ளம்", caption: "நீள்கிற காற்றுக்கு முன் வெண்மை.", palette: "mist", seed: 21 },
]

function useSlideImages(slides: Slide[]): string[] {
  const key = slides.map((s) => s.image || (s.palette || "dawn") + ":" + (s.seed ?? 1)).join("|")
  const [painted, setPainted] = React.useState(() => slides.map(() => ""))
  React.useEffect(() => {
    setPainted(slides.map((s, i) => (s.image ? "" : paintLandscape(s.seed ?? i + 1, s.palette || "dawn"))))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return slides.map((s, i) => s.image || painted[i] || "")
}

/* The stage holds the string and cards. The bar sits below it in normal flow,
   so the cards can never paint over the caption. */
const PL_CSS = [
  ".pl-root{position:relative;display:flex;flex-direction:column;width:100%;overflow:hidden;background:var(--pl-bg);color:var(--pl-ink);user-select:none;-webkit-user-select:none;touch-action:pan-y;outline:none;cursor:grab;font-family:'Mukta Malar',ui-sans-serif,system-ui,sans-serif}",
  ".pl-root[data-drag='1']{cursor:grabbing}",
  ".pl-root:focus-visible{box-shadow:inset 0 0 0 2px var(--pl-ink)}",
  ".pl-stage{position:relative;flex:1 1 auto;min-height:0;overflow:hidden}",
  ".pl-string{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:visible}",
  ".pl-card{position:absolute;left:0;top:0;width:var(--pl-cw);transform-origin:50% 0;will-change:transform;cursor:inherit}",
  ".pl-print{margin-top:10px;background:#fbfaf7;padding:10px 10px 8px;box-shadow:0 1px 2px rgba(0,0,0,.12),0 18px 30px -16px rgba(0,0,0,.4);transition:transform .5s cubic-bezier(.2,.7,.2,1),filter .5s ease}",
  ".pl-card[data-on='0'] .pl-print{transform:scale(.9);filter:saturate(.7) brightness(.96)}",
  ".pl-shot{position:relative;aspect-ratio:1;overflow:hidden;background:#d9d5cc}",
  ".pl-shot img{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;display:block;pointer-events:none}",
  ".pl-note{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;text-align:center;padding:6px 4px 4px;font-family:'Noto Serif Tamil',ui-serif,Georgia,serif;font-weight:500;font-size:clamp(12px,calc(var(--pl-cw) * .05),16px);line-height:1.7;color:#4d1218;min-height:3.4em}",
  ".pl-peg{position:absolute;left:50%;top:0;width:10px;height:26px;margin-left:-5px;border-radius:2px;background:linear-gradient(90deg,#c9a67a,#e3c9a1 45%,#b8915f);box-shadow:0 2px 3px rgba(0,0,0,.25)}",
  ".pl-peg::after{content:'';position:absolute;left:4px;top:8px;width:2px;height:7px;background:rgba(80,60,30,.45);border-radius:1px}",
  ".pl-bar{position:relative;z-index:5;flex-shrink:0;display:flex;flex-wrap:wrap;align-items:flex-end;gap:10px clamp(12px,2vw,24px);padding:6px clamp(16px,4vw,56px) clamp(14px,3.5vh,32px);cursor:default}",
  ".pl-cap{flex:1 1 0;min-width:0;padding-bottom:.2em}",
  ".pl-cap>*{display:block;animation:pl-in .55s cubic-bezier(.2,.8,.2,1) both}",
  ".pl-title{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;font-family:'Noto Serif Tamil',ui-serif,Georgia,serif;font-weight:600;font-size:clamp(18px,2.4vw,26px);line-height:1.6;padding-bottom:.1em;color:var(--pl-ink)}",
  ".pl-sub{margin-top:2px;font-family:'Mukta Malar',ui-sans-serif,system-ui,sans-serif;font-weight:500;font-size:clamp(13px,1.3vw,15px);line-height:1.7;color:var(--pl-muted)}",
  ".pl-ctrls{display:flex;align-items:center;gap:10px;margin-left:auto}",
  ".pl-btn{appearance:none;width:40px;height:40px;border-radius:50%;border:1px solid var(--pl-line);background:transparent;color:inherit;display:grid;place-items:center;cursor:pointer;transition:background .2s ease,color .2s ease;flex-shrink:0}",
  ".pl-btn:hover{background:var(--pl-ink);color:var(--pl-bg)}",
  ".pl-btn:focus-visible{outline:2px solid var(--pl-ink);outline-offset:2px}",
  ".pl-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
  "@media (max-width:520px){.pl-cap{flex:1 1 100%}.pl-title{font-size:clamp(17px,5.2vw,22px)}}",
  "@keyframes pl-in{from{transform:translateY(100%);opacity:0}to{transform:none;opacity:1}}",
  "@media (prefers-reduced-motion:reduce){.pl-cap>*{animation:none}.pl-print{transition:none}}",
].join("\n")

export default function PolaroidLineCarousel({
  slides = DEFAULT_SLIDES,
  loops = 7,
  height = "100svh",
  cardWidth = 300,
  sag = 46,
  swing = 1,
  autoplay = 4500,
  string = "#8a7f72",
  background = "var(--color-background, #efece6)",
  ink = "var(--color-foreground, #161513)",
  onChange,
  className,
  style,
  ariaLabel = "இனிய நினைவுகள் — புகைப்படச் சரம்",
}: PolaroidLineCarouselProps) {
  const n = slides.length
  const srcs = useSlideImages(slides)
  const [active, setActive] = React.useState(0)
  const [dragging, setDragging] = React.useState(false)
  const [size, setSize] = React.useState({ w: 1200, h: 800, cw: cardWidth, y0: 112 })
  const rootRef = React.useRef(null as HTMLDivElement | null)
  const stageRef = React.useRef(null as HTMLDivElement | null)
  const pathRef = React.useRef(null as SVGPathElement | null)
  const cards = React.useRef([] as (HTMLDivElement | null)[])
  const sim = React.useRef({ off: 0, vel: 0, target: 0, a: [] as number[], w: [] as number[] })
  const drag = React.useRef(null as null | { x: number; off: number; lx: number; lt: number; v: number; moved: boolean })
  const lastTouch = React.useRef(0)
  const activeRef = React.useRef(0)
  const opts = React.useRef({ sag, swing })
  opts.current = { sag, swing }

  const spacing = size.cw * 1.08

  // The photo set repeats `loops` times around the track
  const copies = n ? Math.max(1, loops) : 0
  const total = n * copies
  const loopLen = total * spacing

  const goTo = React.useCallback(
    (i: number) => {
      sim.current.target = i * spacing
    },
    [spacing]
  )

  const curTarget = () => Math.round(sim.current.target / spacing)

  // Measure the stage (not the whole component) and size cards to fit it
  React.useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const ro = new ResizeObserver(() => {
      const w = stage.clientWidth
      const h = stage.clientHeight
      if (!w || !h) return
      const { y0, cw } = layoutFor(w, h, cardWidth, opts.current.sag)
      setSize({ w, h, cw, y0 })
    })
    ro.observe(stage)
    return () => ro.disconnect()
  }, [cardWidth])

  // Keep the current slide in view when the size changes
  React.useEffect(() => {
    sim.current.target = activeRef.current * spacing
    sim.current.off = activeRef.current * spacing
  }, [spacing])

  React.useEffect(() => {
    onChange?.(active)
  }, [active, onChange])

  React.useEffect(() => {
    const root = rootRef.current
    if (!root || n === 0) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const { w, h, cw, y0 } = size
    let visible = true
    let raf = 0
    let prev = performance.now()
    const S = sim.current

    const frame = (now: number) => {
      raf = 0
      if (!visible) return
      const dt = Math.min(0.033, (now - prev) / 1000)
      prev = now
      const d = drag.current
      let lineVel: number
      if (d && d.moved) {
        lineVel = d.v * 1000
      } else {
        const before = S.off
        ;[S.off, S.vel] = springStep(S.off, S.vel, S.target, dt)
        lineVel = -(S.off - before) / Math.max(dt, 1e-3)
      }
      const o = opts.current
      const g = reduce ? 0 : o.swing
      const center = Math.round(S.off / spacing)
      const cIdx = wrapInt(center, total)

      for (let j = 0; j < total; j++) {
        const el = cards.current[j]
        if (!el) continue
        const rel = wrapPos(j * spacing - S.off, loopLen)
        if (Math.abs(rel) > w / 2 + cw * 1.5) {
          el.style.visibility = "hidden"
          continue
        }
        el.style.visibility = "visible"
        const on = j === cIdx ? "1" : "0"
        if (el.dataset.on !== on) el.dataset.on = on

        const x = w / 2 + rel
        let a = S.a[j] || 0
        let av = S.w[j] || 0
        ;[a, av] = swingStep(a, av, lineVel, dt, g)
        if (g) a += Math.sin(now / 1300 + j * 1.7) * 0.0009 * g
        S.a[j] = a
        S.w[j] = av
        const y = stringY(x, w, y0, o.sag) - 6
        el.style.transform = "translate(" + (x - cw / 2).toFixed(1) + "px," + y.toFixed(1) + "px) rotate(" + a.toFixed(4) + "rad)"
        el.style.zIndex = String(j === cIdx ? total + 1 : total - Math.min(total, Math.round(Math.abs(rel) / spacing)))
      }

      pathRef.current?.setAttribute("d", "M0 " + y0 + " Q" + w / 2 + " " + (y0 + 2 * o.sag) + " " + w + " " + y0)

      const slideIdx = wrapInt(center, n)
      if (slideIdx !== activeRef.current) {
        activeRef.current = slideIdx
        setActive(slideIdx)
      }
      raf = requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) {
        prev = performance.now()
        raf = requestAnimationFrame(frame)
      }
    })
    io.observe(root)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [size, spacing, n, total, loopLen])

  React.useEffect(() => {
    if (!autoplay || n < 2) return
    const t = window.setInterval(() => {
      if (document.hidden || drag.current || performance.now() - lastTouch.current < autoplay) return
      goTo(curTarget() + 1)
    }, autoplay)
    return () => window.clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, n, goTo])

  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest(".pl-bar")) return
    lastTouch.current = performance.now()
    drag.current = { x: e.clientX, off: sim.current.off, lx: e.clientX, lt: e.timeStamp, v: 0, moved: false }
  }

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true
      setDragging(true)
      rootRef.current?.setPointerCapture(e.pointerId)
    }
    if (!d.moved) return
    const dt = Math.max(1, e.timeStamp - d.lt)
    d.v = 0.7 * ((e.clientX - d.lx) / dt) + 0.3 * d.v
    d.lx = e.clientX
    d.lt = e.timeStamp
    sim.current.off = d.off - dx
  }

  const onUp = (e: React.PointerEvent) => {
    const d = drag.current
    drag.current = null
    lastTouch.current = performance.now()
    if (!d) return
    if (d.moved) {
      setDragging(false)
      sim.current.vel = -d.v * 1000
      goTo(Math.round((sim.current.off - d.v * 180) / spacing))
      return
    }
    // Tap on a card: move to the nearest copy of that slide
    const card = (e.target as HTMLElement).closest("[data-i]")
    if (card) {
      const k = Number(card.getAttribute("data-i"))
      const cur = curTarget()
      let diff = wrapInt(k - cur, n)
      if (diff > n / 2) diff -= n
      goTo(cur + diff)
    }
  }

  const step = (dir: number) => {
    lastTouch.current = performance.now()
    goTo(curTarget() + dir)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") step(1)
    else if (e.key === "ArrowLeft") step(-1)
    else return
    e.preventDefault()
  }

  const s = slides[active] || {}
  const copyList = Array.from({ length: total }, (_, j) => j)

  return (
    <div
      ref={rootRef}
      className={["pl-root", className].filter(Boolean).join(" ")}
      style={{
        height,
        ["--pl-bg" as string]: background,
        ["--pl-ink" as string]: ink,
        ["--pl-muted" as string]: "color-mix(in srgb, var(--pl-ink) 65%, transparent)",
        ["--pl-line" as string]: "color-mix(in srgb, var(--pl-ink) 24%, transparent)",
        ["--pl-cw" as string]: size.cw + "px",
        ...style,
      }}
      data-drag={dragging ? "1" : "0"}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKey}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <style>{PL_CSS}</style>

      <div ref={stageRef} className="pl-stage">
        <svg className="pl-string" aria-hidden="true">
          <path ref={pathRef} fill="none" stroke={string} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {copyList.map((j) => {
          const i = j % n
          const sl = slides[i]
          return (
            <div
              key={j}
              className="pl-card"
              data-i={i}
              ref={(el) => void (cards.current[j] = el)}
              aria-hidden={j >= n ? true : undefined}
            >
              <div className="pl-print">
                <div className="pl-shot">
                  {srcs[i] ? <img src={srcs[i]} alt={sl.alt || sl.title || ""} draggable={false} /> : null}
                </div>
                <div className="pl-note">{sl.title || ""}</div>
              </div>
              <div className="pl-peg" />
            </div>
          )
        })}
      </div>

      <div className="pl-bar">
        <div className="pl-cap" key={active} aria-hidden="true">
          {s.title ? <span className="pl-title">{s.title}</span> : null}
          {s.caption ? <span className="pl-sub">{s.caption}</span> : null}
        </div>
        <div className="pl-ctrls">
          <button type="button" className="pl-btn" aria-label="முந்தைய புகைப்படம்" onClick={() => step(-1)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
          <button type="button" className="pl-btn" aria-label="அடுத்த புகைப்படம்" onClick={() => step(1)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="pl-sr" aria-live="polite">
        {"படம் " + (active + 1) + ", மொத்தம் " + n + (s.title ? ": " + s.title : "")}
      </div>
    </div>
  )
}