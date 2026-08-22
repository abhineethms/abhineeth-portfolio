import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AgentSessionProvider } from "@/components/agents-ui/agent-session-provider";
import { AgentAudioVisualizerAura } from "@/components/agents-ui/agent-audio-visualizer-aura";
import { AgentChatTranscript } from "@/components/agents-ui/agent-chat-transcript";
import { StartAudioButton } from "@/components/agents-ui/start-audio-button";
import { useScrolledPastThreshold } from "@/components/BackToTop";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Composer } from "./controls";
import { useAbhiAISession } from "./use-abhiai-session";

/** The site's foreground, oklch(65% 0.24 30) from src/index.css, as sRGB hex for the shader. */
const AURA_COLOR = "#ff3321";

/**
 * One persistent aura, moved and scaled with transforms only. Its canvas always renders
 * at full size, so it is crisp at every scale, and nothing re-lays-out mid-animation.
 *
 *   closed  - small, bottom-right, next to the back-to-top button
 *   center  - small, screen centre               (site blurs out behind)
 *   grown   - large, screen centre
 *   live    - large, left half; transcript + controls on the right
 *   ...and back: live -> grown -> center -> closed
 */
type Phase = "closed" | "center" | "grown" | "live";

const STEP_MS = 650;
const BUTTON_PX = 48;
/** Phone: the wave rests in the nav bar, in a slot Navigation.tsx renders. */
const NAV_SLOT_ID = "abhiai-nav-slot";
const NAV_BUTTON_PX = 36;
/** right-8, bottom-8: the corner the back-to-top button also uses. */
const CORNER_PX = 32;
const GAP_PX = 16;
const EASE = [0.22, 1, 0.36, 1] as const;
const fade = { duration: 0.45, ease: EASE };
const travel = { type: "spring", stiffness: 170, damping: 26, mass: 0.9 } as const;

interface Viewport {
  w: number;
  h: number;
  md: boolean;
  /** Back-to-top is showing, so the resting spot shifts one slot left. */
  scrolled: boolean;
  /** The nav slot's position on phones (viewport coordinates; the nav is fixed). */
  navSlot: { left: number; top: number } | null;
}

function readNavSlot(): Viewport["navSlot"] {
  const el = document.getElementById(NAV_SLOT_ID);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width === 0) return null; // hidden on md+
  return { left: r.left, top: r.top };
}

function readViewport(scrolled: boolean): Viewport {
  return {
    w: window.innerWidth,
    h: window.innerHeight,
    md: window.innerWidth >= 768,
    scrolled,
    navSlot: readNavSlot(),
  };
}

/** Where the CTA rests: the corner ring on md+, the nav-bar slot on phones. */
function ctaRect(v: Viewport): { left: number; top: number; size: number } {
  if (v.md || !v.navSlot) {
    const slot = v.scrolled ? BUTTON_PX + GAP_PX : 0;
    return { left: v.w - CORNER_PX - slot - BUTTON_PX, top: v.h - CORNER_PX - BUTTON_PX, size: BUTTON_PX };
  }
  return { left: v.navSlot.left, top: v.navSlot.top, size: NAV_BUTTON_PX };
}

/** Full-size box edge, the size the canvas renders at. */
function auraSize(v: Viewport): number {
  return v.md ? 320 : Math.min(240, v.w * 0.6);
}

/** Centre point and scale for each phase. */
function target(phase: Phase, v: Viewport): { cx: number; cy: number; scale: number } {
  const size = auraSize(v);
  switch (phase) {
    case "closed": {
      const r = ctaRect(v);
      return { cx: r.left + r.size / 2, cy: r.top + r.size / 2, scale: r.size / size };
    }
    case "center":
      return { cx: v.w / 2, cy: v.h / 2, scale: BUTTON_PX / size };
    case "grown":
      return { cx: v.w / 2, cy: v.h / 2, scale: 1 };
    case "live":
      return v.md
        ? { cx: v.w / 4, cy: v.h / 2, scale: 1 }
        : { cx: v.w / 2, cy: v.h * 0.19, scale: 0.72 };
  }
}

interface TalkToMeProps {
  /** True while the overlay is up, so the page behind can blur. */
  onOpenChange: (open: boolean) => void;
}

export default function TalkToMe({ onOpenChange }: TalkToMeProps) {
  const [phase, setPhase] = useState<Phase>("closed");
  const scrolled = useScrolledPastThreshold();
  const [viewport, setViewport] = useState<Viewport>(() => readViewport(scrolled));
  const timers = useRef<number[]>([]);
  const { session, agent, messages, connect, disconnect, idle, micState, retryMicrophone } =
    useAbhiAISession();

  useEffect(() => {
    const measure = () => setViewport(readViewport(scrolled));
    measure();
    // The nav slot mounts with the page, possibly after this effect; measure again next frame.
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [scrolled]);

  const schedule = (steps: Array<() => void>) => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = steps.map((fn, i) => window.setTimeout(fn, STEP_MS * (i + 1)));
  };

  const open = useCallback(() => {
    // Ask for the mic first, inside the tap, and only then start moving: the browser's
    // permission dialog should never land on top of the animation.
    void connect().then(() => {
      onOpenChange(true);
      setPhase("center");
      schedule([() => setPhase("grown"), () => setPhase("live")]);
    });
  }, [connect, onOpenChange]);

  const close = useCallback(() => {
    if (!idle) disconnect();
    setPhase("grown");
    schedule([
      () => setPhase("center"),
      () => {
        setPhase("closed");
        onOpenChange(false);
      },
    ]);
  }, [disconnect, idle, onOpenChange]);

  // The agent can end the session itself (inactivity goodbye); follow it out.
  useEffect(() => {
    if (phase === "live" && idle) close();
  }, [phase, idle, close]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const isOpen = phase !== "closed";
  const isLive = phase === "live";
  const size = auraSize(viewport);
  const t = target(phase, viewport);

  return (
    <AgentSessionProvider session={session}>
      {/* Cream backdrop under everything in the overlay. */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-background backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
          />
        )}
      </AnimatePresence>

      {/* Transcript and controls: right half, or below the aura on phones. */}
      <AnimatePresence>
        {isLive && (
          <motion.section
            key="side"
            className="fixed inset-x-0 bottom-0 top-[36dvh] z-[55] flex flex-col md:inset-y-0 md:left-1/2 md:right-0 md:border-l md:border-foreground/15"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { ...fade, delay: 0.3 } }}
            exit={{ opacity: 0, y: 16, transition: { duration: 0.3, ease: EASE } }}
          >
            <header className="flex shrink-0 items-start justify-between gap-4 px-6 pt-4 md:px-12 md:pt-10">
              <div>
                <h2 className="font-serif text-large text-foreground">Talk to me</h2>
                <p className="mt-1 text-small text-muted-foreground">
                  Ask me about my work, my projects, or what I'm like.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="group mt-1 flex shrink-0 items-center gap-2 text-tiny uppercase tracking-[0.18em] text-foreground transition-opacity hover:opacity-70"
              >
                <span className="hidden sm:inline">End conversation</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/30 transition-colors group-hover:border-foreground">
                  <X className="h-4 w-4" />
                </span>
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-hidden px-4 py-3 md:px-10 md:py-4">
              <AgentChatTranscript messages={messages} agentState={agent.state} className="h-full" />
            </div>

            <footer className="shrink-0 space-y-3 px-6 pb-6 md:px-12 md:pb-10">
              <div className="flex justify-center empty:hidden">
                <StartAudioButton label="Enable audio" size="sm" variant="secondary" />
              </div>
              <Composer micState={micState} onRetryMicrophone={retryMicrophone} />
            </footer>
          </motion.section>
        )}
      </AnimatePresence>

      {/* The CTA: a ring on md+, a labelled pill on phones. The aura rests on top of it. */}
      <motion.button
        type="button"
        onClick={open}
        aria-label="Talk to the AI version of me"
        className={cn(
          "group fixed left-0 top-0 z-[61] flex items-center justify-center rounded-full border border-foreground/30 transition-colors hover:border-foreground",
          viewport.md ? "bg-background/85 shadow-lg backdrop-blur-sm" : "bg-transparent",
        )}
        style={{ pointerEvents: isOpen ? "none" : "auto" }}
        animate={{
          x: ctaRect(viewport).left,
          y: ctaRect(viewport).top,
          width: ctaRect(viewport).size,
          height: ctaRect(viewport).size,
          opacity: isOpen ? 0 : 1,
          scale: isOpen ? 0.9 : 1,
        }}
        whileHover={viewport.md ? { scale: 1.06 } : undefined}
        whileTap={{ scale: 0.96 }}
        transition={{ x: travel, y: travel, width: travel, height: travel, opacity: fade, scale: fade }}
      >
        {viewport.md && (
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap font-serif text-small text-foreground opacity-0 transition-opacity group-hover:opacity-100">
            Talk to the AI version of me
          </span>
        )}
      </motion.button>

      {/* The aura itself: full-size canvas, positioned by transform only. */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[62]"
        style={{ width: size, height: size }}
        animate={{ x: t.cx - size / 2, y: t.cy - size / 2, scale: t.scale }}
        transition={travel}
      >
        <AgentAudioVisualizerAura
          size="xl"
          state={agent.state}
          audioTrack={agent.microphoneTrack}
          themeMode="light"
          color={AURA_COLOR}
          colorShift={0.05}
          className="!h-full !w-full mix-blend-multiply"
        />
      </motion.div>
    </AgentSessionProvider>
  );
}
