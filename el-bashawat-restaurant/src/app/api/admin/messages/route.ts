import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const messages = await db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json(messages);
}
