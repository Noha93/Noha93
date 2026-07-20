import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import slugify from "slugify";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await db.menuCategory.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(categories);
}

const categorySchema = z.object({ name: z.string().min(1), sortOrder: z.coerce.number().int().optional() });

export async function POST(req: NextRequest) {
  const parsed = categorySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const category = await db.menuCategory.create({
    data: { name: parsed.data.name, sortOrder: parsed.data.sortOrder ?? 0, slug: slugify(parsed.data.name, { lower: true }) },
  });
  return NextResponse.json(category, { status: 201 });
}
