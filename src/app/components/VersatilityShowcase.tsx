const TAGS = [
  "RAP & UNDERGROUND",
  "POP & MAINSTREAM",
  "MARKI PREMIUM",
  "KAMPANIE WIZERUNKOWE",
  "FASHION & BEAUTY",
  "B2B & EVENTY",
] as const;

export default function VersatilityShowcase() {
  return (
    <section
      aria-labelledby="versatility-heading"
      className="relative w-screen max-w-none overflow-x-clip bg-[var(--cinematic-base)] pt-12 pb-16 md:pt-14 md:pb-20 lg:pt-16 lg:pb-24"
      style={{ marginInline: "calc(50% - 50vw)" }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-visible">
        <div className="absolute left-1/2 top-1/2 h-[min(42vw,220px)] w-[min(118vw,980px)] -translate-x-1/2 -translate-y-1/2 md:h-[280px] md:w-[min(100%,980px)]">
          <svg
            viewBox="0 0 1000 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            className="h-full w-full overflow-visible blur-[64px] md:blur-[84px]"
          >
            <defs>
              <linearGradient
                id="versatility-arc-glow"
                x1="0"
                y1="0"
                x2="1000"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#e11d48" stopOpacity="0.95" />
                <stop offset="0.5" stopColor="#e11d48" stopOpacity="0.9" />
                <stop offset="1" stopColor="#ff003c" stopOpacity="0.85" />
              </linearGradient>
            </defs>
            <path
              d="M 20 56 Q 500 132 980 56"
              stroke="url(#versatility-arc-glow)"
              strokeWidth="88"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path
              d="M 20 56 Q 500 132 980 56"
              stroke="url(#versatility-arc-glow)"
              strokeWidth="48"
              strokeLinecap="round"
              opacity="0.82"
            />
          </svg>
        </div>
      </div>

      <div
        aria-hidden
        className="hands-bridge-grain pointer-events-none absolute inset-0 z-[1]"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center md:px-10">
        <h2
          id="versatility-heading"
          className="font-heading text-balance text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1.02] tracking-tight"
        >
          <span className="bg-gradient-to-r from-white via-[var(--cinematic-accent)] to-[var(--cinematic-accent-neon)] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(225,29,72,0.35)]">
            Czujemy każdy klimat.
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-[68ch] text-pretty text-sm leading-relaxed text-white/92 md:mt-8 md:text-base md:leading-relaxed lg:text-lg">
          Działamy bez ograniczeń. Od podziemia, przez mainstream, aż po kampanie
          dla marek premium. Przekładamy teledyskową dynamikę na świat biznesu.
          Nie narzucamy swoich schematów – po prostu wchodzimy w Twoją wizję i
          dowozimy kinową jakość.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 md:mt-12 md:gap-6">
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/85 transition-all duration-300 hover:border-[var(--cinematic-accent)]/50 hover:bg-[var(--cinematic-accent)]/[0.08] hover:text-foreground hover:shadow-[0_0_32px_-6px_rgba(225,29,72,0.55)] md:text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
