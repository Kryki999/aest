export type DispatchOrigin = "home" | "blog";

export type DispatchItem = {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  body: string[];
};

const MONTHS_PL = [
  "stycznia",
  "lutego",
  "marca",
  "kwietnia",
  "maja",
  "czerwca",
  "lipca",
  "sierpnia",
  "września",
  "października",
  "listopada",
  "grudnia",
] as const;

export function formatDispatchDate(dateString: string): string {
  const date = new Date(`${dateString}T12:00:00`);
  const day = date.getDate();
  const month = MONTHS_PL[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function getDispatchHref(
  slug: string,
  from: DispatchOrigin = "blog",
): string {
  return `/aktualnosci/${slug}?from=${from}`;
}

export function getDispatchBySlug(slug: string): DispatchItem | undefined {
  return DISPATCH_ITEMS.find((item) => item.slug === slug);
}

export function estimateReadTime(body: string[]): number {
  const wordCount = body.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/** Wszystkie wpisy (szuflada, filmstrip, podstrony). */
export const DISPATCH_ITEMS: DispatchItem[] = [
  {
    slug: "grading-filmu-reklamowego",
    date: "2026-05-02",
    title: "Za kulisami: grading naszego najnowszego filmu reklamowego",
    excerpt:
      "Jak dopasowaliśmy halację i ziarno do analogowych referencji klienta, nie tracąc cyfrowej czystości obrazu.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Wiązka światła projektora w ciemnym kinie",
    body: [
      "Klient przyszedł do nas z folderem referencji na klisze 35 mm — ciepłe halacje w highlightach, delikatne ziarno i miękkie przejścia w cieniach. Wyzwaniem nie było „zrobić ładnie”, tylko odtworzyć emocję materiału analogowego w pipeline’ie w pełni cyfrowym.",
      "Zaczęliśmy od neutralnego grade’u i mapy kontrastu opartej o skin tone line. Dopiero potem dokładaliśmy warstwy halacji i grainu — każda z osobną maską, żeby nie zabijać detalu w twarzach i produkcie. Kluczowe okazało się trzymanie czystości w środkowych tonach: tam marka musiała wyglądać premium, a nie „retro dla retro”.",
      "W postprodukcji użyliśmy kombinacji power windowów na źródła światła i selektywnego blura w miksie halacji. Ziarno skalowaliśmy per plan — szerokie ujęcia dostały grubszą strukturę, zbliżenia prawie czyste, żeby zachować wizerunek twarzy.",
      "Efekt końcowy przeszedł akceptację klienta bez większych poprawek. Największą lekcją z tego projektu jest to, że analogowy charakter to nie filtr na końcu, tylc decyzje podejmowane już na planie — od strobing po wybór dyfuzora.",
    ],
  },
  {
    slug: "makro-ujecia-produktow",
    date: "2026-04-18",
    title: "Notatki ze studia — makro ujęcia produktów na stole",
    excerpt:
      "Triki oświetleniowe, które podkreślają produkt, a jednocześnie oszczędzają czas działu artystycznego.",
    image: "/doranahd.webp",
    imageAlt: "Kadr z produkcji — materiał promocyjny studia",
    body: [
      "Tabletop w makro to zawsze wyścig z głębią ostrości i refleksami. Na ostatniej sesji produktowej mieliśmy trzy warianty szkła, matowe opakowanie i metaliczne akcenty — wszystko w jednym kadrze hero.",
      "Zamiast walczyć z odbiciami na postprodukcji, postawiliśmy na duży softbox z boku i cienki strip light od góry. Wypełnienie zrobiła biała płyta po przeciwnej stronie, odsunięta tak, żeby nie wypłaszczać tekstury. Dzięki temu art department miał mniej poprawek między ujęciami.",
      "Przy makro używamy stałej checklisty: czystość powierzchni, kierunek kurzu (tak, to też widać), test ostrości na najmniejszym detalu logotypu. Każdy setup fotografuje się najpierw na szarym chartcie — oszczędza to późniejsze poprawki koloru.",
      "Jeśli planujesz podobną sesję, rezerwuj czas na test światła zanim wejdzie produkt finalny. Te dwadzieścia minut na początku zwracają się w postprodukcji wielokrotnie.",
    ],
  },
  {
    slug: "sound-design-jako-opowiesc",
    date: "2026-03-30",
    title: "Sound design jako opowieść",
    excerpt:
      "Trzy miksy, które odrzuciliśmy — i czego nauczyły nas o budowaniu emocjonalnego rytmu.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Analogowa konsola mikserska — pokrętła i wskaźniki",
    body: [
      "Dźwięk często traktujemy jak ostatnią warstwę, a na tym projekcie klient poprosił nas, żeby mix prowadził emocję tak samo mocno jak obraz. Mieliśmy trzy wersje — i każda uczyła nas czegoś innego.",
      "Pierwsza była zbyt „kinowa”: głośne uderzenia i gęsty low-end zagłuszały dialog. Druga poszła w minimalizm — cisza działała w pierwszych sekundach, ale traciła energię w finale. Dopiero trzecia wersja znalazła rytm: cichszy intro, stopniowe dokładanie warstw percepcyjnych, payoff w ostatnich pięciu sekundach.",
      "Kluczem okazało się mapowanie dźwięku do storyboardu beat po beat. Każdy punkt zwrotny dostał własny motyw — nawet jeśli słyszalny tylko przez ułamek sekundy. To pozwoliło montażyście ciąć obraz bez walki z muzyką.",
      "Dziś na każdym większym projekcie prosimy o wczesny draft mixu jeszcze przed finalnym grade’em. Obraz i dźwięk muszą rosnąć razem, nie obok siebie.",
    ],
  },
  {
    slug: "aest-dispatch-workflow",
    date: "2026-03-06",
    title: "Usprawnienia workflow w produkcji",
    excerpt:
      "Szablony shot listy, z których nasi producenci naprawdę korzystają — zebrane z ostatnich dwunastu planów zdjęciowych.",
    image: "/faqaest-cropped.webp",
    imageAlt: "Planowanie ujęć i notatki produkcyjne na planie filmowym",
    body: [
      "Po dwunastu produkcjach w Q1 zebraliśmy powtarzające się problemy: rozjechane shot listy, brak wersji B dla lokacji outdoor i zbyt późne domykanie listy sprzętu. Stąd pomysł na wewnętrzny zestaw szablonów, który dziś udostępniamy też klientom.",
      "Każdy plan zaczyna się od trzech bloków: must-have kadry, nice-to-have i rezerwowe ujęcia pogodowe. Producenci oznaczają priorytety kolorem — czerwony musi paść tego dnia, żółty przesuwamy, zielony to bonus. Proste, ale eliminuje 80% chaosu na planie.",
      "Do tego checklista sprzętu w wersji mobile: kto podpisuje wypożyczenie, kto robi backup kart i gdzie ląduje footage po wrapie. Br brzmi oczywiste, dopóki nie ma piętnastu osób na planie i dwóch lokacji tego samego dnia.",
      "Szablony są żywe — aktualizujemy je po każdej większej produkcji. Jeśli chcesz je zobaczyć w praktyce, napisz do nas przy briefie — dołączymy PDF dopasowany do skali Twojego projektu.",
    ],
  },
];
