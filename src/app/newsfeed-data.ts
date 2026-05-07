export type DispatchItem = {
  date: string;
  title: string;
  excerpt: string;
  href: string;
};

export const DISPATCH_ITEMS: DispatchItem[] = [
  {
    date: "2026-05-02",
    title: "Behind the curtain: grading our latest brand film",
    excerpt:
      "How we matched halation and grain to the client's analog references without losing digital clarity.",
    href: "#",
  },
  {
    date: "2026-04-18",
    title: "Studio notes — shooting tabletop at macro scale",
    excerpt:
      "Lighting shortcuts that keep products heroic while staying gentle on art department time.",
    href: "#",
  },
  {
    date: "2026-03-30",
    title: "Sound design as storytelling",
    excerpt:
      "Three mixes we abandoned and what they taught us about pacing emotional beats.",
    href: "#",
  },
  {
    date: "2026-03-06",
    title: "Aest Dispatch · workflow upgrades",
    excerpt:
      "Shotlisting templates our producers actually use — pulled from the last twelve shoots.",
    href: "#",
  },
];
