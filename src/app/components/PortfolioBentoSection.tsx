"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

/* Zewnętrzne URL-e obrazów — bez rozszerzania next/image o domeny demo. */
/* eslint-disable @next/next/no-img-element */

import { BentoGrid } from "@/components/ui/bento-grid";
import { cn } from "@/lib/utils";

function CinematicHeader({
  title,
  tags,
  imageSrc,
  videoSrc,
  layoutTitleId,
  layoutTagsId,
}: {
  title: string;
  tags: string;
  imageSrc: string;
  videoSrc?: string;
  layoutTitleId?: string;
  layoutTagsId?: string;
}) {
  const useVideo = Boolean(videoSrc);

  return (
    <div className="relative h-full min-h-[272px] w-full flex-1 overflow-hidden md:min-h-0">
      <div className="absolute inset-0 overflow-hidden bg-background">
        {useVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover contrast-[1.02] transition-[transform] duration-[680ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover/tile:scale-[1.065]"
            src={videoSrc}
            poster={imageSrc}
            muted
            autoPlay
            loop
            playsInline
          />
        ) : (
          <img
            src={imageSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover contrast-[1.02] transition-[transform] duration-[680ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover/tile:scale-[1.065]"
          />
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/30 to-transparent pb-5 pl-5 pr-5 pt-20">
        <div>
          <motion.h3
            layoutId={layoutTitleId}
            className="text-balance text-lg font-semibold tracking-tight text-white md:text-xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {title}
          </motion.h3>
          <motion.p
            layoutId={layoutTagsId}
            className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85"
          >
            {tags}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

type TileConfig = {
  id: string;
  title: string;
  tags: string;
  article: string;
  imageSrc: string;
  videoSrc?: string;
  gridClass: string;
};

/** Układ 3×3 (3 kolumny × 3 rzędy komórek): lewy pionowy reel, góra „hero” na 2 kolumny,
 *  środek dwa mniejsze kafelki, dół pas na całą szerokość — nieregularna siatka bez 4. kolumny. */
const TILES: TileConfig[] = [
  {
    id: "vertical-reel",
    title: "Vertical reel",
    tags: "Social · Crop 9:16",
    article:
      "Projekt powstał jako seria dynamicznych pionowych cutów zoptymalizowanych pod szybki odbiór mobilny. Zespół skupił się na rytmie montażu, wyraźnej ekspozycji produktu i mikro-narracji, która domyka historię w pierwszych sekundach. Dzięki precyzyjnemu color gradingowi i wersjonowaniu formatów kampania utrzymała spójny charakter w reelsach, stories i shortach.",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUlPYYgQSvj5HJ_zoAeNzJASe83QJkefLnwWHiWIrftnBOyJOMUO1VPCNa7c4uzlNbDxMep2DMxUTZjo638xq9pKlXJ0eXQqTFpumovvhKa6Ub5un7t4qxbfBFL5OO_o9g5peLC3n0hMqNKf_08bunE7n64lAdtEonNjMFaUDDBeTxTTh3z1aMbeBGiVi1kxRmk0wldsCsOMr-0xU2liM2apYzC5kY42B3W1V8ePOZzPE5X4hoKhXlcO_XPZwjS8WVCKiYTBveRuew",
    videoSrc:
      "https://cdn.pixabay.com/video/2019/12/12/30121-380473626_large.mp4",
    gridClass: "md:col-span-1 md:row-span-2",
  },
  {
    id: "featured-brand",
    title: "Featured work — kampania branded",
    tags: "Wideo · Brand story",
    article:
      "Głównym celem było zbudowanie premiumowego tonu komunikacji i wyraźnego hero produktu w każdej scenie. Pracowaliśmy na języku wizualnym łączącym cinematic movement z kontrolowanym światłem i detalem set designu. Finalny materiał został przygotowany jako rdzeń kampanii 360, który zasilił landing, social media oraz formaty paid.",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAeviKa0ntc82s3ZuLK0du89vuAMffA0Tjm8scZ0nSEePVA16HlOFAPCMLXxExR0Xs0hggO9D4RLbGZdqHMbVoDGK6u5uOZJxq9eD4eCsTnd5QC7D7_xmXDdu9U3qgE2d8o7M4g_vbJylUiDqHDO3fFBLmx2KfYRVeF-9I4xC0RI71WMXnTYTusWenwrO53kULnCGU2ipo7lhvYdlJePo1reDujyvzKTNq0NyuGQCu4I6yCpYjIoBl3Qm6AfsjnZ5wX8gOL0IpJyxOR",
    gridClass: "md:col-span-2 md:row-span-1",
  },
  {
    id: "lookbook-foto",
    title: "Lookbook foto",
    tags: "Studio · Produkt",
    article:
      "Sesja lookbookowa została zaprojektowana pod równowagę między elegancją a czytelnością materiału produktowego. Ujęcia i kadrowanie wspierały modularne wykorzystanie w e-commerce i social feedzie bez utraty jakości art directionu. Efektem była biblioteka spójnych kadrów, którą marka mogła wdrażać etapami w wielu kanałach.",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMQejSKlmRYRRuh8jY47yjDAaryeIoT8Pwhr7waIkN_nxZjStqzckvdmkqavbN_mzHQn6UEFVx3Qca-hM3zvhsWZePyEyHe0lYOWgWCfT6urwGE7BG-Y-26WT9Yn0bWEvvYMXeCj9KBbsXXzeq0kwgF1551WuZn84CNlB9tI70r5RZgu-vruwASnsFqAP7YuQLkeG84zTwJZAkU9jZFGNhGnDSu-_XMml_cODPpu4zjmCeKv29N7MHI2Ak_NYJGjUsnIonx1KDUfiX",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: "teaser-muzyczny",
    title: "Teaser muzyczny",
    tags: "Artysta · Teaser",
    article:
      "Krótka forma teaserowa była budowana na kontrastach: surowe faktury obrazu kontra precyzyjne prowadzenie dynamiki dźwięku. Zaprojektowaliśmy narrację pod wysoki retention i silny moment kulminacyjny na końcu. Całość wzmocniła pre-launch utworu i podniosła wolumen interakcji w pierwszych dniach publikacji.",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-LxSKjND7km-qB1ikO76rNhGs9ZyYs4mb_fBkNtR5rPCCKJiBObSkezf5Te3ohcu0cyQLLYMOqcVyNpNjKrYmiOAynmLintK_XRHMH-6gqLchw1JCwElyD_4CX3M8cptt2yP5BEbYPQm4TOKqZmE180SLZumJuvaDz-oRRGPVixf_4oaZ5IRH0wSt-Uu_bQXc8bOl8r2tFhd6jKBF6TW7tkt-hklBkkg4T_qzMB4jWMWMTY9t8eeWB2IRmjEe3-XdW1WjpZllxa7q",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    id: "kampania-360",
    title: "Kampania 360°",
    tags: "Key visual · rollout",
    article:
      "Wdrożenie 360 objęło pełny zestaw materiałów: hero video, pakiet foto, cuty performance i adaptacje nośnikowe. Priorytetem była pełna spójność estetyczna na styku kanałów i etapów lejka. Dzięki temu marka zyskała jednolity język wizualny, który zwiększył rozpoznawalność i skrócił czas produkcji kolejnych odsłon kampanii.",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAeviKa0ntc82s3ZuLK0du89vuAMffA0Tjm8scZ0nSEePVA16HlOFAPCMLXxExR0Xs0hggO9D4RLbGZdqHMbVoDGK6u5uOZJxq9eD4eCsTnd5QC7D7_xmXDdu9U3qgE2d8o7M4g_vbJylUiDqHDO3fFBLmx2KfYRVeF-9I4xC0RI71WMXnTYTusWenwrO53kULnCGU2ipo7lhvYdlJePo1reDujyvzKTNq0NyuGQCu4I6yCpYjIoBl3Qm6AfsjnZ5wX8gOL0IpJyxOR",
    gridClass: "md:col-span-3 md:row-span-1",
  },
];

const PORTFOLIO_HISTORY_MARKER = "portfolio-case-study-open";

const panelTransition = {
  type: "spring",
  stiffness: 240,
  damping: 34,
  mass: 0.9,
};

function layoutCardId(scope: string, id: string) {
  return `${scope}-card-${id}`;
}

function layoutImageId(scope: string, id: string) {
  return `${scope}-image-${id}`;
}

function layoutTitleId(scope: string, id: string) {
  return `${scope}-title-${id}`;
}

function layoutTagsId(scope: string, id: string) {
  return `${scope}-tags-${id}`;
}

export function PortfolioBentoGrid({ className }: { className?: string }) {
  const [activeTile, setActiveTile] = useState<TileConfig | null>(null);
  const layoutScope = useId();
  const isOpen = activeTile !== null;
  const shouldGoBackOnCloseRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyOverflowX = document.body.style.overflowX;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousHtmlOverflowX = document.documentElement.style.overflowX;

    document.body.style.overflow = "hidden";
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overflowX = "hidden";

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveTile(null);
      }
    };
    window.addEventListener("keydown", onEscape);

    return () => {
      window.removeEventListener("keydown", onEscape);
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overflowX = previousBodyOverflowX;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.documentElement.style.overflowX = previousHtmlOverflowX;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const state = window.history.state ?? {};
    if (!state || state[PORTFOLIO_HISTORY_MARKER] !== true) {
      shouldGoBackOnCloseRef.current = true;
      window.history.pushState(
        { ...state, [PORTFOLIO_HISTORY_MARKER]: true },
        "",
        window.location.href,
      );
    }

    const onPopState = () => {
      shouldGoBackOnCloseRef.current = false;
      setActiveTile(null);
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
      if (shouldGoBackOnCloseRef.current) {
        shouldGoBackOnCloseRef.current = false;
        window.history.back();
      }
    };
  }, [isOpen]);

  return (
    <>
      <BentoGrid
        className={cn(
          "w-full max-w-full gap-3 md:auto-rows-[minmax(280px,min(42vmin,460px))] md:grid-cols-3 md:gap-4",
          className,
        )}
      >
        {TILES.map((tile) => (
          <motion.button
            key={tile.id}
            type="button"
            onClick={() => setActiveTile(tile)}
            className={cn(
              "group/tile relative h-full overflow-hidden rounded-2xl text-left ring-1 ring-border transition-shadow duration-500",
              "hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
              tile.gridClass,
            )}
          >
            <motion.div layoutId={layoutCardId(layoutScope, tile.id)} className="h-full">
              <motion.div layoutId={layoutImageId(layoutScope, tile.id)} className="h-full">
                <CinematicHeader
                  title={tile.title}
                  tags={tile.tags}
                  imageSrc={tile.imageSrc}
                  videoSrc={tile.videoSrc}
                  layoutTitleId={layoutTitleId(layoutScope, tile.id)}
                  layoutTagsId={layoutTagsId(layoutScope, tile.id)}
                />
              </motion.div>
            </motion.div>
          </motion.button>
        ))}
      </BentoGrid>

      <AnimatePresence>
        {activeTile ? (
          <>
            <motion.div
              key="portfolio-case-backdrop"
              className="fixed inset-0 z-[220] hidden bg-black/65 backdrop-blur-sm md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setActiveTile(null)}
            />

            <motion.article
              key={`portfolio-case-${activeTile.id}`}
              layoutId={layoutCardId(layoutScope, activeTile.id)}
              transition={panelTransition}
              className={cn(
                "fixed z-[221] overflow-hidden bg-[var(--cinematic-surface)] text-foreground",
                "inset-0 h-[100dvh] w-screen rounded-none",
                "md:inset-1/2 md:h-[min(92vh,980px)] md:w-[min(94vw,1160px)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:ring-1 md:ring-white/12",
              )}
              role="dialog"
              aria-modal="true"
              aria-label={`Case study: ${activeTile.title}`}
            >
              <motion.button
                type="button"
                onClick={() => setActiveTile(null)}
                aria-label="Zamknij artykuł"
                initial={{ opacity: 0, scale: 0.78 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.78 }}
                transition={{ delay: 0.16, duration: 0.24, ease: "easeOut" }}
                className="absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-[4] inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white backdrop-blur-md transition hover:bg-black/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="h-5 w-5" strokeWidth={2.3} />
              </motion.button>

              <div className="no-scrollbar h-full overflow-x-hidden overflow-y-auto overscroll-contain">
                <div className="relative">
                  <motion.div
                    layoutId={layoutImageId(layoutScope, activeTile.id)}
                    className="relative h-[38dvh] min-h-[260px] w-full overflow-hidden md:h-[48vh] md:min-h-[420px]"
                  >
                    {activeTile.videoSrc ? (
                      <video
                        className="absolute inset-0 h-full w-full object-cover"
                        src={activeTile.videoSrc}
                        poster={activeTile.imageSrc}
                        muted
                        autoPlay
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        src={activeTile.imageSrc}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

                    <div className="absolute bottom-0 left-0 right-0 z-[2] px-5 pb-6 pt-12 text-white md:px-10 md:pb-9 md:pt-16">
                      <motion.h3
                        layoutId={layoutTitleId(layoutScope, activeTile.id)}
                        className="text-balance text-2xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-[2.7rem]"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {activeTile.title}
                      </motion.h3>
                      <motion.p
                        layoutId={layoutTagsId(layoutScope, activeTile.id)}
                        className="mt-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/85 md:text-[0.8rem]"
                      >
                        {activeTile.tags}
                      </motion.p>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  transition={{ delay: 0.24, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto w-full max-w-3xl px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8 md:px-10 md:pb-14 md:pt-10"
                >
                  <p className="text-pretty text-sm leading-7 text-white/82 md:text-[1.03rem] md:leading-8">
                    {activeTile.article}
                  </p>
                </motion.div>
              </div>
            </motion.article>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default function PortfolioBentoSection() {
  return (
    <section
      id="realizacje"
      className="relative mt-14 w-full scroll-mt-24 bg-background py-14 pb-24 text-foreground md:mt-24 md:scroll-mt-28 md:py-20 md:pb-28"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10">
        <PortfolioBentoGrid />
      </div>
    </section>
  );
}
