
import Lenis from "lenis";

/**
 * Shared Lenis reference.
 *
 * Native browser scrolling is used by App.tsx.
 * Do not create a Lenis instance or start a Lenis RAF loop
 * while testing the native-scroll fix.
 */
export const lenisRef: { current: Lenis | null } = {
  current: null,
};
