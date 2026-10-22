/* பின்னணி இசை — public/images/music.mp3 கோப்பை சுழற்சியாக இசைக்கும்.
   இசை தானாக தொடங்காது; App.tsx-இல் intro திறந்த பின் play() அழைக்கப்படும். */

type Listener = (playing: boolean) => void;

const SRC = "/images/music.mp3";
const VOLUME = 0.85;

/* Events that count as user activation. Used only as a fallback
   when the browser blocks playback (for example, iOS Safari). */
const ACTIVATION_EVENTS = ["pointerdown", "keydown", "touchend"] as const;

class MusicEngine {
  private audio: HTMLAudioElement | null = null;
  private playing = false;
  private starting: Promise<boolean> | null = null;
  private retryArmed = false;
  private listeners = new Set<Listener>();

  private ensureAudio(): HTMLAudioElement {
    if (this.audio) return this.audio;
    const a = new Audio(SRC);
    a.loop = true;
    a.preload = "auto";
    a.volume = VOLUME;
    this.audio = a;
    return a;
  }

  /* Fallback: if the browser blocked playback, the next tap anywhere starts it.
     Armed only after a blocked attempt, so it never runs during the intro. */
  private armRetry() {
    if (this.retryArmed || typeof window === "undefined") return;
    this.retryArmed = true;

    const retry = () => {
      ACTIVATION_EVENTS.forEach((e) => window.removeEventListener(e, retry));
      this.retryArmed = false;
      void this.play();
    };

    ACTIVATION_EVENTS.forEach((e) =>
      window.addEventListener(e, retry, { passive: true })
    );
  }

  async play(): Promise<boolean> {
    if (this.playing) return true;
    if (this.starting) return this.starting;

    const a = this.ensureAudio();

    this.starting = (async () => {
      try {
        await a.play();
        this.playing = true;
        this.emit();
        return true;
      } catch (err) {
        // Usually the browser blocked playback, or the file is missing.
        console.warn("Background music could not start:", err);
        this.armRetry();
        return false;
      } finally {
        this.starting = null;
      }
    })();

    return this.starting;
  }

  stop() {
    if (this.audio) this.audio.pause();
    this.playing = false;
    this.emit();
  }

  async toggle(): Promise<boolean> {
    if (this.playing) {
      this.stop();
      return false;
    }
    return this.play();
  }

  isPlaying() {
    return this.playing;
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private emit() {
    this.listeners.forEach((fn) => fn(this.playing));
  }
}

export const musicEngine = new MusicEngine();