import { useEffect, useState } from "react";

export default function ScrollIndicator() {
  const [progress, setProgress] = useState(0);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 1;
      setProgress(p);
      setAtBottom(p >= 0.98);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollDown = () =>
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });

  return (
    <div
      className={`fixed bottom-24 left-1/2 z-[1000] flex -translate-x-1/2 flex-col items-center gap-2 transition-all duration-300 md:bottom-6 md:left-[calc(50%+46px)] ${
        atBottom ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"
      }`}
    >
      
      <p
        className="text-[11px] text-cream-200/80"
        style={{ fontFamily: '"Noto Serif Tamil", "Tiro Tamil", serif' }}
      >

      </p>

      <button
        onClick={scrollDown}
        aria-label="Scroll down"
        className="grid h-11 w-11 animate-bounce place-items-center rounded-full border border-gold-400/50 bg-maroon-950/80 text-gold-300 shadow-[0_4px_16px_rgba(0,0,0,0.5)] backdrop-blur-sm transition hover:bg-maroon-950"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div className="h-[2px] w-16 overflow-hidden rounded-full bg-gold-400/20">
        <div
          className="h-full origin-left bg-gold-400"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}