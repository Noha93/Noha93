import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://elbashawat.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "مطاعم البشوات | مشويات وأكلات شرقية",
    template: "%s | مطاعم البشوات",
  },
  description:
    "مطاعم البشوات — سلسلة مطاعم مشويات وأكلات شرقية. تصفح المنيو، اطلع على أحدث العروض، واطلب أونلاين من أقرب فرع ليك.",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "مطاعم البشوات",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-arabic min-h-screen flex flex-col text-brand-dark">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
