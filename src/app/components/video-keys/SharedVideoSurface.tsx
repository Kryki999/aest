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
    const playPromise = el.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Autoplay can be blocked silently; ignore.
      });
    }

    return () => {
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
