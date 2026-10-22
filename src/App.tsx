
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import Intro from "./components/Intro";
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

import {
  ScrollProgress,
  GrainOverlay,
  ViewportFrame,
} from "./components/fx";

import { musicEngine } from "./audio/musicEngine";

type Phase = "intro" | "done";

/**
 * Release any scroll lock left by the intro.
 * Native browser scrolling is used after the intro finishes.
 */
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

/**
 * Lock scrolling while the intro is playing.
 */
function lockPageScroll() {
  document.documentElement.style.setProperty("overflow", "hidden");
  document.body.style.setProperty("overflow", "hidden");
}

export default function App() {
  const [phase, setPhase] = useState<Phase>("intro");
  const done = phase === "done";

  // Keep the page locked only while the intro is active.
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
    // Ensure scrolling remains locked during the intro.
    lockPageScroll();
  }, []);

  const handleComplete = useCallback(() => {
    // Prevent duplicate completion callbacks.
    if (document.body.dataset.introComplete === "true") {
      return;
    }

    document.body.dataset.introComplete = "true";

    // Mark the intro as finished. The effect above releases the lock.
    setPhase("done");

    // Start the invitation music after the intro.
    void musicEngine.play();
  }, []);

  // Use native browser scrolling for in-page navigation.
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
      <AnimatePresence>
        {!done && (
          <Intro
            key="intro"
            onStart={handleIntroStart}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>

      <ScrollProgress />
      <GrainOverlay />
      <ViewportFrame />

      {done && <Butterflies />}

      <Navbar visible={done} />
      <MusicButton visible={done} />

      <main className="md:pl-[92px] pb-24 md:pb-0">
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

      <Footer className="md:pl-[92px]" />
    </div>
  );
}
