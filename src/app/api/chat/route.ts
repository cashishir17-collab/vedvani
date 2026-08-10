import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveSession, applyGuestCookieIfNeeded } from "@/lib/session";
import { retrievePassages } from "@/lib/retrieval";
import { getAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are VedVani, an assistant that answers questions about Hindu scripture and tradition (Vedas, Upanishads, Bhagavad Gita, Puranas).

Hard rules:
1. Only make scriptural claims that are grounded in the retrieved passages provided to you as context below. Do not invent verses, translations, or citations.
2. Cite each passage you rely on inline, in the form "(Source Work Location)", e.g. "(Bhagavad Gita 2.47)".
3. If none of the retrieved passages are a good match for the question, say so honestly. You may still offer a general-knowledge answer, but you MUST clearly label that portion "VedVani synthesis — not sourced from our scripture library."
4. Never claim divine authority, infallibility, or that your answers are the literal word of God. You are a fallible synthesis tool.
5. When traditions differ (e.g. Advaita vs. Vaishnavism vs. Shaivism vs. Shaktism), present them neutrally, side by side. Never rank one sampradaya as superior to another.
6. Distinguish clearly between: "Scripture says" (direct primary_text quotation), "Commentary/Tradition holds" (paraphrase_summary or traditional interpretation), "VedVani synthesis" (your own unsourced reasoning), and "Uncertain/disputed" (where scholarship or traditions disagree).

You will be given a list of retrieved passages, each with title, sourceWork, location, translationText, sourceType, attribution, and traditionTags. Ground your answer in these. Keep answers concise, warm, and respectful.`;

function buildContextBlock(passages: Awaited<ReturnType<typeof retrievePassages>>) {
  if (passages.length === 0) return "No passages were retrieved for this question.";
  return passages
    .map((p, i) => {
      return `[Passage ${i + 1}]
Title: ${p.title}
Source Work: ${p.sourceWork}
Location: ${p.location}
Source Type: ${p.sourceType}
Attribution: ${p.attribution}
Tradition Tags: ${p.traditionTags.join(", ") || "general"}
Text: ${p.translationText}`;
    })
    .join("\n\n");
}

export async function POST(req: NextRequest) {
  try {
    const session = await resolveSession();
    const body = await req.json();
    const message: string = (body?.message ?? "").toString().trim();
    let conversationId: string | undefined = body?.conversationId;

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    let conversation = conversationId
      ? await prisma.conversation.findUnique({ where: { id: conversationId } })
      : null;

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data:
          session.type === "user"
            ? { userId: session.userId, title: message.slice(0, 60) }
            : { guestSessionId: session.guestId, title: message.slice(0, 60) },
      });
    }
    conversationId = conversation.id;

    await prisma.message.create({
      data: { conversationId, role: "user", content: message },
    });

    const passages = await retrievePassages(message);
    const contextBlock = buildContextBlock(passages);

    let answer: string;
    try {
      const anthropic = getAnthropicClient();
      const response = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Retrieved passages:\n\n${contextBlock}\n\nUser question: ${message}`,
          },
        ],
      });
      const textBlock = response.content.find((b) => b.type === "text");
      answer = textBlock && "text" in textBlock ? textBlock.text : "I was unable to generate a response.";
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      answer = `VedVani synthesis unavailable right now: ${msg}. Here are the closest passages we found in our library:\n\n${passages
        .map((p) => `- ${p.title} (${p.sourceWork} ${p.location}): ${p.translationText}`)
        .join("\n")}`;
    }

    const assistantMessage = await prisma.message.create({
      data: { conversationId, role: "assistant", content: answer },
    });

    const citations = await Promise.all(
      passages.map((p) =>
        prisma.citation.create({
          data: {
            messageId: assistantMessage.id,
            corpusPassageId: p.id,
            snippet: p.translationText.slice(0, 240),
          },
          include: { corpusPassage: true },
        })
      )
    );

    const res = NextResponse.json({
      conversationId,
      answer,
      citations: citations.map((c) => ({
        id: c.id,
        title: c.corpusPassage!.title,
        sourceWork: c.corpusPassage!.sourceWork,
        location: c.corpusPassage!.location,
        sourceType: c.corpusPassage!.sourceType,
        attribution: c.corpusPassage!.attribution,
        traditionTags: c.corpusPassage!.traditionTags,
        snippet: c.snippet,
      })),
    });

    applyGuestCookieIfNeeded(res, session);

    return res;
  } catch (err) {
    console.error("[/api/chat] error", err);
    return NextResponse.json({ error: "Internal error handling chat request." }, { status: 500 });
  }
}
