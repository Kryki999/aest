"use client";

import Link from "next/link";

import { NAV_LINKS } from "../nav-links";
import { SOCIAL_LINKS } from "../social-links";

const iconCls =
  "size-[1.15rem] text-muted-foreground transition-colors duration-200 hover:text-foreground";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative w-screen max-w-none border-t border-border bg-background text-muted-foreground"
      style={{ marginInline: "calc(50% - 50vw)" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-16 lg:px-14">
        <div className="flex flex-col items-center gap-y-10">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
              A
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
              Aest Media
            </span>
          </Link>

          <nav aria-label="Stopka">
            <ul className="flex flex-wrap justify-center gap-x-7 gap-y-2.5 text-sm md:gap-x-8">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          aria-hidden
          className="my-12 border-t border-dashed border-border md:my-14"
        />

        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between sm:gap-4">
          <p className="text-center text-sm text-muted-foreground sm:text-left">
            © {year} Aest Media
          </p>
          <div className="flex items-center gap-6 md:gap-7">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="outline-none focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Icon className={iconCls} stroke={1.5} aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
