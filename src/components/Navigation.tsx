import { useState } from "react";
import { personalInfo } from "@/data/portfolio-data";
import { track } from "@/lib/analytics";

interface NavigationProps {
  scrolled?: boolean;
}

const sectionLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#work" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation(_props: NavigationProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border px-8 md:px-16 lg:px-24"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span className="text-base sm:text-lg md:text-xl font-bold">{personalInfo.name}</span>
            <span className="text-sm sm:text-base font-semibold text-muted-foreground">
              {personalInfo.title}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {sectionLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm hover:text-muted-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={personalInfo.resumeUrl}
              onClick={() => track("resume_opened", { location: "nav" })}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline hover:text-muted-foreground transition-colors"
            >
              Résumé
            </a>
          </div>

          <div className="md:hidden flex items-center gap-5">
            {/* Resting spot for the voice-agent wave on phones; TalkToMe measures and
                overlays it. Keeps layout honest without coupling the two components. */}
            <span id="abhiai-nav-slot" aria-hidden className="block h-9 w-9" />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="text-tiny tracking-widest uppercase hover:text-muted-foreground transition-colors"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {open && (
          <div id="mobile-nav" className="md:hidden flex flex-col gap-3 pt-4 pb-2">
            {sectionLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm hover:text-muted-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={personalInfo.resumeUrl}
              onClick={() => track("resume_opened", { location: "nav" })}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline hover:text-muted-foreground transition-colors"
            >
              Résumé
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
