import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const branches = await db.branch.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
  return NextResponse.json(branches);
}
