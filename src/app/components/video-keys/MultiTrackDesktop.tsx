"use client";

import { motion, useReducedMotion } from "motion/react";

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

export function MultiTrackDesktop({
  panels,
  activeIndex,
  onActivate,
  onBreakout,
}: MultiTrackDesktopProps) {
  const prefersReducedMotion = useReducedMotion();
  const safeActive = mod(activeIndex, panels.length);

  return (
    <div
      className="hidden h-[68vh] items-stretch gap-2 md:flex"
      style={{ contain: "layout" }}
    >
      {panels.map((panel, idx) => {
        const isActive = idx === safeActive;
        return (
          <motion.article
            key={`mt-desktop-${idx}-${panel.title}`}
            layout
            layoutId={tileLayoutId(idx)}
            onMouseEnter={() => onActivate(idx)}
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
            aria-label={`${panel.title} – ${panel.subtitle}`}
            transition={prefersReducedMotion ? { duration: 0 } : SPRING}
            className={`relative h-full cursor-pointer overflow-hidden outline-none ring-0 focus-visible:ring-2 focus-visible:ring-primary ${panel.shiftClass}`}
            style={{
              flex: isActive ? "2.8 1 0%" : "1 1 0%",
              willChange: "transform",
              transform: "translateZ(0)",
            }}
          >
            <PosterTile
              src={panel.image}
              alt={panel.title}
              dimmed={!isActive}
              priority={idx === 4}
              sizes="(min-width: 1280px) 30vw, 25vw"
            />
            {isActive ? (
              <SharedVideoSurface
                src={panel.video}
                style={{ zIndex: 1 }}
              />
            ) : null}
          </motion.article>
        );
      })}
    </div>
  );
}
