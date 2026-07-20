import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  phone: z.string().min(6).optional(),
  whatsapp: z.string().min(6).optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  openingTime: z.string().optional(),
  closingTime: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const branch = await db.branch.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json(branch);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await db.branch.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
