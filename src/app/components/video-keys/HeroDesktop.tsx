"use client";

import { Fragment, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";

import { CanvasMirror } from "./CanvasMirror";
import { PosterTile } from "./PosterTile";
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

/** Tailwind v4 spacing-5 = 1.25rem ≈ 20px. */
function shiftPxFromClass(cls: string): number {
  if (cls === "-translate-y-5") return -20;
  if (cls === "translate-y-5") return 20;
  return 0;
}

const FILLER_BASE: CSSProperties = {
  position: "absolute",
  insetInline: 0,
  backgroundColor: CURTAIN_BG,
  zIndex: 3,
};

function TileWindowColumn({
  shiftClass,
  onBreakout,
  ariaLabel,
}: {
  shiftClass: string;
  onBreakout: () => void;
  ariaLabel: string;
}) {
  const shiftPx = shiftPxFromClass(shiftClass);
  const topPad = shiftPx > 0 ? shiftPx : 0;
  const bottomPad = shiftPx < 0 ? -shiftPx : 0;
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
        className="absolute inset-x-0 cursor-pointer overflow-clip outline-none focus-visible:ring-2 focus-visible:ring-primary"
        style={{ top: topPad, bottom: bottomPad, zIndex: 2 }}
        onClick={onBreakout}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onBreakout();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
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
        zIndex: 3,
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
  const breakoutLabel = `${activeHero.title} – ${activeHero.subtitle}`;
  const openBreakout = () => onBreakout(activeIndex);

  const leftTiles = Array.from({ length: LEFT_TILE_COUNT }, (_, idx) => ({
    panel: panels[mod(heroStartIndex + idx, panels.length)],
    idx,
  }));
  const rightPanel = panels[mod(heroStartIndex + 6, panels.length)];

  return (
    <div
      className="relative hidden h-full md:block"
      style={{
        overflow: "hidden",
        paddingTop: SHIFT_SAFE_PADDING_PX,
        paddingBottom: SHIFT_SAFE_PADDING_PX,
        backgroundColor: CURTAIN_BG,
      }}
    >
      <div className="relative h-full" style={{ contain: "layout" }}>
        <div
          className="absolute inset-0 overflow-clip"
          style={{ zIndex: 0, isolation: "isolate" }}
        >
          <PosterTile
            src={activeHero.image}
            alt={activeHero.title}
            priority
            objectPosition="center"
            sizes="100vw"
          />
          <CanvasMirror src={activeHero.video} objectPosition="50% center" />
        </div>

        <div
          className="absolute inset-0 flex items-stretch"
          style={{ zIndex: 1 }}
        >
          {leftTiles.map(({ panel, idx }) => (
            <Fragment key={`hero-left-${idx}-${panel.title}`}>
              {idx > 0 ? <GapFiller /> : null}
              <TileWindowColumn
                shiftClass={panel.shiftClass}
                onBreakout={openBreakout}
                ariaLabel={breakoutLabel}
              />
            </Fragment>
          ))}

          <GapFiller />

          <motion.article
            key={`hero-desktop-surface-${activeIndex}`}
            layoutId={tileLayoutId(activeIndex)}
            onClick={openBreakout}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openBreakout();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={breakoutLabel}
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
              className="font-heading vertical-title text-[44px] leading-none text-foreground md:text-[52px]"
            >
              {activeHero.title}
            </p>
            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Hero Story
            </p>
          </motion.article>

          <GapFiller />

          <TileWindowColumn
            shiftClass={rightPanel.shiftClass}
            onBreakout={openBreakout}
            ariaLabel={breakoutLabel}
          />
        </div>
      </div>
    </div>
  );
}
