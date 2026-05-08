"use client";

import { useEffect, useRef, type CSSProperties } from "react";

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
  const { subscribeMirror } = useVideoBuffer();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return subscribeMirror(src, canvas, objectPosition);
  }, [src, objectPosition, subscribeMirror]);

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
