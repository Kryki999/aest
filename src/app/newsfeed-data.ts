export type DispatchItem = {
  date: string;
  title: string;
  excerpt: string;
  href: string;
  /** Wide editorial thumbnail */
  image: string;
  imageAlt: string;
};

/** Wszystkie wpisy (np. szuflada w nagłówku). */
export const DISPATCH_ITEMS: DispatchItem[] = [
  {
    date: "2026-05-02",
    title: "Behind the curtain: grading our latest brand film",
    excerpt:
      "How we matched halation and grain to the client's analog references without losing digital clarity.",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Film projector light beam in a dark cinema space",
  },
  {
    date: "2026-04-18",
    title: "Studio notes — shooting tabletop at macro scale",
    excerpt:
      "Lighting shortcuts that keep products heroic while staying gentle on art department time.",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1542038784786-6ea353972eae?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Macro tabletop photography setup with soft reflections",
  },
  {
    date: "2026-03-30",
    title: "Sound design as storytelling",
    excerpt:
      "Three mixes we abandoned and what they taught us about pacing emotional beats.",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Vintage analog mixer knobs and meters",
  },
  {
    date: "2026-03-06",
    title: "Aest Dispatch · workflow upgrades",
    excerpt:
      "Shotlisting templates our producers actually use — pulled from the last twelve shoots.",
    href: "#",
    image:
      "https://images.unsplash.com/photo-1532629345429-a31842dfe024?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Director planning shots with notes on a film set",
  },
];
