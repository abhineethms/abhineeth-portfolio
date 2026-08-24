import { personalInfo } from "@/data/portfolio-data";

/**
 * HeaderSection Component
 * Split name layout with centered image
 */
export default function HeaderSection() {
  const currentYear = new Date().getFullYear();
  const nameParts = personalInfo.name.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');
  
  return (
    <section className="flex items-center justify-center px-6 sm:px-8 md:px-16 lg:px-24 pt-24 pb-20 md:pt-28 md:pb-24">
      <div className="w-full max-w-7xl flex flex-col items-center gap-10 md:gap-14">
        <p className="text-tiny tracking-widest text-center">{personalInfo.title}</p>

        <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-10 items-center justify-items-center">
          <h1 className="text-[clamp(2.75rem,11vw,5.5rem)] leading-[0.95] font-light text-center lg:text-right lg:justify-self-end whitespace-nowrap">
            {firstName}
          </h1>

          <div className="flex justify-center shrink-0">
            <img
              src={personalInfo.avatar}
              alt={personalInfo.name}
              className="w-[min(78vw,20rem)] lg:w-[22rem] shrink-0 h-auto aspect-[4/5] object-cover object-top rounded-t-[12rem]"
            />
          </div>

          <h1 className="text-[clamp(2.75rem,11vw,5.5rem)] leading-[0.95] font-light text-center lg:text-left lg:justify-self-start whitespace-nowrap">
            {lastName}
          </h1>
        </div>

        <p className="text-small text-center">{currentYear}</p>
      </div>
    </section>
  );
}
