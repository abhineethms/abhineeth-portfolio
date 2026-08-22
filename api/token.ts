import type { VercelRequest, VercelResponse } from "@vercel/node";
import { allow, mintToken } from "./_mint.js";

/**
 * POST /api/token — mints a LiveKit token that joins a fresh room and dispatches the
 * AbhiAI agent into it. The client sends LiveKit's standard body shape; we ignore the
 * requested room_name on purpose (see _mint.ts).
 *
 * Reads LIVEKIT_* from Vercel env vars scoped to Production only, so preview
 * deployments cannot mint real tokens.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }
  const ip = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0].trim() ?? "unknown";
  if (!allow(ip)) {
    res.status(429).json({ error: "Too many sessions started. Please try again later." });
    return;
  }
  try {
    const result = await mintToken(process.env);
    res.status(200).json(result);
  } catch (err) {
    console.error("token mint failed:", err);
    res.status(500).json({ error: "Voice agent is not configured." });
  }
}
