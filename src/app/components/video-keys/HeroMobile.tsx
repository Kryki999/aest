"use client";

import { Fragment, useState, type CSSProperties, type TouchEvent } from "react";
import { motion, useReducedMotion } from "motion/react";

import { CanvasMirror } from "./CanvasMirror";
import { PosterTile } from "./PosterTile";
import {
  HERO_MOBILE_STAGGER_PAD_PX,
  HERO_MOBILE_STAGGER_PATTERN,
  SWIPE_THRESHOLD_PX,
  VERTICAL_GESTURE_TOLERANCE_PX,
  mod,
  tileLayoutId,
  type Panel,
} from "./panels";

type HeroMobileProps = {
  panels: Panel[];
  heroStartIndex: number;
  onSwipe: (delta: number) => void;
  onBreakout: (idx: number) => void;
};

const TILE_COUNT = 5;
const GAP_PX = 4;
const CURTAIN_BG = "var(--background)";
const TILE_TINT = "rgba(12, 10, 9, 0)";

const FILLER_BASE: CSSProperties = {
  position: "absolute",
  insetInline: 0,
  backgroundColor: CURTAIN_BG,
  zIndex: 3,
};

function MobileTileColumn({ offsetY }: { offsetY: number }) {
  const topPad = offsetY > 0 ? offsetY : 0;
  const bottomPad = offsetY < 0 ? -offsetY : 0;
  return (
    <div className="relative h-full flex-1 overflow-hidden" style={{ zIndex: 1 }}>
      {topPad > 0 ? (
        <div aria-hidden style={{ ...FILLER_BASE, top: 0, height: topPad }} />
      ) : null}
      {bottomPad > 0 ? (
        <div
          aria-hidden
          style={{ ...FILLER_BASE, bottom: 0, height: bottomPad }}
        />
      ) : null}
      <article
        className="pointer-events-none absolute inset-x-0 overflow-clip"
        style={{ top: topPad, bottom: bottomPad, zIndex: 2 }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ backgroundColor: TILE_TINT }}
        />
      </article>
    </div>
  );
}

function MobileGapFiller() {
  return (
    <div
      aria-hidden
      style={{
        flex: `0 0 ${GAP_PX}px`,
        height: "100%",
        backgroundColor: CURTAIN_BG,
        zIndex: 3,
      }}
    />
  );
}

export function HeroMobile({
  panels,
  heroStartIndex,
  onSwipe,
  onBreakout,
}: HeroMobileProps) {
  const prefersReducedMotion = useReducedMotion();
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const activeIndex = mod(heroStartIndex, panels.length);
  const activeHero = panels[activeIndex];

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
      onSwipe(deltaX > 0 ? -1 : 1);
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  return (
    <motion.div
      layoutId={tileLayoutId(activeIndex)}
      onClick={() => onBreakout(activeIndex)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onBreakout(activeIndex);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${activeHero.title} – ${activeHero.subtitle}`}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 240, damping: 32 }
      }
      className="relative mx-auto h-full w-full max-w-[460px] cursor-pointer overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
      style={{
        contain: "layout paint",
        willChange: "transform",
        transform: "translateZ(0)",
        backgroundColor: CURTAIN_BG,
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="absolute inset-0 overflow-clip"
        style={{ zIndex: 0, isolation: "isolate" }}
      >
        <PosterTile
          src={activeHero.image}
          alt={activeHero.title}
          priority
          objectPosition="center"
          sizes="(min-width: 768px) 40vw, 100vw"
        />
        <CanvasMirror src={activeHero.video} objectPosition="50% center" />
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          insetInline: 0,
          top: 0,
          height: HERO_MOBILE_STAGGER_PAD_PX + 1,
          backgroundColor: CURTAIN_BG,
          zIndex: 3,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          insetInline: 0,
          bottom: 0,
          height: HERO_MOBILE_STAGGER_PAD_PX + 1,
          backgroundColor: CURTAIN_BG,
          zIndex: 3,
        }}
      />

      <div
        className="absolute inset-x-0 flex items-stretch"
        style={{
          top: HERO_MOBILE_STAGGER_PAD_PX,
          bottom: HERO_MOBILE_STAGGER_PAD_PX,
          zIndex: 1,
        }}
      >
        {Array.from({ length: TILE_COUNT }, (_, idx) => {
          const offsetY = HERO_MOBILE_STAGGER_PATTERN[idx] ?? 0;
          return (
            <Fragment key={`hero-mobile-frame-${idx}`}>
              {idx > 0 ? <MobileGapFiller /> : null}
              <MobileTileColumn offsetY={offsetY} />
            </Fragment>
          );
        })}
      </div>
    </motion.div>
  );
}
