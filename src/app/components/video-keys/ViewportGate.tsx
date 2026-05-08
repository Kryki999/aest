"use client";

import type { ReactNode } from "react";

import { useViewport, type Viewport } from "./useViewport";

type ViewportGateProps = {
  desktop: ReactNode;
  mobile: ReactNode;
  fallback?: ReactNode;
  /** Force-render a viewport (useful for testing). */
  forceViewport?: Viewport;
};

/**
 * Mounts ONLY the subtree that matches the current viewport. The opposite
 * branch is unmounted (not just hidden), so heavy media trees never coexist.
 * Renders `fallback` (default: `null`) during SSR / first paint until matchMedia resolves.
 */
export function ViewportGate({
  desktop,
  mobile,
  fallback = null,
  forceViewport,
}: ViewportGateProps) {
  const detected = useViewport();
  const viewport = forceViewport ?? detected;

  if (viewport === null) return <>{fallback}</>;
  if (viewport === "desktop") return <>{desktop}</>;
  return <>{mobile}</>;
}
