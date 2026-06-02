import type { Metadata } from "next";

import CinematicSiteHeader from "../components/CinematicSiteHeader";
import DispatchBlogList from "../components/dispatch/DispatchBlogList";
import SiteFooter from "../components/SiteFooter";
import { DISPATCH_ITEMS } from "../newsfeed-data";

export const metadata: Metadata = {
  title: "Aktualności | AestMedia",
  description:
    "Notatki ze studia — plany zdjęciowe, grading, dźwięk i produkcja.",
};

export default function AktualnosciPage() {
  return (
    <>
      <main className="relative min-h-screen bg-background text-foreground">
        <CinematicSiteHeader />

        <div className="px-[6vw] pb-20 pt-[calc(var(--site-header-h,5.5rem)+2rem)] md:pb-28 md:pt-[calc(var(--site-header-h,5rem)+3rem)]">
          <div className="mx-auto max-w-7xl">
            <header className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cinematic-accent)]">
                Aktualności
              </span>
              <h1 className="font-heading mt-4 text-balance text-3xl font-semibold leading-[1.02] tracking-tight md:text-5xl xl:text-[3.25rem]">
                Wszystkie{" "}
                <span className="text-[var(--cinematic-accent)]">wpisy</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base md:leading-relaxed">
                Notatki ze studia — plany zdjęciowe, grading i dźwięk. To samo,
                co w szufladzie powiadomień, tylko w pełnej formie.
              </p>
            </header>

            {DISPATCH_ITEMS.length > 0 ? (
              <DispatchBlogList posts={DISPATCH_ITEMS} />
            ) : (
              <p className="text-center text-muted-foreground">
                Brak wpisów. Wróć wkrótce!
              </p>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
