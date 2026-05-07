"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { RefObject } from "react";

import { DISPATCH_ITEMS } from "../newsfeed-data";
import { SOCIAL_LINKS } from "../social-links";
import { drawerSlideTransition } from "./nav-motion";

const railIconCls =
  "size-[1.05rem] text-muted-foreground transition-colors duration-200 hover:text-foreground";

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
            className="fixed inset-0 z-[85] bg-[var(--cinematic-base)]/60"
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
            className="fixed left-0 top-0 z-[95] flex h-[100dvh] w-full flex-row bg-[var(--cinematic-surface)] shadow-[8px_0_48px_rgba(0,0,0,0.35)] md:w-[min(40vw,520px)]"
          >
            <div className="flex w-14 shrink-0 flex-col items-center justify-between border-r border-border/55 py-4 md:w-16">
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close newsfeed"
                className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cinematic-surface)]"
                onClick={onClose}
              >
                <X className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
              </button>
              <nav
                aria-label="Social links"
                className="flex flex-col items-center gap-5 pb-2"
              >
                {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className="rounded-md outline-none focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cinematic-surface)]"
                  >
                    <Icon className={railIconCls} stroke={1.5} aria-hidden />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="newsfeed-scrollbar flex min-w-0 flex-1 overflow-y-auto">
              <motion.div
                className="flex w-full flex-col gap-8 px-5 py-7 pb-12 md:px-7 md:py-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <h2
                    className="font-semibold tracking-tight text-foreground"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Latest Dispatches
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Notes from the studio — shoots, grade, and sound.
                  </p>
                </motion.div>

                {DISPATCH_ITEMS.map((item) => (
                  <motion.article key={item.title} variants={itemVariants}>
                    <Link
                      href={item.href}
                      className="group block rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cinematic-surface)]"
                    >
                      <time
                        dateTime={item.date}
                        className="text-xs uppercase tracking-wider text-muted-foreground"
                      >
                        {item.date}
                      </time>
                      <span className="mt-1 block text-lg font-medium leading-snug text-foreground transition-colors group-hover:text-primary">
                        {item.title}
                      </span>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {item.excerpt}
                      </p>
                    </Link>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
