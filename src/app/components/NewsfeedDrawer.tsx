"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { RefObject } from "react";

import { DISPATCH_ITEMS } from "../newsfeed-data";
import { SOCIAL_LINKS } from "../social-links";
import { drawerSlideTransition } from "./nav-motion";

const railIconCls =
  "size-[1.05rem] text-white/88 transition-colors duration-200 hover:text-white";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: drawerSlideTransition.duration,
      staggerChildren: 0.068,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.34,
      ease: drawerSlideTransition.ease,
    },
  },
};

type NewsfeedDrawerProps = {
  open: boolean;
  onClose: () => void;
  drawerId: string;
  closeButtonRef?: RefObject<HTMLButtonElement | null>;
};

export default function NewsfeedDrawer({
  open,
  onClose,
  drawerId,
  closeButtonRef,
}: NewsfeedDrawerProps) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            key="newsfeed-backdrop"
            role="presentation"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: drawerSlideTransition.ease }}
            className="fixed inset-0 z-[105] bg-[var(--cinematic-base)]/60"
            onClick={onClose}
          />
          <motion.aside
            key="newsfeed-panel"
            id={drawerId}
            role="dialog"
            aria-modal="true"
            aria-label="Latest dispatches and studio news"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={drawerSlideTransition}
            className="fixed left-0 top-0 z-[110] flex h-[100dvh] w-full flex-row bg-[var(--cinematic-surface)] shadow-[12px_0_56px_rgba(0,0,0,0.45)] md:w-[min(40vw,520px)]"
          >
            <div className="relative z-[2] flex w-14 shrink-0 flex-col items-center justify-between border-r border-border/55 bg-[var(--cinematic-surface)] py-4 md:w-16">
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close newsfeed"
                className="relative z-[2] rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cinematic-surface)]"
                onClick={onClose}
              >
                <X className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
              </button>
              <nav
                aria-label="Social links"
                className="relative z-[2] flex flex-col items-center gap-5 pb-2"
              >
                {SOCIAL_LINKS.map(({ href, label, icon }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className="rounded-md outline-none focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cinematic-surface)]"
                  >
                    <Icon icon={icon} className={railIconCls} aria-hidden />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="newsfeed-scrollbar relative z-[1] flex min-w-0 flex-1 overflow-y-auto bg-[var(--cinematic-surface)]">
              <motion.div
                className="flex w-full flex-col gap-10 px-5 py-7 pb-14 md:gap-11 md:px-7 md:py-8 md:pb-16"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <h2
                    className="text-xl font-semibold tracking-tight text-foreground md:text-2xl"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Latest Dispatches
                  </h2>
                  <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
                    Notes from the studio — shoots, grade, and sound.
                  </p>
                </motion.div>

                <div className="flex flex-col gap-9 md:gap-10">
                  {DISPATCH_ITEMS.map((item) => (
                    <motion.article
                      key={item.title}
                      variants={itemVariants}
                      className="overflow-hidden rounded-xl border border-border/50 bg-[rgb(24_24_27_/0.55)] shadow-[0_1px_0_rgb(255_255_255_/0.04)_inset]"
                    >
                      <Link
                        href={item.href}
                        className="group block outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cinematic-surface)]"
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                          <Image
                            src={item.image}
                            alt={item.imageAlt}
                            fill
                            sizes="(max-width: 768px) 100vw, min(40vw, 520px)"
                            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                          />
                          <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--cinematic-surface)]/80 via-transparent to-transparent opacity-90"
                          />
                          <time
                            dateTime={item.date}
                            className="absolute left-4 top-4 rounded bg-[var(--cinematic-base)]/75 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-[2px]"
                          >
                            {item.date}
                          </time>
                        </div>

                        <div className="space-y-3 px-5 pb-6 pt-5 md:px-6 md:pb-7 md:pt-6">
                          <h3
                            className="text-[1.35rem] font-semibold leading-[1.15] tracking-tight text-foreground transition-colors group-hover:text-primary md:text-2xl md:leading-snug"
                            style={{ fontFamily: "var(--font-serif)" }}
                          >
                            {item.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem] md:leading-[1.65]">
                            {item.excerpt}
                          </p>
                          <span className="inline-flex items-center gap-1.5 pt-1 text-xs font-medium uppercase tracking-[0.2em] text-[var(--cinematic-accent)] transition-colors group-hover:text-[var(--cinematic-accent-neon)]">
                            Więcej
                            <span aria-hidden className="translate-x-0 transition-transform duration-300 group-hover:translate-x-1">
                              →
                            </span>
                          </span>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
