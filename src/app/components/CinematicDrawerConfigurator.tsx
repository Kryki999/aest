"use client";

import { CINEMATIC_EASE } from "./nav-motion";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type CinematicStep = 1 | 2 | 3 | "success";

const KIND_OPTIONS = [
  { id: "teledysk", label: "Teledysk" },
  { id: "promo-video", label: "Wideo promocyjne" },
  { id: "photo-session", label: "Sesja zdjęciowa" },
  { id: "montaz", label: "Montaż" },
  { id: "other", label: "Inny epicki pomysł" },
] as const;

type KindId = (typeof KIND_OPTIONS)[number]["id"];

const ghostField =
  "w-full border-0 border-b border-white/[0.12] bg-transparent px-0 py-3.5 text-[0.9375rem] text-foreground outline-none transition-[box-shadow,border-color,background-color] duration-300 placeholder:text-muted-foreground/85 focus:border-[var(--cinematic-accent)] focus:shadow-[inset_0_-1px_0_0_rgba(225,29,72,0.85),0_0_32px_-12px_rgba(225,29,72,0.45)]";

type CinematicDrawerConfiguratorProps = {
  onStepChange?: (step: CinematicStep) => void;
  keyboardBottomInset?: number;
  mode?: "drawer" | "embedded";
  titleId?: string;
  onSuccessClose?: () => void;
  quickContactPhone?: string;
  quickContactEmail?: string;
};

const stepVariants = {
  initial: (d: number) => ({ x: 44 * d, opacity: 0 }),
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.44, ease: CINEMATIC_EASE },
  },
  exit: (d: number) => ({
    x: -44 * d,
    opacity: 0,
    transition: { duration: 0.4, ease: CINEMATIC_EASE },
  }),
};

export default function CinematicDrawerConfigurator({
  onStepChange,
  keyboardBottomInset = 0,
  mode = "drawer",
  titleId,
  onSuccessClose,
  quickContactPhone = "+48 570 220 680",
  quickContactEmail = "kontakt@aestmedia.pl",
}: CinematicDrawerConfiguratorProps) {
  const uid = useId();
  const resolvedTitleId = titleId ?? `${uid}-title`;
  const [step, setStep] = useState<CinematicStep>(1);
  const [direction, setDirection] = useState(1);
  const [projectKind, setProjectKind] = useState<KindId | "">("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [story, setStory] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fax, setFax] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [flashId, setFlashId] = useState<string | null>(null);

  const formContainerRef = useRef<HTMLDivElement>(null);
  const firstTileRef = useRef<HTMLButtonElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const closeSuccessRef = useRef<HTMLButtonElement>(null);

  const isInitialMount = useRef(true);

  const progress = step === "success" ? 1 : (step as number) / 3;

  const announceId = `${uid}-announce`;

  const focusField = useCallback((el: HTMLElement | null) => {
    requestAnimationFrame(() => {
      el?.focus();
    });
  }, []);

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [step]);

  useEffect(() => {
    if (step === 1) focusField(firstTileRef.current);
    if (step === 2) focusField(linkRef.current);
    if (step === 3) focusField(nameRef.current);
    if (step === "success") focusField(closeSuccessRef.current);
  }, [step, focusField]);

  const goNextFromTile = (id: KindId) => {
    setDirection(1);
    setFlashId(id);
    setProjectKind(id);
    window.setTimeout(() => {
      setFlashId(null);
      setStep(2);
    }, 240);
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (story.trim().length < 8) {
      e.story = "Dodaj choć kilka słów o projekcie.";
    }
    const ref = referenceUrl.trim();
    if (ref) {
      try {
        const raw = ref.match(/^https?:\/\//) ? ref : `https://${ref}`;
        new URL(raw);
      } catch {
        e.referenceUrl = "Wklej poprawny link (np. Instagram, YouTube).";
      }
    }
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Imię jest wymagane.";
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 15) {
      e.phone = "Podaj poprawny numer (min. 9 cyfr).";
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = "Niepoprawny e-mail.";
    }
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.set("projectKind", projectKind);
      fd.set("referenceUrl", referenceUrl.trim());
      fd.set("story", story.trim());
      fd.set("name", name.trim());
      fd.set("phone", phone.trim());
      if (email.trim()) fd.set("email", email.trim());
      if (fax) fd.set("fax", fax);

      const res = await fetch("/api/send-project-brief", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        success?: boolean;
      };
      if (!res.ok) {
        throw new Error(data.error || "Błąd wysyłki");
      }
      setDirection(1);
      setStep("success");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Spróbuj ponownie za chwilę.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollFieldIntoView = (el: HTMLElement) => {
    el.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  const resetWizard = () => {
    setStep(1);
    setDirection(1);
    setProjectKind("");
    setReferenceUrl("");
    setStory("");
    setName("");
    setPhone("");
    setEmail("");
    setFax("");
    setSubmitError(null);
    setFieldErrors({});
    setFlashId(null);
  };

  return (
    <div
      ref={formContainerRef}
      className="scroll-mt-4"
      style={{ paddingBottom: keyboardBottomInset }}
    >
      <p id={announceId} className="sr-only" aria-live="polite">
        {step === "success"
          ? "Wysłano. Dziękujemy."
          : `Krok ${step} z 3.`}
      </p>

      <div className="mb-8 space-y-2">
        <div
          className="h-[3px] w-full overflow-hidden rounded-full bg-white/[0.08]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-label="Postęp konfiguratora"
        >
          <motion.div
            className="h-full w-full origin-left bg-gradient-to-r from-[var(--cinematic-accent)] via-[var(--cinematic-accent-neon)] to-[var(--cinematic-accent)] shadow-[0_0_20px_rgba(255,0,60,0.45)] will-change-transform"
            initial={{ scaleX: 0.33 }}
            animate={{ scaleX: progress }}
            transition={{ duration: 0.55, ease: CINEMATIC_EASE }}
          />
        </div>
      </div>

      <AnimatePresence custom={direction} mode="wait" initial={false}>
        {step === "success" ? (
          <motion.div
            key="success"
            role="status"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: CINEMATIC_EASE }}
            className="flex min-h-[40vh] flex-col items-center justify-center gap-6 py-6 text-center"
          >
            <div
              id={resolvedTitleId}
              className="max-w-sm text-balance text-2xl font-semibold leading-tight text-foreground md:text-3xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Dziękujemy — ekran już pracuje na Twoim froncie.
            </div>
            <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
              Wrócimy z pierwszym kontaktem na podany numer.
              {mode === "drawer"
                ? " Jeśli chcesz, możesz już zamknąć ten panel."
                : " Jeśli chcesz, możesz od razu wysłać kolejny brief."}
            </p>
            {mode === "drawer" ? (
              <button
                ref={closeSuccessRef}
                type="button"
                className="rounded-full border border-primary/35 bg-primary px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-[0_0_24px_-4px_var(--cinematic-accent-neon)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--cinematic-accent-neon)] hover:bg-[var(--cinematic-accent-neon)]"
                onClick={onSuccessClose}
              >
                Zamknij
              </button>
            ) : (
              <button
                ref={closeSuccessRef}
                type="button"
                className="rounded-full border border-white/15 bg-transparent px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition duration-300 hover:-translate-y-0.5 hover:border-[var(--cinematic-accent)]/60 hover:text-[var(--cinematic-accent)]"
                onClick={resetWizard}
              >
                Wyślij kolejny brief
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key={`step-${step}`}
            custom={direction}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <header className="space-y-2">
              {step === 1 && mode === "drawer" ? (
                <p className="mb-4 text-pretty text-[0.95rem] leading-relaxed text-foreground/95 md:text-base">
                  Wolisz działać od razu? Zadzwoń na{" "}
                  <a
                    href={`tel:${quickContactPhone.replace(/\s+/g, "")}`}
                    className="group relative inline-flex items-center text-[var(--cinematic-accent)] transition-colors duration-300 hover:text-[var(--cinematic-accent-neon)] focus-visible:text-[var(--cinematic-accent-neon)] focus-visible:outline-none"
                  >
                    <span className="relative z-[1]">{quickContactPhone}</span>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[var(--cinematic-accent)]/65 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -bottom-1 left-1/2 h-3 w-14 -translate-x-1/2 rounded-full bg-[var(--cinematic-accent)]/35 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                    />
                  </a>{" "}
                  lub wyslij{" "}
                  <a
                    href={`mailto:${quickContactEmail}`}
                    className="group relative inline-flex items-center text-[var(--cinematic-accent)] transition-colors duration-300 hover:text-[var(--cinematic-accent-neon)] focus-visible:text-[var(--cinematic-accent-neon)] focus-visible:outline-none"
                  >
                    <span className="relative z-[1]">{quickContactEmail}</span>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[var(--cinematic-accent)]/65 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -bottom-1 left-1/2 h-3 w-14 -translate-x-1/2 rounded-full bg-[var(--cinematic-accent)]/35 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                    />
                  </a>
                  . Albo nakreśl swoją wizję poniżej a my się z tobą skontaktujemy.
                </p>
              ) : null}
              <h3
                id={resolvedTitleId}
                className="text-balance text-xl font-semibold leading-snug tracking-tight text-foreground md:text-2xl"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {step === 1 && "Co dokładnie mamy dla Ciebie stworzyć?"}
                {step === 2 &&
                  "Pokaż nam swój styl i powiedz dwa słowa o projekcie."}
                {step === 3 &&
                  "Zostaw namiary. Ekipa zaraz się odezwie."}
              </h3>
            </header>

            {step === 1 && (
              <div className="grid grid-cols-1 gap-3 sm:gap-3.5">
                {KIND_OPTIONS.map((opt, i) => (
                  <motion.button
                    key={opt.id}
                    ref={i === 0 ? firstTileRef : undefined}
                    type="button"
                    className={cn(
                      "relative min-h-[4.25rem] w-full rounded-2xl border border-white/[0.07] bg-white/[0.03] px-5 py-5 text-left text-[0.95rem] font-medium tracking-tight text-foreground transition-colors duration-300",
                      "hover:border-[var(--cinematic-accent)]/45 hover:bg-[var(--cinematic-accent)]/[0.07]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cinematic-accent)]/55",
                      flashId === opt.id &&
                      "border-[var(--cinematic-accent)]/90 bg-[var(--cinematic-accent)]/15 shadow-[0_0_36px_-8px_rgba(225,29,72,0.65)]",
                    )}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => goNextFromTile(opt.id)}
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-7">
                <div className="space-y-2">
                  <label
                    htmlFor={`${uid}-link`}
                    className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                  >
                    Link referencyjny (opcjonalnie)
                  </label>
                  <input
                    ref={linkRef}
                    id={`${uid}-link`}
                    type="text"
                    inputMode="url"
                    autoComplete="url"
                    placeholder="Instagram, YouTube, portfolio…"
                    value={referenceUrl}
                    onChange={(e) => setReferenceUrl(e.target.value)}
                    onFocus={(e) => scrollFieldIntoView(e.currentTarget)}
                    className={cn(ghostField, fieldErrors.referenceUrl && "border-red-400/80")}
                    aria-invalid={!!fieldErrors.referenceUrl}
                    aria-describedby={
                      fieldErrors.referenceUrl ? `${uid}-link-err` : undefined
                    }
                  />
                  {fieldErrors.referenceUrl ? (
                    <p id={`${uid}-link-err`} className="text-xs text-red-400/90">
                      {fieldErrors.referenceUrl}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor={`${uid}-story`}
                    className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                  >
                    Twój klimat
                  </label>
                  <textarea
                    id={`${uid}-story`}
                    rows={6}
                    required
                    placeholder="W jakiej branży działasz? Co dokładnie chodzi Ci po głowie?"
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    onFocus={(e) => scrollFieldIntoView(e.target)}
                    className={cn(
                      ghostField,
                      "min-h-[140px] resize-y rounded-lg border border-white/[0.06] px-3 py-3 focus:border-[var(--cinematic-accent)]",
                      fieldErrors.story && "border-red-400/80",
                    )}
                    aria-invalid={!!fieldErrors.story}
                    aria-describedby={
                      fieldErrors.story ? `${uid}-story-err` : undefined
                    }
                  />
                  {fieldErrors.story ? (
                    <p id={`${uid}-story-err`} className="text-xs text-red-400/90">
                      {fieldErrors.story}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-4">
                  <button
                    type="button"
                    className="min-h-12 flex-1 rounded-full border border-white/15 bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition hover:border-white/25 hover:text-foreground"
                    onClick={() => {
                      setDirection(-1);
                      setStep(1);
                    }}
                  >
                    Wstecz
                  </button>
                  <button
                    type="button"
                    className="min-h-12 flex-[1.35] rounded-full border border-primary/35 bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-[0_0_24px_-4px_var(--cinematic-accent-neon)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--cinematic-accent-neon)] hover:bg-[var(--cinematic-accent-neon)]"
                    onClick={() => {
                      if (!validateStep2()) return;
                      setDirection(1);
                      setStep(3);
                    }}
                  >
                    Dalej
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form className="space-y-7" onSubmit={handleSubmit} noValidate>
                <input
                  type="text"
                  name="fax"
                  value={fax}
                  onChange={(e) => setFax(e.target.value)}
                  className="pointer-events-none absolute left-0 top-0 -z-10 h-px w-px opacity-0"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                />

                <div className="space-y-2">
                  <label
                    htmlFor={`${uid}-name`}
                    className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                  >
                    Imię
                  </label>
                  <input
                    ref={nameRef}
                    id={`${uid}-name`}
                    type="text"
                    autoComplete="given-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={(e) => scrollFieldIntoView(e.currentTarget)}
                    className={cn(ghostField, fieldErrors.name && "border-red-400/80")}
                    aria-invalid={!!fieldErrors.name}
                  />
                  {fieldErrors.name ? (
                    <p className="text-xs text-red-400/90">{fieldErrors.name}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor={`${uid}-phone`}
                    className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                  >
                    Numer telefonu
                  </label>
                  <input
                    id={`${uid}-phone`}
                    type="tel"
                    autoComplete="tel"
                    required
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={(e) => scrollFieldIntoView(e.currentTarget)}
                    className={cn(ghostField, fieldErrors.phone && "border-red-400/80")}
                    aria-invalid={!!fieldErrors.phone}
                  />
                  {fieldErrors.phone ? (
                    <p className="text-xs text-red-400/90">{fieldErrors.phone}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor={`${uid}-email`}
                    className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                  >
                    E-mail (opcjonalnie)
                  </label>
                  <input
                    id={`${uid}-email`}
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={(e) => scrollFieldIntoView(e.currentTarget)}
                    className={cn(ghostField, fieldErrors.email && "border-red-400/80")}
                    aria-invalid={!!fieldErrors.email}
                  />
                  {fieldErrors.email ? (
                    <p className="text-xs text-red-400/90">{fieldErrors.email}</p>
                  ) : null}
                </div>

                {submitError ? (
                  <p className="text-sm text-red-400/95" role="alert">
                    {submitError}
                  </p>
                ) : null}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-4">
                  <button
                    type="button"
                    className="min-h-12 flex-1 rounded-full border border-white/15 bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition hover:border-white/25 hover:text-foreground"
                    onClick={() => {
                      setDirection(-1);
                      setStep(2);
                    }}
                  >
                    Wstecz
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-h-12 flex-[1.35] rounded-full border border-primary/35 bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground shadow-[0_0_28px_-6px_var(--cinematic-accent-neon)] transition duration-300 enabled:hover:-translate-y-0.5 enabled:hover:border-[var(--cinematic-accent-neon)] enabled:hover:bg-[var(--cinematic-accent-neon)] disabled:opacity-55"
                  >
                    {isSubmitting ? "Wysyłanie…" : "Odpalamy projekt!"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
