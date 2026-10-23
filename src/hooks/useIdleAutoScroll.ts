import { useEffect } from "react";

type Options = {
  enabled?: boolean;   // set false to pause the feature entirely
  idleMs?: number;     // how long to wait without interaction (default 15s)
  stepPx?: number;     // how far each nudge scrolls
  steps?: number;      // how many nudges per idle period
  stepGapMs?: number;  // pause between nudges
};

export function useIdleAutoScroll({
  enabled = true,
  idleMs = 15000,
  stepPx = 350,
  steps = 3,
  stepGapMs = 700,
}: Options = {}) {
  useEffect(() => {
    if (!enabled) return;

    let idleTimer: number | undefined;
    let stepTimer: number | undefined;
    let autoScrolling = false;

    const atBottom = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    const stopAuto = () => {
      autoScrolling = false;
      window.clearTimeout(stepTimer);
    };

    const scheduleIdle = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(startAuto, idleMs);
    };

    const startAuto = () => {
      if (atBottom()) return;
      autoScrolling = true;
      let done = 0;

      const nudge = () => {
        if (!autoScrolling || done >= steps || atBottom()) {
          stopAuto();
          scheduleIdle();
          return;
        }
        window.scrollBy({ top: stepPx, behavior: "smooth" });
        done++;
        stepTimer = window.setTimeout(nudge, stepGapMs);
      };

      nudge();
    };

    // Real user input cancels auto-scroll and restarts the idle timer
    const onUserActivity = () => {
      if (autoScrolling) stopAuto();
      scheduleIdle();
    };

    // Manual scrolling restarts the timer, but our own nudges don't
    const onScroll = () => {
      if (!autoScrolling) scheduleIdle();
    };

    const userEvents = ["wheel", "touchstart", "touchmove", "keydown", "mousedown", "pointerdown"];
    userEvents.forEach((e) =>
      window.addEventListener(e, onUserActivity, { passive: true })
    );
    window.addEventListener("scroll", onScroll, { passive: true });

    scheduleIdle();

    return () => {
      window.clearTimeout(idleTimer);
      window.clearTimeout(stepTimer);
      userEvents.forEach((e) => window.removeEventListener(e, onUserActivity));
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled, idleMs, stepPx, steps, stepGapMs]);
}