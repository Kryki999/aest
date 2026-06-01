"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type MirrorMeta = {
  posX: number;
  posY: number;
};

type PoolEntry = {
  element: HTMLVideoElement;
  /** Ordered list of containers currently claiming this element. Most recent last. */
  parents: HTMLElement[];
  /** Canvas mirrors that share this source via per-frame drawImage. */
  mirrors: Map<HTMLCanvasElement, MirrorMeta>;
  rafId: number | null;
  lastTouched: number;
};

type VideoBufferContextValue = {
  /** Acquire the pooled video element for `src` and reparent it into `container`. */
  acquire: (src: string, container: HTMLElement) => HTMLVideoElement;
  /** Release the pooled element from `container`. If other claimants remain, the element is reparented to the most recent. */
  release: (src: string, container: HTMLElement) => void;
  /** Warm up the pool with `src` so the network/decoder pipeline is ready when the surface mounts. */
  prefetch: (src: string) => void;
  /**
   * Subscribe a canvas to mirror the given source via per-frame drawImage.
   * The source video is kept playing (parked off-screen if no primary surface holds it).
   * Returns an unsubscribe function.
   */
  subscribeMirror: (
    src: string,
    canvas: HTMLCanvasElement,
    objectPosition: string,
  ) => () => void;
  /** Global sound toggle (default off). Unmutes the focused inline clip when on. */
  soundOn: boolean;
  setSoundOn: (value: boolean) => void;
  /** Marks which inline source should receive audio when `soundOn` is true. */
  setAudioFocus: (src: string | null) => void;
  /** Fullscreen took over audio: unmute only this source (unless muted in fullscreen). */
  enterFullscreenAudio: (src: string) => void;
  /** Leave fullscreen audio: fall back to the global `soundOn`/focus rule. */
  exitFullscreenAudio: () => void;
  /** Whether the fullscreen player is currently muted. */
  fullscreenMuted: boolean;
  toggleFullscreenMute: () => void;
  /** Direct access to the pooled element for a source (e.g. for a scrubber). */
  getElement: (src: string) => HTMLVideoElement | null;
};

const VideoBufferContext = createContext<VideoBufferContextValue | null>(null);

const LRU_LIMIT = 3;

type FullscreenAudio = { src: string; muted: boolean } | null;

/**
 * Single source of truth for which pooled element should be audible.
 * Returns the `muted` value that an element with `src` must have.
 */
function computeMuted(
  src: string,
  soundOn: boolean,
  audioFocusSrc: string | null,
  fullscreen: FullscreenAudio,
): boolean {
  if (fullscreen) {
    return !(src === fullscreen.src && !fullscreen.muted);
  }
  return !(soundOn && src === audioFocusSrc);
}

function configureVideoElement(el: HTMLVideoElement, src: string): void {
  el.src = src;
  el.muted = true;
  el.loop = true;
  el.playsInline = true;
  el.autoplay = true;
  el.preload = "auto";
  el.crossOrigin = "anonymous";
  el.setAttribute("muted", "");
  el.setAttribute("playsinline", "");
  el.style.width = "100%";
  el.style.height = "100%";
  el.style.objectFit = "cover";
  el.style.display = "block";
  el.style.willChange = "transform";
  el.style.transform = "translateZ(0)";
}

function createVideoElement(src: string): HTMLVideoElement {
  const el = document.createElement("video");
  configureVideoElement(el, src);
  return el;
}

function destroyEntry(entry: PoolEntry): void {
  if (entry.rafId !== null) {
    cancelAnimationFrame(entry.rafId);
    entry.rafId = null;
  }
  entry.mirrors.clear();
  entry.element.pause();
  entry.element.removeAttribute("src");
  entry.element.load();
  if (entry.element.parentNode) {
    entry.element.parentNode.removeChild(entry.element);
  }
}

function parsePosition(pos: string): { posX: number; posY: number } {
  const tokens = pos.trim().split(/\s+/);
  const tokenToPct = (token: string | undefined, fallback: number): number => {
    if (!token) return fallback;
    if (token === "left" || token === "top") return 0;
    if (token === "right" || token === "bottom") return 1;
    if (token === "center") return 0.5;
    const parsed = parseFloat(token);
    if (Number.isNaN(parsed)) return fallback;
    return Math.min(1, Math.max(0, parsed / 100));
  };
  const posX = tokenToPct(tokens[0], 0.5);
  const posY = tokenToPct(tokens[1], 0.5);
  return { posX, posY };
}

function getCoverSourceRect(
  videoW: number,
  videoH: number,
  canvasW: number,
  canvasH: number,
  posX: number,
  posY: number,
): { sx: number; sy: number; sw: number; sh: number } {
  const videoAR = videoW / videoH;
  const canvasAR = canvasW / canvasH;
  let sw: number;
  let sh: number;
  if (videoAR > canvasAR) {
    sh = videoH;
    sw = videoH * canvasAR;
  } else {
    sw = videoW;
    sh = videoW / canvasAR;
  }
  const sx = (videoW - sw) * posX;
  const sy = (videoH - sh) * posY;
  return { sx, sy, sw, sh };
}

export function VideoBufferProvider({ children }: { children: ReactNode }) {
  const pool = useRef<Map<string, PoolEntry>>(new Map());
  const parkRef = useRef<HTMLDivElement | null>(null);

  const [soundOn, setSoundOnState] = useState(false);
  const [fullscreen, setFullscreen] = useState<FullscreenAudio>(null);
  // Mirror the audio state into refs so acquire/subscribeMirror/prefetch can
  // mute brand-new elements synchronously, before the next render commits.
  const soundOnRef = useRef(false);
  const audioFocusRef = useRef<string | null>(null);
  const fullscreenRef = useRef<FullscreenAudio>(null);

  const applyMuted = useCallback((src: string, el: HTMLVideoElement) => {
    el.muted = computeMuted(
      src,
      soundOnRef.current,
      audioFocusRef.current,
      fullscreenRef.current,
    );
  }, []);

  const syncAudio = useCallback(() => {
    pool.current.forEach((entry, src) => {
      applyMuted(src, entry.element);
    });
  }, [applyMuted]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const park = document.createElement("div");
    park.setAttribute("aria-hidden", "true");
    park.style.cssText =
      "position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;pointer-events:none;contain:strict;";
    document.body.appendChild(park);
    parkRef.current = park;
    return () => {
      park.remove();
      parkRef.current = null;
    };
  }, []);

  const stopRAF = useCallback((entry: PoolEntry) => {
    if (entry.rafId !== null) {
      cancelAnimationFrame(entry.rafId);
      entry.rafId = null;
    }
  }, []);

  const startRAF = useCallback((entry: PoolEntry) => {
    if (entry.rafId !== null) return;
    const tick = () => {
      if (entry.mirrors.size === 0) {
        entry.rafId = null;
        return;
      }
      const video = entry.element;
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (vw > 0 && vh > 0 && video.readyState >= 2) {
        const dpr = window.devicePixelRatio || 1;
        entry.mirrors.forEach((meta, canvas) => {
          const cw = canvas.clientWidth;
          const ch = canvas.clientHeight;
          if (cw <= 0 || ch <= 0) return;
          const targetW = Math.max(1, Math.floor(cw * dpr));
          const targetH = Math.max(1, Math.floor(ch * dpr));
          if (canvas.width !== targetW) canvas.width = targetW;
          if (canvas.height !== targetH) canvas.height = targetH;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          const { sx, sy, sw, sh } = getCoverSourceRect(
            vw,
            vh,
            targetW,
            targetH,
            meta.posX,
            meta.posY,
          );
          ctx.drawImage(video, sx, sy, sw, sh, 0, 0, targetW, targetH);
        });
      }
      entry.rafId = requestAnimationFrame(tick);
    };
    entry.rafId = requestAnimationFrame(tick);
  }, []);

  const evict = useCallback(() => {
    const map = pool.current;
    if (map.size <= LRU_LIMIT) return;

    const candidates = Array.from(map.entries())
      .filter(
        ([, entry]) => entry.parents.length === 0 && entry.mirrors.size === 0,
      )
      .sort((a, b) => a[1].lastTouched - b[1].lastTouched);

    while (map.size > LRU_LIMIT && candidates.length > 0) {
      const next = candidates.shift();
      if (!next) break;
      const [src, entry] = next;
      destroyEntry(entry);
      map.delete(src);
    }
  }, []);

  const ensureSourcePlaying = useCallback((entry: PoolEntry) => {
    const playPromise = entry.element.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Silent: autoplay can be blocked.
      });
    }
  }, []);

  const parkSourceIfOrphan = useCallback((entry: PoolEntry) => {
    if (entry.parents.length === 0 && entry.mirrors.size > 0 && parkRef.current) {
      if (entry.element.parentNode !== parkRef.current) {
        parkRef.current.appendChild(entry.element);
      }
    }
  }, []);

  const acquire = useCallback(
    (src: string, container: HTMLElement) => {
      const map = pool.current;
      let entry = map.get(src);
      if (!entry) {
        entry = {
          element: createVideoElement(src),
          parents: [],
          mirrors: new Map(),
          rafId: null,
          lastTouched: Date.now(),
        };
        map.set(src, entry);
      }
      entry.parents = entry.parents.filter((c) => c !== container);
      entry.parents.push(container);
      entry.lastTouched = Date.now();

      if (entry.element.parentNode !== container) {
        container.appendChild(entry.element);
      }
      applyMuted(src, entry.element);
      ensureSourcePlaying(entry);
      return entry.element;
    },
    [applyMuted, ensureSourcePlaying],
  );

  const release = useCallback(
    (src: string, container: HTMLElement) => {
      const entry = pool.current.get(src);
      if (!entry) return;
      entry.parents = entry.parents.filter((c) => c !== container);
      entry.lastTouched = Date.now();

      const fallback = entry.parents[entry.parents.length - 1];
      if (fallback) {
        if (entry.element.parentNode !== fallback) {
          fallback.appendChild(entry.element);
        }
        return;
      }

      if (entry.mirrors.size > 0) {
        parkSourceIfOrphan(entry);
        return;
      }

      entry.element.pause();
      if (entry.element.parentNode === container) {
        container.removeChild(entry.element);
      }
      evict();
    },
    [evict, parkSourceIfOrphan],
  );

  const prefetch = useCallback(
    (src: string) => {
      const map = pool.current;
      const existing = map.get(src);
      if (existing) {
        existing.lastTouched = Date.now();
        return;
      }
      const element = createVideoElement(src);
      element.autoplay = false;
      element.removeAttribute("autoplay");
      element.preload = "metadata";
      applyMuted(src, element);
      map.set(src, {
        element,
        parents: [],
        mirrors: new Map(),
        rafId: null,
        lastTouched: Date.now(),
      });
      evict();
    },
    [applyMuted, evict],
  );

  const subscribeMirror = useCallback(
    (src: string, canvas: HTMLCanvasElement, objectPosition: string) => {
      const map = pool.current;
      let entry = map.get(src);
      if (!entry) {
        entry = {
          element: createVideoElement(src),
          parents: [],
          mirrors: new Map(),
          rafId: null,
          lastTouched: Date.now(),
        };
        map.set(src, entry);
      }
      const meta = parsePosition(objectPosition);
      entry.mirrors.set(canvas, meta);
      entry.lastTouched = Date.now();

      parkSourceIfOrphan(entry);
      applyMuted(src, entry.element);
      ensureSourcePlaying(entry);
      startRAF(entry);

      return () => {
        const current = pool.current.get(src);
        if (!current) return;
        current.mirrors.delete(canvas);
        current.lastTouched = Date.now();
        if (current.mirrors.size === 0) {
          stopRAF(current);
          if (current.parents.length === 0) {
            current.element.pause();
            if (current.element.parentNode === parkRef.current) {
              parkRef.current?.removeChild(current.element);
            }
            evict();
          }
        }
      };
    },
    [applyMuted, ensureSourcePlaying, evict, parkSourceIfOrphan, startRAF, stopRAF],
  );

  const setSoundOn = useCallback(
    (value: boolean) => {
      soundOnRef.current = value;
      setSoundOnState(value);
      syncAudio();
    },
    [syncAudio],
  );

  const setAudioFocus = useCallback(
    (src: string | null) => {
      if (audioFocusRef.current === src) return;
      audioFocusRef.current = src;
      syncAudio();
    },
    [syncAudio],
  );

  const enterFullscreenAudio = useCallback(
    (src: string) => {
      const next = { src, muted: false };
      fullscreenRef.current = next;
      setFullscreen(next);
      syncAudio();
    },
    [syncAudio],
  );

  const exitFullscreenAudio = useCallback(() => {
    fullscreenRef.current = null;
    setFullscreen(null);
    syncAudio();
  }, [syncAudio]);

  const toggleFullscreenMute = useCallback(() => {
    const current = fullscreenRef.current;
    if (!current) return;
    const next = { src: current.src, muted: !current.muted };
    fullscreenRef.current = next;
    setFullscreen(next);
    syncAudio();
  }, [syncAudio]);

  const getElement = useCallback((src: string) => {
    return pool.current.get(src)?.element ?? null;
  }, []);

  useEffect(() => {
    const snapshot = pool.current;
    return () => {
      snapshot.forEach((entry) => destroyEntry(entry));
      snapshot.clear();
    };
  }, []);

  const value = useMemo<VideoBufferContextValue>(
    () => ({
      acquire,
      release,
      prefetch,
      subscribeMirror,
      soundOn,
      setSoundOn,
      setAudioFocus,
      enterFullscreenAudio,
      exitFullscreenAudio,
      fullscreenMuted: fullscreen?.muted ?? false,
      toggleFullscreenMute,
      getElement,
    }),
    [
      acquire,
      release,
      prefetch,
      subscribeMirror,
      soundOn,
      setSoundOn,
      setAudioFocus,
      enterFullscreenAudio,
      exitFullscreenAudio,
      fullscreen,
      toggleFullscreenMute,
      getElement,
    ],
  );

  return (
    <VideoBufferContext.Provider value={value}>
      {children}
    </VideoBufferContext.Provider>
  );
}

export function useVideoBuffer(): VideoBufferContextValue {
  const ctx = useContext(VideoBufferContext);
  if (!ctx) {
    throw new Error("useVideoBuffer must be used within VideoBufferProvider");
  }
  return ctx;
}
