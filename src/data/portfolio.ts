// ✏️ Edit everything personal here. Placeholders in [BRACKETS] are meant to be replaced.
import {
  SiHtml5, SiCss, SiJavascript, SiReact, SiNodedotjs, SiExpress, SiMongodb, SiPython,
  SiGit, SiGithub, SiTailwindcss, SiFastapi, SiNumpy, SiPandas, SiDocker, SiPostman,
  SiReactrouter, SiReactquery, SiGooglegemini, SiJsonwebtokens, SiVite, SiAxios, SiLucide,
  SiTypescript, SiSupabase, SiLeaflet, SiOpenstreetmap, SiMongoose, SiJupyter, SiVercel,
  SiRender, SiHuggingface, SiNvidia, SiOpenapiinitiative,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { TbSql, TbBinaryTree, TbApi } from "react-icons/tb";
import {
  Database, Sparkles, Mic, Webhook, PhoneCall, Mail,
  BrainCircuit, Layers, LayoutGrid, Zap, GraduationCap, Award, Briefcase, Calculator, TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { IconType } from "react-icons";

export const profile = {
  name: "Anshika Pathak",
  initials: "AP",
  role: "Full-Stack Developer & AI Enthusiast",
  email: "anshikapathak25@navgurukul.org",
  linkedin: "https://www.linkedin.com/in/anshikapathakdev/",
  github: "", // e.g. "https://github.com/your-handle"
  location: "[YOUR CITY, COUNTRY]",
  resumeUrl: "/resume.pdf", // replace public/resume.pdf with your real resume
  portrait: "/images/portfolio-portrait.png",
};

export const stats = [
  { value: "10+", label: "PROJECTS COMPLETED", icon: "folder" },
  { value: "FULL STACK + AI", label: "CORE FOCUS", icon: "cpu" },
  { value: "7+", label: "TECHNOLOGIES", icon: "code" },
  { value: "100%", label: "COMMITMENT TO LEARNING", icon: "sparkles" },
] as const;

export type TechStripItem = {
  name: string;
  icon: IconType | LucideIcon;
  color: string;
};

export const techStrip: TechStripItem[] = [
  { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
  { name: "CSS3", icon: SiCss, color: "#38BDF8" },
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "React.js", icon: SiReact, color: "#61DAFB" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
  { name: "Express.js", icon: SiExpress, color: "#F4F4F5" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { name: "Python", icon: SiPython, color: "#4B8BBE" },
  { name: "FastAPI", icon: SiFastapi, color: "#05998B" },
  { name: "SQL", icon: Database, color: "#CBD5E1" },
  { name: "NumPy", icon: SiNumpy, color: "#4DABCF" },
  { name: "Pandas", icon: SiPandas, color: "#D8D4F2" },
  { name: "Git", icon: SiGit, color: "#F05032" },
  { name: "GitHub", icon: SiGithub, color: "#F4F4F5" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "Postman", icon: SiPostman, color: "#FF6C37" },
];

export type ProjectTechLogo = {
  name: string;
  icon: IconType | LucideIcon;
  color: string;
};

export type Project = {
  title: string; description: string; tech: string[];
  techLogos?: ProjectTechLogo[];
  image?: string; // optional preview image URL
  visual: "web" | "app" | "ai" | "api";
  status?: string;
  links: { label: string; url: string }[]; // empty url = "link coming soon"
};

export const projects: Project[] = [
  {
    title: "ExpenseFlow",
    description: "A full-stack personal expense manager for tracking wallet funds, daily expenses, category budgets, and spending analytics.",
    tech: ["React.js", "Python", "FastAPI", "MongoDB", "Tailwind CSS", "JWT Authentication", "REST API", "Docker"],
    techLogos: [
      { name: "React.js", icon: SiReact, color: "#61DAFB" },
      { name: "Python", icon: SiPython, color: "#4B8BBE" },
      { name: "FastAPI", icon: SiFastapi, color: "#05998B" },
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "JWT Authentication", icon: SiJsonwebtokens, color: "#FB015B" },
      { name: "REST API", icon: Webhook, color: "#FB923C" },
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
    ],
    image: "/images/expenseflow-preview.jpg",
    visual: "web",
    links: [
      { label: "View Project", url: "https://expenseflow-flax.vercel.app/" },
      { label: "View Code", url: "https://github.com/Anshika366/expenseflow" },
    ],
  },
  {
    title: "NexusStore",
    description: "An e-commerce storefront and protected admin portal featuring product browsing, cart, wishlist, inventory, and order management.",
    tech: ["React.js", "JavaScript", "Vite", "React Router", "TanStack Query", "Axios", "Lucide React", "REST API"],
    techLogos: [
      { name: "React.js", icon: SiReact, color: "#61DAFB" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "Vite", icon: SiVite, color: "#646CFF" },
      { name: "React Router", icon: SiReactrouter, color: "#CA4245" },
      { name: "TanStack Query", icon: SiReactquery, color: "#FF4154" },
      { name: "Axios", icon: SiAxios, color: "#5A29E4" },
      { name: "Lucide React", icon: SiLucide, color: "#F56565" },
      { name: "REST API", icon: Webhook, color: "#FB923C" },
    ],
    image: "/images/nexus-preview.jpg",
    visual: "app",
    links: [
      { label: "View Project", url: "https://nexus-ecommerce-admin-portal-zeta.vercel.app/" },
      { label: "View Code", url: "https://github.com/Anshika366/Nexus-ecommerce-admin-portal" },
    ],
  },
  {
    title: "VoxSales AI",
    description: "An AI voice sales representative that conducts multilingual voice calls, handles objections, qualifies leads, and logs call outcomes.",
    tech: ["React.js", "JavaScript", "Node.js", "Gemini API", "AI Integration", "Web Speech API", "Tailwind CSS"],
    techLogos: [
      { name: "React.js", icon: SiReact, color: "#61DAFB" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
      { name: "Gemini API", icon: SiGooglegemini, color: "#60A5FA" },
      { name: "AI Integration", icon: Sparkles, color: "#A78BFA" },
      { name: "Web Speech API", icon: Mic, color: "#22D3EE" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
    ],
    image: "/images/voxsales-preview.jpg",
    visual: "ai",
    links: [
      { label: "View Project", url: "https://voxsales-ai.vercel.app/" },
      { label: "View Code", url: "https://github.com/Anshika366/voxsales-ai" },
    ],
  },
  {
    title: "RakshaX",
    description: "RakshaX is a safety-focused Progressive Web App (PWA) that helps users send emergency alerts with live GPS location to their trusted guardians through SMS, WhatsApp, voice calls, and email.",
    tech: [
      "React.js", "TypeScript", "Node.js", "Express.js", "REST API",
      "Supabase PostgreSQL", "Tailwind CSS", "Twilio API", "SendGrid Email", "Leaflet", "OpenStreetMap",
    ],
    techLogos: [
      { name: "React.js", icon: SiReact, color: "#61DAFB" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
      { name: "Express.js", icon: SiExpress, color: "#F4F4F5" },
      { name: "REST API", icon: Webhook, color: "#FB923C" },
      { name: "Supabase PostgreSQL", icon: SiSupabase, color: "#3ECF8E" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Twilio API", icon: PhoneCall, color: "#F22F46" },
      { name: "SendGrid Email", icon: Mail, color: "#38BDF8" },
      { name: "Leaflet", icon: SiLeaflet, color: "#199900" },
      { name: "OpenStreetMap", icon: SiOpenstreetmap, color: "#7EBC6F" },
    ],
    image: "/images/rakshax-preview.jpg",
    visual: "api",
    links: [
      { label: "View Project", url: "" },
      { label: "View Code", url: "https://github.com/Anshika366/RakshaX" },
    ],
  },
];

export type SkillItem = {
  name: string;
  icon?: IconType | LucideIcon;
  color: string;
  highlight?: boolean;
};

export type SkillGroup = {
  title: string;
  items: SkillItem[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend Development",
    items: [
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: SiCss, color: "#38BDF8" },
      { name: "JavaScript (ES6+)", icon: SiJavascript, color: "#F7DF1E", highlight: true },
      { name: "React.js", icon: SiReact, color: "#61DAFB", highlight: true },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
    ],
  },
  {
    title: "Backend Development",
    items: [
      { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E", highlight: true },
      { name: "Express.js", icon: SiExpress, color: "#F4F4F5", highlight: true },
      { name: "Python", icon: SiPython, color: "#4B8BBE" },
      { name: "FastAPI", icon: SiFastapi, color: "#05998B", highlight: true },
      { name: "RESTful APIs", icon: SiOpenapiinitiative, color: "#6BA539" },
    ],
  },
  {
    title: "Databases",
    items: [
      { name: "MongoDB", icon: SiMongodb, color: "#47A248", highlight: true },
      { name: "MongoDB Atlas", icon: SiMongodb, color: "#00ED64" },
      { name: "SQL", icon: TbSql, color: "#38BDF8" },
      { name: "Mongoose", icon: SiMongoose, color: "#E04E4E" },
      { name: "Motor", icon: Zap, color: "#22C55E" },
    ],
  },
  {
    title: "Tools & Platforms",
    items: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub, color: "#F4F4F5" },
      { name: "VS Code", icon: VscVscode, color: "#3B9EE8" },
      { name: "Postman", icon: SiPostman, color: "#FF6C37" },
      { name: "Docker", icon: SiDocker, color: "#2496ED", highlight: true },
      { name: "Jupyter Notebook", icon: SiJupyter, color: "#F37626" },
      { name: "Vercel", icon: SiVercel, color: "#F4F4F5" },
      { name: "Render", icon: SiRender, color: "#46E3B7" },
    ],
  },
  {
    title: "AI, Machine Learning & Automation",
    items: [
      { name: "Artificial Intelligence", icon: BrainCircuit, color: "#A78BFA", highlight: true },
      { name: "Hugging Face", icon: SiHuggingface, color: "#FFD21E", highlight: true },
      { name: "NVIDIA", icon: SiNvidia, color: "#76B900" },
      { name: "NumPy", icon: SiNumpy, color: "#4DABCF" },
      { name: "Pandas", icon: SiPandas, color: "#A5B4FC" },
      { name: "AI Coding Tools", icon: Sparkles, color: "#FF8547" },
    ],
  },
  {
    title: "Additional Technical Skills",
    items: [
      { name: "Data Structures & Algorithms (Fundamentals)", icon: TbBinaryTree, color: "#60A5FA" },
      { name: "Context API", icon: SiReact, color: "#61DAFB" },
      { name: "State Management", icon: Layers, color: "#38BDF8" },
      { name: "JWT Authentication", icon: SiJsonwebtokens, color: "#FB015B", highlight: true },
      { name: "API Integration", icon: TbApi, color: "#FB923C" },
    ],
  },
];

export type EducationHighlight = {
  label: string;
  icon: IconType | LucideIcon;
  color: string;
};

export type EducationItem = {
  degree: string;
  institution: string;
  location: string;
  dates: string;
  badge: string;
  icon: LucideIcon;
  description: string;
  highlights: EducationHighlight[];
};

export const education: EducationItem[] = [
  {
    degree: "Bachelor of Commerce",
    institution: "Dr. Ashok Smarak PG College",
    location: "Uttar Pradesh",
    dates: "2025 — 2028",
    badge: "Undergraduate Degree",
    icon: GraduationCap,
    description: "Developing knowledge of Business Management, Accounting, and Financial Analysis.",
    highlights: [
      { label: "Business Management", icon: Briefcase, color: "#FF8547" },
      { label: "Accounting", icon: Calculator, color: "#38BDF8" },
      { label: "Financial Analysis", icon: TrendingUp, color: "#4ADE80" },
    ],
  },
  {
    degree: "Software Development Diploma Course",
    institution: "NavGurukul Foundation for Social Welfare",
    location: "Pune, Maharashtra",
    dates: "2025 — Present",
    badge: "Technical Diploma",
    icon: Award,
    description: "Building practical skills in Full-Stack Web Development and modern web technologies — crafting responsive user interfaces, RESTful APIs, databases, and deployed web applications.",
    highlights: [
      { label: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { label: "CSS3", icon: SiCss, color: "#38BDF8" },
      { label: "JavaScript (ES6+)", icon: SiJavascript, color: "#F7DF1E" },
      { label: "React.js", icon: SiReact, color: "#61DAFB" },
      { label: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { label: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
      { label: "Express.js", icon: SiExpress, color: "#F4F4F5" },
      { label: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { label: "Python", icon: SiPython, color: "#4B8BBE" },
      { label: "FastAPI", icon: SiFastapi, color: "#05998B" },
      { label: "Git & GitHub", icon: SiGit, color: "#F05032" },
    ],
  },
];

export type ExperienceItem = {
  role: string;
  org: string;
  logo: string;
  location: string;
  duration: string;
  dates: string;
  badge: string;
  points: string[];
  tech: { name: string; icon: IconType | LucideIcon; color: string }[];
};

export const experience: ExperienceItem[] = [
  {
    role: "Web Development Intern",
    org: "Honeybee Digital",
    logo: "/images/honeybee-digital-emblem.png",
    location: "Remote",
    duration: "3 Months",
    dates: "April 2026 — July 2026",
    badge: "3-Month Internship",
    points: [
      "Built responsive UI components and interactive web pages using React.js, Tailwind CSS, HTML5, CSS3, and modern JavaScript (ES6+).",
      "Collaborated with the development team to enhance and maintain web applications, resolve UI issues, and deliver sprint tasks reliably.",
      "Wrote clean, modular code with Git and GitHub version control while following team coding standards and cross-device responsiveness best practices.",
    ],
    tech: [
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: SiCss, color: "#38BDF8" },
      { name: "JavaScript (ES6+)", icon: SiJavascript, color: "#F7DF1E" },
      { name: "React.js", icon: SiReact, color: "#61DAFB" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Responsive Design", icon: LayoutGrid, color: "#A78BFA" },
      { name: "Git & GitHub", icon: SiGit, color: "#F05032" },
    ],
  },
];
