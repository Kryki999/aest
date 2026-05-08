"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type Testimonial = {
  name: string;
  company: string;
  quote: string;
  avatar: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Piotr Dowgalski",
    company: "AquaBox Polska",
    quote:
      "The skills, combined with extensive practical expertise and knowledge in 3D modeling, integrating models with video footage, CGI and VFX effects, working with lighting, visual aesthetics, and scene composition, ensures highly professional audiovisual results.",
    avatar:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Anna Skorupska",
    company: "NAUTRA",
    quote:
      "I am extremely impressed with the project's turnaround time. From the first phone call to the completed project, it took less than a week.",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Lukasz Kaszynski",
    company: "GBS",
    quote:
      "Working with Palm Vision Studio has been an absolute pleasure. Team's creativity and professionalism ensured that each video clip was unique and met my expectations perfectly.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Marta Lewandowska",
    company: "Bloom Atelier",
    quote:
      "Od pierwszego dnia czuliśmy, że projekt jest prowadzony strategicznie. Komunikacja, tempo i finalna jakość materiałów były na najwyższym poziomie.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Michal Kaczmarek",
    company: "Atlas Group",
    quote:
      "Dostaliśmy content, który realnie podniósł jakość naszego wizerunku. Materiały działały świetnie zarówno w kampanii, jak i organicznie w social mediach.",
    avatar:
      "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&w=160&q=80",
  },
];

const VISIBLE_ON_DESKTOP = 3;

function getVisibleTestimonials(items: Testimonial[], startIndex: number, count: number) {
  return Array.from({ length: count }, (_, offset) => {
    const index = (startIndex + offset) % items.length;
    return items[index];
  });
}

export default function TestimonialsSection() {
  const [startIndex, setStartIndex] = useState(0);

  const desktopTestimonials = useMemo(
    () => getVisibleTestimonials(TESTIMONIALS, startIndex, VISIBLE_ON_DESKTOP),
    [startIndex],
  );
  const mobileTestimonial = TESTIMONIALS[startIndex % TESTIMONIALS.length];

  const showPrev = () => {
    setStartIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const showNext = () => {
    setStartIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  return (
    <section
      id="opinie"
      className="w-full scroll-mt-24 overflow-x-clip bg-background pb-20 pt-6 md:scroll-mt-28 md:pb-28"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="px-2 pb-6 pt-6 md:px-0 md:pt-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
            <article className="md:hidden">
              <header className="mb-5 grid min-h-[4.5rem] grid-cols-[4rem,1fr] items-center gap-4">
                <img
                  src={mobileTestimonial.avatar}
                  alt={mobileTestimonial.name}
                  className="h-16 w-16 rounded-full object-cover ring-1 ring-white/15"
                />
                <div className="min-w-0">
                  <h3 className="break-words text-lg font-semibold leading-tight tracking-tight text-foreground">
                    {mobileTestimonial.name}
                  </h3>
                  <p className="mt-1 text-sm leading-tight text-muted-foreground">
                    {mobileTestimonial.company}
                  </p>
                </div>
              </header>
              <div className="mb-4 text-lg tracking-[0.08em] text-[var(--cinematic-accent)]">
                {"★★★★★"}
              </div>
              <p className="h-[11rem] overflow-hidden break-words text-base leading-relaxed text-foreground/92">
                {mobileTestimonial.quote}
              </p>
            </article>

            {desktopTestimonials.map((testimonial) => (
              <article
                key={`${testimonial.name}-${testimonial.company}`}
                className="hidden h-full md:flex md:flex-col"
              >
                <header className="mb-5 grid min-h-[5rem] grid-cols-[4rem,1fr] items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-16 w-16 rounded-full object-cover ring-1 ring-white/15"
                  />
                  <div className="min-w-0">
                    <h3 className="break-words text-[1.38rem] font-semibold leading-tight tracking-tight text-foreground">
                      {testimonial.name}
                    </h3>
                    <p className="mt-1 text-[1.02rem] leading-tight text-muted-foreground">
                      {testimonial.company}
                    </p>
                  </div>
                </header>
                <div className="mb-4 text-xl tracking-[0.08em] text-[var(--cinematic-accent)]">
                  {"★★★★★"}
                </div>
                <p className="h-[11.5rem] overflow-hidden break-words text-[1.04rem] leading-relaxed text-foreground/90">
                  {testimonial.quote}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={showPrev}
              aria-label="Show previous testimonial"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/70 text-foreground transition hover:border-primary hover:text-primary"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden />
            </button>

            <button
              type="button"
              onClick={showNext}
              aria-label="Show next testimonial"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/70 text-foreground transition hover:border-primary hover:text-primary"
            >
              <ChevronRight className="h-6 w-6" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
