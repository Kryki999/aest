"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { useId, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

import { NAV_LINKS } from "../nav-links";
import { SOCIAL_LINKS } from "../social-links";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("ok");
    setEmail("");
  };

  return (
    <footer
      className="relative w-screen max-w-none border-t border-border bg-background text-foreground"
      style={{ marginInline: "calc(50% - 50vw)" }}
    >
      <div className="mx-auto max-w-[1800px] px-6 py-20 md:px-10 md:py-24 lg:px-14 lg:py-28">
        <div className="flex flex-col items-center gap-y-14 md:gap-y-16">
          <Link
            href="/"
            aria-label="Go to homepage"
            className="whitespace-nowrap text-center text-5xl italic lowercase leading-none tracking-tight text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            aest <span className="text-[var(--cinematic-accent)]">media</span>
          </Link>

          <nav aria-label="Stopka">
            <ul className="flex flex-wrap justify-center gap-x-9 gap-y-4 text-base md:gap-x-11 md:text-xl">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="font-semibold text-white transition-colors hover:text-[var(--cinematic-accent)] focus-visible:text-[var(--cinematic-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="w-full max-w-4xl">
            <form onSubmit={handleSubmit} noValidate aria-describedby={`${id}-status`}>
              <div
                className={`group mx-auto flex w-full items-center gap-3 rounded-[2rem] border bg-[var(--cinematic-surface)]/75 p-2.5 pl-6 transition-colors backdrop-blur-[2px] md:gap-4 md:rounded-[2.6rem] md:p-3 md:pl-8 ${
                  status === "error"
                    ? "border-[var(--cinematic-accent)]/80"
                    : "border-white/12 focus-within:border-white/25"
                }`}
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
                  className="min-w-0 flex-1 bg-transparent py-4 text-base tracking-tight text-foreground placeholder:text-muted-foreground/70 outline-none focus:outline-none md:py-5 md:text-lg"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-[var(--cinematic-accent)] px-6 py-3.5 text-xs font-medium tracking-wide text-white shadow-[0_8px_24px_-8px_rgba(225,29,72,0.55)] transition-[background-color,transform,box-shadow] duration-300 hover:bg-[var(--cinematic-accent-neon)] hover:shadow-[0_10px_28px_-8px_rgba(255,0,60,0.65)] active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cinematic-base)] md:px-8 md:py-4 md:text-sm"
                >
                  Bądź na bieżąco
                </button>
              </div>
              <p
                id={`${id}-status`}
                role="status"
                aria-live="polite"
                className={`mt-3 min-h-[1.1rem] text-center text-xs ${
                  status === "error"
                    ? "text-[var(--cinematic-accent)]"
                    : status === "ok"
                      ? "text-foreground/85"
                      : "text-transparent"
                }`}
              >
                {status === "ok"
                  ? "Witamy w grupie. Pierwszy list trafi do Ciebie wkrótce."
                  : status === "error"
                    ? "Sprawdź adres e-mail — coś tu nie pasuje."
                    : "—"}
              </p>
            </form>
          </div>
        </div>

        <div
          aria-hidden
          className="my-14 border-t border-dashed border-border md:my-16"
        />

        <div className="flex flex-col items-center gap-9 sm:flex-row sm:justify-between sm:gap-4">
          <p className="text-center text-lg font-semibold tracking-tight text-white sm:text-left md:text-2xl">
            © {year} Aest Media
          </p>
          <div className="flex items-center gap-7 md:gap-9">
            {SOCIAL_LINKS.map(({ href, label, icon, hoverColor, hoverGradient }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="group outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span
                  className="relative block size-8 md:size-10"
                  style={
                    {
                      ...(hoverColor ? { "--hover-color": hoverColor } : {}),
                      ...(hoverGradient ? { "--hover-gradient": hoverGradient } : {}),
                    } as CSSProperties
                  }
                >
                  <Icon
                    icon={icon}
                    className="absolute inset-0 size-full text-white transition-opacity duration-300 group-hover:opacity-0"
                    aria-hidden
                  />
                  <Icon
                    icon={icon}
                    className="absolute inset-0 size-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      color: hoverColor ?? undefined,
                      ...(hoverGradient
                        ? {
                            color: "transparent",
                            backgroundImage: hoverGradient,
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                          }
                        : {}),
                    }}
                    aria-hidden
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
