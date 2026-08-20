/**
 * Portfolio Data
 * Single source of truth for all portfolio content
 */

import type {
  PersonalInfo,
  Experience,
  Project,
  Education,
  SocialLink,
} from "@/types/portfolio";
import avatarImage from "@/assets/Abhineeth_DP.jpg";

// ===== Portfolio Data =====

export const personalInfo: PersonalInfo = {
  name: "Abhineeth Srinivasa",
  title: "Solutions Engineer",
  tagline: "BUILD · SHIP · SELL",
  location: { city: "Bangalore, Karnataka", country: "India" },
  email: "srinivasaabhineeth@gmail.com",
  phone: "+91 6361959859",
  avatar: avatarImage,
  resumeUrl: "/Abhineeth_Resume.pdf",
  bio: "I build products end to end, and then I go sell them. At Recruit41 I own Learn41, a mock-interview product for campus students, from platform architecture through to client acquisition: I designed the multi-tenant system, closed the first paying customer, and ran the unit economics behind its pricing. In parallel I ship core interview infrastructure such as RBAC, ATS integration, and real-time LiveKit/WebRTC pipelines serving 50,000+ candidates. I care about the whole loop: the architecture decision, the customer conversation, and the P&L line they both end up on.",
  stats: [
    {
      value: "INR 1M+",
      label: "Revenue generated for Learn41, the product I designed, built and then sold",
    },
    {
      value: "1 product",
      label: "Taken from zero to launch, from system architecture to its first customer",
    },
    {
      value: "50,000+",
      label: "Candidates interviewed on the platform infrastructure I helped build and maintain",
    },
    {
      value: "1 client",
      label: "First paying customer sourced, closed, and now managed by me as account owner",
    },
  ],
  skills: [
    {
      category: "Core",
      items: ["Python", "TypeScript", "Django", "FastAPI", "React.js", "PostgreSQL"],
    },
    {
      category: "Platform",
      items: [
        "GCP",
        "Kubernetes",
        "Docker",
        "WebSocket",
        "LiveKit/WebRTC",
        "Daily.co",
        "Pipecat",
        "CI/CD",
        "Alembic",
      ],
    },
    {
      category: "AI & Data",
      items: ["LLM Prompt Engineering", "AI Evaluation Pipelines", "PostHog Analytics"],
    },
    {
      category: "Business",
      items: [
        "Go-to-Market Strategy",
        "Client Acquisition",
        "Account Management",
        "Unit Economics",
        "P&L Ownership",
      ],
    },
  ],
};

export const experience: Experience[] = [
  {
    id: "exp-1",
    company: "Recruit41",
    companyUrl: "https://recruit41.com/",
    role: "Solutions Engineer",
    location: "Bangalore, India",
    startDate: "2025-10",
    endDate: null,
    current: true,
    tracks: [
      {
        label: "Learn41 — Product Owner",
        bullets: [
          "Generated INR 1M+ in revenue for Learn41 by designing and implementing its solution architecture end to end (0→1 product build), including the multi-tenant, cross-domain platform extension that let it launch on its own domain.",
          "Drove go-to-market strategy: sourced leads and closed Learn41's first paying customer.",
          "Acted as account manager for the paying customer, owning the relationship and personally conducting and managing mock interviews for their students.",
          "Ran unit economics and pricing analysis on interview delivery costs, informing P&L decisions for the product line.",
          "Built LLM-based interview evaluation pipelines with prompt engineering for student coaching, plus candidate feedback reporting.",
        ],
      },
      {
        label: "Recruit41 — Platform Engineering",
        bullets: [
          "Designed and implemented an ACL-based RBAC system in Django, enabling granular access control across the multi-tenant platform for enterprise clients.",
          "Built Greenhouse ATS integration enabling automated candidate and interview status updates for enterprise clients.",
          "Rebuilt the LiveKit/WebRTC-based interview recording pipeline for performance and reliability, reducing failed and incomplete recordings at scale.",
          "Established a single source of truth for AI interview scoring, increasing evaluator consistency and trust in automated grading.",
          "Developed an AI proctoring system with violation detection, camera compliance checks, and interview timeline visualization for candidate review.",
        ],
      },
    ],
  },
  {
    id: "exp-2",
    company: "Think41",
    companyUrl: "https://think41.com/",
    role: "SDE-I",
    location: "Bangalore, India",
    startDate: "2025-02",
    endDate: "2025-10",
    current: false,
    description: [
      "Built CuraBot, a healthcare management platform with role-based dashboards for patients, doctors, and admins using React.js and Node.js.",
      "Developed an AI-powered chatbot for patient assistance and automated patient summary generation for doctors.",
      "Built LendSureAI, a credit risk analysis tool with AI-powered assessments, PDF report generation, and analysis history using Django REST Framework.",
    ],
  },
  {
    id: "exp-3",
    company: "Membrane",
    companyUrl: "https://membrane.social/",
    role: "Software Developer Intern",
    location: "Remote",
    startDate: "2024-01",
    endDate: "2025-02",
    current: false,
    description: [
      "Populated and managed a database of 1 million+ movie records including cast details and trailers from global sources.",
      "Developed REST APIs for watchlist management, user reviews, and personalized movie recommendations.",
    ],
  },
];

export const projects: Project[] = [
  {
    id: "proj-1",
    name: "CuraBot — Healthcare Management System",
    date: "Mar 2025",
    description:
      "Full-stack healthcare platform with JWT authentication, appointment scheduling, and an admin analytics dashboard with Recharts visualizations. Deployed on cloud using Docker with role-based access control for patients, doctors, and administrators.",
    techStack: ["React.js", "Node.js", "Docker", "Recharts", "JWT"],
    status: "active",
  },
  {
    id: "proj-2",
    name: "Deflix",
    date: "Jan 2024 – Feb 2025",
    description:
      "Blockchain-based movie review and rating platform built to ensure transparency and efficient incentivisation of users, with APIs that let community contributors display and showcase their contributions.",
    techStack: ["Blockchain", "REST APIs", "React.js"],
    status: "active",
  },
  {
    id: "proj-3",
    name: "Smart Traffic Management using Machine Learning",
    date: "Mar 2023 – Aug 2023",
    description:
      "Smart traffic management system using SUMO and Google Maps to simulate real-life traffic on any selected road network, with a model that dynamically adjusts red light durations to reduce congestion in real time.",
    techStack: ["Python", "Machine Learning", "SUMO", "Google Maps API"],
    status: "archived",
  },
];

export const education: Education[] = [
  {
    id: "edu-1",
    institution: "M S Ramaiah Institute of Technology",
    degree: "Bachelor of Engineering",
    field: "Electronics and Instrumentation",
    startYear: "2021",
    endYear: "2025",
    location: "Bangalore, Karnataka",
    details: "CGPA: 8.50",
  },
];

export const socialLinks: SocialLink[] = [
  {
    platform: "GitHub",
    username: "abhineethms",
    url: "https://github.com/abhineethms",
  },
  {
    platform: "LinkedIn",
    username: "abhineeth-srinivasa-00b8ab226",
    url: "https://linkedin.com/in/abhineeth-srinivasa-00b8ab226",
  },
];
