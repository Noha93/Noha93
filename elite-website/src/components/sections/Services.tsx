"use client";

import { motion } from "framer-motion";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const services = [
  { icon: "🎨", title: "UI/UX Design", desc: "Research-led design systems that convert." },
  { icon: "🌐", title: "Web Platforms", desc: "Fast, resilient, SEO-ready web products." },
  { icon: "📱", title: "Mobile Apps", desc: "Native-quality iOS & Android experiences." },
  { icon: "🤖", title: "AI Integration", desc: "Practical AI features that ship real value." },
  { icon: "☁️", title: "Cloud & DevOps", desc: "Infrastructure that scales without drama." },
  { icon: "⚙️", title: "Systems Engineering", desc: "Complex backends built to last." },
];

export function Services() {
  return (
    <section id="services" className="relative overflow-hidden border-t border-border-subtle py-24 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(60% 50% at 85% 10%, black, transparent)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-border-default bg-surface/50 px-4 py-1.5 text-xs tracking-[0.15em] text-accent-gold uppercase backdrop-blur-sm">
              What we do
            </p>
            <h2 className="font-display mt-5 text-3xl font-semibold text-text-primary sm:text-4xl">
              Everything your product needs, under one senior team
            </h2>
          </div>
          <span className="font-display text-sm text-text-muted">01 — 06</span>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <RevealItem key={s.title}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group relative h-full overflow-hidden rounded-2xl border border-border-default bg-surface/60 p-7 transition-colors duration-300 hover:border-accent-gold/50"
              >
                <span className="font-display pointer-events-none absolute top-3 right-4 text-4xl font-semibold text-white/[0.05] transition-colors duration-300 group-hover:text-accent-gold/[0.12]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div
                  className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(280px circle at 30% 20%, rgba(203,165,61,0.14), transparent 65%)",
                  }}
                />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-accent-primary/10 text-2xl transition-transform duration-300 group-hover:scale-110">
                  {s.icon}
                </div>
                <h3 className="relative mt-5 text-lg font-medium text-text-primary">{s.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-text-secondary">{s.desc}</p>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
