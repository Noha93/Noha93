import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { TrustMarquee } from "@/components/sections/TrustMarquee";
import { Work } from "@/components/sections/Work";
import { CTA } from "@/components/sections/CTA";

export default function HomePreviewPage() {
  return (
    <>
      {/* Hero carries its own overlay nav, matching the full-bleed editorial
          reference layouts — no separate sticky bar stacked on top of it. */}
      <main>
        <Hero />
        <TrustMarquee />
        <Services />
        <Work />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
