import { useRef, useState } from "react";
import { motion, useSpring, useScroll } from "framer-motion";
import type { ReactNode } from "react";
import { Tick } from "./Ornaments";

/* ================= உருட்டல் முன்னேற்றம் ================= */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 130, damping: 26, mass: 0.4 });
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[55] h-[2.5px] origin-left bg-[linear-gradient(90deg,#84641a,#e9cd7f_45%,#c9a227_70%,#f2dfa6)]"
      style={{ scaleX }}
    />
  );
}

/* ================= திரைத்துணி தானியமைப்பு ================= */
export function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[54] opacity-[0.05]"
      aria-hidden
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

/* ================= நுண் தங்கத் திரைச் சட்டம் ================= */
export function ViewportFrame() {
  return (
    <div className="pointer-events-none fixed inset-2.5 z-[53] hidden border border-gold-500/25 lg:block" aria-hidden>
      <Tick className="absolute -left-1.5 -top-1.5 text-gold-400/80" size={11} />
      <Tick className="absolute -right-1.5 -top-1.5 text-gold-400/80" size={11} />
      <Tick className="absolute -bottom-1.5 -left-1.5 text-gold-400/80" size={11} />
      <Tick className="absolute -bottom-1.5 -right-1.5 text-gold-400/80" size={11} />
    </div>
  );
}

/* ================= காந்தப் பொத்தான் ================= */
export function Magnetic({
  children,
  strength = 22,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 180, damping: 15, mass: 0.4 }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setPos({
          x: ((e.clientX - r.left) / r.width - 0.5) * strength,
          y: ((e.clientY - r.top) / r.height - 0.5) * strength,
        });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
    >
      {children}
    </motion.div>
  );
}

/* ================= முக்காடு வெளிப்பாட்டு உரை ================= */
export function RevealText({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.09,
  show,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  show?: boolean;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-flex overflow-hidden align-bottom">
          <motion.span
            className={wordClassName}
            initial={{ y: "115%" }}
            {...(show !== undefined
              ? { animate: { y: show ? "0%" : "115%" } }
              : { whileInView: { y: "0%" }, viewport: { once: true, margin: "-60px" } })}
            transition={{ duration: 0.9, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && <span className="whitespace-pre"> </span>}
        </span>
      ))}
    </span>
  );
}

/* ================= முப்பரிமாண சாய்வு ================= */
export function TiltCard({
  children,
  className = "",
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const rx = useSpring(0, { stiffness: 160, damping: 16 });
  const ry = useSpring(0, { stiffness: 160, damping: 16 });
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", perspective: 800 }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rx.set(-py * max * 2);
        ry.set(px * max * 2);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
