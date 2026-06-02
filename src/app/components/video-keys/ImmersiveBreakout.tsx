"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Volume2, VolumeX, X } from "lucide-react";

import { SharedVideoSurface } from "./SharedVideoSurface";
import { useVideoBuffer } from "./VideoBufferProvider";
import { VideoScrubber } from "./VideoScrubber";
import { tileLayoutId, type Panel } from "./panels";

type BreakoutTarget = {
  panel: Panel;
  idx: number;
};

type ImmersiveBreakoutProps = {
  target: BreakoutTarget | null;
  onClose: () => void;
  /**
   * Use the shared-element (`layoutId`) zoom transition. Disable it where the
   * inline tile can't be projected cleanly (absolutely-positioned, clipped),
   * e.g. the mobile multiTrack carousel — there we use a snappy scale+fade so
   * closing is instant instead of a half-second dead spring.
   */
  sharedLayout?: boolean;
};

const HISTORY_MARKER = "video-keys-breakout";
const SWIPE_DISMISS_PX = 120;
const SWIPE_DISMISS_VELOCITY = 700;

export function ImmersiveBreakout({
  target,
  onClose,
  sharedLayout = true,
}: ImmersiveBreakoutProps) {
  const prefersReducedMotion = useReducedMotion();
  const isOpen = target !== null;
  const useShared = sharedLayout && !prefersReducedMotion;

  const {
    enterFullscreenAudio,
    exitFullscreenAudio,
    fullscreenMuted,
    toggleFullscreenMute,
    getElement,
  } = useVideoBuffer();

  const activeSrc = target?.panel.video ?? null;

  // Fullscreen takes over audio for the shared element. On close we hand audio
  // back to the global rule and resume inline playback on the shared element.
  useEffect(() => {
    if (!activeSrc) return;
    enterFullscreenAudio(activeSrc);
    return () => {
      exitFullscreenAudio();
      const el = getElement(activeSrc);
      if (el) {
        const promise = el.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(() => {});
        }
      }
    };
  }, [activeSrc, enterFullscreenAudio, exitFullscreenAudio, getElement]);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    if (typeof window === "undefined") return;

    const state = window.history.state ?? {};
    if (!state || state[HISTORY_MARKER] !== true) {
      window.history.pushState(
        { ...state, [HISTORY_MARKER]: true },
        "",
        window.location.href,
      );
    }

    const onPop = () => {
      onClose();
    };
    window.addEventListener("popstate", onPop);

    return () => {
      window.removeEventListener("popstate", onPop);
      const currentState = window.history.state;
      if (currentState && currentState[HISTORY_MARKER] === true) {
        window.history.back();
      }
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {target ? (
        <>
          <motion.div
            key="video-keys-breakout-backdrop"
            className="fixed inset-0 z-[120] bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.4, ease: "easeOut" }}
            onClick={onClose}
          />

          <motion.div
            key="video-keys-breakout-stage"
            layoutId={useShared ? tileLayoutId(target.idx) : undefined}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : useShared
                  ? false
                  : { opacity: 0, scale: 0.9 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : useShared
                  ? undefined
                  : { opacity: 1, scale: 1 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : useShared
                  ? undefined
                  : { opacity: 0, scale: 0.92 }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.25 }
                : useShared
                  ? { type: "spring", stiffness: 220, damping: 32, mass: 0.9 }
                  : { type: "spring", stiffness: 260, damping: 30, mass: 0.85 }
            }
            drag={prefersReducedMotion ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.55 }}
            onDragEnd={(_, info) => {
              if (
                info.offset.y > SWIPE_DISMISS_PX ||
                info.velocity.y > SWIPE_DISMISS_VELOCITY
              ) {
                onClose();
              }
            }}
            className="fixed inset-0 z-[121] overflow-hidden bg-black"
            style={{
              willChange: "transform",
              transform: "translateZ(0)",
              transformOrigin: "center center",
              touchAction: "pan-y",
            }}
          >
            <SharedVideoSurface
              src={target.panel.video}
              objectFit="cover"
              objectPosition="center"
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0) 100%)",
                zIndex: 1,
              }}
            />

            <motion.button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={toggleFullscreenMute}
              aria-label={fullscreenMuted ? "Włącz dźwięk" : "Wycisz"}
              aria-pressed={!fullscreenMuted}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{
                delay: prefersReducedMotion ? 0 : 0.25,
                duration: prefersReducedMotion ? 0.15 : 0.35,
                ease: "easeOut",
              }}
              className="absolute left-[max(1.25rem,env(safe-area-inset-left))] top-[max(1.25rem,env(safe-area-inset-top))] z-[3] inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:border-white/60 hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {fullscreenMuted ? (
                <VolumeX className="h-5 w-5" strokeWidth={2.2} />
              ) : (
                <Volume2 className="h-5 w-5" strokeWidth={2.2} />
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={onClose}
              aria-label="Zamknij podgląd"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{
                delay: prefersReducedMotion ? 0 : 0.25,
                duration: prefersReducedMotion ? 0.15 : 0.35,
                ease: "easeOut",
              }}
              className="absolute right-[max(1.25rem,env(safe-area-inset-right))] top-[max(1.25rem,env(safe-area-inset-top))] z-[3] inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:border-white/60 hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-5 w-5" strokeWidth={2.2} />
            </motion.button>

            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{
                delay: prefersReducedMotion ? 0 : 0.25,
                duration: prefersReducedMotion ? 0.15 : 0.55,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              className="absolute inset-x-0 bottom-0 z-[2] px-[6vw] pb-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] pt-10 text-foreground"
              style={{ willChange: "transform" }}
            >
              <h2
                className="font-heading text-balance text-[clamp(2.6rem,6vw,5.4rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-white"
              >
                {target.panel.title}
              </h2>
              <p className="mt-4 text-[0.95rem] uppercase tracking-[0.22em] text-white/70 sm:text-base">
                {target.panel.subtitle}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            key="video-keys-breakout-scrubber"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{
              delay: prefersReducedMotion ? 0 : 0.3,
              duration: prefersReducedMotion ? 0.15 : 0.45,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            className="fixed inset-x-0 bottom-0 z-[122] px-[6vw] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6"
          >
            <VideoScrubber src={target.panel.video} />
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
