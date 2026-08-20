import { experience } from "@/data/portfolio-data";
import SplitSection from "@/components/ui/split-section";
import { format } from "date-fns";

/**
 * WorkSection Component
 * Split layout with all roles listed as bullets or labeled tracks
 */
function BulletList({ bullets }: { bullets: string[] }) {
  return (
    <ul className="space-y-3">
      {bullets.map((bullet, idx) => (
        <li key={idx} className="text-body leading-relaxed flex gap-4">
          <span aria-hidden="true" className="text-muted-foreground select-none">
            —
          </span>
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  );
}

export default function WorkSection() {
  return (
    <SplitSection title="Experience" id="work">
      <div className="space-y-16 md:space-y-20">
        {experience.map((job, index) => {
          const startYear = format(new Date(job.startDate), "yyyy");
          const endYear = job.endDate ? format(new Date(job.endDate), "yyyy") : "Present";

          return (
            <div key={job.id}>
              {index > 0 && <hr className="border-t border-foreground/15 mb-16 md:mb-20" />}
              <div className="space-y-3">
                <h3 className="text-large leading-tight">
                  {job.role} at{" "}
                  {job.companyUrl ? (
                    <a
                      href={job.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline hover:opacity-70 transition-opacity"
                    >
                      {job.company}
                    </a>
                  ) : (
                    job.company
                  )}
                </h3>
                <p className="text-small">
                  {startYear} - {endYear}
                </p>

                {job.description && (
                  <div className="mt-6">
                    <BulletList bullets={job.description} />
                  </div>
                )}

                {job.tracks && (
                  <div className="mt-8 space-y-12 md:space-y-16">
                    {job.tracks.map((track) => (
                      <div key={track.label} className="space-y-6">
                        <h4 className="text-tiny tracking-widest uppercase">{track.label}</h4>
                        <BulletList bullets={track.bullets} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SplitSection>
  );
}
