"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { DISPATCH_ITEMS, type DispatchItem } from "../newsfeed-data";

const CARD_WIDTH_CLS =
  "w-[78vw] max-w-[300px] md:w-[clamp(260px,26vw,340px)] md:max-w-none";

const CARD_ASPECT = "aspect-[3/4]";

function ArticleCard({ item }: { item: DispatchItem }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "group relative block w-full overflow-hidden rounded-2xl border border-border/45",
        CARD_ASPECT,
        "outline-none ring-offset-[var(--cinematic-base)] transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1 hover:border-white/12 hover:shadow-[0_24px_60px_-18px_rgba(0,0,0,0.6)]",
        "focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2",
      )}
    >
      <Image
        src={item.image}
        alt={item.imageAlt}
        fill
        sizes="(max-width: 768px) 78vw, 26vw"
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--cinematic-base)] via-[var(--cinematic-base)]/55 to-transparent"
      />
      <time
        dateTime={item.date}
        className="absolute left-3.5 top-3.5 z-[1] rounded bg-[var(--cinematic-base)]/8 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/85 backdrop-blur-[6px] md:left-4 md:top-4"
      >
        {item.date}
      </time>
      <div className="absolute inset-x-0 bottom-0 z-[1] space-y-2 p-4 pb-5 md:p-5 md:pb-6">
        <h3
          className="text-pretty text-[1.05rem] font-semibold leading-[1.18] tracking-tight text-white transition-colors group-hover:text-[var(--cinematic-accent)] md:text-[1.15rem]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {item.title}
        </h3>
        <p className="line-clamp-2 text-[13px] leading-relaxed text-white/72 md:text-sm">
          {item.excerpt}
        </p>
      </div>
    </Link>
  );
}

function PortalCard() {
  return (
    <a
      href="#studio-newsletter"
      className={cn(
        "group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/12 bg-[var(--cinematic-base)] text-center",
        CARD_ASPECT,
        "px-5 py-8 transition-[transform,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1 hover:border-[var(--cinematic-accent)]/45 hover:bg-[var(--cinematic-surface)]",
        "outline-none ring-offset-[var(--cinematic-base)] focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2",
      )}
    >
      <span className="mb-5 inline-flex items-center justify-center rounded-full border border-white/10 p-3.5 transition-colors group-hover:border-[var(--cinematic-accent)]/45">
        <ArrowRight
          className="size-5 text-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
          strokeWidth={1.4}
          aria-hidden
        />
      </span>
      <h3
        className="max-w-[12ch] text-balance text-[1.35rem] font-semibold leading-[1.08] tracking-tight text-foreground md:text-[1.5rem]"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Odkryj wszystkie historie
      </h3>
    </a>
  );
}

function NewsletterPanel() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("ok");
    setEmail("");
  };

  return (
    <div
      id="studio-newsletter"
      className="mx-auto w-full max-w-2xl scroll-mt-28 px-[6vw] pt-14 md:scroll-mt-32 md:pt-20"
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-describedby={`${id}-status`}
        className="mx-auto w-full"
      >
        <div
          className={cn(
            "group mx-auto flex w-full items-center gap-2 rounded-full border bg-[var(--cinematic-surface)]/70 p-1.5 pl-5 transition-colors backdrop-blur-[2px] md:pl-6",
            status === "error"
              ? "border-[var(--cinematic-accent)]/80"
              : "border-white/12 focus-within:border-white/25",
          )}
        >
          <label htmlFor={`${id}-email`} className="sr-only">
            Adres e-mail
          </label>
          <input
            id={`${id}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Wpisz swój e-mail..."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== "idle") setStatus("idle");
            }}
            required
            aria-invalid={status === "error"}
            className={cn(
              "min-w-0 flex-1 bg-transparent py-3 text-sm tracking-tight text-foreground placeholder:text-muted-foreground/70",
              "outline-none focus:outline-none md:py-3.5 md:text-base",
            )}
          />
          <button
            type="submit"
            className={cn(
              "shrink-0 rounded-full bg-[var(--cinematic-accent)] px-5 py-3 text-xs font-medium tracking-wide text-white shadow-[0_8px_24px_-8px_rgba(225,29,72,0.55)]",
              "transition-[background-color,transform,box-shadow] duration-300 hover:bg-[var(--cinematic-accent-neon)] hover:shadow-[0_10px_28px_-8px_rgba(255,0,60,0.65)] active:translate-y-[1px]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cinematic-base)] md:px-6 md:py-3.5 md:text-sm",
            )}
          >
            Bądź na bieżąco
          </button>
        </div>

        <p
          id={`${id}-status`}
          role="status"
          aria-live="polite"
          className={cn(
            "mt-3 min-h-[1.1rem] text-center text-xs",
            status === "error"
              ? "text-[var(--cinematic-accent)]"
              : status === "ok"
                ? "text-foreground/85"
                : "text-transparent",
          )}
        >
          {status === "ok"
            ? "Witamy w grupie. Pierwszy list trafi do Ciebie wkrótce."
            : status === "error"
              ? "Sprawdź adres e-mail — coś tu nie pasuje."
              : "—"}
        </p>
      </form>
    </div>
  );
}

export default function NewsfeedFilmstripSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const atStart = el.scrollLeft <= 0;
      const atEnd =
        el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      if ((atEnd && e.deltaY > 0) || (atStart && e.deltaY < 0)) return;
      e.preventDefault();
      el.scrollBy({ left: e.deltaY * 1.15, behavior: "smooth" });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section
      aria-labelledby="newsfeed-filmstrip-heading"
      className="relative w-screen max-w-none overflow-hidden border-t border-border bg-background pb-20 pt-16 text-foreground md:pb-28 md:pt-20"
      style={{ marginInline: "calc(50% - 50vw)" }}
    >
      <header className="mx-auto mb-12 flex w-full items-center gap-4 px-[6vw] md:mb-16 md:gap-6">
        <Bell
          className="size-10 shrink-0 text-[var(--cinematic-accent)] md:size-14"
          strokeWidth={1.4}
          aria-hidden
        />
        <h2
          id="newsfeed-filmstrip-heading"
          className="text-balance text-3xl font-semibold leading-[1.02] tracking-tight md:text-5xl xl:text-[3.25rem]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          <span className="text-foreground">Najnowsze</span>{" "}
          <span className="text-[var(--cinematic-accent)]">wpisy</span>
        </h2>
      </header>

      <div
        ref={trackRef}
        className="no-scrollbar relative w-full overflow-x-auto overflow-y-clip overscroll-x-contain [-webkit-overflow-scrolling:touch] [scroll-snap-type:x_proximity]"
      >
        <ul className="flex items-center gap-4 px-[6vw] py-6 pr-[14vw] md:gap-6 md:py-8 md:pr-[12vw]">
          {DISPATCH_ITEMS.map((item) => (
            <li
              key={item.title}
              className={cn(
                "shrink-0 [scroll-snap-align:center] [scroll-snap-stop:always]",
                CARD_WIDTH_CLS,
              )}
            >
              <ArticleCard item={item} />
            </li>
          ))}
          <li
            className={cn(
              "shrink-0 [scroll-snap-align:center] [scroll-snap-stop:always]",
              CARD_WIDTH_CLS,
            )}
          >
            <PortalCard />
          </li>
        </ul>
      </div>

      <NewsletterPanel />
    </section>
  );
}
