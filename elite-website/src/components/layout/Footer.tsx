export function Footer() {
  return (
    <footer className="border-t border-border-subtle py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-text-muted sm:flex-row lg:px-10">
        <span className="font-display text-text-secondary">
          Elite<span className="text-accent-gold">.</span>
        </span>
        <span>© {new Date().getFullYear()} Elite Software House. All rights reserved.</span>
      </div>
    </footer>
  );
}
