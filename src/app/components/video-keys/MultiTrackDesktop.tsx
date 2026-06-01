"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { PosterTile } from "./PosterTile";
import { SharedVideoSurface } from "./SharedVideoSurface";
import { type Panel, mod, tileLayoutId } from "./panels";

type MultiTrackDesktopProps = {
  panels: Panel[];
  activeIndex: number;
  onActivate: (idx: number) => void;
  onBreakout: (idx: number) => void;
};

const SPRING = { type: "spring" as const, stiffness: 240, damping: 32, mass: 0.9 };

type Slot = { idx: number; role: "prev" | "active" | "next" };

const CENTER_H = "clamp(340px, 54vh, 580px)";
const CENTER_W = `calc(${CENTER_H} * 16 / 9)`;
const SIDE_W = "clamp(96px, 10vw, 158px)";
const SIDE_H = "clamp(300px, 48vh, 520px)";

export function MultiTrackDesktop({
  panels,
  activeIndex,
  onActivate,
  onBreakout,
}: MultiTrackDesktopProps) {
  const prefersReducedMotion = useReducedMotion();
  const safeActive = mod(activeIndex, panels.length);

  const slots: Slot[] = [
    { idx: mod(safeActive - 1, panels.length), role: "prev" },
    { idx: safeActive, role: "active" },
    { idx: mod(safeActive + 1, panels.length), role: "next" },
  ];

  return (
    <div
      className="relative hidden h-full w-full overflow-hidden md:block"
      style={{ contain: "layout" }}
    >
      <div className="flex h-full items-center justify-center gap-3 lg:gap-5">
        <AnimatePresence initial={false} mode="popLayout">
          {slots.map(({ idx, role }) => {
            const panel = panels[idx];
            const isActive = role === "active";
            const delta = role === "prev" ? -1 : role === "next" ? 1 : 0;

            return (
              <motion.article
                key={tileLayoutId(idx)}
                layout
                layoutId={tileLayoutId(idx)}
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  if (isActive) onBreakout(idx);
                  else onActivate(idx);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    if (isActive) onBreakout(idx);
                    else onActivate(idx);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={
                  isActive
                    ? `${panel.title} - ${panel.subtitle}`
                    : delta < 0
                      ? `Poprzedni material: ${panel.title}`
                      : `Nastepny material: ${panel.title}`
                }
                transition={prefersReducedMotion ? { duration: 0 } : SPRING}
                className={`relative shrink-0 cursor-pointer overflow-hidden rounded-[10px] outline-none ring-0 focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive ? "border border-white/12 shadow-[0_30px_80px_rgba(0,0,0,0.5)]" : ""
                }`}
                style={{
                  width: isActive ? CENTER_W : SIDE_W,
                  height: isActive ? CENTER_H : SIDE_H,
                  willChange: "transform",
                  transform: "translateZ(0)",
                }}
              >
                <PosterTile
                  src={panel.image}
                  alt={panel.title}
                  dimmed={!isActive}
                  priority={isActive}
                  objectPosition="center"
                  sizes={
                    isActive
                      ? "(min-width: 1280px) 56vw, 62vw"
                      : "(min-width: 768px) 12vw, 16vw"
                  }
                />
                {isActive ? (
                  <SharedVideoSurface src={panel.video} style={{ zIndex: 1 }} />
                ) : null}
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
