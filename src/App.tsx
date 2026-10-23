
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import Intro from "./components/Intro";
import ContactPanel from "./components/ContactDetails";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import { EngagementSection } from "./components/Invitations";
import Journey from "./components/Journey";
import Countdown from "./components/Countdown";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";
import MusicButton from "./components/MusicButton";
import Butterflies from "./components/Butterflies";
import ScrollIndicator from "./components/ScrollIndicator";

import {
  ScrollProgress,
  GrainOverlay,
  ViewportFrame,
} from "./components/fx";

import { useIdleAutoScroll } from "./hooks/useIdleAutoScroll";

type Phase = "intro" | "done";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Release any scroll lock left by the intro. */
function unlockPageScroll() {
  const html = document.documentElement;
  const body = document.body;

  html.style.removeProperty("overflow");
  html.style.removeProperty("overflow-y");
  body.style.removeProperty("overflow");
  body.style.removeProperty("overflow-y");

  html.classList.remove("lenis-stopped");
  body.classList.remove("lenis-stopped");
}

/** Lock scrolling while the intro is playing. */
function lockPageScroll() {
  document.documentElement.style.setProperty("overflow", "hidden");
  document.body.style.setProperty("overflow", "hidden");
}

/** End-of-page scroll hint. */
function EndScrollHint({ visible }: { visible: boolean }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={visible ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 1, delay: 0.2, ease: EASE }}
      className="relative z-10 flex min-h-[140px] flex-col items-center justify-center gap-2 bg-maroon-950 px-6 py-12 text-center md:pl-[92px]"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-300">
        Scroll down
      </p>

      <p
        className="text-sm text-cream-200/85"
        style={{ fontFamily: '"Noto Serif Tamil", "Tiro Tamil", serif' }}
      >
        கீழே உருட்டவும்
      </p>

      <svg
        width="14"
        height="8"
        viewBox="0 0 14 8"
        fill="none"
        className="mt-1 animate-bounce text-gold-400"
        aria-hidden="true"
      >
        <path
          d="M1 1l6 6 6-6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}

export default function App() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [contactOpen, setContactOpen] = useState(false);

  const done = phase === "done";

  // Auto-scroll only after the intro finishes.
  useIdleAutoScroll({
    enabled: done,
    idleMs: 15000,
    stepPx: 350,
    steps: 3,
  });

  // Lock scrolling while the intro is active.
  useEffect(() => {
    if (done) {
      unlockPageScroll();
    } else {
      lockPageScroll();
      window.scrollTo(0, 0);
    }

    return () => {
      unlockPageScroll();
    };
  }, [done]);

  const handleIntroStart = useCallback(() => {
    lockPageScroll();
  }, []);

  const handleComplete = useCallback(() => {
    if (document.body.dataset.introComplete === "true") return;

    document.body.dataset.introComplete = "true";
    setPhase("done");
  }, []);

  // Smooth scrolling for in-page anchor links.
  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      let section: HTMLElement | null = null;

      try {
        section = document.querySelector<HTMLElement>(href);
      } catch {
        return;
      }

      if (!section) return;

      event.preventDefault();

      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      if (window.location.hash !== href) {
        window.history.replaceState(null, "", href);
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-screen bg-maroon-950">
      {/* Intro animation */}
      <AnimatePresence>
        {!done && (
          <Intro
            key="intro"
            onStart={handleIntroStart}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>

      {/* Global visual effects */}
      <ScrollProgress />
      <GrainOverlay />
      <ViewportFrame />

      {done && <Butterflies />}

      {/* Navbar opens the contact drawer */}
      <Navbar
        visible={done}
        onContactClick={() => setContactOpen(true)}
      />

      <MusicButton visible={done} />

      {/* Contact drawer remains available from the Navbar */}
      <ContactPanel
        open={contactOpen}
        visible={done}
        onOpen={() => setContactOpen(true)}
        onClose={() => setContactOpen(false)}
      />

      {done && <ScrollIndicator />}

      {/* Main website sections */}
      <main className="pb-24 md:pb-0 md:pl-[92px]">
        <section id="hero">
          <Hero active={done} />
        </section>

        <Marquee />

        <section id="engagement">
          <EngagementSection />
        </section>

        <section id="payanam">
          <Journey />
        </section>

        <section id="countdown">
          <Countdown />
        </section>

        <section id="gallery">
          <Gallery />
        </section>

        <Marquee duration={42} />
      </main>

      <EndScrollHint visible={done} />

      <Footer className="md:pl-[92px]" />
    </div>
  );
}
