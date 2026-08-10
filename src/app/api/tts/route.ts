import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // ElevenLabs default sample voice ("Rachel")

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const body = await req.json();
    const text: string = (body?.text ?? "").toString().trim();

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json(
        {
          available: false,
          message: "Text-to-speech is unavailable: ELEVENLABS_API_KEY is not configured.",
        },
        { status: 200 }
      );
    }

    const voiceId = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;

    const elevenRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });

    if (!elevenRes.ok) {
      const errText = await elevenRes.text().catch(() => "");
      return NextResponse.json(
        { available: false, message: `TTS provider error: ${elevenRes.status} ${errText}`.slice(0, 500) },
        { status: 200 }
      );
    }

    const arrayBuffer = await elevenRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:audio/mpeg;base64,${base64}`;

    return NextResponse.json({ available: true, audioDataUrl: dataUrl });
  } catch (err) {
    console.error("[/api/tts] error", err);
    return NextResponse.json(
      { available: false, message: "Internal error generating speech." },
      { status: 200 }
    );
  }
}
