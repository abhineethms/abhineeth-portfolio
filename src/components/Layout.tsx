import { ReactNode } from "react";
import BackToTop from "./BackToTop";
import SkipLink from "./SkipLink";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      <main id="main-content">{children}</main>
      <BackToTop />
    </div>
  );
}
