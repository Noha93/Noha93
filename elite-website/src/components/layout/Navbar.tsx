import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

const links = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle/60 bg-canvas/70 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-text-primary">
          Elite<span className="text-accent-gold">.</span>
        </Link>
        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-accent-gold after:transition-all after:duration-300 hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <ButtonLink href="#contact" variant="gold" className="px-5 py-2.5 text-xs">
          Start Your Project
        </ButtonLink>
      </div>
    </header>
  );
}
