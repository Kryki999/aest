"use client";

import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";

import { useVideoBuffer } from "./VideoBufferProvider";

type CanvasMirrorProps = {
  src: string;
  /** Mirrors `object-position` semantics applied to a single shared video stream. */
  objectPosition?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Renders a `<canvas>` that mirrors the pooled `<video>` for `src` via per-frame
 * drawImage. Multiple mirrors can show different `objectPosition` slices of the
 * same source while only ONE decoder pipeline runs.
 */
export function CanvasMirror({
  src,
  objectPosition = "50% center",
  className,
  style,
}: CanvasMirrorProps) {
  const { subscribeMirror, getElement } = useVideoBuffer();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Hide the canvas the moment the source changes (synchronously, before the
  // browser paints) so the frozen frame from the previous clip is never shown.
  // The poster behind becomes visible until the new source has a real frame.
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.opacity = "0";
  }, [src]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.style.transition = "opacity 280ms ease";
    const unsubscribe = subscribeMirror(src, canvas, objectPosition);

    // Reveal the canvas only once the NEW source can actually draw a frame, so
    // we cross-fade from the new poster to live video instead of a stale frame.
    let rafId = requestAnimationFrame(function check() {
      const el = getElement(src);
      if (el && el.readyState >= 2 && el.videoWidth > 0) {
        canvas.style.opacity = "1";
        return;
      }
      rafId = requestAnimationFrame(check);
    });

    return () => {
      cancelAnimationFrame(rafId);
      unsubscribe();
    };
  }, [src, objectPosition, subscribeMirror, getElement]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        willChange: "transform",
        transform: "translateZ(0)",
        ...style,
      }}
    />
  );
}
