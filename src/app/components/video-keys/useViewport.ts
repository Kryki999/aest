"use client";

import { useSyncExternalStore } from "react";

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

export type Viewport = "desktop" | "mobile";

const subscribe = (onStoreChange: () => void): (() => void) => {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia(DESKTOP_MEDIA_QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
};

const getSnapshot = (): Viewport => {
  if (typeof window === "undefined" || !window.matchMedia) return "mobile";
  return window.matchMedia(DESKTOP_MEDIA_QUERY).matches ? "desktop" : "mobile";
};

const getServerSnapshot = (): Viewport | null => null;

export function useViewport(): Viewport | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
