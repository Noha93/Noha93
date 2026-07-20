import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify" ;
import { db } from "@/lib/db";

const itemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  categoryId: z.string().min(1),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await db.menuItem.findMany({ include: { category: true }, orderBy: { name: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const parsed = itemSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;

  const item = await db.menuItem.create({
    data: {
      ...data,
      imageUrl: data.imageUrl || undefined,
      slug: `${slugify(data.name, { lower: true })}-${Date.now().toString(36)}`,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
