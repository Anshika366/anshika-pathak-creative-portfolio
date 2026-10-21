// ✏️ Edit everything personal here. Placeholders in [BRACKETS] are meant to be replaced.
import {
  SiHtml5, SiCss, SiJavascript, SiReact, SiNodedotjs, SiExpress, SiMongodb, SiPython,
  SiMysql, SiGit, SiGithub, SiWordpress, SiTailwindcss, SiFastapi, SiMariadb, SiN8N, SiZapier,
} from "react-icons/si";
import type { IconType } from "react-icons";

export const profile = {
  name: "Anshika Pathak",
  initials: "AP",
  role: "Full-Stack Developer & AI Enthusiast",
  email: "", // e.g. "you@example.com"
  linkedin: "", // e.g. "https://linkedin.com/in/your-handle"
  github: "", // e.g. "https://github.com/your-handle"
  location: "[YOUR CITY, COUNTRY]",
  resumeUrl: "/resume.pdf", // replace public/resume.pdf with your real resume
  portrait: "", // put your photo URL here to replace the placeholder
};

export const stats = [
  { value: "[PROJECT COUNT]", label: "Projects Completed", icon: "folder" },
  { value: "[EXPERIENCE]", label: "Professional Experience", icon: "briefcase" },
  { value: "5+", label: "Technologies", icon: "code" },
  { value: "100%", label: "Commitment to Learning", icon: "sparkles" },
] as const;

export const techStrip: { name: string; icon: IconType }[] = [
  { name: "HTML5", icon: SiHtml5 }, { name: "CSS3", icon: SiCss },
  { name: "JavaScript", icon: SiJavascript }, { name: "React", icon: SiReact },
  { name: "Node.js", icon: SiNodedotjs }, { name: "Express.js", icon: SiExpress },
  { name: "MongoDB", icon: SiMongodb }, { name: "Python", icon: SiPython },
  { name: "SQL", icon: SiMysql }, { name: "Git", icon: SiGit },
  { name: "GitHub", icon: SiGithub }, { name: "WordPress", icon: SiWordpress },
];

export type Project = {
  title: string; description: string; tech: string[];
  image?: string; // optional preview image URL
  visual: "web" | "app" | "ai" | "api";
  status?: string;
  links: { label: string; url: string }[]; // empty url = "link coming soon"
};

export const projects: Project[] = [
  {
    title: "University Website",
    description: "A responsive university website built to present institutional information through a structured and user-friendly interface.",
    tech: ["React", "Node.js", "Express.js", "MongoDB"], visual: "web",
    links: [{ label: "Live Demo", url: "" }, { label: "View Code", url: "" }],
  },
  {
    title: "Student Goals & Reflection App",
    description: "A student-focused application designed to help learners set goals, record reflections, and track their progress over time.",
    tech: ["React", "JavaScript", "Node.js", "MongoDB"], visual: "app",
    links: [{ label: "View Project", url: "" }, { label: "View Code", url: "" }],
  },
  {
    title: "AI Notes & Doubt Solver",
    description: "An AI-powered learning assistant concept that helps students organize notes, ask questions, and understand learning material.",
    tech: ["React", "Python", "FastAPI", "RAG", "ChromaDB"], visual: "ai", status: "Concept",
    links: [{ label: "Demo", url: "" }, { label: "View Code", url: "" }],
  },
  {
    title: "Expense Tracker API",
    description: "A backend-focused application for managing expenses, organizing financial records, and retrieving expense data through API endpoints.",
    tech: ["Python", "FastAPI", "Pandas", "NumPy"], visual: "api",
    links: [{ label: "View Code", url: "" }],
  },
];

export const skillGroups: { title: string; items: { name: string; icon?: IconType }[] }[] = [
  { title: "Frontend", items: [{ name: "HTML5", icon: SiHtml5 }, { name: "CSS3", icon: SiCss }, { name: "JavaScript", icon: SiJavascript }, { name: "React", icon: SiReact }, { name: "Tailwind CSS", icon: SiTailwindcss }] },
  { title: "Backend", items: [{ name: "Node.js", icon: SiNodedotjs }, { name: "Express.js", icon: SiExpress }, { name: "Python", icon: SiPython }, { name: "FastAPI", icon: SiFastapi }, { name: "REST APIs" }] },
  { title: "Database", items: [{ name: "MongoDB", icon: SiMongodb }, { name: "MySQL", icon: SiMysql }, { name: "SQL" }, { name: "MariaDB", icon: SiMariadb }] },
  { title: "Tools & Platforms", items: [{ name: "Git", icon: SiGit }, { name: "GitHub", icon: SiGithub }, { name: "WordPress", icon: SiWordpress }, { name: "VS Code" }] },
  { title: "AI & Automation", items: [{ name: "RAG" }, { name: "ChromaDB" }, { name: "AI coding tools" }, { name: "n8n", icon: SiN8N }, { name: "Zapier", icon: SiZapier }] },
];

export const experience = [
  {
    role: "Full-Stack Developer", org: "[ORGANIZATION / FREELANCE]", dates: "[START] — [END / PRESENT]",
    description: "Building frontend interfaces, backend APIs and database integrations, collaborating with others through Git-based workflows.",
    tech: ["React", "Node.js", "Express.js", "MongoDB"],
  },
  {
    role: "[DEGREE / PROGRAM]", org: "[INSTITUTION]", dates: "[START] — [END]",
    description: "Learning journey covering programming fundamentals, web development and data — plus self-driven projects in AI tools.",
    tech: ["Python", "SQL", "JavaScript"],
  },
];
