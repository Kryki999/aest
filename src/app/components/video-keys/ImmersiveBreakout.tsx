"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";

import { SharedVideoSurface } from "./SharedVideoSurface";
import { tileLayoutId, type Panel } from "./panels";

type BreakoutTarget = {
  panel: Panel;
  idx: number;
};

type ImmersiveBreakoutProps = {
  target: BreakoutTarget | null;
  onClose: () => void;
};

const HISTORY_MARKER = "video-keys-breakout";
const SWIPE_DISMISS_PX = 120;
const SWIPE_DISMISS_VELOCITY = 700;

export function ImmersiveBreakout({ target, onClose }: ImmersiveBreakoutProps) {
  const prefersReducedMotion = useReducedMotion();
  const isOpen = target !== null;

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
            layoutId={prefersReducedMotion ? undefined : tileLayoutId(target.idx)}
            initial={prefersReducedMotion ? { opacity: 0 } : false}
            animate={prefersReducedMotion ? { opacity: 1 } : undefined}
            exit={prefersReducedMotion ? { opacity: 0 } : undefined}
            transition={
              prefersReducedMotion
                ? { duration: 0.25 }
                : { type: "spring", stiffness: 220, damping: 32, mass: 0.9 }
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
              className="absolute inset-x-0 bottom-0 z-[2] px-[6vw] pb-[max(2.4rem,env(safe-area-inset-bottom))] pt-10 text-foreground"
              style={{ willChange: "transform" }}
            >
              <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-white/60">
                Hero Story
              </p>
              <h2
                className="text-balance text-[clamp(2.6rem,6vw,5.4rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-white"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {target.panel.title}
              </h2>
              <p className="mt-4 text-[0.95rem] uppercase tracking-[0.22em] text-white/70 sm:text-base">
                {target.panel.subtitle}
              </p>
              <p className="mt-6 hidden text-xs uppercase tracking-[0.28em] text-white/40 md:block">
                Esc · ⤓ swipe down · klik poza
              </p>
            </motion.div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
