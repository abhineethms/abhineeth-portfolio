import { FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Mic, MicOff } from "lucide-react";
import { useChat } from "@livekit/components-react";
import { useInputControls } from "@/hooks/agents-ui/use-agent-control-bar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { MicState } from "./use-abhiai-session";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The composer: one pill holding the mic toggle and a text field, with a send arrow
 * that appears only when there is something to send. On phones the field opens a
 * full-screen typing sheet instead, because the on-screen keyboard would otherwise
 * shove the whole overlay around.
 */
interface ComposerProps {
  micState: MicState;
  onRetryMicrophone: () => Promise<MicState>;
}

const MIC_HINT: Partial<Record<MicState, string>> = {
  denied: "Microphone is off. Tap the mic to allow it, or just type.",
  blocked: "Microphone is blocked for this site. Allow it from the lock icon in the address bar, or just type.",
  insecure: "This page isn't on a secure connection, so the microphone isn't available. You can type instead.",
};

export function Composer({ micState, onRetryMicrophone }: ComposerProps) {
  const { microphoneToggle } = useInputControls();
  const { send } = useChat();
  const isMobile = useIsMobile();
  const [draft, setDraft] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  const micOn = micState === "granted" && microphoneToggle.enabled;
  const canSend = draft.trim().length > 0;
  const hint = MIC_HINT[micState];

  const onMicClick = () => {
    if (micState === "granted") {
      microphoneToggle.toggle();
      return;
    }
    if (micState === "denied") void onRetryMicrophone();
    // blocked / insecure: nothing we can do from the page; the hint below says how.
  };

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!canSend) return;
    const text = draft.trim();
    setDraft("");
    setSheetOpen(false);
    await send(text);
  };

  const micButton = (
    <button
      type="button"
      onClick={onMicClick}
      disabled={microphoneToggle.pending || micState === "blocked" || micState === "insecure"}
      aria-pressed={micOn}
      aria-label={micOn ? "Mute microphone" : "Unmute microphone"}
      title={micOn ? "Mute" : "Unmute"}
      className={cn(
        "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
        micOn
          ? "bg-foreground text-background"
          : "border border-foreground/30 text-foreground hover:border-foreground disabled:opacity-40",
      )}
    >
      {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
      {micOn && (
        <span
          aria-hidden
          className="absolute inset-0 animate-ping rounded-full bg-foreground/30 [animation-duration:2.4s]"
        />
      )}
    </button>
  );

  const placeholder = micOn ? "Speak, or type a question" : "Type a question";

  return (
    <div className="space-y-2">
      <form
        onSubmit={submit}
        className="flex h-14 items-center gap-2 rounded-full border border-foreground/20 bg-card pl-2 pr-2 shadow-sm transition-colors focus-within:border-foreground/50"
      >
        {micButton}

        {isMobile ? (
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="min-w-0 flex-1 truncate px-2 text-left font-serif text-body text-muted-foreground"
          >
            {placeholder}
          </button>
        ) : (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            aria-label="Type a question"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent px-2 font-serif text-body text-card-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        )}

        <AnimatePresence initial={false}>
          {canSend && !isMobile && (
            <motion.button
              key="send"
              type="submit"
              aria-label="Send"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2, ease: EASE }}
              whileTap={{ scale: 0.92 }}
            >
              <ArrowUp className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </form>
      {hint && (
        <p className="px-4 text-center text-tiny text-muted-foreground">{hint}</p>
      )}

      {/* Portalled to <body>: the transcript panel is its own stacking context, so a
          z-index inside it could never rise above the aura layer. */}
      {createPortal(
        <AnimatePresence>
          {isMobile && sheetOpen && (
            <TypingSheet
              draft={draft}
              onChange={setDraft}
              onSend={() => void submit()}
              onCancel={() => setSheetOpen(false)}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}

interface TypingSheetProps {
  draft: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onCancel: () => void;
}

/**
 * Full-screen typing surface for phones. The text area sits at the top, so the keyboard
 * rising from the bottom covers empty space instead of moving anything.
 */
function TypingSheet({ draft, onChange, onSend, onCancel }: TypingSheetProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const canSend = draft.trim().length > 0;

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col bg-background"
      style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <div className="flex items-center justify-between px-6 py-3">
        <button
          type="button"
          onClick={onCancel}
          className="text-tiny uppercase tracking-[0.18em] text-muted-foreground"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSend}
          disabled={!canSend}
          className="flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-tiny uppercase tracking-[0.18em] text-background transition-opacity disabled:opacity-30"
        >
          Send <ArrowUp className="h-3.5 w-3.5" />
        </button>
      </div>

      <textarea
        ref={ref}
        value={draft}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder="Ask me anything about my work, my projects, or what I'm like."
        aria-label="Your question"
        rows={6}
        className="mx-6 mt-2 resize-none bg-transparent font-serif text-large leading-snug text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
      />
    </motion.div>
  );
}
