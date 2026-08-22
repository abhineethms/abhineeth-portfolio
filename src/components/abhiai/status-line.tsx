import { useEffect, useRef } from "react";
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
 * How far along the connection is, from the milestones the client can observe:
 * tap -> token + room connecting -> room connected -> agent joined -> agent listening.
 */
export function deriveProgress(opts: {
  started: boolean;
  connectionState: ConnectionState | string;
  isConnected: boolean;
  agentState: AgentState;
}): number {
  if (!opts.started) return 0;
  switch (opts.agentState) {
    case "listening":
    case "thinking":
    case "speaking":
      return 1;
    case "initializing":
    case "idle":
    case "pre-connect-buffering":
      return 0.8;
    default:
      break;
  }
  if (opts.isConnected) return 0.55;
  if (opts.connectionState === "connecting") return 0.3;
  return 0.1;
}

interface ConnectionBarProps {
  /** 0..1 from deriveProgress; the bar never moves backwards. */
  progress: number;
  /** Hidden once this is false (the AI is on, or the overlay is closed). */
  visible: boolean;
  className?: string;
}

/** A hairline track with a terracotta fill, under the wave while connecting. */
export function ConnectionBar({ progress, visible, className }: ConnectionBarProps) {
  const peak = useRef(0);
  if (!visible) peak.current = 0;
  else peak.current = Math.max(peak.current, progress);

  useEffect(() => {
    if (!visible) peak.current = 0;
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="bar"
          className={cn("h-px w-full overflow-hidden bg-foreground/15", className)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.3 } }}
          role="progressbar"
          aria-label="Connecting"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(peak.current * 100)}
        >
          <motion.div
            className="h-full bg-foreground"
            initial={{ width: "0%" }}
            animate={{ width: `${peak.current * 100}%` }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Words only when something is wrong; normal states are left to the wave. */
export function StatusLine({ status, className }: { status: SessionStatus; className?: string }) {
  const text =
    status === "reconnecting"
      ? "Reconnecting"
      : status === "unavailable"
        ? "Couldn't reach the AI right now"
        : null;
  return (
    <div className={cn("flex h-5 items-center justify-center", className)} aria-live="polite">
      <AnimatePresence mode="wait">
        {text && (
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
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
