import { useLayoutEffect, useRef, useState } from "react";
import { wedding } from "../data/wedding";

function Row({
  hidden = false,
  innerRef,
}: {
  hidden?: boolean;
  innerRef?: React.Ref<HTMLDivElement>;
}) {
  const items = [
    wedding.tagline,
    wedding.engagement.day,
    wedding.engagement.venue,
    "அன்புடன் வரவேற்கிறோம்",
    wedding.footer.motto,
    `${wedding.groom.name} & ${wedding.bride.name}`,
  ];
  return (
    <div ref={innerRef} className="flex shrink-0 items-center" aria-hidden={hidden}>
      {[...items, ...items].map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="whitespace-nowrap px-7 font-display text-sm font-semibold tracking-[0.18em] text-maroon-950 md:text-base">
            {t}
          </span>
          <span className="h-1.5 w-1.5 rotate-45 bg-maroon-900/80" aria-hidden />
        </span>
      ))}
    </div>
  );
}

/* speed = pixels per second. Lower is slower. */
export default function Marquee({ speed = 70 }: { speed?: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(60);

  useLayoutEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const update = () => {
      const w = el.offsetWidth;
      if (w) setDuration(w / speed);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [speed]);

  return (
    <div className="relative z-10 -my-2 -rotate-1 scale-[1.02] overflow-hidden border-y border-gold-300/60 bg-[linear-gradient(100deg,#e9cd7f,#c9a227_30%,#e9cd7f_55%,#b8912a_80%,#e9cd7f)] py-3.5 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.7)]">
      <style>{`
        @keyframes marquee-slow {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none !important; }
        }
      `}</style>
      <div
        className="marquee-track flex w-max will-change-transform"
        style={{ animation: `marquee-slow ${duration}s linear infinite` }}
      >
        <Row innerRef={rowRef} />
        <Row hidden />
      </div>
    </div>
  );
}