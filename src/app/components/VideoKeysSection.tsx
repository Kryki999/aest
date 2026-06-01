"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayoutGroup } from "motion/react";
import {
  AudioLines,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Volume2,
  VolumeX,
} from "lucide-react";

import { HeroDesktop } from "./video-keys/HeroDesktop";
import { HeroMobile } from "./video-keys/HeroMobile";
import { ImmersiveBreakout } from "./video-keys/ImmersiveBreakout";
import { MultiTrackDesktop } from "./video-keys/MultiTrackDesktop";
import { MultiTrackMobile } from "./video-keys/MultiTrackMobile";
import { ViewportGate } from "./video-keys/ViewportGate";
import { useViewport } from "./video-keys/useViewport";
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
}: {
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
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

function Caption({ idx }: { idx: number }) {
  const item = PANELS[mod(idx, PANELS.length)];
  return (
    <div className="mx-auto mt-6 flex min-h-[6.5rem] max-w-[860px] flex-col items-center text-center md:mt-8 md:min-h-[8rem]">
      <p className="font-heading text-balance text-[clamp(1.8rem,5vw,3.2rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-foreground">
        {item.title}
      </p>
      <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground md:text-[0.78rem]">
        {item.subtitle}
      </p>
    </div>
  );
}

function ControlsRow({
  onPrev,
  onNext,
  ariaLabelPrev,
  ariaLabelNext,
  mode,
  setMode,
  soundOn,
  onToggleSound,
}: {
  onPrev: () => void;
  onNext: () => void;
  ariaLabelPrev: string;
  ariaLabelNext: string;
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
  soundOn: boolean;
  onToggleSound: () => void;
}) {
  return (
    <div className="mx-auto mt-2 grid w-full max-w-[600px] grid-cols-[auto_1fr_auto] items-center gap-4 md:mt-4">
      <button
        type="button"
        aria-label={ariaLabelPrev}
        onClick={onPrev}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/18 bg-black/35 text-foreground transition-all hover:-translate-y-0.5 hover:border-[var(--cinematic-accent)]/75 hover:text-white md:h-14 md:w-14"
      >
        <ChevronLeft className="h-7 w-7 md:h-8 md:w-8" strokeWidth={2.8} />
      </button>
      <div className="flex items-center justify-center gap-3">
        <ModeToggleButtons mode={mode} setMode={setMode} />
        <button
          type="button"
          aria-label={soundOn ? "Wyłącz dźwięk" : "Włącz dźwięk"}
          aria-pressed={soundOn}
          onClick={onToggleSound}
          className={`inline-flex h-14 w-14 items-center justify-center rounded-full transition ${
            soundOn
              ? "border border-primary bg-primary text-primary-foreground"
              : "border border-border bg-card/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
          }`}
        >
          {soundOn ? (
            <Volume2 className="h-7 w-7" strokeWidth={2.3} aria-hidden />
          ) : (
            <VolumeX className="h-7 w-7" strokeWidth={2.3} aria-hidden />
          )}
        </button>
      </div>
      <button
        type="button"
        aria-label={ariaLabelNext}
        onClick={onNext}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/18 bg-black/35 text-foreground transition-all hover:-translate-y-0.5 hover:border-[var(--cinematic-accent)]/75 hover:text-white md:h-14 md:w-14"
      >
        <ChevronRight className="h-7 w-7 md:h-8 md:w-8" strokeWidth={2.8} />
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
  const { prefetch, soundOn, setSoundOn, setAudioFocus } = useVideoBuffer();

  // Warm the browser cache with every poster thumbnail up front so switching
  // clips reveals the new clip's still image instantly (no blank flash while
  // the next video buffers).
  useEffect(() => {
    if (typeof window === "undefined") return;
    PANELS.forEach((panel) => {
      const img = new window.Image();
      img.src = panel.image;
    });
  }, []);

  const viewport = useViewport();
  const initedRef = useRef(false);
  useEffect(() => {
    if (!viewport || initedRef.current) return;
    initedRef.current = true;
    setMode(viewport === "mobile" ? "heroStory" : "multiTrack");
  }, [viewport]);

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

  // Switching modes keeps the SAME clip active, so the shared pooled video
  // keeps playing instead of jumping to whatever the other mode had selected.
  const handleModeChange = useCallback(
    (next: ViewMode) => {
      if (next === mode) return;
      if (next === "heroStory") {
        setHeroStartIndex(mod(activeIndex, PANELS.length));
      } else {
        setActiveIndex(mod(heroStartIndex, multiTrackItems.length));
      }
      setMode(next);
    },
    [mode, activeIndex, heroStartIndex, multiTrackItems.length],
  );

  const breakoutTarget = useMemo(() => {
    if (breakoutIdx === null) return null;
    return { panel: PANELS[mod(breakoutIdx, PANELS.length)], idx: breakoutIdx };
  }, [breakoutIdx]);

  const isMulti = mode === "multiTrack";
  const captionIdx = isMulti ? activeIndex : heroStartIndex;
  const move = isMulti ? moveMultiTrack : moveHero;
  const ariaPrev = isMulti
    ? "Poprzedni materiał Multi-Track"
    : "Poprzedni materiał Hero Story";
  const ariaNext = isMulti
    ? "Następny materiał Multi-Track"
    : "Następny materiał Hero Story";

  const activeSrc = isMulti
    ? multiTrackItems[mod(activeIndex, multiTrackItems.length)].video
    : PANELS[mod(heroStartIndex, PANELS.length)].video;

  useEffect(() => {
    setAudioFocus(activeSrc);
  }, [activeSrc, setAudioFocus]);

  return (
    <section
      id="start"
      className="relative mx-auto w-full max-w-[1600px] scroll-mt-24 md:scroll-mt-28"
    >
      <LayoutGroup id="video-keys">
        <div className="relative h-[48vh] md:h-[64vh]">
          {isMulti ? (
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
          ) : (
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
          )}
        </div>

        <Caption idx={captionIdx} />

        <ControlsRow
          onPrev={() => move(-1)}
          onNext={() => move(1)}
          ariaLabelPrev={ariaPrev}
          ariaLabelNext={ariaNext}
          mode={mode}
          setMode={handleModeChange}
          soundOn={soundOn}
          onToggleSound={() => setSoundOn(!soundOn)}
        />

        <ImmersiveBreakout
          target={breakoutTarget}
          onClose={handleBreakoutClose}
          sharedLayout={!(isMulti && viewport === "mobile")}
        />
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
