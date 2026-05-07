import type { Metadata } from "next";
import { Inter, Noto_Serif, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AestMedia",
  description: "Artistic website concept",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark h-full",
        "overflow-x-clip",
        "antialiased",
        inter.variable,
        notoSerif.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="flex min-h-full max-w-full flex-col overflow-x-clip">{children}</body>
    </html>
  );
}
