"use client";

/* Zewnętrzne URL-e obrazów — bez rozszerzania next/image o domeny demo. */
/* eslint-disable @next/next/no-img-element */

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { cn } from "@/lib/utils";

function CinematicHeader({
  title,
  tags,
  imageSrc,
  videoSrc,
}: {
  title: string;
  tags: string;
  imageSrc: string;
  videoSrc?: string;
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
          <h3
            className="text-balance text-lg font-semibold tracking-tight text-white md:text-xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {title}
          </h3>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85">
            {tags}
          </p>
        </div>
      </div>
    </div>
  );
}

type TileConfig = {
  title: string;
  tags: string;
  imageSrc: string;
  videoSrc?: string;
  gridClass: string;
};

/** Układ 3×3 (3 kolumny × 3 rzędy komórek): lewy pionowy reel, góra „hero” na 2 kolumny,
 *  środek dwa mniejsze kafelki, dół pas na całą szerokość — nieregularna siatka bez 4. kolumny. */
const TILES: TileConfig[] = [
  {
    title: "Vertical reel",
    tags: "Social · Crop 9:16",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUlPYYgQSvj5HJ_zoAeNzJASe83QJkefLnwWHiWIrftnBOyJOMUO1VPCNa7c4uzlNbDxMep2DMxUTZjo638xq9pKlXJ0eXQqTFpumovvhKa6Ub5un7t4qxbfBFL5OO_o9g5peLC3n0hMqNKf_08bunE7n64lAdtEonNjMFaUDDBeTxTTh3z1aMbeBGiVi1kxRmk0wldsCsOMr-0xU2liM2apYzC5kY42B3W1V8ePOZzPE5X4hoKhXlcO_XPZwjS8WVCKiYTBveRuew",
    videoSrc:
      "https://cdn.pixabay.com/video/2019/12/12/30121-380473626_large.mp4",
    gridClass: "md:col-span-1 md:row-span-2",
  },
  {
    title: "Featured work — kampania branded",
    tags: "Wideo · Brand story",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAeviKa0ntc82s3ZuLK0du89vuAMffA0Tjm8scZ0nSEePVA16HlOFAPCMLXxExR0Xs0hggO9D4RLbGZdqHMbVoDGK6u5uOZJxq9eD4eCsTnd5QC7D7_xmXDdu9U3qgE2d8o7M4g_vbJylUiDqHDO3fFBLmx2KfYRVeF-9I4xC0RI71WMXnTYTusWenwrO53kULnCGU2ipo7lhvYdlJePo1reDujyvzKTNq0NyuGQCu4I6yCpYjIoBl3Qm6AfsjnZ5wX8gOL0IpJyxOR",
    gridClass: "md:col-span-2 md:row-span-1",
  },
  {
    title: "Lookbook foto",
    tags: "Studio · Produkt",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMQejSKlmRYRRuh8jY47yjDAaryeIoT8Pwhr7waIkN_nxZjStqzckvdmkqavbN_mzHQn6UEFVx3Qca-hM3zvhsWZePyEyHe0lYOWgWCfT6urwGE7BG-Y-26WT9Yn0bWEvvYMXeCj9KBbsXXzeq0kwgF1551WuZn84CNlB9tI70r5RZgu-vruwASnsFqAP7YuQLkeG84zTwJZAkU9jZFGNhGnDSu-_XMml_cODPpu4zjmCeKv29N7MHI2Ak_NYJGjUsnIonx1KDUfiX",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Teaser muzyczny",
    tags: "Artysta · Teaser",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA-LxSKjND7km-qB1ikO76rNhGs9ZyYs4mb_fBkNtR5rPCCKJiBObSkezf5Te3ohcu0cyQLLYMOqcVyNpNjKrYmiOAynmLintK_XRHMH-6gqLchw1JCwElyD_4CX3M8cptt2yP5BEbYPQm4TOKqZmE180SLZumJuvaDz-oRRGPVixf_4oaZ5IRH0wSt-Uu_bQXc8bOl8r2tFhd6jKBF6TW7tkt-hklBkkg4T_qzMB4jWMWMTY9t8eeWB2IRmjEe3-XdW1WjpZllxa7q",
    gridClass: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Kampania 360°",
    tags: "Key visual · rollout",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAeviKa0ntc82s3ZuLK0du89vuAMffA0Tjm8scZ0nSEePVA16HlOFAPCMLXxExR0Xs0hggO9D4RLbGZdqHMbVoDGK6u5uOZJxq9eD4eCsTnd5QC7D7_xmXDdu9U3qgE2d8o7M4g_vbJylUiDqHDO3fFBLmx2KfYRVeF-9I4xC0RI71WMXnTYTusWenwrO53kULnCGU2ipo7lhvYdlJePo1reDujyvzKTNq0NyuGQCu4I6yCpYjIoBl3Qm6AfsjnZ5wX8gOL0IpJyxOR",
    gridClass: "md:col-span-3 md:row-span-1",
  },
];

export function PortfolioBentoGrid({ className }: { className?: string }) {
  return (
    <BentoGrid
      className={cn(
        "w-full max-w-full gap-3 md:auto-rows-[minmax(280px,min(42vmin,460px))] md:grid-cols-3 md:gap-4",
        className,
      )}
    >
      {TILES.map((tile) => (
        <BentoGridItem
          key={tile.title}
          className={cn(
            "group/tile h-full overflow-hidden rounded-2xl border-0 bg-transparent p-0 shadow-none ring-1 ring-border transition-shadow duration-500",
            "hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.55)] dark:border-transparent dark:bg-transparent dark:hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.55)] dark:shadow-none",
            "[&>div:nth-child(2)]:hidden",
            tile.gridClass,
          )}
          header={
            <CinematicHeader
              title={tile.title}
              tags={tile.tags}
              imageSrc={tile.imageSrc}
              videoSrc={tile.videoSrc}
            />
          }
        />
      ))}
    </BentoGrid>
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
