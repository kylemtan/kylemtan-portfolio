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
    id: "gpt-torch",
    title: "Transformer From Scratch",
    tagline: "A GPT-style language model built by hand in PyTorch — attention and all.",
    description:
      "A small GPT-style transformer implemented from scratch in PyTorch — multi-head self-attention, the causal mask, the training loop, and text generation all hand-written rather than pulled from a library. Progresses from a char-level model on Shakespeare to a BPE tokenizer on a real corpus, with modern upgrades (RoPE, weight tying, RMSNorm) evaluated through measured ablations.",
    stack: ["Python", "PyTorch", "Transformers", "BPE Tokenization"],
    codeUrl: "https://github.com/kylemtan/nanoformer",
    status: "in-progress",
    group: "ai",
    featured: true,
  },
  {
    id: "docs-navigator",
    title: "Docs Navigator",
    tagline: "Ask a question about a library's docs — get a source-cited answer.",
    description:
      "A multi-library RAG documentation assistant (Next.js, LangChain, LlamaIndex, Haystack) that answers natural-language questions with grounded, source-cited answers. BGE-M3 hybrid retrieval over Qdrant, cross-encoder reranking, and Claude for generation — FastAPI backend, Next.js frontend, Dockerized on Render. Built a 70-question benchmark and evaluation harness (recall@k, MRR, faithfulness, out-of-scope refusal) and used controlled ablations to select the pipeline, improving section-level recall@3 from 58% to 73%.",
    stack: ["Python", "FastAPI", "BGE-M3", "Qdrant", "Claude", "Docker", "Next.js"],
    liveUrl: "https://docs-navigator.onrender.com",
    codeUrl: "https://github.com/kylemtan/docs-navigator",
    status: "live",
    highlight: "70-question eval harness",
    group: "ai",
    featured: true,
  },
  {
    id: "sempai",
    title: "SempAI",
    tagline: "An AI agent that plans your week of meals and orders the groceries.",
    description:
      "Turns your dietary preferences and spare ingredients into a full weekly meal plan, then auto-populates a Kroger cart for delivery — orchestrating Claude, recipe search, and grocery fulfillment end to end.",
    stack: ["React", "TypeScript", "Vite", "Zustand", "Node.js", "Express", "Claude API", "Tavily API", "Kroger API"],
    liveUrl: "https://semp-ai.onrender.com",
    codeUrl: "https://github.com/kylemtan/SempAI",
    status: "live",
    group: "ai",
    featured: true,
  },
  {
    id: "dr-classifier",
    title: "Diabetic Retinopathy Classifier",
    tagline: "A CNN that grades diabetic-retinopathy severity from retinal images.",
    description:
      "A convolutional neural network with batch normalization and max pooling that classifies diabetic-retinopathy severity levels, built through USC's Center for AI in Society (CAIS++), a 30-member cohort selected from 300+ applicants.",
    highlight: "73.77% accuracy",
    stack: ["Python", "PyTorch"],
    group: "ml",
  },
  {
    id: "spardle",
    title: "Spardle!",
    tagline: "Real-time multiplayer Wordle with live head-to-head play.",
    description:
      "A multiplayer take on Wordle — race an opponent in real time with live state sync and a clean competitive UI.",
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
    tagline: "A browser minigame hub with room-based multiplayer lobbies.",
    description:
      "A multiplayer minigame platform built in high school. Players make an account, join a shared room, and pick from a collection of party games to play together in real time.",
    stack: ["JavaScript", "Node.js", "Socket.IO"],
    liveUrl: "https://jimbogames.netlify.app",
    status: "archived",
    group: "web",
    legacy: true,
  },
  {
    id: "aquarium-portfolio",
    title: "Aquarium Portfolio",
    tagline: "A pixel-art fish tank where every fish is a project.",
    description:
      "My sophomore-year portfolio reimagined as an interactive aquarium: fish drift across the screen, your cursor becomes a net, and catching one reveals the project or internship it represents. Hand-built with original pixel-art animations.",
    stack: ["JavaScript", "HTML/CSS", "Canvas"],
    liveUrl: "https://kylemtan.netlify.app",
    status: "archived",
    group: "web",
    legacy: true,
  },
];
