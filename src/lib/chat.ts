import { prisma } from "@/lib/prisma";
import { retrievePassages } from "@/lib/retrieval";
import { getAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic";
import type { CorpusPassage } from "@prisma/client";

export const SYSTEM_PROMPT = `You are VedVani, an assistant that answers questions about Hindu scripture and tradition (Vedas, Upanishads, Bhagavad Gita, Puranas).

Hard rules:
1. Only make scriptural claims that are grounded in the retrieved passages provided to you as context below. Do not invent verses, translations, or citations.
2. Cite each passage you rely on inline, in the form "(Source Work Location)", e.g. "(Bhagavad Gita 2.47)".
3. If none of the retrieved passages are a good match for the question, say so honestly. You may still offer a general-knowledge answer, but you MUST clearly label that portion "VedVani synthesis — not sourced from our scripture library."
4. Never claim divine authority, infallibility, or that your answers are the literal word of God. You are a fallible synthesis tool.
5. When traditions differ (e.g. Advaita vs. Vaishnavism vs. Shaivism vs. Shaktism), present them neutrally, side by side. Never rank one sampradaya as superior to another.
6. Distinguish clearly between: "Scripture says" (direct primary_text quotation), "Commentary/Tradition holds" (paraphrase_summary or traditional interpretation), "VedVani synthesis" (your own unsourced reasoning), and "Uncertain/disputed" (where scholarship or traditions disagree).

You will be given a list of retrieved passages, each with title, sourceWork, location, translationText, sourceType, attribution, and traditionTags. Ground your answer in these. Keep answers concise, warm, and respectful.`;

// ---------------------------------------------------------------------------
// Safety pre-classifier (Phase 5). Lightweight keyword/regex checks, no
// extra API call. Order matters: self-harm short-circuits everything else.
// ---------------------------------------------------------------------------

const SELF_HARM_PATTERNS = [
  /want to die/i,
  /kill myself/i,
  /end my life/i,
  /ending my life/i,
  /giving up on everything/i,
  /no reason to live/i,
  /\bsuicide\b/i,
  /suicidal/i,
  /don'?t want to live/i,
  /better off dead/i,
];

const ASTROLOGY_CONTEXT_WORDS = /(horoscope|kundali|kundli|rashi|jyotish|astrolog|birth chart|zodiac)/i;
const ASTROLOGY_QUESTION_PATTERNS = [
  /will i die/i,
  /when will i (get married|die|become rich)/i,
  /will i (get married|become rich|pass|succeed|fail)/i,
  /am i going to (die|get married|become rich)/i,
];

const RITUAL_KEYWORDS = /(fasting|\bvrat\b|\bupvas\b)/i;
const MEDICAL_KEYWORDS = /(diabet|pregnan|heart condition|on medication|taking medication|blood pressure)/i;

const DISCRIMINATION_PATTERNS = [
  /caste.*(justified|deserve|inferior)/i,
  /(justified|deserve|inferior).*caste/i,
  /women.*(inferior|impure|not allowed)/i,
  /(inferior|impure|not allowed).*women/i,
];

export type SafetyClassification = {
  selfHarm: boolean;
  astrologyDeterminism: boolean;
  unsafeRitualMedical: boolean;
  discriminationValidation: boolean;
};

export function classifyMessageSafety(message: string): SafetyClassification {
  const selfHarm = SELF_HARM_PATTERNS.some((re) => re.test(message));
  const astrologyDeterminism =
    ASTROLOGY_CONTEXT_WORDS.test(message) && ASTROLOGY_QUESTION_PATTERNS.some((re) => re.test(message));
  const unsafeRitualMedical = RITUAL_KEYWORDS.test(message) && MEDICAL_KEYWORDS.test(message);
  const discriminationValidation = DISCRIMINATION_PATTERNS.some((re) => re.test(message));

  return { selfHarm, astrologyDeterminism, unsafeRitualMedical, discriminationValidation };
}

export const SELF_HARM_RESPONSE = `Thank you for trusting me with something this heavy. I'm really sorry you're feeling this way right now, and I want you to know that what you're going through matters.

I'm not able to provide the kind of support you deserve here — please consider reaching out to a mental health professional or a crisis helpline who can. If you're in India, you can call the KIRAN mental health helpline at 1800-599-0019 (toll-free, 24/7). If you're elsewhere, please look up a local crisis line, or reach out to someone you trust — a friend, family member, or doctor — right now.

You don't have to go through this alone, and reaching out for help is a sign of strength, not weakness. I'll be here if you want to talk about scripture or tradition another time, but right now, please take care of yourself first.`;

// ---------------------------------------------------------------------------
// Response modes (Phase 6 / BRD FR-CHAT-006). Adjusts the system prompt's
// style instructions; does not change the hard grounding/citation rules
// above, which always apply.
// ---------------------------------------------------------------------------

export type ResponseMode = "concise" | "detailed" | "child-friendly" | "academic" | "devotional";

export const RESPONSE_MODES: ResponseMode[] = ["concise", "detailed", "child-friendly", "academic", "devotional"];

export function isResponseMode(value: unknown): value is ResponseMode {
  return typeof value === "string" && (RESPONSE_MODES as string[]).includes(value);
}

const RESPONSE_MODE_INSTRUCTIONS: Record<ResponseMode, string> = {
  detailed:
    "Response style: detailed (default). Give a thorough, well-organized answer with enough context for a curious general reader.",
  concise:
    "Response style: concise. Answer in 2-3 sentences maximum. Be direct, skip preamble, and still cite sources inline.",
  "child-friendly":
    "Response style: child-friendly. Use simple words, short sentences, and a warm, encouraging tone suitable for a curious child (roughly age 8-12). Avoid jargon; briefly explain any Sanskrit terms you use. Keep citations, but explain them simply.",
  academic:
    "Response style: academic. Use precise terminology, note textual/historical context where relevant, and where appropriate reference the kind of scholarship or commentarial tradition that would discuss this point. Maintain a formal, careful register.",
  devotional:
    "Response style: devotional. Use a warmer, more reverent tone that honors the material as living tradition, while still being precise about sourcing and still including citations and the same honesty about synthesis vs. scripture vs. tradition.",
};

const CAVEAT_INSTRUCTION = `\n\nAdditional safety instruction for this response: The user's question touches on a sensitive area (deterministic predictions, ritual/fasting practice combined with a medical condition, or the scriptural status of caste/gender hierarchy). You must explicitly decline to make deterministic or certain claims (e.g. about fate, death, marriage, wealth, or medical safety). Name that Hindu traditions hold a plurality of views on this topic rather than one settled answer. Add clear safety caveats (e.g. recommend consulting a doctor before altering fasting/diet with a medical condition; note that historical caste/gender hierarchy is a matter of active ethical and scholarly debate, and that many modern teachers and traditions explicitly reject discriminatory readings). Do not validate discrimination as scripturally mandated.`;

function buildContextBlock(passages: CorpusPassage[]) {
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

// ---------------------------------------------------------------------------
// Citation verification (Phase 5). After Claude responds, look for
// citation-like patterns "(Source Work Location)" (as the system prompt
// instructs the model to produce) and flag any that don't match a
// retrieved passage's sourceWork/location/title.
// ---------------------------------------------------------------------------

const CITATION_PATTERN = /\(([A-Z][A-Za-z0-9.,'’\- ]{2,60}?)\s+([0-9][0-9.:\-]*)\)/g;

export function verifyCitations(answer: string, passages: CorpusPassage[]): string {
  const matches = Array.from(answer.matchAll(CITATION_PATTERN));
  if (matches.length === 0) return answer;

  let hasUnverified = false;
  for (const m of matches) {
    const sourceWork = m[1].trim();
    const location = m[2].trim();
    const found = passages.some((p) => {
      const sourceMatches = p.sourceWork.toLowerCase().includes(sourceWork.toLowerCase()) ||
        sourceWork.toLowerCase().includes(p.sourceWork.toLowerCase());
      const locationMatches = p.location.toLowerCase().includes(location.toLowerCase()) ||
        location.toLowerCase().includes(p.location.toLowerCase());
      const titleMatches = p.title.toLowerCase().includes(sourceWork.toLowerCase());
      return (sourceMatches && locationMatches) || titleMatches;
    });
    if (!found) {
      hasUnverified = true;
      break;
    }
  }

  if (hasUnverified) {
    return `${answer}\n\n[unverified citation — please double-check this reference]`;
  }
  return answer;
}

export type ChatTurnResult = {
  conversationId: string;
  answer: string;
  citations: Array<{
    id: string;
    title: string;
    sourceWork: string;
    location: string;
    sourceType: string;
    attribution: string;
    traditionTags: string[];
    snippet: string;
  }>;
  safety: SafetyClassification;
};

/**
 * Core chat turn logic, extracted from the /api/chat route handler so it
 * can also be exercised by /api/eval without going through HTTP.
 *
 * `sessionOwner` identifies who owns the (possibly newly created)
 * conversation, mirroring the resolveSession() union type but kept
 * decoupled from Next's cookie APIs so this function has no request/response
 * dependency.
 */
export async function runChatTurn(params: {
  message: string;
  conversationId?: string;
  sessionOwner: { type: "user"; userId: string } | { type: "guest"; guestId: string };
  persist?: boolean;
  responseMode?: ResponseMode;
}): Promise<ChatTurnResult> {
  const { message, sessionOwner } = params;
  const persist = params.persist !== false;
  const responseMode: ResponseMode = isResponseMode(params.responseMode) ? params.responseMode : "detailed";

  const safety = classifyMessageSafety(message);

  let conversationId = params.conversationId;

  if (persist) {
    let conversation = conversationId
      ? await prisma.conversation.findUnique({ where: { id: conversationId } })
      : null;

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data:
          sessionOwner.type === "user"
            ? { userId: sessionOwner.userId, title: message.slice(0, 60) }
            : { guestSessionId: sessionOwner.guestId, title: message.slice(0, 60) },
      });
    }
    conversationId = conversation.id;

    await prisma.message.create({
      data: { conversationId, role: "user", content: message },
    });
  }

  // Self-harm: short-circuit before any retrieval or Claude call.
  if (safety.selfHarm) {
    const answer = SELF_HARM_RESPONSE;

    if (persist && conversationId) {
      await prisma.message.create({
        data: { conversationId, role: "assistant", content: answer },
      });
    }

    return { conversationId: conversationId ?? "", answer, citations: [], safety };
  }

  const passages = await retrievePassages(message);
  const contextBlock = buildContextBlock(passages);

  let systemPrompt = SYSTEM_PROMPT + "\n\n" + RESPONSE_MODE_INSTRUCTIONS[responseMode];
  if (safety.astrologyDeterminism || safety.unsafeRitualMedical || safety.discriminationValidation) {
    systemPrompt += CAVEAT_INSTRUCTION;
  }

  let answer: string;
  try {
    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Retrieved passages:\n\n${contextBlock}\n\nUser question: ${message}`,
        },
      ],
    });
    const textBlock = response.content.find((b: any) => b.type === "text");
    answer = textBlock && "text" in textBlock ? textBlock.text : "I was unable to generate a response.";
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    answer = `VedVani synthesis unavailable right now: ${msg}. Here are the closest passages we found in our library:\n\n${passages
      .map((p) => `- ${p.title} (${p.sourceWork} ${p.location}): ${p.translationText}`)
      .join("\n")}`;
  }

  answer = verifyCitations(answer, passages);

  let citationsOut: ChatTurnResult["citations"] = [];

  if (persist && conversationId) {
    const assistantMessage = await prisma.message.create({
      data: { conversationId, role: "assistant", content: answer, responseMode },
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

    citationsOut = citations.map((c: any) => ({
      id: c.id,
      title: c.corpusPassage!.title,
      sourceWork: c.corpusPassage!.sourceWork,
      location: c.corpusPassage!.location,
      sourceType: c.corpusPassage!.sourceType,
      attribution: c.corpusPassage!.attribution,
      traditionTags: c.corpusPassage!.traditionTags,
      snippet: c.snippet,
    }));
  } else {
    citationsOut = passages.map((p) => ({
      id: p.id,
      title: p.title,
      sourceWork: p.sourceWork,
      location: p.location,
      sourceType: p.sourceType,
      attribution: p.attribution,
      traditionTags: p.traditionTags,
      snippet: p.translationText.slice(0, 240),
    }));
  }

  return { conversationId: conversationId ?? "", answer, citations: citationsOut, safety };
}
