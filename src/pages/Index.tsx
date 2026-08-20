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
import { useActiveSection } from "@/hooks/useActiveSection";

export default function Index() {
  useActiveSection(100);
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
