import { useEffect, useState } from "react";
import {
  Home,
  MailOpen,
  HeartHandshake,
  Hourglass,
  Images,
} from "lucide-react";
import { MonogramCrest } from "./Ornaments";

/* Each `id` must match an element id on the page; `href` is `#` + id.
   Keep this list in page order. */
const LINKS = [
  { id: "hero", label: "முகப்பு", icon: Home },
  { id: "engagement", label: "நிச்சயம்", icon: MailOpen },
  { id: "payanam", label: "பயணம்", icon: HeartHandshake },
  { id: "countdown", label: "நாட்கள்", icon: Hourglass },
  { id: "gallery", label: "படங்கள்", icon: Images },
].map((l) => ({ ...l, href: `#${l.id}` }));

export default function Navbar({ visible }: { visible: boolean }) {
  const [active, setActive] = useState<string>(LINKS[0].id);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;

      // At the very bottom, highlight the last link.
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 80;
      if (nearBottom) {
        setActive(LINKS[LINKS.length - 1].id);
        return;
      }

      // Otherwise, highlight the last section whose top has passed
      // 40% of the viewport height.
      const band = window.innerHeight * 0.4;
      let current = LINKS[0].id;
      for (const l of LINKS) {
        const el = document.getElementById(l.id);
        if (el && el.getBoundingClientRect().top <= band) current = l.id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      {/* Desktop side rail */}
      <nav
        aria-label="பிரிவுகள்"
        className={`fixed inset-y-0 left-0 z-50 hidden w-[92px] flex-col items-center overflow-y-auto overscroll-contain border-r border-gold-500/25 bg-[#170309]/92 pb-3 backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] md:flex ${
          visible
            ? "translate-x-0 opacity-100"
            : "-translate-x-[110%] opacity-0 pointer-events-none"
        }`}
      >
        <a
          href="#hero"
          className="group flex shrink-0 flex-col items-center gap-1 pb-2 pt-5"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/35 bg-[#1c040a] transition-transform duration-500 group-hover:scale-105">
            <MonogramCrest size={46} />
          </div>
          <span className="mt-1 font-display text-[11px] leading-none text-gold-200">
            அழைப்பிதழ்
          </span>
        </a>

        <span
          className="my-3 h-px w-10 shrink-0 bg-gradient-to-r from-transparent via-gold-400/55 to-transparent"
          aria-hidden="true"
        />

        <div className="flex w-full shrink-0 flex-col items-center gap-1 px-2">
          {LINKS.map(({ id, href, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <a
                key={id}
                href={href}
                aria-label={label}
                aria-current={isActive ? "true" : undefined}
                className={`flex w-full flex-col items-center gap-1 rounded-2xl py-2.5 transition-all duration-300 ${
                  isActive
                    ? "bg-[#2b070f] text-gold-100 shadow-inner"
                    : "text-cream-300/55 hover:bg-[#2b070f]/55 hover:text-gold-100"
                }`}
              >
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full transition-all ${
                    isActive
                      ? "bg-[#3a0a13] text-gold-200 shadow-[0_0_14px_rgba(201,162,39,.12)]"
                      : "bg-[#24060c]/70"
                  }`}
                >
                  <Icon size={15} />
                </span>
                <span className="text-center text-[10px] font-medium leading-tight tracking-wide">
                  {label}
                </span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <nav
        aria-label="பிரிவுகள்"
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-gold-500/30 bg-[#170309]/96 backdrop-blur-md transition-all duration-500 md:hidden ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-[110%] opacity-0 pointer-events-none"
        }`}
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 4px)" }}
      >
        {/* grid-cols-5 matches the 5 entries in LINKS */}
        <div className="grid grid-cols-5">
          {LINKS.map(({ id, href, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <a
                key={id}
                href={href}
                aria-current={isActive ? "true" : undefined}
                className={`relative flex min-w-0 flex-col items-center gap-0.5 py-2 transition-colors duration-300 ${
                  isActive
                    ? "text-gold-200"
                    : "text-cream-300/60 active:text-gold-200"
                }`}
              >
                {isActive && (
                  <span className="absolute -top-px left-1/2 h-[3px] w-7 -translate-x-1/2 rounded-b-full bg-gold-400" />
                )}
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full transition-all duration-300 ${
                    isActive ? "scale-105 bg-[#3a0a13] text-gold-100" : ""
                  }`}
                >
                  <Icon size={18} />
                </span>
                <span
                  className={`max-w-full truncate text-[9px] leading-none ${
                    isActive ? "font-bold" : "font-medium"
                  }`}
                >
                  {label}
                </span>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}