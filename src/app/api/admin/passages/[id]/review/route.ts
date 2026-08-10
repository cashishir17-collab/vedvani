import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["unreviewed", "reviewed", "flagged"];

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { isAdmin } = await resolveAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const reviewStatus: string = (body?.reviewStatus ?? "").toString();

  if (!VALID_STATUSES.includes(reviewStatus)) {
    return NextResponse.json({ error: "invalid reviewStatus" }, { status: 400 });
  }

  const passage = await prisma.corpusPassage.update({
    where: { id: params.id },
    data: { reviewStatus },
  });

  return NextResponse.json({ passage });
}
