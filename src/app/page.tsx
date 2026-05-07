"use client";

import Image from "next/image";

import PortfolioBentoSection from "./components/PortfolioBentoSection";
import FaqAccordionSection from "./components/FaqAccordionSection";
import NewsfeedFilmstripSection from "./components/NewsfeedFilmstripSection";
import PreFooterConfigurator from "./components/PreFooterConfigurator";
import SiteFooter from "./components/SiteFooter";
import ScrollBoundHandsBridge from "./components/ScrollBoundHandsBridge";
import CinematicSiteHeader from "./components/CinematicSiteHeader";
import VideoKeysSection from "./components/VideoKeysSection";
import TestimonialsSection from "./components/TestimonialsSection";
import { useConfigurator } from "./components/configurator-shared";

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
    icon: "/3dicons-play-front-color.png",
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
    icon: "/3dicons-music-front-color.png",
    title: "Teledyski",
    description:
      "Projektujemy pomysly i narracje od zera, zeby kazda kampania miala wyrazny kierunek i charakter marki.",
  },
  {
    icon: "/3dicons-setting-front-color.png",
    title: "Edycja",
    description:
      "Montaz, color grading i dopracowany dzwiek, dzieki ktorym finalny material wyglada i brzmi na poziomie top studio.",
  },
  {
    icon: "/3dicons-money-front-color.png",
    title: "Reklamy",
    description:
      "Przygotowujemy szybkie formaty pod social media, ktore utrzymuja spojna jakosc i skutecznie przyciagaja uwage.",
  },
  {
    icon: "/3dicons-rocket-dynamic-color.png",
    title: "Strategia Kampanii",
    description:
      "Laczymy kreacje z celami biznesowymi, by przekuc materialy kreatywne w mierzalny wzrost zasiegu i konwersji.",
  },
];

export default function Home() {
  const { open: openConfigurator } = useConfigurator();
  const marqueeItems = [...LOGO_ITEMS, ...LOGO_ITEMS];

  return (
    <>
      <main className="relative min-h-screen max-w-full overflow-x-clip text-foreground">
        <CinematicSiteHeader />

        <div className="px-[6vw] pb-8 pt-32 md:pt-36">
          <VideoKeysSection />

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
              <div className="mt-7 flex flex-wrap items-center justify-center gap-4 md:mt-8">
                <button
                  type="button"
                  className="rounded-full border border-primary/35 bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-[0_0_24px_-4px_var(--cinematic-accent-neon)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--cinematic-accent-neon)] hover:bg-[var(--cinematic-accent-neon)]"
                  onClick={openConfigurator}
                >
                  Skontaktuj się
                </button>
                <button
                  type="button"
                  className="rounded-full border border-border/80 bg-transparent px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
                  onClick={openConfigurator}
                >
                  Wyceń projekt
                </button>
              </div>
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

        <ScrollBoundHandsBridge />

        <PortfolioBentoSection />
        <TestimonialsSection />

        <div className="px-[6vw] pb-8">
          <FaqAccordionSection />
        </div>

        <NewsfeedFilmstripSection />

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

      <PreFooterConfigurator />
      <SiteFooter />
    </>
  );
}
