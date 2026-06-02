export type SocialLink = {
  href: string;
  label: string;
  icon: string;
  hoverColor?: string;
  hoverGradient?: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://www.instagram.com/aestmediapl/",
    label: "Instagram",
    icon: "simple-icons:instagram",
    hoverGradient:
      "linear-gradient(135deg,#f9ce34 0%,#ee2a7b 50%,#6228d7 100%)",
  },
];
