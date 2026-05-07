"use client";

import ConfiguratorFormBody from "./ConfiguratorFormBody";

const PREFOOTER_VISUAL_POSTER =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=85&auto=format&fit=crop";
const PREFOOTER_VISUAL_VIDEO =
  "https://cdn.pixabay.com/video/2023/09/20/181608-866834614_large.mp4";

export default function PreFooterConfigurator() {
  return (
    <section
      aria-labelledby="prefooter-configurator-heading"
      className="relative w-screen max-w-none border-t border-border bg-background pb-20 pt-20 text-foreground md:pb-28 md:pt-24 lg:pb-32 lg:pt-28"
      style={{ marginInline: "calc(50% - 50vw)" }}
    >
      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-14 xl:px-16">
        <header className="mb-12 max-w-2xl md:mb-14">
          <h2
            id="prefooter-configurator-heading"
            className="text-balance text-3xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Naturalny finał:{" "}
            <span className="text-[var(--cinematic-accent)]">porozmawiajmy</span>
          </h2>
          <p className="mt-4 max-w-prose text-pretty text-sm leading-relaxed text-muted-foreground md:mt-5 md:text-base md:leading-relaxed">
            Ten sam układ pól co w skrócie z góry strony — bez wzywania szuflady,
            jeśli wolisz dokończyć rozmowę tutaj.
          </p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-border/55 bg-card/40 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <div className="flex min-h-0 flex-col md:flex-row">
            <div className="relative hidden min-h-0 w-full flex-none md:flex md:w-1/2 md:flex-col">
              <div className="relative min-h-[38vh] flex-1 bg-muted md:min-h-0">
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

            <div className="w-full p-6 md:w-1/2 md:p-9 lg:p-10">
              <div className="mx-auto max-w-xl">
                <ConfiguratorFormBody variant="embedded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
