"use client";

import { useId, useState, type FormEvent } from "react";

import { cn } from "@/lib/utils";

export type ConfiguratorFormVariant = "drawer" | "embedded";

type ConfiguratorFormBodyProps = {
  variant: ConfiguratorFormVariant;
  className?: string;
};

export default function ConfiguratorFormBody({
  variant,
  className,
}: ConfiguratorFormBodyProps) {
  const uid = useId();
  const suffix = variant === "drawer" ? "d" : "e";
  const id = (name: string) => `${uid}-${suffix}-${name}`;
  const ringOffset =
    variant === "drawer"
      ? "ring-offset-[var(--cinematic-base)]"
      : "ring-offset-background";

  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sent");
  };

  const fieldWrap =
    variant === "drawer"
      ? "flex flex-col gap-1.5"
      : "flex flex-col gap-2";

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-6 md:gap-7", className)}
      noValidate
    >
      {status === "sent" ? (
        <p
          className="rounded-lg border border-primary/25 bg-primary/5 px-4 py-4 text-sm leading-relaxed text-foreground md:text-[0.9375rem]"
          role="status"
        >
          Dziękujemy — wiadomość została zapisana w prototypie. Podłącz endpoint
          wysyłki, aby trafiała do Waszej skrzynki.
        </p>
      ) : null}

      <div className={fieldWrap}>
        <label
          htmlFor={id("name")}
          className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
        >
          Imię lub marka
        </label>
        <input
          id={id("name")}
          name="name"
          type="text"
          autoComplete="name"
          required
          disabled={status === "sent"}
          className={cn(
            "rounded-lg border border-border/80 bg-[rgb(24_24_27_/0.65)] px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/35 disabled:opacity-60",
            ringOffset,
          )}
          placeholder="np. Studio Nova"
        />
      </div>

      <div className={fieldWrap}>
        <label
          htmlFor={id("email")}
          className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
        >
          E-mail
        </label>
        <input
          id={id("email")}
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={status === "sent"}
          className={cn(
            "rounded-lg border border-border/80 bg-[rgb(24_24_27_/0.65)] px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/35 disabled:opacity-60",
            ringOffset,
          )}
          placeholder="kontakt@marka.pl"
        />
      </div>

      <div className={fieldWrap}>
        <label
          htmlFor={id("brief")}
          className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
        >
          Krótki brief
        </label>
        <textarea
          id={id("brief")}
          name="brief"
          rows={variant === "drawer" ? 5 : 6}
          required
          disabled={status === "sent"}
          className={cn(
            "min-h-[120px] resize-y rounded-lg border border-border/80 bg-[rgb(24_24_27_/0.65)] px-4 py-3 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/35 disabled:opacity-60",
            ringOffset,
          )}
          placeholder="Format, termin, budżet orientacyjny, linki referencyjne…"
        />
      </div>

      <div className="pt-1">
        <button
          type="submit"
          disabled={status === "sent"}
          className="w-full rounded-full border border-primary/35 bg-primary px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-[0_0_24px_-4px_var(--cinematic-accent-neon)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--cinematic-accent-neon)] hover:bg-[var(--cinematic-accent-neon)] disabled:pointer-events-none disabled:opacity-50 md:w-auto md:min-w-[200px]"
        >
          {status === "sent" ? "Wysłano" : "Wyślij wiadomość"}
        </button>
      </div>
    </form>
  );
}
