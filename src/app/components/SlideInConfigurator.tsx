"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import CinematicDrawerConfigurator, {
  type CinematicStep,
} from "./CinematicDrawerConfigurator";
import { useConfigurator } from "./configurator-shared";
import { drawerSlideTransition } from "./nav-motion";

const VISUAL_POSTER =
  "https://images.unsplash.com/photo-1492691527719-9d1e07b89eff?w=1400&q=85&auto=format&fit=crop";
const VISUAL_VIDEO =
  "https://cdn.pixabay.com/video/2020/11/07/55718-503971825_large.mp4";

export default function SlideInConfigurator() {
  const { isOpen, close } = useConfigurator();
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panEligible = useRef(false);
  const [wizardStep, setWizardStep] = useState<CinematicStep | null>(null);
  const [keyboardBottomInset, setKeyboardBottomInset] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setWizardStep(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      const overlap = window.innerHeight - vv.height - vv.offsetTop;
      setKeyboardBottomInset(overlap > 64 ? Math.min(overlap, 220) + 8 : 0);
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const root = panelRef.current;
    if (!root) return;

    const selector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodes = [...root.querySelectorAll<HTMLElement>(selector)].filter(
        (el) => !el.hasAttribute("disabled"),
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!active || !root.contains(active)) return;
      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, wizardStep]);

  const onPanStart = useCallback(
    (
      _event: PointerEvent,
      info: { point: { x: number; y: number } },
    ) => {
      if (typeof window !== "undefined" && window.innerWidth >= 768) {
        panEligible.current = false;
        return;
      }
      const rect = panelRef.current?.getBoundingClientRect();
      if (!rect) {
        panEligible.current = false;
        return;
      }
      const localX = info.point.x - rect.left;
      panEligible.current = localX < 72;
    },
    [],
  );

  const onPanEnd = useCallback(
    (
      _event: PointerEvent,
      info: {
        offset: { x: number; y: number };
        velocity: { x: number; y: number };
      },
    ) => {
      if (typeof window !== "undefined" && window.innerWidth >= 768) return;
      if (!panEligible.current) return;
      const { offset, velocity } = info;
      if (offset.x < 40) return;
      if (Math.abs(velocity.y) > Math.abs(velocity.x) + 120) return;
      if (offset.x > 64 || velocity.x > 200) close();
    },
    [close],
  );

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            key="configurator-backdrop"
            role="presentation"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: drawerSlideTransition.ease }}
            className="fixed inset-0 z-[115] bg-[var(--cinematic-base)]/55"
            onClick={close}
          />
          <motion.aside
            ref={panelRef}
            key="configurator-panel"
            id="site-slide-in-configurator"
            role="dialog"
            aria-modal="true"
            aria-labelledby="configurator-dialog-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={drawerSlideTransition}
            onPanStart={onPanStart}
            onPanEnd={onPanEnd}
            className="fixed inset-0 z-[120] flex h-[100dvh] min-h-0 touch-pan-y flex-col bg-[var(--cinematic-surface)] shadow-[-12px_0_56px_rgba(0,0,0,0.45)] md:touch-auto md:flex-row"
          >
            <div className="relative hidden min-h-0 w-full flex-none md:flex md:w-1/2 md:flex-col">
              <div className="relative min-h-[38vh] flex-1 bg-muted md:min-h-0">
                <video
                  className="absolute inset-0 size-full object-cover"
                  autoPlay
                  muted
                  playsInline
                  loop
                  poster={VISUAL_POSTER}
                  aria-hidden
                >
                  <source src={VISUAL_VIDEO} type="video/mp4" />
                </video>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--cinematic-surface)]/25 via-transparent to-[var(--cinematic-surface)]/65 md:bg-gradient-to-t md:from-[var(--cinematic-surface)]/75 md:via-transparent md:to-transparent"
                />
                <div className="pointer-events-none absolute bottom-8 left-8 right-8 z-[1] hidden md:block">
                  <p
                    className="max-w-[24ch] text-2xl font-semibold leading-tight tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Nowy pokój dla Twojego briefu.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex min-h-0 w-full flex-1 flex-col bg-[var(--cinematic-base)] md:w-1/2">
              <div className="relative min-h-0 flex-1 overflow-y-auto px-5 pb-12 pt-14 md:px-9 md:pb-14 md:pt-16">
                <CinematicDrawerConfigurator
                  onStepChange={setWizardStep}
                  keyboardBottomInset={keyboardBottomInset}
                />
              </div>
              <button
                ref={closeRef}
                type="button"
                aria-label="Zamknij konfigurator"
                className="absolute right-5 top-5 z-[2] rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cinematic-base)] md:right-9 md:top-8"
                onClick={close}
              >
                <X className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
