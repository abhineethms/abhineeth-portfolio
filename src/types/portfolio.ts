/**
 * Portfolio Type Definitions
 * TypeScript interfaces for portfolio data structures
 */

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  location: { city: string; country: string };
  email: string;
  phone: string;
  avatar: string;
  resumeUrl: string;
  bio: string;
  skills: SkillCategory[];
  stats: { value: string; label: string }[];
}

export interface ExperienceTrack {
  label: string;
  bullets: string[];
}

export interface Experience {
  id: string;
  company: string;
  companyUrl?: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description?: string[];
  tracks?: ExperienceTrack[];
  media?: string;
  current: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  date?: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  status: "active" | "archived";
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  location: string;
  details?: string;
}

export interface SocialLink {
  platform: string;
  username?: string;
  url: string;
}
