"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import { Bell, Mail, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { NAV_LINKS } from "../nav-links";
import { useConfigurator } from "./configurator-shared";
import NewsfeedDrawer from "./NewsfeedDrawer";
import { CINEMATIC_EASE, menuCurtainTransition } from "./nav-motion";

const MENU_PANEL_ID = "site-primary-menu";
const NEWSFEED_PANEL_ID = "site-newsfeed-drawer";
const CONFIGURATOR_PANEL_ID = "site-slide-in-configurator";

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

  const {
    isOpen: configuratorOpen,
    open: openConfigurator,
    close: closeConfigurator,
  } = useConfigurator();

  const headerRef = useRef<HTMLElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const newsfeedCloseRef = useRef<HTMLButtonElement>(null);

  const openMenu = useCallback(() => {
    closeConfigurator();
    setNewsfeedOpen(false);
    setMenuOpen(true);
  }, [closeConfigurator]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const openNewsfeed = useCallback(() => {
    closeConfigurator();
    setMenuOpen(false);
    setNewsfeedOpen(true);
  }, [closeConfigurator]);

  const closeNewsfeed = useCallback(() => setNewsfeedOpen(false), []);
  const handleBrandClick = useCallback(() => {
    closeConfigurator();
    closeMenu();
    closeNewsfeed();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [closeConfigurator, closeMenu, closeNewsfeed]);

  const { scrollY } = useScroll();

  const padY = useTransform(scrollY, [0, 130], [40, 15]);
  const bgAlpha = useTransform(scrollY, [0, 108], [0, 0.94]);
  const blurPx = useTransform(scrollY, [0, 96], [0, 14]);

  const headerBg = useMotionTemplate`rgba(24, 24, 27, ${bgAlpha})`;
  const backdropBlur = useTransform(blurPx, (v) =>
    v < 0.75 ? "blur(0px)" : `blur(${v.toFixed(1)}px)`,
  );

  useEffect(() => {
    const el = headerRef.current;
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
    const onScroll = () => apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.documentElement.style.removeProperty("--site-header-h");
    };
  }, []);

  useEffect(() => {
    if (!menuOpen && !newsfeedOpen && !configuratorOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen, newsfeedOpen, configuratorOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (configuratorOpen) closeConfigurator();
      else if (menuOpen) closeMenu();
      else if (newsfeedOpen) closeNewsfeed();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    menuOpen,
    newsfeedOpen,
    configuratorOpen,
    closeMenu,
    closeNewsfeed,
    closeConfigurator,
  ]);

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

  const bellUnreachableUnderDrawer = newsfeedOpen || configuratorOpen;

  const openConfiguratorFromHeader = useCallback(() => {
    closeMenu();
    closeNewsfeed();
    openConfigurator();
  }, [closeMenu, closeNewsfeed, openConfigurator]);

  return (
    <>
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
            className="fixed left-0 right-0 top-0 z-[90] flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[var(--cinematic-base)] md:h-[min(640px,68vh)] md:rounded-b-[1.25rem] md:border-b md:border-white/[0.06] md:shadow-[0_28px_90px_rgba(0,0,0,0.55)]"
          >
            <div className="flex h-full flex-col px-[6vw] pb-16 pt-[calc(var(--site-header-h,7rem)+1.25rem)] md:pb-14 md:pt-[calc(var(--site-header-h,5rem)+2rem)]">
              <nav
                aria-label="Primary"
                className="flex flex-1 flex-col items-center justify-center"
              >
                <motion.ul
                  className="flex flex-col items-center gap-7 md:flex-row md:flex-wrap md:justify-center md:gap-x-14 md:gap-y-7"
                  variants={menuContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {NAV_LINKS.map(({ href, label }, i) => (
                    <motion.li key={label} variants={menuItemVariants}>
                      <Link
                        href={href}
                        ref={i === 0 ? firstMenuLinkRef : undefined}
                        className="block rounded-md text-center text-[2.4rem] font-medium tracking-tight text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--cinematic-base)] md:text-[clamp(1.5rem,2.4vw,2.05rem)]"
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
        ref={headerRef}
        className="fixed left-0 top-0 z-[100] w-full px-[6vw]"
        style={
          menuOpen
            ? {
                paddingTop: padY,
                paddingBottom: padY,
                backgroundColor: "var(--cinematic-base)",
                backdropFilter: "none",
                WebkitBackdropFilter: "none",
              }
            : {
                paddingTop: padY,
                paddingBottom: padY,
                backgroundColor: headerBg,
                backdropFilter: backdropBlur,
                WebkitBackdropFilter: backdropBlur,
              }
        }
      >
        <div className="relative mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3">
          <button
            type="button"
            aria-label="Open newsfeed"
            aria-expanded={newsfeedOpen}
            aria-controls={NEWSFEED_PANEL_ID}
            disabled={bellUnreachableUnderDrawer}
            tabIndex={bellUnreachableUnderDrawer ? -1 : 0}
            className="flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-40 md:size-12"
            onClick={() =>
              newsfeedOpen ? closeNewsfeed() : openNewsfeed()
            }
          >
            <Bell className="size-6 md:size-7" strokeWidth={1.35} aria-hidden />
          </button>

          <Link
            href="/"
            scroll
            aria-label="Go to homepage"
            className="text-center text-4xl italic lowercase tracking-tight text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
            onClick={handleBrandClick}
          >
            aest <span className="text-[var(--cinematic-accent)]">media</span>
          </Link>

          <div className="flex shrink-0 items-center gap-0.5 md:gap-1">
            <button
              type="button"
              aria-label="Otwórz konfigurator kontaktu"
              aria-expanded={configuratorOpen}
              aria-controls={CONFIGURATOR_PANEL_ID}
              className="flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:size-12"
              onClick={() =>
                configuratorOpen ? closeConfigurator() : openConfiguratorFromHeader()
              }
            >
              <Mail className="size-6 md:size-7" strokeWidth={1.35} aria-hidden />
            </button>
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
        </div>
      </motion.header>

      <NewsfeedDrawer
        open={newsfeedOpen}
        onClose={closeNewsfeed}
        drawerId={NEWSFEED_PANEL_ID}
        closeButtonRef={newsfeedCloseRef}
      />
    </>
  );
}
