import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

/**
 * Lazily construct the Anthropic client. Missing API key never crashes the
 * module import / build — it only throws when a caller actually tries to
 * make a request at runtime, with a clean, catchable error.
 */
export function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured. Set it in your environment to enable VedVani's answer generation."
    );
  }
  if (!client) {
    client = new Anthropic({ apiKey });
  }
  return client;
}

export const CLAUDE_MODEL = "claude-sonnet-4-5-20250929";
