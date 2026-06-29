"use client";

import { useEffect, useCallback } from "react";
import { Project } from "@/data/projects";

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

interface Props {
  project: Project;
  onClose: () => void;
}

export default function ProjectDetail({ project, onClose }: Props) {
  const groupColor = GROUP_COLORS[project.group] ?? "#5b9df9";

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} project details`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,19,38,0.8)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop blur layer */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg rounded-xl border p-7 shadow-2xl"
        style={{
          background: "var(--bg-surface)",
          borderColor: groupColor + "40",
          boxShadow: `0 0 60px ${groupColor}18, 0 24px 64px rgba(0,0,0,0.5)`,
        }}
        role="document"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border text-sm transition-all"
          style={{
            color: "var(--text-muted)",
            borderColor: "var(--border)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-primary)";
            e.currentTarget.style.borderColor =
              "rgba(91,157,249,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-muted)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
          aria-label="Close project details"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-4 pr-8">
          {/* Group color dot */}
          <div
            className="mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{
              background: groupColor,
              boxShadow: `0 0 8px ${groupColor}`,
            }}
            aria-hidden="true"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="font-mono text-xs tracking-widest uppercase"
                style={{ color: groupColor }}
              >
                {GROUP_LABELS[project.group] ?? project.group}
              </span>
              {project.status === "live" && (
                <span
                  className="font-mono text-xs px-2 py-0.5 rounded-full border"
                  style={{
                    color: "#34d399",
                    borderColor: "rgba(52,211,153,0.3)",
                    background: "rgba(52,211,153,0.08)",
                  }}
                >
                  LIVE
                </span>
              )}
              {project.status === "in-progress" && (
                <span
                  className="font-mono text-xs px-2 py-0.5 rounded-full border"
                  style={{
                    color: "#f59e0b",
                    borderColor: "rgba(245,158,11,0.3)",
                    background: "rgba(245,158,11,0.08)",
                  }}
                >
                  IN PROGRESS
                </span>
              )}
            </div>
            <h2
              className="text-xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {project.title}
            </h2>
          </div>
        </div>

        {/* Highlight metric */}
        {project.highlight && (
          <div
            className="mb-4 px-3 py-2 rounded-lg border text-sm font-mono"
            style={{
              color: groupColor,
              borderColor: groupColor + "30",
              background: groupColor + "0f",
            }}
          >
            ◆ {project.highlight}
          </div>
        )}

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-5"
          style={{ color: "var(--text-soft)" }}
        >
          {project.description}
        </p>

        {/* Stack chips */}
        <div className="flex flex-wrap gap-2 mb-6" aria-label="Tech stack">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-xs px-2.5 py-1 rounded border"
              style={{
                color: "var(--text-muted)",
                borderColor: "var(--border)",
                background: "rgba(91,157,249,0.06)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: "var(--accent)",
                color: "#0a1326",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#7ab3ff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--accent)")
              }
            >
              ↗ Live
            </a>
          )}
          {project.codeUrl && (
            <a
              href={project.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all"
              style={{
                color: "var(--accent-soft)",
                borderColor: "rgba(91,157,249,0.3)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent-dim)";
                e.currentTarget.style.borderColor =
                  "rgba(91,157,249,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor =
                  "rgba(91,157,249,0.3)";
              }}
            >
              {"</>"} Code
            </a>
          )}
          {!project.liveUrl && !project.codeUrl && (
            <span
              className="text-sm px-4 py-2 rounded-lg border"
              style={{
                color: "var(--text-muted)",
                borderColor: "var(--border)",
              }}
            >
              Coming soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
