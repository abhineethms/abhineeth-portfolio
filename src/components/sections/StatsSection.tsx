import { personalInfo } from "@/data/portfolio-data";

/**
 * StatsSection Component
 * Restrained horizontal stats strip below the header
 */
export default function StatsSection() {
  return (
    <section className="px-8 md:px-16 lg:px-24 py-12 md:py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-20 md:gap-y-14">
        {personalInfo.stats.map((stat) => (
          <div key={stat.label} className="space-y-3 max-w-md">
            <p className="text-stat">{stat.value}</p>
            <p className="text-body leading-relaxed text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
