import type { Metadata } from "next";
import { db } from "@/lib/db";
import OrderClient from "@/components/OrderClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "اطلب أونلاين",
  description: "اطلب أونلاين من مطاعم البشوات — اختار الفرع وأكمل طلبك في دقيقة.",
};

export default async function OrderPage() {
  const branches = await db.branch.findMany({
    where: { isActive: true },
    select: { id: true, name: true, city: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">اطلب أونلاين</h1>
      <OrderClient branches={branches} />
    </div>
  );
}
