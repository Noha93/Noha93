import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "../globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elite — Senior Software Partner for Ambitious Brands",
  description:
    "We design, build, and scale digital products — UI/UX, web, mobile, AI, and cloud — with a senior-only team that stays accountable long after launch.",
};

export default function HomePreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${playfair.variable} ${inter.variable} elite-scope min-h-screen font-sans`}>
      {children}
    </div>
  );
}
