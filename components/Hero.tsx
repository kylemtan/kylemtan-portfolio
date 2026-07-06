"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { profile } from "@/data/profile";
import { projects, Project } from "@/data/projects";
import ProjectDetail from "./ProjectDetail";

const NodeGraph = dynamic(() => import("./NodeGraph"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ minHeight: 380 }}
      aria-busy="true"
      aria-label="Loading project graph"
    >
      <div
        className="font-mono text-xs tracking-widest animate-pulse"
        style={{ color: "var(--text-muted)" }}
      >
        INITIALIZING
      </div>
    </div>
  ),
});

const LINKS = [
  {
    href: profile.github,
    label: "GitHub",
    external: true,
    primary: false,
  },
  {
    href: profile.linkedin,
    label: "LinkedIn",
    external: true,
    primary: false,
  },
  {
    href: profile.resumeUrl,
    label: "Resume ↗",
    external: true,
    primary: true,
  },
  {
    href: `mailto:${profile.email}`,
    label: "Email",
    external: false,
    primary: false,
  },
];

export default function Hero() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [firstName, ...restName] = profile.name.split(" ");

  return (
    <>
      <section
        id="hero"
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        aria-label="Introduction"
      >
        {/* Radial background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 65% 50%, rgba(91,157,249,0.07) 0%, transparent 70%), " +
              "radial-gradient(ellipse 50% 40% at 20% 80%, rgba(91,157,249,0.04) 0%, transparent 60%)",
          }}
        />

        {/* Grid dot pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(91,157,249,0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto w-full px-6 pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_6fr] gap-12 lg:gap-8 items-center min-h-[520px]">
            {/* Left — text content */}
            <div className="flex flex-col gap-6 animate-fade-up">
              {/* Role label */}
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-px"
                  style={{ background: "var(--accent)" }}
                  aria-hidden="true"
                />
                <span
                  className="font-mono text-xs tracking-[0.2em] uppercase"
                  style={{ color: "var(--accent)" }}
                >
                  {profile.roleLabel}
                </span>
              </div>

              {/* Name */}
              <div>
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.08] tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {firstName}
                  <br />
                  <span style={{ color: "var(--accent-soft)" }}>
                    {restName.join(" ")}
                  </span>
                </h1>
              </div>

              {/* Headline */}
              <p
                className="text-lg sm:text-xl font-light"
                style={{ color: "var(--text-soft)" }}
              >
                {profile.headline}
              </p>

              {/* Summary */}
              <p
                className="text-sm leading-relaxed max-w-md"
                style={{ color: "var(--text-muted)" }}
              >
                {profile.summary}
              </p>

              {/* CTA links */}
              <div
                className="flex flex-wrap gap-3 pt-2"
                role="list"
                aria-label="Contact and profile links"
              >
                {LINKS.map(({ href, label, external, primary }) => (
                  <a
                    key={label}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    role="listitem"
                    className="text-sm px-4 py-2 rounded-lg border transition-all"
                    style={{
                      color: primary ? "#0a1326" : "var(--accent-soft)",
                      background: primary
                        ? "var(--accent)"
                        : "transparent",
                      borderColor: primary
                        ? "transparent"
                        : "rgba(91,157,249,0.25)",
                    }}
                    onMouseEnter={(e) => {
                      if (primary) {
                        e.currentTarget.style.background = "#7ab3ff";
                      } else {
                        e.currentTarget.style.background =
                          "var(--accent-dim)";
                        e.currentTarget.style.borderColor =
                          "rgba(91,157,249,0.5)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (primary) {
                        e.currentTarget.style.background =
                          "var(--accent)";
                      } else {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor =
                          "rgba(91,157,249,0.25)";
                      }
                    }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Right — node graph */}
            <div
              className="relative w-full lg:h-[520px] h-[360px]"
              style={{ animationDelay: "0.15s" }}
            >
              {/* Mobile: hint text */}
              <p
                className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs font-mono tracking-wide lg:hidden pb-1 z-10"
                style={{ color: "var(--text-muted)" }}
                aria-hidden="true"
              >
                tap a node to explore
              </p>
              {/* Desktop: hint text */}
              <p
                className="absolute bottom-0 right-0 text-xs font-mono tracking-wide hidden lg:block pb-1 z-10"
                style={{ color: "var(--text-muted)" }}
                aria-hidden="true"
              >
                click a node to explore
              </p>
              <NodeGraph
                projects={projects}
                onNodeClick={setActiveProject}
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce"
          aria-hidden="true"
        >
          <div
            className="font-mono text-xs tracking-widest uppercase"
            style={{
              color: "var(--accent-soft)",
              animation: "text-glow-pulse 2s ease-in-out infinite",
            }}
          >
            scroll
          </div>
          <div
            className="w-px h-8 animate-pulse"
            style={{ background: "var(--accent)" }}
          />
        </div>
      </section>

      {/* Project detail modal */}
      {activeProject && (
        <ProjectDetail
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </>
  );
}
