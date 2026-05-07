import type { IconProps } from "@tabler/icons-react";
import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export type SocialIcon = ForwardRefExoticComponent<
  IconProps & RefAttributes<SVGSVGElement>
>;

export type SocialLink = {
  href: string;
  label: string;
  Icon: SocialIcon;
};

export const SOCIAL_LINKS: SocialLink[] = [
  { href: "#", label: "X / Twitter", Icon: IconBrandX },
  { href: "#", label: "LinkedIn", Icon: IconBrandLinkedin },
  { href: "#", label: "GitHub", Icon: IconBrandGithub },
  { href: "#", label: "Facebook", Icon: IconBrandFacebook },
  { href: "#", label: "Instagram", Icon: IconBrandInstagram },
];
