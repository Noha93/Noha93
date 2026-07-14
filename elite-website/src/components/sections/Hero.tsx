"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { PointerEvent } from "react";
import { AmbientBackground } from "@/components/motion/AmbientBackground";
import { ButtonLink } from "@/components/ui/Button";

const stats = [
  { value: "120+", label: "Products shipped" },
  { value: "98%", label: "Client retention" },
  { value: "11 yrs", label: "Senior-only team" },
];

export function Hero() {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 120, damping: 18 });
  const glowX = useSpring(useTransform(mx, [0, 1], [-20, 20]), { stiffness: 80, damping: 20 });
  const glowY = useSpring(useTransform(my, [0, 1], [-20, 20]), { stiffness: 80, damping: 20 });

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  return (
    <section className="relative isolate overflow-hidden pt-20 pb-28 lg:pt-28 lg:pb-36">
      <AmbientBackground />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-default bg-surface/60 px-4 py-1.5 text-xs tracking-wide text-accent-gold"
          >
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-accent-gold" />
            Senior-only software partner, trusted since 2015
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl leading-[1.08] font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
          >
            The Software Partner{" "}
            <span className="bg-gradient-to-r from-accent-gold via-amber-300 to-accent-gold bg-clip-text text-transparent">
              Ambitious Brands
            </span>{" "}
            Actually Trust
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-text-secondary"
          >
            We design, build, and scale digital products — UI/UX, web, mobile, AI, and cloud —
            with a senior-only team that stays accountable long after launch.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <ButtonLink href="#contact" variant="gold">
              Start Your Project
            </ButtonLink>
            <ButtonLink href="#work" variant="outline">
              See Our Work
            </ButtonLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-border-subtle pt-8"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-2xl font-semibold text-text-primary">{s.value}</div>
                <div className="mt-1 text-xs text-text-muted">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => {
            mx.set(0.5);
            my.set(0.5);
          }}
          style={{ perspective: 1200 }}
          className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg"
        >
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="relative h-full w-full rounded-[2rem] border border-border-default/80 bg-gradient-to-br from-surface-alt/80 to-surface/40 shadow-2xl backdrop-blur-sm"
          >
            <motion.div
              style={{ x: glowX, y: glowY }}
              className="pointer-events-none absolute -inset-10 rounded-[2.5rem] bg-[radial-gradient(circle_at_center,rgba(203,165,61,0.28),transparent_65%)] blur-2xl"
            />
            <div className="absolute inset-6 flex flex-col justify-between rounded-2xl border border-border-subtle bg-canvas/60 p-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-primary/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-gold/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                </div>
                <span className="text-[10px] tracking-widest text-text-muted">ELITE / LIVE</span>
              </div>

              <div className="space-y-3">
                {[62, 88, 45, 74].map((w, i) => (
                  <motion.div
                    key={i}
                    initial={{ width: 0 }}
                    animate={{ width: `${w}%` }}
                    transition={{ duration: 1.1, delay: 0.6 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="h-2.5 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary"
                  />
                ))}
              </div>

              <div className="flex items-end gap-2">
                {[40, 70, 55, 90, 65, 80].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.9, delay: 0.9 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full rounded-t-sm bg-gradient-to-t from-accent-gold/80 to-accent-gold/20"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
