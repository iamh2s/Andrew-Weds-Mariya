
import { useCallback, useEffect, useRef, useState } from "react";
import { Music, Pause } from "lucide-react";

const MUSIC_SRC = "/images/music.mp3";

type MusicButtonProps = {
  visible: boolean;
  contactOpen?: boolean;
};

export default function MusicButton({
  visible,
  contactOpen = false,
}: MusicButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const turnedOffRef = useRef(false);
  const visibleRef = useRef(visible);

  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);

  // Keep the latest visibility state available to event listeners.
  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  // Attempt to play the music.
  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      await audio.play();
      setBlocked(false);
    } catch (error) {
      setBlocked(true);
      console.info("Music waiting for a user gesture:", error);
    }
  }, []);

  // Resume only when the invitation is visible and music was not disabled.
  const resumeIfAllowed = useCallback(() => {
    if (visibleRef.current && !turnedOffRef.current) {
      void tryPlay();
    }
  }, [tryPlay]);

  // Create and configure the audio element.
  useEffect(() => {
    const audio = new Audio(MUSIC_SRC);

    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    const onPlay = () => {
      setPlaying(true);
      setBlocked(false);
    };

    const onPause = () => {
      setPlaying(false);
    };

    const onError = () => {
      setPlaying(false);
      console.error("Unable to load wedding music:", MUSIC_SRC);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    return () => {
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      audioRef.current = null;
    };
  }, []);

  // Start music when the invitation becomes visible.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!visible) {
      turnedOffRef.current = false;
      audio.pause();
      audio.currentTime = 0;
      return;
    }

    if (!turnedOffRef.current) {
      void tryPlay();
    }
  }, [visible, tryPlay]);

  // Retry autoplay after the visitor interacts with the page.
  useEffect(() => {
    if (!blocked || !visible || turnedOffRef.current) return;

    const startOnGesture = () => {
      if (!turnedOffRef.current) {
        void tryPlay();
      }
    };

    const events = ["pointerdown", "keydown", "touchstart"] as const;

    events.forEach((eventName) => {
      window.addEventListener(eventName, startOnGesture, { once: true });
    });

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, startOnGesture);
      });
    };
  }, [blocked, visible, tryPlay]);

  // Handle tab visibility and page navigation.
  useEffect(() => {
    const onPageHide = () => {
      audioRef.current?.pause();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        audioRef.current?.pause();
      } else {
        resumeIfAllowed();
      }
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        resumeIfAllowed();
      }
    };

    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener(
        "visibilitychange",
        onVisibilityChange
      );
    };
  }, [resumeIfAllowed]);

  // Toggle playback without resetting the current song position.
  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      turnedOffRef.current = false;
      void tryPlay();
    } else {
      turnedOffRef.current = true;
      audio.pause();
    }
  };

  const buttonVisible = visible && !contactOpen;

  return (
    <div
      className={`fixed right-3 top-3 z-[100] transition-all duration-300 sm:right-5 sm:top-5 ${
        buttonVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-3 opacity-0"
      }`}
      aria-hidden={!buttonVisible}
    >
      <button
        type="button"
        onClick={toggle}
        disabled={!buttonVisible}
        aria-pressed={playing}
        aria-label={playing ? "Turn off music" : "Turn on music"}
        title={playing ? "Turn off music" : "Turn on music"}
        className="group mt-6 flex h-9 items-center gap-1.5 rounded-full border border-gold-400/40 bg-maroon-950/70 pl-1 pr-3 text-gold-200 shadow-[0_4px_12px_rgba(0,0,0,0.35)] backdrop-blur-sm transition hover:border-gold-300/70 active:scale-95"
      >
        <span
          className={`grid h-7 w-7 place-items-center rounded-full transition-all duration-300 ${
            playing
              ? "bg-gradient-to-b from-gold-300 to-gold-400 text-maroon-950"
              : "border border-gold-400/40 text-gold-300"
          }`}
        >
          {playing ? (
            <Pause
              className="h-3 w-3 fill-current"
              aria-hidden="true"
            />
          ) : (
            <Music className="h-3 w-3" aria-hidden="true" />
          )}
        </span>

        <span
          className="text-[11px] font-semibold leading-none"
          style={{
            fontFamily: '"Noto Serif Tamil", "Tiro Tamil", serif',
          }}
        >
          {playing ? "நிறுத்து" : "இசை"}
        </span>

        {playing && (
          <span
            className="flex h-2.5 items-end gap-[1.5px]"
            aria-hidden="true"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-[1.5px] animate-pulse rounded-full bg-gold-300"
                style={{
                  height: `${50 + i * 25}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </span>
        )}
      </button>

      {blocked && buttonVisible && (
        <p className="mt-1 text-right text-[9px] text-cream-200/70">
          Tap anywhere to play
        </p>
      )}
    </div>
  );
}
