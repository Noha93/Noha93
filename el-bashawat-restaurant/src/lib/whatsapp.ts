import { CartLine } from "./cart-store";

/**
 * Builds a wa.me deep link pre-filled with the order summary so the branch
 * receives a ready-to-confirm message the moment the customer taps "send".
 */
export function buildWhatsAppOrderLink(params: {
  branchWhatsapp: string;
  branchName: string;
  customerName: string;
  phone: string;
  address?: string;
  notes?: string;
  lines: CartLine[];
  total: number;
}): string {
  const { branchWhatsapp, branchName, customerName, phone, address, notes, lines, total } = params;

  const itemsText = lines.map((l) => `- ${l.name} × ${l.quantity} = ${l.price * l.quantity} ج.م`).join("\n");

  const message = [
    `طلب جديد من موقع مطاعم البشوات`,
    `الفرع: ${branchName}`,
    `الاسم: ${customerName}`,
    `التليفون: ${phone}`,
    address ? `العنوان: ${address}` : null,
    ``,
    itemsText,
    ``,
    `الإجمالي: ${total} ج.م`,
    notes ? `ملاحظات: ${notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const digitsOnly = branchWhatsapp.replace(/[^\d]/g, "");
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}
