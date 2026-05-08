"use client";

import { Fragment, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";

import { CanvasMirror } from "./CanvasMirror";
import { mod, tileLayoutId, type Panel } from "./panels";

type HeroDesktopProps = {
  panels: Panel[];
  heroStartIndex: number;
  onBreakout: (idx: number) => void;
};

const LEFT_TILE_COUNT = 5;
const SHIFT_SAFE_PADDING_PX = 28;
const GAP_PX = 8;
const CURTAIN_BG = "var(--background)";
const TILE_TINT = "rgba(12, 10, 9, 0)";

/**
 * Tailwind v4 spacing-5 = 1.25rem ≈ 20px. We map the panel shiftClass to
 * pixel deltas so we can compose the curtain (fillers) and the window
 * (the article element with the shift transform) precisely.
 */
function shiftPxFromClass(cls: string): number {
  if (cls === "-translate-y-5") return -20;
  if (cls === "translate-y-5") return 20;
  return 0;
}

const FILLER_BASE: CSSProperties = {
  position: "absolute",
  insetInline: 0,
  backgroundColor: CURTAIN_BG,
  zIndex: 1,
};

function TileWindowColumn({ shiftClass }: { shiftClass: string }) {
  const shiftPx = shiftPxFromClass(shiftClass);
  const topFiller = shiftPx > 0 ? shiftPx : 0;
  const bottomFiller = shiftPx < 0 ? -shiftPx : 0;
  return (
    <div className="relative h-full flex-1" style={{ zIndex: 1 }}>
      {topFiller > 0 ? (
        <div aria-hidden style={{ ...FILLER_BASE, top: 0, height: topFiller }} />
      ) : null}
      {bottomFiller > 0 ? (
        <div
          aria-hidden
          style={{ ...FILLER_BASE, bottom: 0, height: bottomFiller }}
        />
      ) : null}
      <article
        className={`absolute inset-0 overflow-hidden ${shiftClass}`}
        style={{
          zIndex: 2,
          willChange: "transform",
          transform: "translateZ(0)",
        }}
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

function GapFiller() {
  return (
    <div
      aria-hidden
      style={{
        flex: `0 0 ${GAP_PX}px`,
        height: "100%",
        backgroundColor: CURTAIN_BG,
        zIndex: 1,
      }}
    />
  );
}

export function HeroDesktop({
  panels,
  heroStartIndex,
  onBreakout,
}: HeroDesktopProps) {
  const prefersReducedMotion = useReducedMotion();
  const activeIndex = mod(heroStartIndex, panels.length);
  const activeHero = panels[activeIndex];

  const leftTiles = Array.from({ length: LEFT_TILE_COUNT }, (_, idx) => ({
    panel: panels[mod(heroStartIndex + idx, panels.length)],
    idx,
  }));
  const rightPanel = panels[mod(heroStartIndex + 6, panels.length)];

  return (
    <div
      className="relative hidden md:block"
      style={{
        overflow: "hidden",
        paddingTop: SHIFT_SAFE_PADDING_PX,
        paddingBottom: SHIFT_SAFE_PADDING_PX,
        backgroundColor: CURTAIN_BG,
      }}
    >
      <div className="relative h-[68vh]" style={{ contain: "layout" }}>
        <CanvasMirror
          src={activeHero.video}
          objectPosition="50% center"
          style={{ zIndex: 0 }}
        />

        <div
          className="absolute inset-0 flex items-stretch"
          style={{ zIndex: 1 }}
        >
          {leftTiles.map(({ panel, idx }) => (
            <Fragment key={`hero-left-${idx}-${panel.title}`}>
              {idx > 0 ? <GapFiller /> : null}
              <TileWindowColumn shiftClass={panel.shiftClass} />
            </Fragment>
          ))}

          <GapFiller />

          <motion.article
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
            className="relative flex h-full w-[14vw] min-w-[130px] max-w-[190px] cursor-pointer flex-col items-center justify-center border border-border bg-card/95 px-3 text-center outline-none focus-visible:ring-2 focus-visible:ring-primary"
            style={{
              zIndex: 2,
              willChange: "transform",
              transform: "translateZ(0)",
            }}
          >
            <p
              className="vertical-title text-[44px] leading-none text-foreground md:text-[52px]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {activeHero.title}
            </p>
            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Hero Story
            </p>
          </motion.article>

          <GapFiller />

          <TileWindowColumn shiftClass={rightPanel.shiftClass} />
        </div>
      </div>
    </div>
  );
}
