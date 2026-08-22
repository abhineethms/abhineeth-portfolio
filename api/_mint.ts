// Shared by api/token.ts (Vercel) and the Vite dev middleware (vite.config.ts).
// Underscore-prefixed files under api/ are not deployed as functions by Vercel.
import { AccessToken, RoomConfiguration } from "livekit-server-sdk";

/** Dispatch name the agent registers under. Must match agent_name in AbhiAI/src/agent.py. */
export const AGENT_NAME = "AbhiAI";

/** Seconds an empty room lives: covers a token minted but never used. */
const EMPTY_TIMEOUT_S = 60;
/** Backstop after the last participant leaves; the agent deletes the room itself on close. */
const DEPARTURE_TIMEOUT_S = 10;

export interface MintResult {
  server_url: string;
  participant_token: string;
  room_name: string;
}

export async function mintToken(env: Record<string, string | undefined>): Promise<MintResult> {
  const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = env;
  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    throw new Error("LIVEKIT_URL / LIVEKIT_API_KEY / LIVEKIT_API_SECRET are not configured");
  }

  // Server-chosen, always fresh: LiveKit dispatches the agent only when a room is
  // created, so reusing a room name would silently connect to a room with no agent.
  const suffix = Math.random().toString(36).slice(2, 8);
  const roomName = `portfolio-${Date.now().toString(36)}-${suffix}`;
  const identity = `visitor-${suffix}`;

  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity,
    name: "Visitor",
    ttl: "10m",
  });
  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });
  at.roomConfig = new RoomConfiguration({
    emptyTimeout: EMPTY_TIMEOUT_S,
    departureTimeout: DEPARTURE_TIMEOUT_S,
    agents: [{ agentName: AGENT_NAME }],
  });

  return {
    server_url: LIVEKIT_URL,
    participant_token: await at.toJwt(),
    room_name: roomName,
  };
}

// --- Rate limiting ---------------------------------------------------------------
// Fixed window per IP, in memory. On serverless this is per warm instance, so it is
// a soft guard against a single browser hammering the endpoint, not a hard quota.
// Note the client prefetches one token per page load (LiveKit's prepareConnection)
// on top of one per tap, and a household or office shares one IP, so keep this loose.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 30;
const windows = new Map<string, { count: number; resetAt: number }>();

export function allow(ip: string, now = Date.now()): boolean {
  const w = windows.get(ip);
  if (!w || now >= w.resetAt) {
    windows.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  w.count += 1;
  return w.count <= MAX_PER_WINDOW;
}
