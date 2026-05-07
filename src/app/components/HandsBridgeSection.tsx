"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Progres przez pinowane sticky — nie używa offsetTop (stabilnie przy padded main).
 * Zakres: ile trzeba przewinąć, żeby sekcja przejechała przy sticky = height − viewport.
 */
function scrollProgressPinnedSection(section: HTMLElement) {
  const rect = section.getBoundingClientRect();
  const vh = window.innerHeight;
  const range = Math.max(rect.height - vh, 1);
  return clamp(-rect.top / range, 0, 1);
}

type HandsBridgeSectionProps = {
  videoSrc?: string;
  posterSrc?: string;
  /** Im więcej px scrolla na 1 s klipu — tym dłużej ekran „stoi”. */
  scrollPxPerSecond?: number;
};

export default function HandsBridgeSection({
  videoSrc = "/hands.mp4",
  posterSrc,
  scrollPxPerSecond = 900,
}: HandsBridgeSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStageRef = useRef<HTMLDivElement | null>(null);

  const durationRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const inViewRef = useRef(false);

  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [clipDurationSec, setClipDurationSec] = useState(0);

  const [desktopPinMinHeightPx, setDesktopPinMinHeightPx] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      setIsMobile(mobileQuery.matches);
      setReducedMotion(reducedQuery.matches);
    };

    sync();
    mobileQuery.addEventListener("change", sync);
    reducedQuery.addEventListener("change", sync);

    return () => {
      mobileQuery.removeEventListener("change", sync);
      reducedQuery.removeEventListener("change", sync);
    };
  }, []);

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        inViewRef.current = e?.isIntersecting ?? false;
        if (e?.isIntersecting) setShouldLoadVideo(true);
      },
      { rootMargin: "240px 0px", threshold: 0 },
    );

    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;

    const onMeta = () => {
      const d = video.duration;
      if (Number.isFinite(d) && d > 0) {
        durationRef.current = d;
        setClipDurationSec(d);
      }
      setVideoReady(true);
    };

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("canplay", () => setVideoReady(true));

    return () => video.removeEventListener("loadedmetadata", onMeta);
  }, [shouldLoadVideo]);

  /* Długi tor scroll desktop = zsynchronowany z klippem */
  useEffect(() => {
    if (
      reducedMotion ||
      isMobile ||
      clipDurationSec <= 0 ||
      typeof window === "undefined"
    ) {
      setDesktopPinMinHeightPx(null);
      return;
    }

    const compute = () => {
      const track = Math.ceil(clipDurationSec * scrollPxPerSecond);
      setDesktopPinMinHeightPx(track + window.innerHeight);
    };

    compute();
    window.addEventListener("resize", compute);

    return () => window.removeEventListener("resize", compute);
  }, [clipDurationSec, reducedMotion, isMobile, scrollPxPerSecond]);

  useEffect(() => {
    if (!shouldLoadVideo || reducedMotion || !isMobile) return;

    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    video.loop = true;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        if (e.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.2 },
    );

    io.observe(section);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, [shouldLoadVideo, reducedMotion, isMobile]);

  useEffect(() => {
    if (!shouldLoadVideo || reducedMotion || isMobile) return;

    const section = sectionRef.current;
    const video = videoRef.current;
    const mediaStage = mediaStageRef.current;
    if (!section || !video || !mediaStage) return;

    video.pause();

    const tick = () => {
      rafRef.current = null;

      if (document.visibilityState !== "visible") return;

      const d = durationRef.current;

      if (d > 0) {
        const linear = scrollProgressPinnedSection(section);
        const targetEnd = Math.max(d - 1 / 60, 0);
        const targetTime = clamp(linear * d, 0, targetEnd);

        if (
          video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
          Math.abs(video.currentTime - targetTime) > 1 / 120
        ) {
          try {
            video.currentTime = targetTime;
          } catch {
            /* seek race — ignorujemy */
          }
        }

        const subtleScale = 1 + linear * 0.035;
        mediaStage.style.transform = `translate3d(0, ${(0.5 - linear) * 1}%, 0) scale(${subtleScale})`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.visibilityState !== "visible") stopRaf();
      else if (rafRef.current === null)
        rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stopRaf();
      document.removeEventListener("visibilitychange", onVisibility);
      mediaStage.style.transform = "";
    };
  }, [shouldLoadVideo, reducedMotion, isMobile, stopRaf]);

  useEffect(() => {
    if (!reducedMotion) return;
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;
    video.pause();
    try {
      video.currentTime = 0;
    } catch {
      /* ignore */
    }
  }, [reducedMotion, shouldLoadVideo]);

  const desktopStyle =
    !isMobile && !reducedMotion && desktopPinMinHeightPx && desktopPinMinHeightPx > 0
      ? { minHeight: `${desktopPinMinHeightPx}px` }
      : undefined;

  /* Zanim przyjdzie metadata — przybliżony długi pin (nie kończy klip zanim się załaduje) */
  const heightFallbackDesktop =
    !isMobile && !reducedMotion && desktopPinMinHeightPx == null ? "min-h-[280vh]" : "";

  return (
    <section
      ref={sectionRef}
      style={desktopStyle}
      aria-label="Sekcja przejściowa z animacją"
      className={`relative isolate w-screen shrink-0 max-w-none ${
        reducedMotion ? "min-h-[52vh]" : isMobile ? "min-h-[92vh]" : ""
      } ${heightFallbackDesktop} mx-[calc(50%-50vw)]`}
    >
      <div className="sticky top-0 flex h-[100dvh] w-full min-h-0 items-stretch overflow-hidden">
        <div className="relative mx-auto flex h-full w-full min-h-0 min-w-0 max-w-[min(100vw,2200px)] flex-1">
          <div
            ref={mediaStageRef}
            className="absolute inset-0 origin-center bg-background will-change-transform"
          >
            {shouldLoadVideo ? (
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                src={videoSrc}
                poster={posterSrc}
                muted
                playsInline
                preload={reducedMotion ? "metadata" : "auto"}
                autoPlay={isMobile && !reducedMotion}
                loop={isMobile && !reducedMotion}
                disablePictureInPicture
                aria-hidden="true"
              />
            ) : (
              <div className="absolute inset-0 bg-background" aria-hidden />
            )}
          </div>

          <div
            className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(9,9,11,0.14)_0%,transparent_42%,transparent_58%,rgba(9,9,11,0.22)_100%)]"
            aria-hidden
          />
          <div
            className="hands-bridge-grain pointer-events-none absolute inset-0 z-10"
            aria-hidden
          />

          {!videoReady && shouldLoadVideo && !reducedMotion && (
            <div
              className="absolute inset-0 z-20 flex items-center justify-center bg-background"
              aria-live="polite"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                Ładowanie
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
