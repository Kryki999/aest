"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import { Bell, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { NAV_LINKS } from "../nav-links";
import NewsfeedDrawer from "./NewsfeedDrawer";
import { CINEMATIC_EASE, menuCurtainTransition } from "./nav-motion";

const MENU_PANEL_ID = "site-primary-menu";
const NEWSFEED_PANEL_ID = "site-newsfeed-drawer";

const menuContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: menuCurtainTransition.duration * 0.62,
      staggerChildren: 0.06,
    },
  },
};

const menuItemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: CINEMATIC_EASE,
    },
  },
};

export default function CinematicSiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [newsfeedOpen, setNewsfeedOpen] = useState(false);

  const chromeInnerRef = useRef<HTMLDivElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const newsfeedCloseRef = useRef<HTMLButtonElement>(null);

  const openMenu = useCallback(() => {
    setNewsfeedOpen(false);
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const openNewsfeed = useCallback(() => {
    setMenuOpen(false);
    setNewsfeedOpen(true);
  }, []);

  const closeNewsfeed = useCallback(() => setNewsfeedOpen(false), []);

  const { scrollY } = useScroll();

  const padY = useTransform(scrollY, [0, 130], [40, 15]);
  const bgAlpha = useTransform(scrollY, [0, 108], [0, 0.94]);
  const blurPx = useTransform(scrollY, [0, 96], [0, 14]);

  const headerBg = useMotionTemplate`rgba(24, 24, 27, ${bgAlpha})`;
  const backdropBlur = useTransform(blurPx, (v) =>
    v < 0.75 ? "blur(0px)" : `blur(${v.toFixed(1)}px)`,
  );

  useEffect(() => {
    const el = chromeInnerRef.current;
    if (!el) return;
    const apply = () => {
      document.documentElement.style.setProperty(
        "--site-header-h",
        `${Math.ceil(el.getBoundingClientRect().height)}px`,
      );
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty("--site-header-h");
    };
  }, []);

  useEffect(() => {
    if (!menuOpen && !newsfeedOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen, newsfeedOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (menuOpen) closeMenu();
      else if (newsfeedOpen) closeNewsfeed();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, newsfeedOpen, closeMenu, closeNewsfeed]);

  useEffect(() => {
    if (!menuOpen) return;
    const t = window.requestAnimationFrame(() => {
      firstMenuLinkRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(t);
  }, [menuOpen]);

  useEffect(() => {
    if (!newsfeedOpen) return;
    const t = window.requestAnimationFrame(() => {
      newsfeedCloseRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(t);
  }, [newsfeedOpen]);

  return (
    <>
      <NewsfeedDrawer
        open={newsfeedOpen}
        onClose={closeNewsfeed}
        drawerId={NEWSFEED_PANEL_ID}
        closeButtonRef={newsfeedCloseRef}
      />

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="menu-curtain"
            id={MENU_PANEL_ID}
            role="dialog"
            aria-modal="true"
            aria-label="Primary navigation"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={menuCurtainTransition}
            className="fixed inset-0 z-[90] flex flex-col bg-[var(--cinematic-base)]"
          >
            <div className="flex min-h-[100dvh] flex-col px-[6vw] pb-14 pt-[var(--site-header-h,7rem)]">
              <nav
                aria-label="Primary"
                className="flex flex-1 flex-col items-center justify-center md:pb-10 md:pt-6"
              >
                <motion.ul
                  className="flex flex-col items-center gap-6 md:flex-row md:flex-wrap md:justify-center md:gap-x-14 md:gap-y-8"
                  variants={menuContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {NAV_LINKS.map(({ href, label }, i) => (
                    <motion.li key={label} variants={menuItemVariants}>
                      <Link
                        href={href}
                        ref={i === 0 ? firstMenuLinkRef : undefined}
                        className="block rounded-md text-center text-4xl font-medium tracking-tight text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cinematic-base)] md:text-3xl"
                        onClick={closeMenu}
                      >
                        {label}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.header
        className="fixed left-0 top-0 z-[100] w-full px-[6vw]"
        style={{
          paddingTop: padY,
          paddingBottom: padY,
          backgroundColor: headerBg,
          backdropFilter: backdropBlur,
          WebkitBackdropFilter: backdropBlur,
        }}
      >
        <div
          ref={chromeInnerRef}
          className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3"
        >
          <button
            type="button"
            aria-label="Open newsfeed"
            aria-expanded={newsfeedOpen}
            aria-controls={NEWSFEED_PANEL_ID}
            className="flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:size-12"
            onClick={() =>
              newsfeedOpen ? closeNewsfeed() : openNewsfeed()
            }
          >
            <Bell className="size-6 md:size-7" strokeWidth={1.35} aria-hidden />
          </button>

          <h1
            className="pointer-events-none text-center text-4xl italic lowercase tracking-tight text-foreground md:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            aest{" "}
            <span className="text-[var(--cinematic-accent)]">media</span>
          </h1>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={MENU_PANEL_ID}
            className="flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:size-12"
            onClick={() => (menuOpen ? closeMenu() : openMenu())}
          >
            {menuOpen ? (
              <X className="size-6 md:size-7" strokeWidth={1.35} aria-hidden />
            ) : (
              <Menu
                className="size-6 md:size-7"
                strokeWidth={1.35}
                aria-hidden
              />
            )}
          </button>
        </div>
      </motion.header>
    </>
  );
}
