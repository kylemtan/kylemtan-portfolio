export type Project = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  liveUrl?: string;
  codeUrl?: string;
  status?: "live" | "in-progress" | "archived";
  highlight?: string;
  group: "ai" | "ml" | "web" | "research";
  featured?: boolean;
  legacy?: boolean;
};

export const projects: Project[] = [
  {
    id: "rag-app",
    title: "RAG Application",
    tagline: "End-to-end RAG app with a vector-database retrieval pipeline.",
    description:
      "In progress — a deployed RAG application with a vector-DB retrieval pipeline, an LLM answering over a document corpus, a FastAPI backend, and a live demo. Update with real details and links once built.",
    stack: ["Python", "FastAPI", "Vector DB", "LLM"],
    status: "in-progress",
    group: "ai",
    featured: true,
  },
  {
    id: "sempai",
    title: "SempAI",
    tagline: "An AI agent that plans your week of meals and orders the groceries.",
    description:
      "Takes dietary preferences and spare ingredients and turns them into a full weekly meal plan, then auto-populates a Kroger cart for delivery — orchestrating an LLM, web search, and grocery fulfillment end to end.",
    stack: ["TypeScript", "React", "Vite", "Claude API", "Tavily API", "Kroger API"],
    liveUrl: "https://semp-ai.onrender.com",
    codeUrl: "https://github.com/kylemtan/SempAI",
    status: "live",
    group: "ai",
    featured: true,
  },
  {
    id: "dr-classifier",
    title: "Diabetic Retinopathy Classifier",
    tagline: "CNN that grades diabetic-retinopathy severity from fundus images.",
    description:
      "A convolutional neural network with batch normalization and max pooling that classifies diabetic-retinopathy severity levels. Built through USC's Center for AI in Society (CAIS++).",
    highlight: "73.77% accuracy",
    stack: ["Python", "PyTorch"],
    group: "ml",
  },
  {
    id: "spardle",
    title: "Spardle!",
    tagline: "Real-time multiplayer Wordle with live head-to-head play.",
    description:
      "A multiplayer take on Wordle with live head-to-head play, real-time state sync, and a clean competitive UI.",
    highlight: "3,000+ users at peak",
    stack: ["React", "Node.js", "Socket.IO"],
    liveUrl: "https://spardle.onrender.com",
    status: "live",
    group: "web",
  },

  // ── Earlier work ──────────────────────────────────────────────────────────

  {
    id: "jimbogames",
    title: "JimboGames",
    tagline: "Browser minigame hub with room-based multiplayer lobbies.",
    description:
      "A multiplayer minigame platform built in high school. Players create accounts, connect to a shared room, and choose from a collection of party games to play together in real time.",
    stack: ["JavaScript", "Node.js", "Socket.IO"],
    liveUrl: "https://jimbogames.netlify.app/hi",
    status: "archived",
    group: "web",
    legacy: true,
  },
  {
    id: "aquarium-portfolio",
    title: "Aquarium Portfolio",
    tagline: "A pixel-art fish tank where each fish is a project.",
    description:
      "My sophomore-year portfolio reimagined as an interactive aquarium. Fish drift freely across the screen, your cursor becomes a net, and catching one reveals the project or internship it represents. Built entirely from scratch with pixel art animations.",
    stack: ["JavaScript", "HTML/CSS", "Canvas"],
    liveUrl: "https://kylemtan.netlify.app/",
    status: "archived",
    group: "web",
    legacy: true,
  },
];
