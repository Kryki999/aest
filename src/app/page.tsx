"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import PortfolioBentoSection from "./components/PortfolioBentoSection";
import FaqAccordionSection from "./components/FaqAccordionSection";
import SiteFooter from "./components/SiteFooter";
import ScrollBoundAdamHero from "./components/ScrollBoundAdamHero";
import CinematicSiteHeader from "./components/CinematicSiteHeader";

type ViewMode = "tenPanel" | "sevenPanel";

type Panel = {
  title: string;
  subtitle: string;
  image: string;
  video: string;
  shiftClass: string;
};

const PANEL_DATA: Panel[] = [
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
  {
    title: "Little Shop of Horrors",
    subtitle: "Suddenly, Seymour",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUlPYYgQSvj5HJ_zoAeNzJASe83QJkefLnwWHiWIrftnBOyJOMUO1VPCNa7c4uzlNbDxMep2DMxUTZjo638xq9pKlXJ0eXQqTFpumovvhKa6Ub5un7t4qxbfBFL5OO_o9g5peLC3n0hMqNKf_08bunE7n64lAdtEonNjMFaUDDBeTxTTh3z1aMbeBGiVi1kxRmk0wldsCsOMr-0xU2liM2apYzC5kY42B3W1V8ePOZzPE5X4hoKhXlcO_XPZwjS8WVCKiYTBveRuew",
    video: "https://cdn.pixabay.com/video/2020/05/29/40731-425335642_large.mp4",
    shiftClass: "translate-y-5",
  },
];

const LOGO_ITEMS = [
  "Nova",
  "Graviz",
  "CBS",
  "WKDZIK",
  "Pro8lem",
  "XOX",
  "Atlas",
  "Bloom",
  "Vanta",
  "Aether",
];

const SERVICES_DATA = [
  {
    icon: "/3dicons-camera-front-color.png",
    title: "Produkcja Wideo",
    description:
      "Tworzymy filmy reklamowe i branded content, ktore buduja emocje i realnie wzmacniaja rozpoznawalnosc marki.",
  },
  {
    icon: "/3dicons-camera-front-color.png",
    title: "Produkcja Foto",
    description:
      "Realizujemy sesje produktowe, wizerunkowe i kampanijne, laczac estetyke premium z mocnym efektem sprzedazowym.",
  },
  {
    icon: "/3dicons-camera-front-color.png",
    title: "Koncepcja Kreatywna",
    description:
      "Projektujemy pomysly i narracje od zera, zeby kazda kampania miala wyrazny kierunek i charakter marki.",
  },
  {
    icon: "/3dicons-camera-front-color.png",
    title: "Postprodukcja",
    description:
      "Montaz, color grading i dopracowany dzwiek, dzieki ktorym finalny material wyglada i brzmi na poziomie top studio.",
  },
  {
    icon: "/3dicons-camera-front-color.png",
    title: "Content Social",
    description:
      "Przygotowujemy szybkie formaty pod social media, ktore utrzymuja spojna jakosc i skutecznie przyciagaja uwage.",
  },
  {
    icon: "/3dicons-camera-front-color.png",
    title: "Strategia Kampanii",
    description:
      "Laczymy kreacje z celami biznesowymi, by przekuc materialy kreatywne w mierzalny wzrost zasiegu i konwersji.",
  },
];

const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("tenPanel");
  const [startIndex, setStartIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(3);

  const activePanel = PANEL_DATA[mod(activeIndex, PANEL_DATA.length)];

  const move = (delta: number) => {
    setStartIndex((prev) => mod(prev + delta, PANEL_DATA.length));
    setActiveIndex((prev) => mod(prev + delta, PANEL_DATA.length));
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (viewMode !== "sevenPanel") return;
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewMode]);

  const tenPanelItems = useMemo(
    () =>
      Array.from({ length: 10 }, (_, offset) => {
        const idx = mod(startIndex + offset, PANEL_DATA.length);
        return PANEL_DATA[idx];
      }),
    [startIndex],
  );

  const sevenLeft = useMemo(
    () =>
      Array.from({ length: 5 }, (_, offset) => {
        const idx = mod(startIndex + offset, PANEL_DATA.length);
        return PANEL_DATA[idx];
      }),
    [startIndex],
  );

  const sevenRight = PANEL_DATA[mod(startIndex + 5, PANEL_DATA.length)];
  const marqueeItems = [...LOGO_ITEMS, ...LOGO_ITEMS];

  return (
    <>
    <main className="relative min-h-screen max-w-full overflow-x-clip text-foreground">
      <CinematicSiteHeader />

      <div className="px-[6vw] pb-8 pt-32 md:pt-36">
      <section className="relative mx-auto w-full max-w-[1600px]">
        {viewMode === "tenPanel" ? (
          <div className="flex h-[65vh] items-start gap-1 md:h-[70vh] md:gap-2">
            {tenPanelItems.map((panel, idx) => (
              <article
                key={`${panel.title}-ten-${idx}`}
                className={`group panel-expand relative h-full flex-1 cursor-pointer overflow-hidden opacity-65 transition duration-700 hover:opacity-100 ${panel.shiftClass}`}
              >
                <img
                  src={panel.image}
                  alt={panel.title}
                  className="panel-media h-full w-full object-cover grayscale transition duration-700 group-hover:grayscale-0"
                />
                <video
                  className="panel-media panel-video"
                  src={panel.video}
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-stone-900/40 transition duration-700 group-hover:bg-transparent" />
              </article>
            ))}
          </div>
        ) : (
          <div className="relative flex h-[65vh] items-start gap-2 md:h-[70vh]">
            <button
              aria-label="Previous panels"
              onClick={() => move(-1)}
              className="absolute -left-6 top-1/2 z-10 -translate-y-1/2 text-3xl text-muted-foreground transition-colors hover:text-[var(--cinematic-accent)] md:-left-10"
            >
              ←
            </button>

            {sevenLeft.map((panel, idx) => (
              <article
                key={`${panel.title}-seven-left-${idx}`}
                className={`group relative h-full flex-1 cursor-pointer overflow-hidden opacity-75 transition duration-700 hover:opacity-100 ${panel.shiftClass}`}
                onMouseEnter={() => setActiveIndex(mod(startIndex + idx, PANEL_DATA.length))}
              >
                <img
                  src={panel.image}
                  alt={panel.title}
                  className="panel-media h-full w-full object-cover grayscale transition duration-700 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-stone-900/45 transition duration-700 group-hover:bg-transparent" />
              </article>
            ))}

            <article className="flex h-full w-[14vw] min-w-[110px] max-w-[180px] flex-col items-center justify-center bg-card px-2 text-center ring-1 ring-border">
              <p
                className="vertical-title text-[58px] leading-none text-foreground md:text-[66px]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {activePanel.title}
              </p>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Explore Song &amp; Extra Material
              </p>
            </article>

            <article
              className={`group relative h-full flex-1 cursor-pointer overflow-hidden opacity-80 transition duration-700 hover:opacity-100 ${sevenRight.shiftClass}`}
              onMouseEnter={() => setActiveIndex(mod(startIndex + 5, PANEL_DATA.length))}
            >
              <img
                src={sevenRight.image}
                alt={sevenRight.title}
                className="panel-media h-full w-full object-cover grayscale transition duration-700 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-stone-900/45 transition duration-700 group-hover:bg-transparent" />
            </article>

            <button
              aria-label="Next panels"
              onClick={() => move(1)}
              className="absolute -right-6 top-1/2 z-10 -translate-y-1/2 text-3xl text-muted-foreground transition-colors hover:text-[var(--cinematic-accent)] md:-right-10"
            >
              →
            </button>
          </div>
        )}
      </section>

      <section className="mx-auto mt-10 flex w-full max-w-[1600px] items-center justify-between">
        <button
          className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          onClick={() => move(-1)}
        >
          ← {PANEL_DATA[mod(activeIndex - 1, PANEL_DATA.length)].title}
        </button>

        <div className="flex items-center gap-3">
          <button
            aria-label="Switch to 10 panel view"
            onClick={() => setViewMode("tenPanel")}
            className={`h-8 w-8 rounded-full border text-xs transition-colors ${viewMode === "tenPanel" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
          >
            10
          </button>
          <button
            aria-label="Switch to 7 panel view"
            onClick={() => setViewMode("sevenPanel")}
            className={`h-8 w-8 rounded-full border text-xs transition-colors ${viewMode === "sevenPanel" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
          >
            7
          </button>
        </div>

        <button
          className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          onClick={() => move(1)}
        >
          {PANEL_DATA[mod(activeIndex + 1, PANEL_DATA.length)].title} →
        </button>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[1080px] px-3 pb-10 md:mt-20">
        <div className="mx-auto mb-9 flex max-w-[820px] flex-col items-center text-center md:mb-12">
          <h2
            className="text-balance text-3xl font-semibold leading-[1.02] tracking-[-0.02em] text-foreground sm:text-4xl md:text-6xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Kreatywne studio{" "}
            <span className="text-[var(--cinematic-accent)]">produkcyjne</span> z wizją.
          </h2>
          <p className="mx-auto mt-5 max-w-[720px] text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base md:mt-6 md:text-lg md:leading-relaxed">
            Pomagamy ambitnym markom, agencjom i topowym artystom uderzać
            mocniej. Przekuwamy surową energię w najwyższej klasy produkcje
            wideo i foto.
          </p>
          <button
            type="button"
            className="mt-7 rounded-full border border-primary/35 bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-[0_0_24px_-4px_var(--cinematic-accent-neon)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--cinematic-accent-neon)] hover:bg-[var(--cinematic-accent-neon)] md:mt-8"
          >
            Skontaktuj się
          </button>
        </div>

        <div className="relative overflow-hidden rounded-full border border-border bg-card/95 px-5 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:px-8 md:py-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-card via-card/70 to-transparent md:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-card via-card/70 to-transparent md:w-24" />

          <div className="logo-marquee-track flex w-max items-center gap-8 md:gap-12">
            {marqueeItems.map((logo, idx) => (
              <span
                key={`${logo}-${idx}`}
                className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.18em] text-foreground/90 md:text-base"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-[980px] px-3 pb-14 md:mt-20 md:pb-20">
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 md:gap-y-14 lg:grid-cols-3 lg:gap-x-8">
          {SERVICES_DATA.map((service) => (
            <article
              key={service.title}
              className="group mx-auto flex max-w-[260px] flex-col items-center text-center transition duration-300 hover:-translate-y-1"
            >
              <div className="mb-5 inline-flex p-2">
                <Image
                  src={service.icon}
                  alt={service.title}
                  width={88}
                  height={88}
                  className="h-20 w-20 object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.42)] sm:h-24 sm:w-24"
                />
              </div>
              <h4 className="text-[1.05rem] font-semibold uppercase leading-tight tracking-[0.08em] text-foreground sm:text-[1.12rem]">
                {service.title}
              </h4>
              <p className="mt-3 max-w-[30ch] text-[0.95rem] leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </section>
      </div>

      <ScrollBoundAdamHero />

      <PortfolioBentoSection />

      <div className="px-[6vw] pb-8">
        <FaqAccordionSection />
      </div>

      <style jsx global>{`
        @keyframes logoMarquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .logo-marquee-track {
          animation: logoMarquee 18s linear infinite;
        }
      `}</style>
    </main>

    <SiteFooter />
    </>
  );
}
