"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const DESKTOP_HAND_PROGRESS = [0, 0.3, 0.48];

const DESKTOP_STAGE = {
  widthClass: "w-full max-w-[1600px]",
  handClass: "w-[clamp(620px,52vw,900px)]",
};

type HandAxis = [string, string, string];
type HandScale = [number, number, number];

type HandMotionPoint = {
  x: HandAxis;
  y: HandAxis;
  scale: HandScale;
};

const HAND_MOTION: Record<
  "desktop",
  Record<"left" | "right", HandMotionPoint>
> = {
  desktop: {
    left: {
      x: ["-260px", "-48px", "16px"],
      y: ["-13vh", "-5vh", "-2.5vh"],
      scale: [1, 1.04, 1.075],
    },
    right: {
      x: ["260px", "48px", "-16px"],
      y: ["24vh", "16.5vh", "14vh"],
      scale: [1, 1.04, 1.075],
    },
  },
};

export default function ScrollBoundHandsBridge() {
  const trackRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const leftDesktopX = useTransform(scrollYProgress, DESKTOP_HAND_PROGRESS, HAND_MOTION.desktop.left.x);
  const leftDesktopY = useTransform(scrollYProgress, DESKTOP_HAND_PROGRESS, HAND_MOTION.desktop.left.y);
  const leftDesktopScale = useTransform(scrollYProgress, DESKTOP_HAND_PROGRESS, HAND_MOTION.desktop.left.scale);
  const rightDesktopX = useTransform(scrollYProgress, DESKTOP_HAND_PROGRESS, HAND_MOTION.desktop.right.x);
  const rightDesktopY = useTransform(scrollYProgress, DESKTOP_HAND_PROGRESS, HAND_MOTION.desktop.right.y);
  const rightDesktopScale = useTransform(scrollYProgress, DESKTOP_HAND_PROGRESS, HAND_MOTION.desktop.right.scale);
  const auraOpacity = useTransform(scrollYProgress, [0, 0.48, 0.68], [0.42, 0.82, 0]);
  const darkRevealOpacity = useTransform(scrollYProgress, [0.5, 0.72, 1], [0, 0.92, 0.92]);
  const finalTextOpacity = useTransform(scrollYProgress, [0.5, 0.54, 0.96, 1], [0, 1, 1, 0]);
  const finalTextX = useTransform(
    scrollYProgress,
    [0.48, 0.68, 0.9, 1],
    ["112vw", "42vw", "-42vw", "-240vw"],
  );
  const bentoHintOpacity = useTransform(scrollYProgress, [0.9, 0.98, 1], [0, 0.55, 0.55]);
  const bentoHintY = useTransform(scrollYProgress, [0.9, 0.98, 1], ["16vh", "0vh", "0vh"]);
  const darkEdgeOpacity = useTransform(scrollYProgress, [0, 0.5, 0.72], [1, 1, 0]);

  return (
    <section
      ref={trackRef}
      aria-label="Aest Media cinematic hero"
      className="relative w-full max-w-full overflow-x-clip bg-[#09090B] md:h-[440vh]"
    >
      <div className="relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden px-0 py-8 md:hidden">
        <div className="relative z-10 -mb-12 w-[118vw] max-w-[520px] -translate-x-[25vw] -translate-y-[3vh] rotate-[-6deg]">
          <Image
            src="/handleft.webp"
            alt=""
            width={1400}
            height={900}
            priority
            sizes="118vw"
            className="h-auto w-full select-none object-contain drop-shadow-[0_0_28px_rgba(225,29,72,0.18)]"
          />
        </div>

        <p
          className="relative z-20 max-w-[12ch] text-center text-[clamp(2.4rem,12vw,4.1rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-[var(--cinematic-accent)]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Sztuka wizualnego wpływu.
        </p>

        <div className="relative z-10 -mt-3 w-[118vw] max-w-[520px] translate-x-[25vw] translate-y-[4vh] rotate-[2deg]">
          <Image
            src="/handright.webp"
            alt=""
            width={1400}
            height={900}
            priority
            sizes="118vw"
            className="h-auto w-full select-none object-contain drop-shadow-[0_0_28px_rgba(225,29,72,0.18)]"
          />
        </div>
      </div>

      <div className="sticky top-0 hidden h-[100dvh] w-full max-w-full overflow-hidden bg-[#09090B] md:block">
        <motion.div
          aria-hidden="true"
          style={{ opacity: darkRevealOpacity }}
          className="pointer-events-none absolute inset-0 z-[25] hidden bg-[#09090B] md:block"
        />
        <motion.div
          aria-hidden="true"
          style={{ opacity: auraOpacity }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[64vmin] w-[64vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(225,29,72,0.34)_0%,rgba(225,29,72,0.14)_36%,transparent_70%)] blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.22)_45%,rgba(9,9,11,0.88)_100%)]"
        />
        <div
          aria-hidden="true"
          className="hands-bridge-grain pointer-events-none absolute inset-0 opacity-[0.07]"
        />

        <div className="pointer-events-none absolute inset-0 z-40 hidden items-center overflow-hidden md:flex">
          <motion.p
            style={{
              fontFamily: "var(--font-serif)",
              opacity: finalTextOpacity,
              x: finalTextX,
            }}
            className="absolute left-0 w-max whitespace-nowrap text-left text-[clamp(4.2rem,7.4vw,8.8rem)] font-semibold leading-none tracking-[-0.06em] text-[var(--cinematic-accent)] will-change-transform"
          >
            Sztuka wizualnego wpływu.
          </motion.p>
        </div>

        <div
          className={`absolute left-1/2 top-1/2 z-20 hidden h-full ${DESKTOP_STAGE.widthClass} -translate-x-1/2 -translate-y-1/2 md:block`}
        >
          <motion.div
            aria-hidden="true"
            style={{ x: leftDesktopX, y: leftDesktopY, scale: leftDesktopScale }}
            className={`absolute left-0 top-1/2 ${DESKTOP_STAGE.handClass} origin-left will-change-transform`}
          >
            <div className="-translate-y-1/2">
              <Image
                src="/handleft.webp"
                alt=""
                width={1800}
                height={1100}
                priority
                sizes="(min-width: 1600px) 900px, 52vw"
                className="h-auto w-full select-none object-contain drop-shadow-[0_0_46px_rgba(225,29,72,0.2)]"
              />
            </div>
          </motion.div>

          <motion.div
            aria-hidden="true"
            style={{ x: rightDesktopX, y: rightDesktopY, scale: rightDesktopScale }}
            className={`absolute right-0 top-1/2 ${DESKTOP_STAGE.handClass} origin-right will-change-transform`}
          >
            <div className="-translate-y-1/2">
              <Image
                src="/handright.webp"
                alt=""
                width={1800}
                height={1100}
                priority
                sizes="(min-width: 1600px) 900px, 52vw"
                className="h-auto w-full select-none object-contain drop-shadow-[0_0_46px_rgba(225,29,72,0.2)]"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          aria-hidden="true"
          style={{ opacity: bentoHintOpacity, y: bentoHintY }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-50 hidden h-24 bg-gradient-to-t from-[var(--cinematic-accent)]/35 via-white/10 to-transparent will-change-transform md:block"
        />

        <motion.div
          aria-hidden="true"
          style={{ opacity: darkEdgeOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-36 bg-gradient-to-t from-[#09090B] to-transparent"
        />
      </div>
    </section>
  );
}
