import type { Metadata } from "next";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة",
  description: "إجابات على أكثر الأسئلة شيوعاً عن الطلب والتوصيل والفروع في مطاعم البشوات.",
};

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const faqs = await db.faqItem.findMany({ orderBy: { sortOrder: "asc" } });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">الأسئلة الشائعة</h1>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <details key={faq.id} className="rounded-xl bg-white p-4 shadow-sm">
            <summary className="font-bold cursor-pointer">{faq.question}</summary>
            <p className="mt-2 text-brand-dark/70">{faq.answer}</p>
          </details>
        ))}
        {faqs.length === 0 && <p className="text-brand-dark/60">هنضيف الأسئلة الشائعة قريباً.</p>}
      </div>
      {faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </div>
  );
}
