import Layout from "@/components/Layout";
import Navigation from "@/components/Navigation";
import HeaderSection from "@/components/sections/HeaderSection";
import StatsSection from "@/components/sections/StatsSection";
import AboutSection from "@/components/sections/AboutSection";
import WorkSection from "@/components/sections/WorkSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import EducationSection from "@/components/sections/EducationSection";
import ContactSection from "@/components/sections/ContactSection";
import { useEffect, useRef } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { track } from "@/lib/analytics";

export default function Index() {
  const activeSection = useActiveSection(100);

  // One event per section per visit, so scrolling back and forth doesn't inflate counts.
  const seenSections = useRef(new Set<string>());
  useEffect(() => {
    if (seenSections.current.has(activeSection)) return;
    seenSections.current.add(activeSection);
    track("section_viewed", { section: activeSection });
  }, [activeSection]);

  return (
    <Layout>
      <Navigation />
      <HeaderSection />
      <StatsSection />
      <AboutSection />
      <WorkSection />
      <ProjectsSection />
      <SkillsSection />
      <EducationSection />
      <ContactSection />
    </Layout>
  );
}
