import { personalInfo } from "@/data/portfolio-data";

/**
 * AboutSection Component
 * Centered about section with large text
 */
export default function AboutSection() {
  // Take only the first paragraph for minimal design
  const firstParagraph = personalInfo.bio.split('\n\n')[0];
  
  return (
    <section id="about" className="flex items-center justify-center px-8 md:px-16 lg:px-24 py-20 md:py-24">
      <div className="w-full max-w-4xl text-center space-y-12 md:space-y-16">
        <h2 className="text-tiny tracking-widest">ABOUT ME</h2>
        <p className="text-body leading-relaxed max-w-3xl mx-auto">
          {firstParagraph}
        </p>
      </div>
    </section>
  );
}
