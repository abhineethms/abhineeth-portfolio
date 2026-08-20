import { projects } from "@/data/portfolio-data";
import SplitSection from "@/components/ui/split-section";

/**
 * ProjectsSection Component
 * Split layout listing projects with date, description and tech stack
 */
export default function ProjectsSection() {
  return (
    <SplitSection title="Projects" id="projects">
      <div className="space-y-16 md:space-y-20">
        {projects.map((project, index) => (
          <div key={project.id}>
            {index > 0 && <hr className="border-t border-foreground/15 mb-16 md:mb-20" />}
            <div className="space-y-3">
              <h3 className="text-large leading-tight">{project.name}</h3>
              {project.date && <p className="text-small">{project.date}</p>}
              <p className="text-body leading-relaxed mt-6">{project.description}</p>
              <div className="flex flex-wrap gap-3 pt-4">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-tiny tracking-widest py-2 px-4 border border-foreground/15"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SplitSection>
  );
}
