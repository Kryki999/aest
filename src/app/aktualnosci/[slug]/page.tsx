import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, Clock } from "lucide-react";

import CinematicSiteHeader from "../../components/CinematicSiteHeader";
import DispatchBackButton from "../../components/dispatch/DispatchBackButton";
import SiteFooter from "../../components/SiteFooter";
import {
  DISPATCH_ITEMS,
  estimateReadTime,
  formatDispatchDate,
  getDispatchBySlug,
  type DispatchOrigin,
} from "../../newsfeed-data";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
};

export async function generateStaticParams() {
  return DISPATCH_ITEMS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getDispatchBySlug(slug);

  if (!post) {
    return { title: "Wpis nie znaleziony | AestMedia" };
  }

  return {
    title: `${post.title} | AestMedia`,
    description: post.excerpt,
  };
}

function resolveOrigin(from: string | undefined): DispatchOrigin {
  return from === "home" ? "home" : "blog";
}

export default async function DispatchArticlePage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { from } = await searchParams;
  const post = getDispatchBySlug(slug);

  if (!post) {
    notFound();
  }

  const origin = resolveOrigin(from);
  const readTime = estimateReadTime(post.body);

  return (
    <>
      <main className="relative min-h-screen bg-background text-foreground">
        <CinematicSiteHeader />

        <article className="px-[6vw] pb-20 pt-[calc(var(--site-header-h,5.5rem)+1.25rem)] md:pb-28 md:pt-[calc(var(--site-header-h,5rem)+1.75rem)]">
          <div className="mx-auto max-w-4xl">
            <DispatchBackButton origin={origin} className="mb-8 md:mb-10" />

            <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-2xl border border-border/50 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)] md:mb-10">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--cinematic-base)]/35 via-transparent to-transparent"
              />
            </div>

            <div className="mx-auto max-w-3xl">
              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" strokeWidth={1.5} aria-hidden />
                  <time dateTime={post.date}>{formatDispatchDate(post.date)}</time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4" strokeWidth={1.5} aria-hidden />
                  {readTime} min czytania
                </div>
              </div>

              <h1 className="font-heading text-balance text-3xl font-semibold leading-[1.08] tracking-tight md:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              <p className="mt-6 border-l-4 border-[var(--cinematic-accent)] pl-4 text-lg leading-relaxed text-muted-foreground md:text-xl">
                {post.excerpt}
              </p>

              <div className="prose prose-invert mt-10 max-w-none">
                {post.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="mb-5 text-base leading-relaxed text-foreground/88 md:text-[1.05rem] md:leading-[1.75]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-14 border-t border-border/60 pt-8">
                <DispatchBackButton
                  origin={origin}
                  label={
                    origin === "home"
                      ? "Wróć do sekcji aktualności"
                      : "Wróć do wszystkich wpisów"
                  }
                />
              </div>
            </div>
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
