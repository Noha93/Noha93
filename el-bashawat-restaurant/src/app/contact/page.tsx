import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: "تواصل مع فريق مطاعم البشوات لأي استفسار أو اقتراح أو شكوى.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">تواصل معنا</h1>
      <ContactForm />
    </div>
  );
}
