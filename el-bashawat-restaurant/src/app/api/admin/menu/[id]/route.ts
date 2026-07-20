import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  categoryId: z.string().min(1).optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const item = await db.menuItem.update({
    where: { id: params.id },
    data: { ...parsed.data, imageUrl: parsed.data.imageUrl || undefined },
  });
  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await db.menuItem.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
