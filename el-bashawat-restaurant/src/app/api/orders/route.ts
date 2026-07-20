import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";

const orderSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(8),
  address: z.string().optional(),
  notes: z.string().optional(),
  branchId: z.string().min(1),
  lines: z.array(z.object({ menuItemId: z.string(), quantity: z.number().int().positive() })).min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { customerName, phone, address, notes, branchId, lines } = parsed.data;

  const branch = await db.branch.findUnique({ where: { id: branchId } });
  if (!branch || !branch.isActive) {
    return NextResponse.json({ error: "الفرع غير متاح حالياً" }, { status: 400 });
  }

  // Re-price every line from the database — never trust prices sent by the client.
  const menuItems = await db.menuItem.findMany({
    where: { id: { in: lines.map((l) => l.menuItemId) }, isAvailable: true },
  });
  const menuItemById = new Map(menuItems.map((m) => [m.id, m]));

  const verifiedLines = lines.flatMap((line) => {
    const item = menuItemById.get(line.menuItemId);
    if (!item) return [];
    return [{ menuItemId: item.id, name: item.name, price: Number(item.price), quantity: line.quantity }];
  });

  if (verifiedLines.length === 0) {
    return NextResponse.json({ error: "الأصناف المطلوبة غير متاحة" }, { status: 400 });
  }

  const total = verifiedLines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  const order = await db.order.create({
    data: {
      customerName,
      phone,
      address,
      notes,
      branchId,
      total,
      items: {
        create: verifiedLines.map((l) => ({
          menuItemId: l.menuItemId,
          quantity: l.quantity,
          unitPrice: l.price,
        })),
      },
    },
  });

  const whatsappUrl = buildWhatsAppOrderLink({
    branchWhatsapp: branch.whatsapp,
    branchName: branch.name,
    customerName,
    phone,
    address,
    notes,
    lines: verifiedLines,
    total,
  });

  return NextResponse.json({ orderId: order.id, whatsappUrl });
}
