import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const branchSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  phone: z.string().min(6),
  whatsapp: z.string().min(6),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  openingTime: z.string(),
  closingTime: z.string(),
  isActive: z.boolean().optional(),
});

export const dynamic = "force-dynamic";

export async function GET() {
  const branches = await db.branch.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(branches);
}

export async function POST(req: NextRequest) {
  const parsed = branchSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const branch = await db.branch.create({ data: parsed.data });
  return NextResponse.json(branch, { status: 201 });
}
