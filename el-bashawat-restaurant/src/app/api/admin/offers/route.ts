import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const offerSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  discountPct: z.coerce.number().int().min(1).max(100).optional(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
  isActive: z.boolean().optional(),
});

export const dynamic = "force-dynamic";

export async function GET() {
  const offers = await db.offer.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(offers);
}

export async function POST(req: NextRequest) {
  const parsed = offerSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const offer = await db.offer.create({ data: { ...parsed.data, imageUrl: parsed.data.imageUrl || undefined } });
  return NextResponse.json(offer, { status: 201 });
}
