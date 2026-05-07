"use client";

import { useMemo, useState, type TouchEvent } from "react";

type ViewMode = "multiTrack" | "heroStory";

type Panel = {
  title: string;
  subtitle: string;
  image: string;
  video: string;
  shiftClass: string;
};

const PANELS: Panel[] = [
  {
    title: "The Little Mermaid",
    subtitle: "Part of Your World",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAeviKa0ntc82s3ZuLK0du89vuAMffA0Tjm8scZ0nSEePVA16HlOFAPCMLXxExR0Xs0hggO9D4RLbGZdqHMbVoDGK6u5uOZJxq9eD4eCsTnd5QC7D7_xmXDdu9U3qgE2d8o7M4g_vbJylUiDqHDO3fFBLmx2KfYRVeF-9I4xC0RI71WMXnTYTusWenwrO53kULnCGU2ipo7lhvYdlJePo1reDujyvzKTNq0NyuGQCu4I6yCpYjIoBl3Qm6AfsjnZ5wX8gOL0IpJyxOR",
    video: "https://cdn.pixabay.com/video/2020/11/07/55718-503971825_large.mp4",
    shiftClass: "-translate-y-5",
  },
  {
    title: "Beauty and the Beast",
    subtitle: "Be Our Guest",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUlPYYgQSvj5HJ_zoAeNzJASe83QJkefLnwWHiWIrftnBOyJOMUO1VPCNa7c4uzlNbDxMep2DMxUTZjo638xq9pKlXJ0eXQqTFpumovvhKa6Ub5un7t4qxbfBFL5OO_o9g5peLC3n0hMqNKf_08bunE7n64lAdtEonNjMFaUDDBeTxTTh3z1aMbeBGiVi1kxRmk0wldsCsOMr-0xU2liM2apYzC5kY42B3W1V8ePOZzPE5X4hoKhXlcO_XPZwjS8WVCKiYTBveRuew",
    video: "https://cdn.pixabay.com/video/2019/12/12/30121-380473626_large.mp4",
    shiftClass: "translate-y-0",
  },
  {
    title: "Aladdin",
    subtitle: "A Whole New World",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMQejSKlmRYRRuh8jY47yjDAaryeIoT8Pwhr7waIkN_nxZjStqzckvdmkqavbN_mzHQn6UEFVx3Qca-hM3zvhsWZePyEyHe0lYOWgWCfT6urwGE7BG-Y-26WT9Yn0bWEvvYMXeCj9KBbsXXzeq0kwgF1551WuZn84CNlB9tI70r5RZgu-vruwASnsFqAP7YuQLkeG84zTwJZAkU9jZFGNhGnDSu-_XMml_cODPpu4zjmCeKv29N7MHI2Ak_NYJGjUsnIonx1KDUfiX",
    video: "https://cdn.pixabay.com/video/2020/05/06/38270-415950888_large.mp4",
    shiftClass: "translate-y-5",
  },
  {
    title: "Pocahontas",
    subtitle: "Colors of the Wind",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-LxSKjND7km-qB1ikO76rNhGs9ZyYs4mb_fBkNtR5rPCCKJiBObSkezf5Te3ohcu0cyQLLYMOqcVyNpNjKrYmiOAynmLintK_XRHMH-6gqLchw1JCwElyD_4CX3M8cptt2yP5BEbYPQm4TOKqZmE180SLZumJuvaDz-oRRGPVixf_4oaZ5IRH0wSt-Uu_bQXc8bOl8r2tFhd6jKBF6TW7tkt-hklBkkg4T_qzMB4jWMWMTY9t8eeWB2IRmjEe3-XdW1WjpZllxa7q",
    video: "https://cdn.pixabay.com/video/2024/03/03/202813-918944372_large.mp4",
    shiftClass: "translate-y-0",
  },
  {
    title: "Hercules",
    subtitle: "Zero to Hero",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAeviKa0ntc82s3ZuLK0du89vuAMffA0Tjm8scZ0nSEePVA16HlOFAPCMLXxExR0Xs0hggO9D4RLbGZdqHMbVoDGK6u5uOZJxq9eD4eCsTnd5QC7D7_xmXDdu9U3qgE2d8o7M4g_vbJylUiDqHDO3fFBLmx2KfYRVeF-9I4xC0RI71WMXnTYTusWenwrO53kULnCGU2ipo7lhvYdlJePo1reDujyvzKTNq0NyuGQCu4I6yCpYjIoBl3Qm6AfsjnZ5wX8gOL0IpJyxOR",
    video: "https://cdn.pixabay.com/video/2025/10/12/309451_large.mp4",
    shiftClass: "-translate-y-5",
  },
  {
    title: "Tangled",
    subtitle: "I See the Light",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUlPYYgQSvj5HJ_zoAeNzJASe83QJkefLnwWHiWIrftnBOyJOMUO1VPCNa7c4uzlNbDxMep2DMxUTZjo638xq9pKlXJ0eXQqTFpumovvhKa6Ub5un7t4qxbfBFL5OO_o9g5peLC3n0hMqNKf_08bunE7n64lAdtEonNjMFaUDDBeTxTTh3z1aMbeBGiVi1kxRmk0wldsCsOMr-0xU2liM2apYzC5kY42B3W1V8ePOZzPE5X4hoKhXlcO_XPZwjS8WVCKiYTBveRuew",
    video: "https://cdn.pixabay.com/video/2025/01/14/252568_large.mp4",
    shiftClass: "translate-y-5",
  },
  {
    title: "Newsies",
    subtitle: "Seize the Day",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMQejSKlmRYRRuh8jY47yjDAaryeIoT8Pwhr7waIkN_nxZjStqzckvdmkqavbN_mzHQn6UEFVx3Qca-hM3zvhsWZePyEyHe0lYOWgWCfT6urwGE7BG-Y-26WT9Yn0bWEvvYMXeCj9KBbsXXzeq0kwgF1551WuZn84CNlB9tI70r5RZgu-vruwASnsFqAP7YuQLkeG84zTwJZAkU9jZFGNhGnDSu-_XMml_cODPpu4zjmCeKv29N7MHI2Ak_NYJGjUsnIonx1KDUfiX",
    video: "https://cdn.pixabay.com/video/2020/11/30/58126-486441454_large.mp4",
    shiftClass: "translate-y-0",
  },
  {
    title: "Enchanted",
    subtitle: "Happy Working Song",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-LxSKjND7km-qB1ikO76rNhGs9ZyYs4mb_fBkNtR5rPCCKJiBObSkezf5Te3ohcu0cyQLLYMOqcVyNpNjKrYmiOAynmLintK_XRHMH-6gqLchw1JCwElyD_4CX3M8cptt2yP5BEbYPQm4TOKqZmE180SLZumJuvaDz-oRRGPVixf_4oaZ5IRH0wSt-Uu_bQXc8bOl8r2tFhd6jKBF6TW7tkt-hklBkkg4T_qzMB4jWMWMTY9t8eeWB2IRmjEe3-XdW1WjpZllxa7q",
    video: "https://cdn.pixabay.com/video/2023/10/24/186181-877706029_large.mp4",
    shiftClass: "-translate-y-5",
  },
  {
    title: "The Hunchback",
    subtitle: "Out There",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAeviKa0ntc82s3ZuLK0du89vuAMffA0Tjm8scZ0nSEePVA16HlOFAPCMLXxExR0Xs0hggO9D4RLbGZdqHMbVoDGK6u5uOZJxq9eD4eCsTnd5QC7D7_xmXDdu9U3qgE2d8o7M4g_vbJylUiDqHDO3fFBLmx2KfYRVeF-9I4xC0RI71WMXnTYTusWenwrO53kULnCGU2ipo7lhvYdlJePo1reDujyvzKTNq0NyuGQCu4I6yCpYjIoBl3Qm6AfsjnZ5wX8gOL0IpJyxOR",
    video: "https://cdn.pixabay.com/video/2017/08/24/11587-231935334_large.mp4",
    shiftClass: "translate-y-0",
  },
];

const MULTI_TRACK_COUNT = 9;
const SWIPE_THRESHOLD_PX = 40;
const HERO_MOBILE_STAGGER_PATTERN = [-14, 0, 14, 0, -14];
const mod = (n: number, m: number) => ((n % m) + m) % m;

function ModeIcon({
  active,
  type,
}: {
  active: boolean;
  type: "multiTrack" | "heroStory";
}) {
  if (type === "multiTrack") {
    return (
      <svg viewBox="0 0 32 32" className="h-4 w-4" aria-hidden>
        {[2, 6, 10, 14, 18, 22, 26, 30, 34].map((_, idx) => (
          <rect
            key={`multi-${idx}`}
            x={2 + idx * 3}
            y={4 + (idx % 2 === 0 ? 0 : 2)}
            width="2"
            height="24"
            rx="1"
            className={active ? "fill-primary-foreground" : "fill-current"}
          />
        ))}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" className="h-4 w-4" aria-hidden>
      <rect x="3" y="4" width="4" height="24" rx="1" className={active ? "fill-primary-foreground" : "fill-current"} />
      <rect x="8.5" y="4" width="4" height="24" rx="1" className={active ? "fill-primary-foreground" : "fill-current"} />
      <rect x="14" y="4" width="4" height="24" rx="1" className={active ? "fill-primary-foreground" : "fill-current"} />
      <rect x="19.5" y="4" width="4" height="24" rx="1" className={active ? "fill-primary-foreground" : "fill-current"} />
      <rect x="25" y="4" width="4" height="24" rx="1" className={active ? "fill-primary-foreground" : "fill-current"} />
    </svg>
  );
}

export default function VideoKeysSection() {
  const [mode, setMode] = useState<ViewMode>("multiTrack");
  const [activeIndex, setActiveIndex] = useState(4);
  const [heroStartIndex, setHeroStartIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const multiTrackItems = useMemo(() => PANELS.slice(0, MULTI_TRACK_COUNT), []);
  const activeMultiTrack = multiTrackItems[mod(activeIndex, multiTrackItems.length)];
  const activeHero = PANELS[mod(heroStartIndex, PANELS.length)];

  const moveMultiTrack = (delta: number) => {
    setActiveIndex((prev) => mod(prev + delta, multiTrackItems.length));
  };

  const moveHero = (delta: number) => {
    setHeroStartIndex((prev) => mod(prev + delta, PANELS.length));
  };

  const onMultiTrackTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0]?.clientX ?? null);
  };

  const onMultiTrackTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX;
    const deltaX = endX - touchStartX;
    if (Math.abs(deltaX) >= SWIPE_THRESHOLD_PX) {
      moveMultiTrack(deltaX > 0 ? -1 : 1);
    }
    setTouchStartX(null);
  };

  const onHeroTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.touches[0]?.clientX ?? null);
  };

  const onHeroTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX;
    const deltaX = endX - touchStartX;
    if (Math.abs(deltaX) >= SWIPE_THRESHOLD_PX) {
      moveHero(deltaX > 0 ? -1 : 1);
    }
    setTouchStartX(null);
  };

  return (
    <section className="relative mx-auto w-full max-w-[1600px]">
      {mode === "multiTrack" ? (
        <>
          <div className="hidden h-[68vh] items-stretch gap-2 md:flex">
            {multiTrackItems.map((panel, idx) => {
              const isActive = idx === mod(activeIndex, multiTrackItems.length);
              return (
                <article
                  key={`${panel.title}-multi-desktop`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`relative h-full cursor-pointer overflow-hidden transition-all duration-500 ${panel.shiftClass} ${
                    isActive ? "flex-[2.8] opacity-100" : "flex-1 opacity-65"
                  }`}
                >
                  <img
                    src={panel.image}
                    alt={panel.title}
                    className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${
                      isActive ? "grayscale-0" : "grayscale"
                    }`}
                  />
                  <video
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                    src={panel.video}
                    muted
                    loop
                    autoPlay={isActive}
                    playsInline
                  />
                  <div
                    className={`absolute inset-0 transition duration-500 ${
                      isActive ? "bg-transparent" : "bg-stone-950/60"
                    }`}
                  />
                </article>
              );
            })}
          </div>

          <div
            className="relative mx-auto h-[55vh] w-full max-w-[460px] md:hidden"
            onTouchStart={onMultiTrackTouchStart}
            onTouchEnd={onMultiTrackTouchEnd}
          >
            {[mod(activeIndex - 1, multiTrackItems.length), activeIndex, mod(activeIndex + 1, multiTrackItems.length)].map(
              (rawIdx, slot) => {
                const panel = multiTrackItems[mod(rawIdx, multiTrackItems.length)];
                const isCenter = slot === 1;
                return (
                  <article
                    key={`${panel.title}-multi-mobile-${slot}`}
                    className={`absolute top-0 h-full overflow-hidden transition-all duration-500 ${panel.shiftClass} ${
                      isCenter
                        ? "left-[18%] z-20 w-[64%] opacity-100"
                        : slot === 0
                          ? "left-[-24%] z-10 w-[38%] opacity-45"
                          : "left-[86%] z-10 w-[38%] opacity-45"
                    }`}
                  >
                    <img
                      src={panel.image}
                      alt={panel.title}
                      className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${
                        isCenter ? "grayscale-0" : "grayscale"
                      }`}
                    />
                    <video
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                        isCenter ? "opacity-100" : "opacity-0"
                      }`}
                      src={panel.video}
                      muted
                      loop
                      autoPlay={isCenter}
                      playsInline
                    />
                    <div className={`absolute inset-0 ${isCenter ? "bg-transparent" : "bg-stone-950/55"}`} />
                  </article>
                );
              },
            )}
          </div>

          <div className="mx-auto mt-8 max-w-[860px] text-center">
            <p
              className="text-balance text-[clamp(2rem,3.6vw,3.2rem)] font-semibold leading-[0.94] tracking-[-0.04em] text-foreground"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {activeMultiTrack.title}
            </p>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-muted-foreground md:text-[0.78rem]">
              {activeMultiTrack.subtitle}
            </p>
          </div>

          <div className="mx-auto mt-5 flex w-full max-w-[460px] items-center justify-between md:hidden">
            <button
              aria-label="Poprzedni materiał Multi-Track"
              className="text-2xl leading-none text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => moveMultiTrack(-1)}
            >
              ←
            </button>
            <div className="flex items-center justify-center gap-3">
              <button
                aria-label="Tryb Multi-Track"
                onClick={() => setMode("multiTrack")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground transition"
              >
                <ModeIcon type="multiTrack" active />
              </button>
              <button
                aria-label="Tryb Hero Story"
                onClick={() => setMode("heroStory")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/30 text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
              >
                <ModeIcon type="heroStory" active={false} />
              </button>
            </div>
            <button
              aria-label="Następny materiał Multi-Track"
              className="text-2xl leading-none text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => moveMultiTrack(1)}
            >
              →
            </button>
          </div>

          <div className="mt-6 hidden items-center justify-center gap-3 md:flex">
            <button
              aria-label="Tryb Multi-Track"
              onClick={() => setMode("multiTrack")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground transition"
            >
              <ModeIcon type="multiTrack" active />
            </button>
            <button
              aria-label="Tryb Hero Story"
              onClick={() => setMode("heroStory")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/30 text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
            >
              <ModeIcon type="heroStory" active={false} />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="hidden h-[68vh] items-stretch gap-2 md:flex">
            {Array.from({ length: 5 }, (_, idx) => {
              const item = PANELS[mod(heroStartIndex + idx, PANELS.length)];
              const position = `${(idx / 4) * 100}%`;
              return (
                <article
                  key={`${item.title}-hero-left-${idx}`}
                  className={`relative h-full flex-1 overflow-hidden ${item.shiftClass}`}
                >
                  <video
                    src={activeHero.video}
                    muted
                    loop
                    autoPlay
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: `${position} center` }}
                  />
                  <div className="absolute inset-0 bg-stone-950/30" />
                </article>
              );
            })}

            <article className="flex h-full w-[14vw] min-w-[130px] max-w-[190px] flex-col items-center justify-center border border-border bg-card/95 px-3 text-center">
              <p
                className="vertical-title text-[56px] leading-none text-foreground md:text-[64px]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {activeHero.title}
              </p>
              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Hero Story
              </p>
            </article>

            <article className={`relative h-full flex-1 overflow-hidden ${PANELS[mod(heroStartIndex + 6, PANELS.length)].shiftClass}`}>
              <video
                src={activeHero.video}
                muted
                loop
                autoPlay
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: "100% center" }}
              />
              <div className="absolute inset-0 bg-stone-950/30" />
            </article>
          </div>

          <div className="md:hidden">
            <div
              className="mx-auto h-[50vh] w-full max-w-[460px]"
              onTouchStart={onHeroTouchStart}
              onTouchEnd={onHeroTouchEnd}
            >
              <div className="relative h-full w-full">
                <div className="grid h-[calc(100%-2.5rem)] grid-cols-5 gap-1 overflow-hidden pt-5">
                {Array.from({ length: 5 }, (_, idx) => {
                  const offsetY = HERO_MOBILE_STAGGER_PATTERN[idx] ?? 0;
                  return (
                    <article
                      key={`${activeHero.title}-hero-mobile-${idx}`}
                      className="relative h-full overflow-hidden"
                      style={{ transform: `translateY(${offsetY}px)` }}
                    >
                      <video
                        src={activeHero.video}
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="auto"
                        className="absolute left-0 top-[-20px] h-[calc(100%+40px)] w-[500%] max-w-none object-cover"
                        style={{ transform: `translate(-${idx * 20}%, ${-offsetY}px)` }}
                      />
                      <div className="absolute inset-0 bg-stone-950/34" />
                    </article>
                  );
                })}
                </div>
              </div>
            </div>

            <div className="mt-5 text-center">
              <p
                className="text-balance text-[clamp(1.8rem,8vw,2.7rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-foreground"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {activeHero.title}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {activeHero.subtitle}
              </p>
            </div>

            <div className="mx-auto mt-5 flex w-full max-w-[460px] items-center justify-between">
              <button
                aria-label="Poprzedni materiał Hero Story"
                className="text-2xl leading-none text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => moveHero(-1)}
              >
                ←
              </button>
              <div className="flex items-center justify-center gap-3">
                <button
                  aria-label="Tryb Multi-Track"
                  onClick={() => setMode("multiTrack")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/30 text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
                >
                  <ModeIcon type="multiTrack" active={false} />
                </button>
                <button
                  aria-label="Tryb Hero Story"
                  onClick={() => setMode("heroStory")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground transition"
                >
                  <ModeIcon type="heroStory" active />
                </button>
              </div>
              <button
                aria-label="Następny materiał Hero Story"
                className="text-2xl leading-none text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => moveHero(1)}
              >
                →
              </button>
            </div>
          </div>

          <div className="mx-auto mt-9 hidden w-full max-w-[1600px] items-center justify-between md:flex">
            <button
              className="text-3xl leading-none text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => moveHero(-1)}
            >
              ←
            </button>
            <button
              className="text-3xl leading-none text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => moveHero(1)}
            >
              →
            </button>
          </div>

          <div className="mt-6 hidden items-center justify-center gap-3 md:flex">
            <button
              aria-label="Tryb Multi-Track"
              onClick={() => setMode("multiTrack")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/30 text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
            >
              <ModeIcon type="multiTrack" active={false} />
            </button>
            <button
              aria-label="Tryb Hero Story"
              onClick={() => setMode("heroStory")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground transition"
            >
              <ModeIcon type="heroStory" active />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
