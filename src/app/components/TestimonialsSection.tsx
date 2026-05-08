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
    name: "Nina Ostrowska",
    company: "Nova Stage · wokalistka",
    quote:
      "Z Aest Media zrealizowaliśmy teledysk od pierwszego pomysłu po deliver na platformy. Ekipa pilnuje każdego detalu — światła, kadru i montażu — więc klip brzmi i wygląda dokładnie tak, jak sobie to wyobrażałam.",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Tomasz Grabowski",
    company: "Graviz · dyrektor kreatywny",
    quote:
      "Jako agencja szukaliśmy partnera produkcyjnego, który rozumie tempo kampanii. Aest Media dowozi spójny pakiet wideo i foto, dopina harmonogram i nie trzeba ich pilnować przy postprodukcji — po prostu wiemy, że materiał będzie gotowy na czas.",
    avatar:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Karolina Maj",
    company: "Bloom Atelier · założycielka",
    quote:
      "Sesja lookbook i krótkie formaty pod social zrobiły różnicę przy premierze kolekcji. Zespół Aest Media ma bardzo dobry gust wizualny i czuło się, że znają się na premium aesthetics od pierwszego dnia na planie.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Jakub Pawlak",
    company: "Atlas Motorsport · marketing",
    quote:
      "Potrzebowaliśmy dynamicznych ujęć z toru i montażu, który trzyma tempo jak dobry trailer. Aest Media ogarnęło całość — od logistyki po color — i dostarczyło nam zestaw klipów, który realnie podniósł zasięgi sponsorów.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
  },
  {
    name: "Ewa Lisiecka",
    company: "XOX Entertainment · producentka",
    quote:
      "Przy klipach dla artystów liczy się zaufanie i kultura planu. Współpraca z Aest Media jest jak z własnym studiem — rozumieją branding wykonawcy, pilnują legalów i dostarczają master, który jest gotowy od razu pod dystrybucję.",
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
