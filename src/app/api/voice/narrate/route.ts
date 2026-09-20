import { z } from "zod";

export const runtime = "nodejs";

const narrationSchema = z.object({ text: z.string().trim().min(1).max(5_000) });

/** Uses the cafe's authorized HeyGen voice profile; the app never uploads a voice sample. */
export async function POST(req: Request) {
  const parsed = narrationSchema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: "Invalid narration" }, { status: 400 });

  const apiKey = process.env.HEYGEN_API_KEY;
  const voiceId = process.env.HEYGEN_VOICE_ID;
  if (!apiKey || !voiceId) return Response.json({ error: "HeyGen voice is not configured" }, { status: 503 });

  const speechResponse = await fetch("https://api.heygen.com/v3/voices/speech", {
    method: "POST",
    headers: { "x-api-key": apiKey, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ text: parsed.data.text, voice_id: voiceId, input_type: "text", speed: 0.92, language: "en", locale: "en-IN" }),
    cache: "no-store"
  });
  if (!speechResponse.ok) return Response.json({ error: "HeyGen narration is temporarily unavailable" }, { status: 502 });

  const speechPayload = await speechResponse.json() as { data?: { audio_url?: string }; audio_url?: string };
  const audioUrl = speechPayload.data?.audio_url || speechPayload.audio_url;
  if (!audioUrl) return Response.json({ error: "HeyGen did not return audio" }, { status: 502 });

  const audioResponse = await fetch(audioUrl, { cache: "no-store" });
  if (!audioResponse.ok || !audioResponse.body) return Response.json({ error: "Generated audio is unavailable" }, { status: 502 });
  return new Response(audioResponse.body, { headers: { "content-type": audioResponse.headers.get("content-type") || "audio/mpeg", "cache-control": "no-store" } });
}