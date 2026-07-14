import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { TrustMarquee } from "@/components/sections/TrustMarquee";
import { CTA } from "@/components/sections/CTA";

export default function HomePreviewPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustMarquee />
        <Services />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
