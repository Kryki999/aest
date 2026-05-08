export type SocialLink = {
  href: string;
  label: string;
  icon: string;
  hoverColor?: string;
  hoverGradient?: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  { href: "#", label: "Instagram", icon: "simple-icons:instagram", hoverGradient: "linear-gradient(135deg,#f9ce34 0%,#ee2a7b 50%,#6228d7 100%)" },
  { href: "#", label: "YouTube", icon: "simple-icons:youtube", hoverColor: "#ff0033" },
  { href: "#", label: "LinkedIn", icon: "simple-icons:linkedin", hoverColor: "#0a66c2" },
  { href: "#", label: "X / Twitter", icon: "simple-icons:x", hoverColor: "#1d9bf0" },
  { href: "#", label: "Facebook", icon: "simple-icons:facebook", hoverColor: "#1877f2" },
];
