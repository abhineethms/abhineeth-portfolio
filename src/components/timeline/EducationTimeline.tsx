import { education } from "@/data/portfolio-data";
import TimelineItem from "./TimelineItem";

export default function EducationTimeline() {
  const sortedEducation = [...education].sort(
    (a, b) => parseInt(b.endYear) - parseInt(a.endYear)
  );

  return (
    <div>
      {sortedEducation.map((edu) => (
        <TimelineItem
          key={edu.id}
          date={`${edu.startYear} — ${edu.endYear}`}
          title={`${edu.degree} in ${edu.field}`}
          subtitle={edu.institution}
          location={edu.location}
          description={edu.details}
        />
      ))}
    </div>
  );
}
