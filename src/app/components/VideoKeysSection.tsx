"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutGroup } from "motion/react";
import { AudioLines, Clapperboard } from "lucide-react";

import { HeroDesktop } from "./video-keys/HeroDesktop";
import { HeroMobile } from "./video-keys/HeroMobile";
import { ImmersiveBreakout } from "./video-keys/ImmersiveBreakout";
import { MultiTrackDesktop } from "./video-keys/MultiTrackDesktop";
import { MultiTrackMobile } from "./video-keys/MultiTrackMobile";
import { ViewportGate } from "./video-keys/ViewportGate";
import { VideoBufferProvider, useVideoBuffer } from "./video-keys/VideoBufferProvider";
import { MULTI_TRACK_COUNT, PANELS, mod } from "./video-keys/panels";

type ViewMode = "multiTrack" | "heroStory";

function ModeIcon({ type }: { type: ViewMode }) {
  if (type === "multiTrack") {
    return <AudioLines className="h-7 w-7" strokeWidth={2.3} aria-hidden />;
  }
  return <Clapperboard className="h-7 w-7" strokeWidth={2.3} aria-hidden />;
}

function ModeToggleButtons({
  mode,
  setMode,
  className = "",
}: {
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <button
        type="button"
        aria-label="Tryb Multi-Track"
        aria-pressed={mode === "multiTrack"}
        onClick={() => setMode("multiTrack")}
        className={`inline-flex h-14 w-14 items-center justify-center rounded-full transition ${
          mode === "multiTrack"
            ? "border border-primary bg-primary text-primary-foreground"
            : "border border-border bg-card/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
        }`}
      >
        <ModeIcon type="multiTrack" />
      </button>
      <button
        type="button"
        aria-label="Tryb Hero Story"
        aria-pressed={mode === "heroStory"}
        onClick={() => setMode("heroStory")}
        className={`inline-flex h-14 w-14 items-center justify-center rounded-full transition ${
          mode === "heroStory"
            ? "border border-primary bg-primary text-primary-foreground"
            : "border border-border bg-card/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
        }`}
      >
        <ModeIcon type="heroStory" />
      </button>
    </div>
  );
}

function MultiTrackSubtitle({ idx }: { idx: number }) {
  const item = PANELS[mod(idx, MULTI_TRACK_COUNT)];
  return (
    <div className="mx-auto mt-8 max-w-[860px] text-center">
      <p
        className="text-balance text-[clamp(2rem,3.6vw,3.2rem)] font-semibold leading-[0.94] tracking-[-0.04em] text-foreground"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {item.title}
      </p>
      <p className="mt-3 text-sm uppercase tracking-[0.2em] text-muted-foreground md:text-[0.78rem]">
        {item.subtitle}
      </p>
    </div>
  );
}

function HeroSubtitle({ idx }: { idx: number }) {
  const item = PANELS[mod(idx, PANELS.length)];
  return (
    <div className="mt-5 text-center md:hidden">
      <p
        className="text-balance text-[clamp(1.8rem,8vw,2.7rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-foreground"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {item.title}
      </p>
      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {item.subtitle}
      </p>
    </div>
  );
}

function ArrowControls({
  onPrev,
  onNext,
  ariaLabelPrev,
  ariaLabelNext,
  className = "",
}: {
  onPrev: () => void;
  onNext: () => void;
  ariaLabelPrev: string;
  ariaLabelNext: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        type="button"
        aria-label={ariaLabelPrev}
        className="text-2xl leading-none text-muted-foreground transition-colors hover:text-foreground md:text-3xl"
        onClick={onPrev}
      >
        ←
      </button>
      <button
        type="button"
        aria-label={ariaLabelNext}
        className="text-2xl leading-none text-muted-foreground transition-colors hover:text-foreground md:text-3xl"
        onClick={onNext}
      >
        →
      </button>
    </div>
  );
}

function VideoKeysContent() {
  const [mode, setMode] = useState<ViewMode>("multiTrack");
  const [activeIndex, setActiveIndex] = useState(4);
  const [heroStartIndex, setHeroStartIndex] = useState(0);
  const [breakoutIdx, setBreakoutIdx] = useState<number | null>(null);

  const multiTrackItems = useMemo(() => PANELS.slice(0, MULTI_TRACK_COUNT), []);
  const { prefetch } = useVideoBuffer();

  useEffect(() => {
    if (mode !== "multiTrack") return;
    const safe = mod(activeIndex, multiTrackItems.length);
    const next = multiTrackItems[mod(safe + 1, multiTrackItems.length)];
    const prev = multiTrackItems[mod(safe - 1, multiTrackItems.length)];
    if (next) prefetch(next.video);
    if (prev) prefetch(prev.video);
  }, [activeIndex, mode, multiTrackItems, prefetch]);

  useEffect(() => {
    if (mode !== "heroStory") return;
    const safe = mod(heroStartIndex, PANELS.length);
    const next = PANELS[mod(safe + 1, PANELS.length)];
    if (next) prefetch(next.video);
  }, [heroStartIndex, mode, prefetch]);

  const moveMultiTrack = useCallback(
    (delta: number) => {
      setActiveIndex((prev) => mod(prev + delta, multiTrackItems.length));
    },
    [multiTrackItems.length],
  );

  const moveHero = useCallback((delta: number) => {
    setHeroStartIndex((prev) => mod(prev + delta, PANELS.length));
  }, []);

  const handleBreakoutOpen = useCallback((idx: number) => {
    setBreakoutIdx(idx);
  }, []);

  const handleBreakoutClose = useCallback(() => {
    setBreakoutIdx(null);
  }, []);

  const breakoutTarget = useMemo(() => {
    if (breakoutIdx === null) return null;
    return { panel: PANELS[mod(breakoutIdx, PANELS.length)], idx: breakoutIdx };
  }, [breakoutIdx]);

  return (
    <section className="relative mx-auto w-full max-w-[1600px]">
      <LayoutGroup id="video-keys">
        {mode === "multiTrack" ? (
          <>
            <ViewportGate
              desktop={
                <MultiTrackDesktop
                  panels={multiTrackItems}
                  activeIndex={activeIndex}
                  onActivate={setActiveIndex}
                  onBreakout={handleBreakoutOpen}
                />
              }
              mobile={
                <MultiTrackMobile
                  panels={multiTrackItems}
                  activeIndex={activeIndex}
                  onActivate={setActiveIndex}
                  onBreakout={handleBreakoutOpen}
                />
              }
            />

            <MultiTrackSubtitle idx={activeIndex} />

            <div className="md:hidden">
              <div className="mx-auto mt-5 grid w-full max-w-[460px] grid-cols-[auto_1fr_auto] items-center gap-4">
                <button
                  type="button"
                  aria-label="Poprzedni materiał Multi-Track"
                  className="text-2xl leading-none text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => moveMultiTrack(-1)}
                >
                  ←
                </button>
                <ModeToggleButtons mode={mode} setMode={setMode} />
                <button
                  type="button"
                  aria-label="Następny materiał Multi-Track"
                  className="text-2xl leading-none text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => moveMultiTrack(1)}
                >
                  →
                </button>
              </div>
            </div>

            <ModeToggleButtons mode={mode} setMode={setMode} className="mt-6 hidden md:flex" />
          </>
        ) : (
          <>
            <ViewportGate
              desktop={
                <HeroDesktop
                  panels={PANELS}
                  heroStartIndex={heroStartIndex}
                  onBreakout={handleBreakoutOpen}
                />
              }
              mobile={
                <HeroMobile
                  panels={PANELS}
                  heroStartIndex={heroStartIndex}
                  onSwipe={moveHero}
                  onBreakout={handleBreakoutOpen}
                />
              }
            />

            <HeroSubtitle idx={heroStartIndex} />

            <div className="md:hidden">
              <div className="mx-auto mt-5 grid w-full max-w-[460px] grid-cols-[auto_1fr_auto] items-center gap-4">
                <button
                  type="button"
                  aria-label="Poprzedni materiał Hero Story"
                  className="text-2xl leading-none text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => moveHero(-1)}
                >
                  ←
                </button>
                <ModeToggleButtons mode={mode} setMode={setMode} />
                <button
                  type="button"
                  aria-label="Następny materiał Hero Story"
                  className="text-2xl leading-none text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => moveHero(1)}
                >
                  →
                </button>
              </div>
            </div>

            <ArrowControls
              onPrev={() => moveHero(-1)}
              onNext={() => moveHero(1)}
              ariaLabelPrev="Poprzedni materiał Hero Story"
              ariaLabelNext="Następny materiał Hero Story"
              className="mx-auto mt-9 hidden w-full max-w-[1600px] md:flex"
            />

            <ModeToggleButtons mode={mode} setMode={setMode} className="mt-6 hidden md:flex" />
          </>
        )}

        <ImmersiveBreakout target={breakoutTarget} onClose={handleBreakoutClose} />
      </LayoutGroup>
    </section>
  );
}

export default function VideoKeysSection() {
  return (
    <VideoBufferProvider>
      <VideoKeysContent />
    </VideoBufferProvider>
  );
}
