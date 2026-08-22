import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Scroll depth at which the button appears. Shared with the voice button, which makes room for it. */
export const BACK_TO_TOP_THRESHOLD = 400;

export function useScrolledPastThreshold(): boolean {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const update = () => setPast(window.scrollY > BACK_TO_TOP_THRESHOLD);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return past;
}

/**
 * BackToTop Button Component
 * Slides in from the right edge once the user has scrolled, pushing the voice button aside.
 */
export default function BackToTop() {
  const isVisible = useScrolledPastThreshold();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button
      onClick={scrollToTop}
      size="lg"
      className={cn(
        "fixed bottom-8 right-8 z-40 h-12 w-12 rounded-full p-0 shadow-lg transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-24 opacity-0 pointer-events-none"
      )}
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
