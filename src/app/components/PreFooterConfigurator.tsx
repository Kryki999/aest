"use client";

import CinematicDrawerConfigurator from "./CinematicDrawerConfigurator";

const PREFOOTER_VISUAL_POSTER =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=85&auto=format&fit=crop";
const PREFOOTER_VISUAL_VIDEO =
  "https://cdn.pixabay.com/video/2023/09/20/181608-866834614_large.mp4";

export default function PreFooterConfigurator() {
  return (
    <section
      aria-labelledby="prefooter-configurator-heading"
      className="relative w-screen max-w-none border-t border-border bg-background pb-24 pt-20 text-foreground md:pb-32 md:pt-24 lg:pb-36 lg:pt-28"
      style={{ marginInline: "calc(50% - 50vw)" }}
    >
      <div className="relative mx-auto w-full max-w-[1800px] px-0 md:px-10 lg:px-14 xl:px-16">
        <header className="mb-12 max-w-4xl px-6 md:mb-14 md:px-0">
          <h2
            id="prefooter-configurator-heading"
            className="text-balance text-3xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Scena jest
            <span className="text-[var(--cinematic-accent)]"> Twoja.</span>
          </h2>
          <p className="mt-4 max-w-[66ch] text-pretty text-sm leading-relaxed text-foreground md:mt-5 md:text-base md:leading-relaxed">
            Znasz już nasz klimat i wiesz, do czego jesteśmy zdolni. Teraz czas przełożyć Twoją ambicję na kinowy obraz. Zróbmy ten pierwszy krok.
          </p>
        </header>

        <div className="overflow-hidden rounded-none border-y border-border/55 bg-card/40 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:rounded-2xl md:border">
          <div className="flex min-h-0 flex-col md:min-h-[76vh] md:flex-row lg:min-h-[80vh]">
            <div className="relative hidden min-h-0 w-full flex-none md:flex md:w-1/2 md:flex-col">
              <div className="relative min-h-[42vh] flex-1 bg-muted md:min-h-0">
                <video
                  className="absolute inset-0 size-full object-cover"
                  autoPlay
                  muted
                  playsInline
                  loop
                  poster={PREFOOTER_VISUAL_POSTER}
                  aria-hidden
                >
                  <source src={PREFOOTER_VISUAL_VIDEO} type="video/mp4" />
                </video>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--cinematic-surface)]/70 via-transparent to-transparent"
                />
                <div className="pointer-events-none absolute bottom-8 left-8 right-8 z-[1]">
                  <p
                    className="max-w-[24ch] text-2xl font-semibold leading-tight tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Inny rytm. Ten sam cel kontaktu.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full bg-[var(--cinematic-base)] p-5 sm:p-6 md:w-1/2 md:p-10 lg:p-12">
              <div className="mx-auto max-w-2xl">
                <CinematicDrawerConfigurator mode="embedded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
