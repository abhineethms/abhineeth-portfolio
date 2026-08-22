import { AnimatePresence, motion } from "framer-motion";
import type { AgentState } from "@livekit/components-react";
import type { ConnectionState } from "livekit-client";
import { cn } from "@/lib/utils";

export type SessionStatus = "connecting" | "live" | "reconnecting" | "unavailable" | null;

/** Collapse agent + connection state into what the visitor needs to know. */
export function deriveStatus(opts: {
  open: boolean;
  connectionState: ConnectionState | string;
  agentState: AgentState;
  agentGone: boolean;
  failed: boolean;
}): SessionStatus {
  if (!opts.open) return null;
  if (opts.failed || opts.agentGone) return "unavailable";
  if (opts.connectionState === "reconnecting" || opts.connectionState === "signalReconnecting") {
    return "reconnecting";
  }
  switch (opts.agentState) {
    case "listening":
    case "thinking":
    case "speaking":
      return "live";
    default:
      return "connecting";
  }
}

/**
 * Under the wave: a heartbeat while the line is live, words only when something is
 * wrong. Listening / thinking / speaking are left to the wave itself.
 */
export function StatusLine({ status, className }: { status: SessionStatus; className?: string }) {
  return (
    <div className={cn("flex h-5 items-center justify-center", className)} aria-live="polite">
      <AnimatePresence mode="wait">
        {status === "live" && (
          <motion.span
            key="heartbeat"
            aria-label="Connected"
            className="relative flex h-2.5 w-2.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-foreground/40 [animation-duration:2.2s]" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-foreground" />
          </motion.span>
        )}
        {(status === "reconnecting" || status === "unavailable") && (
          <motion.span
            key={status}
            className={cn(
              "text-tiny uppercase tracking-[0.18em]",
              status === "unavailable" ? "text-destructive" : "animate-pulse text-muted-foreground",
            )}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            {status === "reconnecting" ? "Reconnecting" : "Couldn't reach the AI right now"}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/** A hairline ring that breathes around the wave while connecting. */
export function ConnectingRing({ active, size }: { active: boolean; size: number }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.span
          key="ring"
          aria-hidden
          className="pointer-events-none absolute rounded-full border border-foreground/30"
          style={{ width: size, height: size, left: 0, top: 0 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: [0.25, 0.7, 0.25], scale: [0.96, 1.02, 0.96] }}
          exit={{ opacity: 0, scale: 1.08, transition: { duration: 0.5 } }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </AnimatePresence>
  );
}
