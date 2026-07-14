import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export function CTA() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-border-subtle py-24 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(600px circle at 50% 0%, rgba(203,165,61,0.14), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-10">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold text-text-primary sm:text-4xl">
            Ready to build something worth shipping?
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Not sure where to start? Let&apos;s map it out together — free, no strings attached.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="#" variant="gold">
              Start Your Project
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
