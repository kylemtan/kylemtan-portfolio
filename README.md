# kylemtan.com — Personal Portfolio

Personal portfolio for **Kyle Macasilli-Tan**. Built with Next.js (App Router, static export), TypeScript, and Tailwind CSS. The hero features an interactive SVG node-graph of projects powered by d3-force.

---

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # produces /out
```

Serve the static output locally to verify the production build:

```bash
npx serve out
```

---

## How to add a project

**Edit one file: [`data/projects.ts`](data/projects.ts)**

Add a new object to the `projects` array:

```ts
{
  id: "my-project",           // unique slug, kebab-case
  title: "My Project",
  tagline: "One line shown on node hover and in the card.",
  description: "2–3 sentences for the detail panel.",
  stack: ["Python", "FastAPI"],
  liveUrl: "https://...",     // optional
  codeUrl: "https://...",     // optional
  status: "live",             // "live" | "in-progress" | omit
  highlight: "10k users",     // optional metric callout
  group: "ai",                // "ai" | "ml" | "web" | "research" — drives node color
  featured: true,             // optional — larger node + "Featured" badge
},
```

That's it. The node graph, project cards, and detail panel all render from this array automatically.

---

## Resume PDF

Drop your resume at:

```
public/resume.pdf
```

The nav "Resume" link and footer "Download PDF" button both point to `/resume.pdf`. Kyle's browsers will open it in a new tab.

---

## Adding a favicon / OG image

- **Favicon:** replace `public/favicon.svg` with your own SVG (or add `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`).
- **OG image:** add `public/og-image.png` (1200 × 630 px). The LinkedIn banner works well as a placeholder. `app/layout.tsx` references it automatically.

---

## Interests section

The "Beyond code" section is stubbed out but commented in. When ready:

1. Open [`data/interests.ts`](data/interests.ts) and uncomment + fill in real interests.
2. Create `components/Interests.tsx` with your layout.
3. Import and add `<Interests />` between `<About />` and `<Footer />` in [`app/page.tsx`](app/page.tsx).

---

## Deploying to Render (Static Site)

1. Push this repo to GitHub.
2. In [Render](https://render.com), create a new **Static Site**.
3. Connect the GitHub repo.
4. Set:
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `out`
5. Click **Deploy**.

### Custom domain (`kylemtan.com`)

In the Render dashboard → your site → **Settings → Custom Domains**:

1. Add `kylemtan.com` and `www.kylemtan.com`.
2. Follow the DNS instructions Render provides (usually a CNAME or A record pointed at Render's edge).
3. Render provisions TLS automatically.

---

## Project structure

```
kylemtan-portfolio/
├── app/
│   ├── layout.tsx        # Root layout, metadata, OG tags, fonts
│   ├── page.tsx          # Single-page shell (Nav + sections)
│   └── globals.css       # Design tokens (CSS vars), Tailwind, animations
├── components/
│   ├── Nav.tsx           # Sticky nav, scroll-aware blur
│   ├── Hero.tsx          # Hero section — imports NodeGraph dynamically
│   ├── NodeGraph.tsx     # SVG + d3-force graph (client-only, ssr:false)
│   ├── ProjectDetail.tsx # Modal panel opened on node click
│   ├── ProjectCards.tsx  # Semantic project card grid
│   ├── About.tsx         # Bio + skills + USC badge
│   └── Footer.tsx        # Contact links + resume CTA
├── data/
│   ├── profile.ts        # Name, headline, links — edit here
│   ├── projects.ts       # ← Add/edit projects here
│   └── interests.ts      # Stubbed for later
└── public/
    ├── favicon.svg       # Replace with real favicon
    ├── og-image.png      # Add 1200×630 OG image
    └── resume.pdf        # Drop your resume here
```

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Graph | Custom SVG + d3-force (no canvas library) |
| Font | Geist (via next/font) |
| Deploy | Render Static Site |
| Output | `out/` (pure HTML/CSS/JS) |
