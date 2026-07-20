import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  discountPct: z.coerce.number().int().min(1).max(100).optional(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const offer = await db.offer.update({
    where: { id: params.id },
    data: { ...parsed.data, imageUrl: parsed.data.imageUrl || undefined },
  });
  return NextResponse.json(offer);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await db.offer.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
