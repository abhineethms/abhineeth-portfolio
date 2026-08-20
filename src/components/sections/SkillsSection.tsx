import { personalInfo } from "@/data/portfolio-data";
import SplitSection from "@/components/ui/split-section";

/**
 * SkillsSection Component
 * Categorized skill groups using sticky split layout
 */
export default function SkillsSection() {
  return (
    <SplitSection title="Skills" id="skills">
      <div className="space-y-12 md:space-y-16">
        {personalInfo.skills.map((group) => (
          <div key={group.category} className="space-y-6">
            <h3 className="text-tiny tracking-widest uppercase">{group.category}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {group.items.map((skill) => (
                <div
                  key={skill}
                  className="text-small py-4 px-6 border border-foreground/15 hover:border-foreground/30 transition-colors"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SplitSection>
  );
}
