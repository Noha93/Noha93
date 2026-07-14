const links = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border-subtle bg-canvas py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <span className="font-display text-lg text-text-secondary">
          Elite<span className="text-accent-gold">.</span>
        </span>
        <nav className="flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs tracking-[0.12em] text-text-muted uppercase transition-colors hover:text-text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <span className="text-xs text-text-muted">
          © {new Date().getFullYear()} Elite Software House. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
