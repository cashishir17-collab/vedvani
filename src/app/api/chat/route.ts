import { NextRequest, NextResponse } from "next/server";
import { resolveSession, applyGuestCookieIfNeeded } from "@/lib/session";
import { runChatTurn, isResponseMode } from "@/lib/chat";
import { withRequestLog } from "@/lib/requestLog";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  return withRequestLog({ path: "/api/chat", method: "POST" }, async () => {
    try {
      const session = await resolveSession();
      const body = await req.json();
      const message: string = (body?.message ?? "").toString().trim();
      const conversationId: string | undefined = body?.conversationId;
      const responseMode = isResponseMode(body?.responseMode) ? body.responseMode : "detailed";

      if (!message) {
        return NextResponse.json({ error: "message is required" }, { status: 400 });
      }

      const result = await runChatTurn({
        message,
        conversationId,
        responseMode,
        sessionOwner:
          session.type === "user" ? { type: "user", userId: session.userId } : { type: "guest", guestId: session.guestId },
      });

      const res = NextResponse.json({
        conversationId: result.conversationId,
        answer: result.answer,
        citations: result.citations,
      });

      applyGuestCookieIfNeeded(res, session);

      return res;
    } catch (err) {
      console.error("[/api/chat] error", err);
      return NextResponse.json({ error: "Internal error handling chat request." }, { status: 500 });
    }
  });
}
