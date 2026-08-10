import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const { isAdmin } = await resolveAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const report = await prisma.userReport.update({
    where: { id: params.id },
    data: { status: "resolved" },
  });

  return NextResponse.json({ report });
}
