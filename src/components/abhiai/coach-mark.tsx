import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Set once the visitor has seen or used the agent; never shown again after that. */
const SEEN_KEY = "abhiai:coach-seen";
/** Fallback trigger for visitors who never scroll. */
const DWELL_MS = 8000;
/** Same depth that reveals the back-to-top button: the visitor is browsing, not reading the hero. */
const SCROLL_TRIGGER_PX = 400;
/** Long enough to read one line, short enough not to linger. */
const AUTO_DISMISS_MS = 10000;

export function markCoachSeen(): void {
  try {
    localStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Private mode or storage disabled: the tip simply shows again next visit.
  }
}

function hasSeenCoach(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Decides when the one-time tip should appear: once the visitor has scrolled past
 * the hero, or after DWELL_MS for those who never scroll, whichever comes first.
 * Never fires for someone who has already seen or used the agent.
 */
export function useCoachMark(suppressed: boolean): { show: boolean; dismiss: () => void } {
  const [show, setShow] = useState(false);
  const settled = useRef(false);

  const dismiss = () => {
    settled.current = true;
    setShow(false);
    markCoachSeen();
  };

  useEffect(() => {
    if (hasSeenCoach()) {
      settled.current = true;
      return;
    }

    const reveal = () => {
      if (settled.current) return;
      settled.current = true;
      setShow(true);
    };

    const onScroll = () => {
      if (window.scrollY > SCROLL_TRIGGER_PX) reveal();
    };

    const dwell = window.setTimeout(reveal, DWELL_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(dwell);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Auto-dismiss, and stand down immediately if the agent is opened another way.
  useEffect(() => {
    if (!show) return;
    if (suppressed) {
      setShow(false);
      markCoachSeen();
      return;
    }
    const t = window.setTimeout(() => {
      setShow(false);
      markCoachSeen();
    }, AUTO_DISMISS_MS);
    return () => window.clearTimeout(t);
  }, [show, suppressed]);

  return { show, dismiss };
}

interface CoachMarkProps {
  show: boolean;
  /** Where the wave is parked, in viewport coordinates. */
  anchor: { left: number; top: number; size: number };
  /** Phones anchor below the nav bar; desktop above the corner ring. */
  below: boolean;
  onOpen: () => void;
  onDismiss: () => void;
}

/**
 * A one-time tip pointing at the wave. Non-modal and it never takes focus: it is a
 * hint, not a step the visitor has to complete.
 */
export function CoachMark({ show, anchor, below, onOpen, onDismiss }: CoachMarkProps) {
  const reduce = useReducedMotion();
  const offset = below ? 14 : 12;

  // Right-aligned to the wave, clamped so it never runs off a narrow screen.
  // Positioned with top/bottom rather than a transform: framer-motion animates `y`,
  // which writes to transform, so a transform here would be overwritten.
  const right = Math.max(12, window.innerWidth - (anchor.left + anchor.size) - 4);
  const style = below
    ? { top: anchor.top + anchor.size + offset, right }
    : { bottom: window.innerHeight - anchor.top + offset, right };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="coach"
          role="status"
          aria-live="polite"
          className="fixed z-[59] max-w-[min(15rem,calc(100vw-1.5rem))]"
          style={style}
          initial={{ opacity: 0, y: reduce ? 0 : below ? -6 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : below ? -6 : 6 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative flex items-start gap-2 rounded-lg border border-foreground/20 bg-card px-4 py-3 shadow-lg">
            {/* The pointer: a rotated square tucked under the card's edge. */}
            <span
              aria-hidden
              className={cn(
                "absolute right-5 h-2.5 w-2.5 rotate-45 border-foreground/20 bg-card",
                below ? "-top-[6px] border-l border-t" : "-bottom-[6px] border-b border-r",
              )}
            />
            <button
              type="button"
              onClick={onOpen}
              className="text-left font-serif text-small leading-snug text-card-foreground"
            >
              Talk to my AI version
            </button>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss"
              className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
