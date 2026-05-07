"use client";

import { Accordion } from "@base-ui/react/accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type FaqEntry = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_ITEMS: FaqEntry[] = [
  {
    id: "1",
    question: "Czym konkretnie zajmuje się Aest Media?",
    answer:
      "Łączymy koncepcję, produkcję foto i wideo oraz post — od jednego rolloutu kampanii po dedykowany content pod social i artystów. Możemy poprowadzić cały pipeline albo wsunąć się w konkretny etap, jeśli agencja już trzyma kierunek kreatywny.",
  },
  {
    id: "2",
    question: "Jak wygląda proces od briefu do finalu?",
    answer:
      "Startujemy od rozmowy o celach i piętnie marce. Potem: propozycja kierunków, konsultacja kosztów/timeline’u, produkcja na planie lub w studio, selekcja, montaż / retusz / grading, paczka plików do publikacji. Na każdym etapie jest jedna osoba kontaktowa po naszej stronie.",
  },
  {
    id: "3",
    question: "Czy realizujecie projekty poza Polską?",
    answer:
      "Tak — travel i zdalna postprodukcja są standardem. Harmonogram zawiera logistykę kadru lub przesyłkę materiału do obróbki. Szczegóły praw/licencji ustalamy przy briefie.",
  },
  {
    id: "4",
    question: "Ile czasu zajmuje typowy rollout?",
    answer:
      "To zależy od formatu — krótki spot reklamowy to inna kalendaryczka niż sesja stylizowana ze stop-motion. Podajemy konkretny harmonogram już przy wycenie, żebyś nie został z napisem „orientacyjnie dwa tygodnie” bez kolejnych punktów kontrolnych.",
  },
  {
    id: "5",
    question: "Czy współpracujecie z artystami i labelami?",
    answer:
      "Tak. Mamy zaplecze pod teledyski, teasingi, backstage’y i rollout streamingu. Zakres praw muzycznych i sync omawiamy przed kręceniem, żeby nic nie blokowało publikacji.",
  },
  {
    id: "6",
    question: "Jak mogę zlecić projekt?",
    answer:
      "Napisz z krótkim opisem marki / materiału, budżetem orientacyjnym i terminem docelowym — wrócimy z propozycją kierunku i kolejnym krokiem. Jeśli wolisz, możemy zacząć od calla 20 min bez zobowiązań.",
  },
];

export default function FaqAccordionSection() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="relative w-screen max-w-none border-t border-border bg-background pb-24 pt-20 text-foreground md:pb-32 md:pt-28 lg:pb-36 lg:pt-32"
      style={{ marginInline: "calc(50% - 50vw)" }}
    >
      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-14 xl:px-16">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-start lg:gap-x-12 lg:gap-y-0 xl:gap-x-16">
          <header className="lg:sticky lg:top-28 lg:min-h-0 lg:self-start">
            <h2
              id="faq-heading"
              className="max-w-[12ch] text-balance text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl lg:max-w-none lg:text-5xl xl:text-6xl"
            >
              <span className="block">Najczęściej zadawane</span>
              <span className="block text-[var(--cinematic-accent)]">pytania</span>
            </h2>
          </header>

          <div className="lg:min-h-0">
            <Accordion.Root multiple={false} keepMounted className="flex flex-col">
              {FAQ_ITEMS.map((item, index) => (
                <Accordion.Item
                  key={item.id}
                  value={item.id}
                  className={cn(
                    "group border-b border-border",
                    index === 0 && "border-t border-border",
                  )}
                >
                  <Accordion.Header>
                    <Accordion.Trigger
                      className={cn(
                        "flex w-full cursor-pointer items-start gap-4 py-7 text-left outline-none md:gap-5 md:py-8",
                        "transition-[color] hover:text-foreground",
                        "focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      )}
                    >
                      <Plus
                        aria-hidden
                        strokeWidth={2.5}
                        className={cn(
                          "mt-1 size-[1.125rem] shrink-0 text-primary md:size-5",
                          "transition-transform duration-300 ease-out",
                          "group-data-[open]:rotate-45",
                        )}
                      />
                      <span className="min-w-0 flex-1 text-[15px] font-medium leading-snug tracking-tight text-foreground md:text-base lg:text-lg">
                        {item.question}
                      </span>
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Panel
                    className={cn(
                      "h-[var(--accordion-panel-height)] overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]",
                      "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
                    )}
                  >
                    <div className="flex gap-4 pb-7 md:gap-5 md:pb-8">
                      {/* kolumna pod ikonę „+“, żeby odpowiedź startowała jak tekst pytania */}
                      <span
                        aria-hidden
                        className="w-[1.125rem] shrink-0 pt-1 md:w-5 md:pt-0"
                      />
                      <p className="min-w-0 flex-1 text-pretty text-[15px] leading-relaxed text-muted-foreground md:text-base">
                        {item.answer}
                      </p>
                    </div>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </div>
      </div>
    </section>
  );
}
