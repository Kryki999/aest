"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

import type { DispatchOrigin } from "../../newsfeed-data";

type DispatchBackButtonProps = {
  origin: DispatchOrigin;
  label?: string;
  className?: string;
};

function getBackTarget(origin: DispatchOrigin) {
  if (origin === "home") {
    return {
      href: "/#aktualnosci",
      label: "Wróć na stronę główną",
    };
  }

  return {
    href: "/aktualnosci",
    label: "Wróć do aktualności",
  };
}

export default function DispatchBackButton({
  origin,
  label,
  className,
}: DispatchBackButtonProps) {
  const target = getBackTarget(origin);

  return (
    <Link
      href={target.href}
      className={cn(
        "group inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        "outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <ArrowLeft
        className="size-4 transition-transform group-hover:-translate-x-1"
        strokeWidth={1.5}
        aria-hidden
      />
      {label ?? target.label}
    </Link>
  );
}
