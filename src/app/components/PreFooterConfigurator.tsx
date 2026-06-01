"use client";

import CinematicDrawerConfigurator from "./CinematicDrawerConfigurator";

export default function PreFooterConfigurator() {
  return (
    <section
      id="kontakt"
      aria-labelledby="prefooter-configurator-heading"
      className="relative w-screen max-w-none scroll-mt-24 border-t border-border bg-background pb-24 pt-20 text-foreground md:scroll-mt-28 md:pb-32 md:pt-24 lg:pb-36 lg:pt-28"
      style={{ marginInline: "calc(50% - 50vw)" }}
    >
      <div className="relative mx-auto w-full max-w-[1800px] px-0 md:px-10 lg:px-14 xl:px-16">
        <header className="mb-12 max-w-4xl px-6 md:mb-14 md:px-0">
          <h2
            id="prefooter-configurator-heading"
            className="font-heading text-balance text-3xl font-semibold uppercase leading-[1.08] tracking-[0.06em] text-foreground md:text-4xl lg:text-5xl"
          >
            Wyceń swój{" "}
            <span className="text-[var(--cinematic-accent)]">projekt</span>
          </h2>
          <p className="mt-4 max-w-[66ch] text-pretty text-sm leading-relaxed text-foreground md:mt-5 md:text-base md:leading-relaxed">
            Opisz pokrótce czego potrzebujesz i zostaw numer telefonu —
            skontaktujemy się z Tobą tak szybko, jak to możliwe.
          </p>
        </header>

        <div className="overflow-hidden rounded-none border-y border-border/55 bg-card/40 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:rounded-2xl md:border">
          <div className="flex min-h-0 flex-col md:min-h-[76vh] md:flex-row lg:min-h-[80vh]">
            <div className="relative hidden min-h-0 w-full flex-none md:flex md:w-1/2 md:flex-col">
              <div className="relative min-h-[42vh] flex-1 bg-muted md:min-h-0">
                <img
                  src="/mordorhd.webp"
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                  aria-hidden
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--cinematic-surface)]/70 via-transparent to-transparent"
                />
                <div className="pointer-events-none absolute bottom-8 left-8 right-8 z-[1]">
                  <p
                    className="font-heading max-w-[24ch] text-2xl font-semibold leading-tight tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]"
                  >
                    Krótki opis. Szybka odpowiedź.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full bg-[var(--cinematic-base)] p-5 sm:p-6 md:w-1/2 md:p-10 lg:p-12">
              <div className="mx-auto max-w-2xl">
                <CinematicDrawerConfigurator
                  mode="embedded"
                  quickContactEmail="kontakt@vibeco.pl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
