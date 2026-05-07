/** Matches cinematic easing used across panels (see globals `.panel-expand`). */
export const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;

export const drawerSlideTransition = {
  duration: 0.52,
  ease: CINEMATIC_EASE,
} as const;

export const menuCurtainTransition = {
  duration: 0.55,
  ease: CINEMATIC_EASE,
} as const;
