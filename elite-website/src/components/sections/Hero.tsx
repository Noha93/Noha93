"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { PointerEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export function Hero() {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const cardX = useSpring(useTransform(mx, [0, 1], [-14, 14]), { stiffness: 60, damping: 20 });
  const cardY = useSpring(useTransform(my, [0, 1], [-10, 10]), { stiffness: 60, damping: 20 });
  const cardX2 = useSpring(useTransform(mx, [0, 1], [10, -10]), { stiffness: 50, damping: 20 });
  const cardY2 = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 50, damping: 20 });
  const wordmarkX = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 40, damping: 24 });

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  return (
    <section
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-canvas"
    >
      {/* full-bleed backdrop */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 18% 0%, rgba(20,111,166,0.35), transparent 55%), radial-gradient(90% 70% at 88% 100%, rgba(203,165,61,0.22), transparent 60%), linear-gradient(180deg, #0b1220 0%, #101828 55%, #0a0f1a 100%)",
          }}
        />
        <div
          className="animate-drift-a absolute top-[-10%] left-[-10%] h-[70%] w-[70%] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--accent-primary), transparent 70%)" }}
        />
        <div
          className="animate-drift-b absolute right-[-15%] bottom-[-15%] h-[65%] w-[65%] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--accent-gold), transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(80% 60% at 50% 30%, black, transparent)",
          }}
        />
        <div className="bg-grain absolute inset-0" />
      </div>

      {/* oversized bleeding wordmark */}
      <motion.div
        style={{ x: wordmarkX }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-2.5vw] z-[1] flex justify-center select-none"
      >
        <span
          className="font-display leading-none font-semibold tracking-[-0.03em] whitespace-nowrap text-transparent"
          style={{
            fontSize: "clamp(6rem, 19vw, 15rem)",
            WebkitTextStroke: "1px rgba(247,251,253,0.14)",
          }}
        >
          ELITE
        </span>
      </motion.div>

      {/* minimal overlay nav */}
      <div className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-7xl items-center justify-between px-6 pt-8 lg:px-10">
        <span className="font-display text-lg font-semibold tracking-tight text-text-primary">
          Elite<span className="text-accent-gold">.</span>
        </span>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs tracking-[0.12em] text-text-secondary uppercase transition-colors hover:text-text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <span className="text-xs tracking-[0.12em] text-text-muted uppercase">Est. 2015</span>
      </div>

      {/* floating stat card */}
      <motion.div
        style={{ x: cardX, y: cardY }}
        initial={{ opacity: 0, y: 24, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: -3 }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[22%] right-6 z-20 w-44 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl lg:right-14"
      >
        <div className="font-display text-2xl font-semibold text-text-primary">98%</div>
        <div className="mt-1 text-[11px] text-text-secondary">Client retention, senior-only delivery</div>
      </motion.div>

      {/* floating preview card */}
      <motion.div
        style={{ x: cardX2, y: cardY2 }}
        initial={{ opacity: 0, y: 24, rotate: 2 }}
        animate={{ opacity: 1, y: 0, rotate: 2 }}
        transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="group absolute top-[42%] right-10 z-20 w-52 cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-colors hover:border-accent-gold/50 lg:right-24"
      >
        <div className="flex items-start justify-between">
          <span className="text-[11px] tracking-[0.1em] text-accent-gold uppercase">Latest work</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-text-muted transition-colors group-hover:text-accent-gold" />
        </div>
        <div className="mt-2 text-sm text-text-primary">A fintech platform rebuilt for scale</div>
      </motion.div>

      {/* foreground content */}
      <div className="relative z-10 w-full px-6 pb-16 lg:px-10 lg:pb-24">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-default bg-surface/50 px-4 py-1.5 text-xs tracking-wide text-accent-gold backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-accent-gold" />
            Senior-only software partner, trusted since 2015
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-3xl leading-[1.1] font-semibold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
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
            transition={{ duration: 0.7, delay: 0.38 }}
            className="mt-5 max-w-lg text-base leading-relaxed text-text-secondary lg:text-lg"
          >
            We design, build, and scale digital products — UI/UX, web, mobile, AI, and cloud —
            with a senior-only team that stays accountable long after launch.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <ButtonLink href="#contact" variant="gold" className="gap-2">
              Start Your Project
              <ArrowUpRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="#work" variant="outline">
              See Our Work
            </ButtonLink>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
