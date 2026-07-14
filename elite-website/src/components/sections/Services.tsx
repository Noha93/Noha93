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
    <section id="services" className="relative border-t border-border-subtle py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-2xl">
          <p className="text-xs tracking-[0.2em] text-accent-gold uppercase">What we do</p>
          <h2 className="font-display mt-4 text-3xl font-semibold text-text-primary sm:text-4xl">
            Everything your product needs, under one senior team
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <RevealItem key={s.title}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group relative h-full overflow-hidden rounded-2xl border border-border-default bg-surface/60 p-7 transition-colors duration-300 hover:border-accent-primary-hover"
              >
                <div
                  className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(280px circle at 30% 20%, rgba(20,111,166,0.18), transparent 65%)",
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
