import { prisma } from "@/lib/prisma";

/**
 * Phase 11: lightweight request/observability logging.
 *
 * This is deliberately NOT a global Next.js middleware — it is a small
 * helper called explicitly from inside a handful of key API route
 * handlers (see src/app/api/chat/route.ts, src/app/api/bookmarks/route.ts,
 * src/app/api/reports/route.ts) so it can wrap existing logic with timing
 * without changing global request handling or risking unrelated routes.
 *
 * IMPORTANT (privacy): only path/method/status/timing metadata is ever
 * recorded. Never pass raw request bodies, messages, or any other
 * user-authored content into logRequest().
 */
export async function logRequest(params: {
  path: string;
  method: string;
  statusCode: number;
  durationMs: number;
}): Promise<void> {
  try {
    await prisma.requestLog.create({
      data: {
        path: params.path,
        method: params.method,
        statusCode: params.statusCode,
        durationMs: params.durationMs,
      },
    });
  } catch (err) {
    // Logging must never break the actual request/response cycle.
    console.error("[requestLog] failed to write request log", err);
  }
}

/**
 * Convenience wrapper: runs `handler`, times it, and logs the outcome
 * (success or thrown error) without altering the handler's return value
 * or swallowing thrown errors — the log is fire-and-forget relative to
 * the caller (awaited here, but failures inside logRequest are caught).
 */
export async function withRequestLog<T extends { status: number }>(
  params: { path: string; method: string },
  handler: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  try {
    const result = await handler();
    await logRequest({
      path: params.path,
      method: params.method,
      statusCode: result.status,
      durationMs: Date.now() - start,
    });
    return result;
  } catch (err) {
    await logRequest({
      path: params.path,
      method: params.method,
      statusCode: 500,
      durationMs: Date.now() - start,
    });
    throw err;
  }
}
