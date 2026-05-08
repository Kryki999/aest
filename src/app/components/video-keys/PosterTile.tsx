"use client";

import Image from "next/image";
import { type CSSProperties } from "react";

type PosterTileProps = {
  src: string;
  alt: string;
  /** Render the optimised dimmed/grayscale state for inactive idle tiles. */
  dimmed?: boolean;
  /** Optional overlay opacity (0..1). */
  overlayOpacity?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  objectPosition?: string;
};

/**
 * Idle-state representation of a video tile. Renders a single optimised
 * still frame via `next/image` plus a tonal overlay. NEVER mounts a `<video>`.
 */
export function PosterTile({
  src,
  alt,
  dimmed = false,
  overlayOpacity,
  priority = false,
  sizes = "(min-width: 768px) 25vw, 80vw",
  className,
  style,
  objectPosition = "center",
}: PosterTileProps) {
  const overlay =
    overlayOpacity ?? (dimmed ? 0.6 : 0);

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        ...style,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover transition-[filter] duration-500 ${
          dimmed ? "grayscale" : "grayscale-0"
        }`}
        style={{ objectPosition }}
        unoptimized
      />
      {overlay > 0 ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: `rgba(12, 10, 9, ${overlay})`,
            transition: "background-color 500ms ease",
          }}
        />
      ) : null}
    </div>
  );
}
