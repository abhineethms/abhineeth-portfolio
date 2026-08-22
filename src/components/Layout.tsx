import { ReactNode, useEffect, useState } from "react";
import BackToTop from "./BackToTop";
import SkipLink from "./SkipLink";
import TalkToMe from "./abhiai/talk-to-me";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [talkOpen, setTalkOpen] = useState(false);

  // Lock page scroll while the voice overlay is up, so a drag or a keyboard cannot
  // scroll the site around behind it.
  useEffect(() => {
    document.body.style.overflow = talkOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [talkOpen]);

  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      {/* Inert while the voice overlay is up so nothing behind it can take focus.
          No transform/filter here: either would break position:fixed for the nav and buttons. */}
      <div {...({ inert: talkOpen ? "" : undefined } as Record<string, unknown>)}>
        <main id="main-content">{children}</main>
        <BackToTop />
      </div>
      <TalkToMe onOpenChange={setTalkOpen} />
    </div>
  );
}
