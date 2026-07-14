"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { PointerEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

const stats = [
  { value: "3.2x", label: "Faster checkout flow" },
  { value: "40%", label: "Lower infra cost" },
  { value: "99.9%", label: "Uptime since launch" },
];

export function Work() {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const cardX = useSpring(useTransform(mx, [0, 1], [-12, 12]), { stiffness: 60, damping: 20 });
  const cardY = useSpring(useTransform(my, [0, 1], [-8, 8]), { stiffness: 60, damping: 20 });

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  return (
    <section
      id="work"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      className="relative isolate flex min-h-[92vh] items-center overflow-hidden border-t border-border-subtle bg-canvas"
    >
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(85% 65% at 82% 20%, rgba(203,165,61,0.20), transparent 60%), radial-gradient(70% 60% at 10% 90%, rgba(20,111,166,0.28), transparent 60%), linear-gradient(160deg, #0a0f1a 0%, #101828 60%, #0d1420 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(70% 60% at 70% 40%, black, transparent)",
          }}
        />
        <div className="bg-grain absolute inset-0" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 z-0 flex -translate-y-1/2 justify-start select-none"
      >
        <span
          className="font-display leading-none font-semibold tracking-[-0.03em] whitespace-nowrap text-transparent"
          style={{
            fontSize: "clamp(5rem, 16vw, 13rem)",
            WebkitTextStroke: "1px rgba(247,251,253,0.12)",
            marginLeft: "-2vw",
          }}
        >
          VANTAGE
        </span>
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-default bg-surface/50 px-4 py-1.5 text-xs tracking-[0.15em] text-accent-gold uppercase backdrop-blur-sm"
            >
              Featured case study
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-2xl leading-snug font-semibold text-text-primary sm:text-3xl lg:text-4xl"
            >
              A retail platform rebuilt for scale, speed, and checkout that never drops a sale
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.24 }}
              className="mt-8"
            >
              <ButtonLink href="#contact" variant="outline" className="gap-2">
                View Case Study
                <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
            </motion.div>
          </div>

          <div className="flex flex-col gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                style={i === 0 ? { x: cardX, y: cardY } : undefined}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl"
              >
                <span className="font-display text-2xl font-semibold text-text-primary">{s.value}</span>
                <span className="max-w-[10rem] text-right text-xs text-text-secondary">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute right-6 bottom-8 z-10 flex items-center gap-2 text-xs tracking-widest text-text-muted lg:right-10">
        <span className="text-text-primary">01</span>
        <span className="h-px w-6 bg-border-default" />
        <span>04</span>
      </div>
    </section>
  );
}
