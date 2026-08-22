import { useCallback, useEffect, useRef, useState } from "react";
import { TokenSource } from "livekit-client";
import { useAgent, useSession, useSessionMessages } from "@livekit/components-react";

/** Must match agent_name in AbhiAI/src/agent.py and AGENT_NAME in api/_mint.ts. */
export const AGENT_NAME = "AbhiAI";

const tokenSource = TokenSource.endpoint("/api/token");

/**
 * granted  - mic is live
 * denied   - visitor declined the prompt this time; asking again will re-prompt
 * blocked  - the site is blocked in browser settings; re-prompting cannot work
 * insecure - http:// origin other than localhost; browsers never offer the mic here
 * unknown  - not asked yet
 */
export type MicState = "unknown" | "granted" | "denied" | "blocked" | "insecure";

// A fresh value per connect. The server picks the real room name, but TokenSource
// caches its response until these options change, so this is what busts the cache.
function newRoomName(): string {
  return `portfolio-${Date.now().toString(36)}`;
}

async function queryMicPermission(): Promise<PermissionState | null> {
  try {
    // Safari has no "microphone" permission descriptor; that throws, and we fall through.
    const status = await navigator.permissions.query({ name: "microphone" as PermissionName });
    return status.state;
  } catch {
    return null;
  }
}

/**
 * Ask for the microphone. Must be called synchronously inside the tap handler:
 * Safari only grants getUserMedia within a user gesture, and the gesture expires
 * during any await that precedes it. The probe stream is released immediately;
 * LiveKit acquires its own track afterwards, which no longer needs a prompt.
 */
export async function requestMicrophone(): Promise<MicState> {
  if (!window.isSecureContext) return "insecure";
  if (!navigator.mediaDevices?.getUserMedia) return "insecure";
  if ((await queryMicPermission()) === "denied") return "blocked";
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    return "granted";
  } catch (err) {
    const name = err instanceof Error ? err.name : "";
    if (name === "NotAllowedError" || name === "SecurityError") {
      return (await queryMicPermission()) === "denied" ? "blocked" : "denied";
    }
    // NotFoundError (no mic), NotReadableError (in use), etc.
    return "denied";
  }
}

export function useAbhiAISession() {
  const [roomName, setRoomName] = useState(newRoomName);
  const startWithMic = useRef(false);
  const startRequested = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [micState, setMicState] = useState<MicState>("unknown");
  /** True once this session has actually connected; distinguishes "ended" from "never started". */
  const [hasConnected, setHasConnected] = useState(false);

  const session = useSession(tokenSource, {
    agentName: AGENT_NAME,
    roomName,
    participantName: "Visitor",
    agentConnectTimeoutMilliseconds: 20_000,
  });
  const agent = useAgent(session);
  const { messages } = useSessionMessages(session);

  useEffect(() => {
    if (session.isConnected) setHasConnected(true);
  }, [session.isConnected]);

  /** Call from the tap handler. Resolves once the mic decision is made. */
  const connect = useCallback(async (): Promise<MicState> => {
    setError(null);
    setHasConnected(false);
    const state = await requestMicrophone();
    setMicState(state);
    startWithMic.current = state === "granted";
    startRequested.current = true;
    setRoomName(newRoomName());
    return state;
  }, []);

  useEffect(() => {
    if (!startRequested.current) return;
    startRequested.current = false;
    void session
      .start({ tracks: { microphone: { enabled: startWithMic.current } } })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[abhiai] session start failed:", msg);
        setError(
          /429/.test(msg)
            ? "Too many conversations started from your network just now. Please try again in a few minutes."
            : "I couldn't start the conversation. Please try again in a moment.",
        );
      });
    // session changes identity every render; roomName is the real trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName]);

  /** Re-ask for the mic mid-session (after a "denied"); no-op when blocked. */
  const retryMicrophone = useCallback(async (): Promise<MicState> => {
    const state = await requestMicrophone();
    setMicState(state);
    if (state === "granted") {
      await session.room.localParticipant.setMicrophoneEnabled(true);
    }
    return state;
  }, [session]);

  const disconnect = useCallback(() => {
    void session.end();
  }, [session]);

  const idle = !session.isConnected && session.connectionState === "disconnected";

  return {
    session,
    agent,
    messages,
    connect,
    disconnect,
    idle,
    hasConnected,
    error,
    micState,
    retryMicrophone,
  };
}
