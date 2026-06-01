"use client";

import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";

import { useVideoBuffer } from "./VideoBufferProvider";

type SharedVideoSurfaceProps = {
  src: string;
  /** CSS object-position passed to the underlying <video> (e.g. "50% center"). */
  objectPosition?: string;
  /** CSS object-fit override (default: "cover"). */
  objectFit?: CSSProperties["objectFit"];
  className?: string;
  style?: CSSProperties;
};

/**
 * Borrows a single HTMLVideoElement from the global pool keyed by `src` and
 * reparents it into this container. The same DOM node is moved between
 * surfaces (grid tile -> immersive overlay) without resetting the playback.
 */
export function SharedVideoSurface({
  src,
  objectPosition,
  objectFit = "cover",
  className,
  style,
}: SharedVideoSurfaceProps) {
  const { acquire, release } = useVideoBuffer();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const el = acquire(src, container);
    el.autoplay = true;
    el.preload = "auto";

    // Keep the shared element transparent until it actually has a frame for
    // THIS source, so the poster behind shows the new clip's thumbnail
    // immediately instead of a frozen/stale frame while HLS buffers.
    el.style.transition = "opacity 280ms ease";
    const reveal = () => {
      if (el.readyState >= 2) el.style.opacity = "1";
    };
    if (el.readyState >= 2) {
      el.style.opacity = "1";
    } else {
      el.style.opacity = "0";
      el.addEventListener("loadeddata", reveal);
      el.addEventListener("canplay", reveal);
      el.addEventListener("playing", reveal);
      el.addEventListener("timeupdate", reveal);
    }

    const playPromise = el.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Autoplay can be blocked silently; ignore.
      });
    }

    return () => {
      el.removeEventListener("loadeddata", reveal);
      el.removeEventListener("canplay", reveal);
      el.removeEventListener("playing", reveal);
      el.removeEventListener("timeupdate", reveal);
      // Reset so the next consumer of this pooled element starts visible.
      el.style.opacity = "1";
      release(src, container);
    };
  }, [src, acquire, release]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const el = container.firstElementChild as HTMLVideoElement | null;
    if (!el) return;
    el.style.objectFit = objectFit ?? "cover";
    if (objectPosition) {
      el.style.objectPosition = objectPosition;
    } else {
      el.style.removeProperty("object-position");
    }
  }, [objectFit, objectPosition]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        willChange: "transform",
        transform: "translateZ(0)",
        ...style,
      }}
    />
  );
}
