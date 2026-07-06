export type Profile = {
  name: string;
  shortName: string;
  roleLabel: string;
  roleTitle: string;
  headline: string;
  aboutHeadline: string;
  location: string;
  summary: string;
  shortSummary: string;
  bio: string;
  education: {
    school: string;
    distinction: string;
  };
  seeking: string;
  skills: string[];
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
  siteUrl: string;
};

export const profile: Profile = {
  name: "Kyle Macasilli-Tan",
  shortName: "KMT",
  roleLabel: "AI · Software Engineering · USC",
  roleTitle: "AI & Software Engineer",
  headline: "",
  aboutHeadline: "",
  location: "Los Angeles, CA",
  summary:
    "CS + AI student at USC (BS/MS, Presidential Scholar) who builds AI products that ship and get used. Strongest in Python and PyTorch across LLMs, RAG, and agent tooling — and comfortable across the full stack. Seeking Summer 2027 software-engineering and ML internships.",
  shortSummary:
    "CS + AI student at USC building AI products that ship. LLMs · RAG · agent tooling · full stack.",
  bio:
    "",
  education: {
    school: "USC · BS/MS Computer Science + AI",
    distinction: "Presidential Scholar",
  },
  seeking:
    "Seeking Summer 2027 software-engineering and ML internships. Based in Los Angeles; open to remote or relocation.",
  skills: [
    "Python",
    "TypeScript",
    "JavaScript",
    "C++",
    "Java",
    "SQL",
    "HTML/CSS",
    "PyTorch",
    "TensorFlow",
    "Machine Learning",
    "Deep Learning",
    "LLMs",
    "RAG",
    "Transformers",
    "Prompt Engineering",
    "Vector Databases",
    "Reinforcement Learning",
    "AI Agents",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "FastAPI",
    "REST APIs",
    "Docker",
    "Git",
    "Qdrant",
    "Google Cloud"
  ],
  email: "kylemacasillitan@gmail.com",
  github: "https://github.com/kylemtan",
  linkedin: "https://www.linkedin.com/in/kyle-macasilli-tan",
  resumeUrl: "/resume.pdf",
  siteUrl: "https://kylemtan.com",
};
