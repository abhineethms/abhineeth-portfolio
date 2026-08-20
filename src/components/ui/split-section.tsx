import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SplitSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * SplitSection Component
 * Section title on the left, content on the right
 */
export default function SplitSection({ 
  title,
  children, 
  className,
  id 
}: SplitSectionProps) {
  return (
    <section 
      id={id}
      className={cn(
        "flex items-center px-8 md:px-16 lg:px-24 py-20 md:py-24",
        className
      )}
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_1.5fr] gap-12 md:gap-24 lg:gap-32 items-start">
        <div className="md:text-left flex items-start md:sticky md:top-32">
          <h2 className="text-section">{title}</h2>
        </div>
        <div>
          {children}
        </div>
      </div>
    </section>
  );
}
