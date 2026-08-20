interface TimelineItemProps {
  date: string;
  title: string;
  subtitle?: string;
  location?: string;
  description?: string | string[];
  media?: string;
  link?: string;
}

export default function TimelineItem({
  date,
  title,
  subtitle,
  location,
  description,
  media,
  link,
}: TimelineItemProps) {
  const content = (
    <div className="grid grid-cols-[100px_1fr] gap-12 mb-8">
      {/* Date Column */}
      <div className="pt-1">
        <p className="timeline-date">{date}</p>
      </div>

      {/* Content Column */}
      <div className="space-y-1">
        <h3 className="timeline-title">{title}</h3>

        {subtitle && <p className="timeline-subtitle">{subtitle}</p>}

        {location && <p className="timeline-meta">{location}</p>}

        {description && (
          <div className="body-text mt-2">
            {Array.isArray(description) ? (
              description.map((item, idx) => (
                <p key={idx} className="mb-2 last:mb-0">
                  {item}
                </p>
              ))
            ) : (
              <p>{description}</p>
            )}
          </div>
        )}

        {media && (
          <div className="mt-4">
            <img src={media} alt={title} className="max-w-md w-full" loading="lazy" />
          </div>
        )}
      </div>
    </div>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}
