"use client";

import { useState, type TouchEvent } from "react";
import { motion, useReducedMotion } from "motion/react";

import { PosterTile } from "./PosterTile";
import { SharedVideoSurface } from "./SharedVideoSurface";
import {
  SWIPE_THRESHOLD_PX,
  VERTICAL_GESTURE_TOLERANCE_PX,
  mod,
  tileLayoutId,
  type Panel,
} from "./panels";

type MultiTrackMobileProps = {
  panels: Panel[];
  activeIndex: number;
  onActivate: (idx: number) => void;
  onBreakout: (idx: number) => void;
};

export function MultiTrackMobile({
  panels,
  activeIndex,
  onActivate,
  onBreakout,
}: MultiTrackMobileProps) {
  const prefersReducedMotion = useReducedMotion();
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const safeActive = mod(activeIndex, panels.length);
  const move = (delta: number) => onActivate(mod(safeActive + delta, panels.length));

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0]?.clientX ?? null);
    setTouchStartY(event.touches[0]?.clientY ?? null);
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null || touchStartY === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX;
    const endY = event.changedTouches[0]?.clientY ?? touchStartY;
    const deltaX = endX - touchStartX;
    const deltaY = endY - touchStartY;

    const isHorizontalSwipe =
      Math.abs(deltaX) >= SWIPE_THRESHOLD_PX &&
      Math.abs(deltaX) > Math.abs(deltaY) + VERTICAL_GESTURE_TOLERANCE_PX;

    if (isHorizontalSwipe) {
      move(deltaX > 0 ? -1 : 1);
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  const slots: { idx: number; slot: 0 | 1 | 2 }[] = [
    { idx: mod(safeActive - 1, panels.length), slot: 0 },
    { idx: safeActive, slot: 1 },
    { idx: mod(safeActive + 1, panels.length), slot: 2 },
  ];

  return (
    <div
      className="relative mx-auto h-[55vh] w-full max-w-[460px] md:hidden"
      style={{ contain: "layout" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {slots.map(({ idx, slot }) => {
        const panel = panels[idx];
        const isCenter = slot === 1;
        const positionClasses = isCenter
          ? "left-[18%] z-20 w-[64%] opacity-100"
          : slot === 0
            ? "left-[-24%] z-10 w-[38%] opacity-45"
            : "left-[86%] z-10 w-[38%] opacity-45";

        return (
          <motion.article
            key={`mt-mobile-${slot}-${panel.title}`}
            layoutId={isCenter ? tileLayoutId(idx) : undefined}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 240, damping: 32 }
            }
            onClick={() => {
              if (isCenter) onBreakout(idx);
              else onActivate(idx);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (isCenter) onBreakout(idx);
                else onActivate(idx);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`${panel.title} – ${panel.subtitle}`}
            className={`absolute top-0 h-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-primary ${panel.shiftClass} ${positionClasses}`}
            style={{ willChange: "transform", transform: "translateZ(0)" }}
          >
            <PosterTile
              src={panel.image}
              alt={panel.title}
              dimmed={!isCenter}
              priority={isCenter}
              sizes="(min-width: 768px) 40vw, 80vw"
            />
            {isCenter ? (
              <SharedVideoSurface src={panel.video} style={{ zIndex: 1 }} />
            ) : null}
          </motion.article>
        );
      })}
    </div>
  );
}
