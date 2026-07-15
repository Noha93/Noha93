import type { ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "gold" | "outline" | "ghost";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-accent-primary text-white hover:bg-accent-primary-hover shadow-[0_0_0_1px_rgba(20,111,166,0.4)] hover:shadow-[0_0_28px_-4px_rgba(20,111,166,0.65)]",
  gold: "bg-accent-gold text-[#101828] hover:bg-accent-gold-hover shadow-[0_0_0_1px_rgba(203,165,61,0.4)] hover:shadow-[0_0_28px_-4px_rgba(203,165,61,0.55)]",
  outline:
    "border border-border-default text-text-primary hover:border-accent-gold hover:text-accent-gold bg-transparent",
  ghost: "text-text-secondary hover:text-text-primary bg-transparent",
};

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 ease-out active:scale-[0.97]";

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={cn(base, "shimmer", variantStyles[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className,
  children,
  href,
}: {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href} className={cn(base, "shimmer", variantStyles[variant], className)}>
      {children}
    </Link>
  );
}
