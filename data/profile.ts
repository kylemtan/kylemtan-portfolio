export type Profile = {
  name: string;
  headline: string;
  location: string;
  summary: string;
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
};

export const profile: Profile = {
  name: "Kyle Macasilli-Tan",
  headline: "I build AI that ships.",
  location: "Los Angeles, CA",
  summary:
    "CS + AI student at USC (BS/MS, Presidential Scholar) who builds AI products that ship and get used. Strongest in Python and PyTorch across LLMs, RAG, and agent tooling — and comfortable across the full stack. Seeking Summer 2027 software-engineering and ML internships.",
  email: "kylemacasillitan@gmail.com",
  github: "https://github.com/kylemtan",
  linkedin: "https://www.linkedin.com/in/kyle-macasilli-tan",
  resumeUrl: "/resume.pdf",
};
