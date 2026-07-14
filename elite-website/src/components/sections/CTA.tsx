"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export function CTA() {
  return (
    <section
      id="contact"
      className="relative isolate flex min-h-[70vh] flex-col items-center justify-center overflow-hidden border-t border-border-subtle py-28 text-center"
    >
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 60% at 50% 0%, rgba(203,165,61,0.16), transparent 65%), linear-gradient(180deg, #0d1420 0%, #101828 100%)",
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
        className="pointer-events-none absolute inset-x-0 bottom-[-6%] z-0 flex justify-center select-none"
      >
        <span
          className="font-display leading-none font-semibold tracking-[-0.03em] whitespace-nowrap text-transparent"
          style={{
            fontSize: "clamp(5.5rem, 17vw, 14rem)",
            WebkitTextStroke: "1px rgba(203,165,61,0.14)",
          }}
        >
          LET&apos;S TALK
        </span>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 lg:px-10">
        <Reveal>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-default bg-surface/50 px-4 py-1.5 text-xs tracking-[0.15em] text-accent-gold uppercase backdrop-blur-sm">
            Start a project
          </p>
          <h2 className="font-display text-3xl font-semibold text-text-primary sm:text-4xl">
            Ready to build something worth shipping?
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Not sure where to start? Let&apos;s map it out together — free, no strings attached.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="#" variant="gold" className="gap-2">
              Start Your Project
              <ArrowUpRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="#" variant="outline">
              Talk to Our Team
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
