"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

import { useVideoBuffer } from "./VideoBufferProvider";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function VideoScrubber({ src }: { src: string }) {
  const { getElement } = useVideoBuffer();
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const scrubbingRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = getElement(src);
    if (!el) return;

    const readDuration = () => {
      setDuration(Number.isFinite(el.duration) ? el.duration : 0);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    readDuration();
    setPlaying(!el.paused);
    setCurrent(el.currentTime);

    el.addEventListener("loadedmetadata", readDuration);
    el.addEventListener("durationchange", readDuration);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);

    const tick = () => {
      if (!scrubbingRef.current) {
        setCurrent(el.currentTime);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener("loadedmetadata", readDuration);
      el.removeEventListener("durationchange", readDuration);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [src, getElement]);

  const togglePlay = () => {
    const el = getElement(src);
    if (!el) return;
    if (el.paused) {
      const promise = el.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(() => {});
      }
    } else {
      el.pause();
    }
  };

  const seekTo = (time: number) => {
    const el = getElement(src);
    setCurrent(time);
    if (el) el.currentTime = time;
  };

  const max = duration > 0 ? duration : 0;
  const value = Math.min(current, max || current);
  const pct = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="mx-auto flex w-full max-w-[1100px] items-center gap-3 sm:gap-4">
      <button
        type="button"
        onClick={togglePlay}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label={playing ? "Wstrzymaj" : "Odtwórz"}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:border-white/60 hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {playing ? (
          <Pause className="h-5 w-5" strokeWidth={2.2} />
        ) : (
          <Play className="h-5 w-5 translate-x-[1px]" strokeWidth={2.2} />
        )}
      </button>

      <span className="w-[3.25rem] shrink-0 text-right font-mono text-xs tabular-nums text-white/80">
        {formatTime(value)}
      </span>

      <input
        type="range"
        min={0}
        max={max || 0}
        step={0.05}
        value={value}
        aria-label="Pasek przewijania wideo"
        onPointerDown={(e) => {
          e.stopPropagation();
          scrubbingRef.current = true;
        }}
        onPointerUp={() => {
          scrubbingRef.current = false;
        }}
        onPointerCancel={() => {
          scrubbingRef.current = false;
        }}
        onChange={(e) => seekTo(Number(e.target.value))}
        className="video-scrubber-range h-1.5 w-full cursor-pointer appearance-none rounded-full bg-transparent"
        style={{
          background: `linear-gradient(to right, var(--cinematic-accent, #c8a36a) ${pct}%, rgba(255,255,255,0.22) ${pct}%)`,
        }}
      />

      <span className="w-[3.25rem] shrink-0 font-mono text-xs tabular-nums text-white/60">
        {formatTime(max)}
      </span>
    </div>
  );
}
