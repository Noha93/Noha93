const names = [
  "Northwind Capital",
  "Aurora Health",
  "Ledger & Co.",
  "Vantage Retail",
  "Solace Travel",
  "Meridian Bank",
  "Palm & Pine",
  "Zenith Labs",
];

export function TrustMarquee() {
  const row = [...names, ...names];
  return (
    <section className="relative overflow-hidden border-t border-border-subtle py-10">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-canvas to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-canvas to-transparent" />
      <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-16">
        {row.map((n, i) => (
          <span key={i} className="text-lg font-medium tracking-wide whitespace-nowrap text-text-muted">
            {n}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
