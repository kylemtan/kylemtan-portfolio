"use client";

import { projects } from "@/data/projects";

const GROUP_LABELS: Record<string, string> = {
  ai: "AI",
  ml: "ML",
  web: "Web",
  research: "Research",
};

const GROUP_COLORS: Record<string, string> = {
  ai: "#5b9df9",
  ml: "#34d399",
  web: "#60a5fa",
  research: "#a78bfa",
};

export default function ProjectCards() {
  return (
    <section
      id="projects"
      className="max-w-6xl mx-auto px-6 py-24"
      aria-labelledby="projects-heading"
    >
      {/* Section header */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-6 h-px"
            style={{ background: "var(--accent)" }}
            aria-hidden="true"
          />
          <span
            className="font-mono text-xs tracking-[0.2em] uppercase"
            style={{ color: "var(--accent)" }}
          >
            Selected Work
          </span>
        </div>
        <h2
          id="projects-heading"
          className="text-3xl sm:text-4xl font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Things I&apos;ve built
        </h2>
        <p
          className="mt-3 text-sm max-w-md"
          style={{ color: "var(--text-muted)" }}
        >
          From AI agents to neural networks — each project lives in{" "}
          <code
            className="font-mono text-xs px-1.5 py-0.5 rounded"
            style={{
              background: "var(--accent-dim)",
              color: "var(--accent-soft)",
            }}
          >
            data/projects.ts
          </code>
          . Adding a new one takes editing that file alone.
        </p>
      </div>

      {/* Cards grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
        role="list"
        aria-label="Project list"
      >
        {projects.map((project) => {
          const groupColor =
            GROUP_COLORS[project.group] ?? "#5b9df9";

          return (
            <article
              key={project.id}
              role="listitem"
              className="group relative flex flex-col rounded-xl border p-6 transition-all duration-300"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = groupColor + "50";
                e.currentTarget.style.boxShadow = `0 0 32px ${groupColor}0f`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Top row: badges */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="font-mono text-xs px-2 py-0.5 rounded border tracking-wider"
                  style={{
                    color: groupColor,
                    borderColor: groupColor + "35",
                    background: groupColor + "0f",
                  }}
                >
                  {GROUP_LABELS[project.group] ?? project.group}
                </span>

                {project.featured && (
                  <span
                    className="font-mono text-xs px-2 py-0.5 rounded border tracking-wider"
                    style={{
                      color: "var(--accent-soft)",
                      borderColor: "rgba(91,157,249,0.25)",
                      background: "rgba(91,157,249,0.06)",
                    }}
                  >
                    Featured
                  </span>
                )}

                {project.status === "live" && (
                  <span
                    className="ml-auto flex items-center gap-1.5 font-mono text-xs"
                    style={{ color: "#34d399" }}
                    aria-label="Live project"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: "#34d399" }}
                      aria-hidden="true"
                    />
                    Live
                  </span>
                )}

                {project.status === "in-progress" && (
                  <span
                    className="ml-auto font-mono text-xs"
                    style={{ color: "#f59e0b" }}
                    aria-label="Project in progress"
                  >
                    In Progress
                  </span>
                )}
              </div>

              {/* Title */}
              <h3
                className="text-lg font-semibold mb-1.5"
                style={{ color: "var(--text-primary)" }}
              >
                {project.title}
              </h3>

              {/* Tagline */}
              <p
                className="text-sm mb-4 flex-1"
                style={{ color: "var(--text-muted)" }}
              >
                {project.tagline}
              </p>

              {/* Highlight metric */}
              {project.highlight && (
                <div
                  className="inline-flex items-center gap-2 text-xs font-mono px-2.5 py-1.5 rounded-lg mb-4 self-start"
                  style={{
                    color: groupColor,
                    background: groupColor + "12",
                  }}
                >
                  <span aria-hidden="true">◆</span>
                  {project.highlight}
                </div>
              )}

              {/* Stack chips */}
              <div
                className="flex flex-wrap gap-1.5 mb-5"
                aria-label={`Tech stack: ${project.stack.join(", ")}`}
              >
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs px-2 py-0.5 rounded border"
                    style={{
                      color: "var(--text-muted)",
                      borderColor: "var(--border)",
                      background: "rgba(91,157,249,0.04)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Divider */}
              {
                (project.liveUrl || project.codeUrl) && (
                  <div
                    className="w-full h-px mb-4"
                    style={{ background: "var(--border)" }}
                    aria-hidden="true"
                  />
                )
              }

              {/* Action links */}
              <div className="flex items-center gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium px-3.5 py-1.5 rounded-lg transition-all"
                    style={{
                      background: groupColor,
                      color: "#0a1326",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = "0.85")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.opacity = "1")
                    }
                    aria-label={`Open ${project.title} live site`}
                  >
                    ↗ Live
                  </a>
                )}
                {project.codeUrl && (
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm px-3.5 py-1.5 rounded-lg border transition-all"
                    style={{
                      color: "var(--accent-soft)",
                      borderColor: "rgba(91,157,249,0.25)",
                      background: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "var(--accent-dim)";
                      e.currentTarget.style.borderColor =
                        "rgba(91,157,249,0.45)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor =
                        "rgba(91,157,249,0.25)";
                    }}
                    aria-label={`View ${project.title} source code`}
                  >
                    {"</>"} Code
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
