"use client";

import { profile } from "@/data/profile";

const SKILLS = [
  "Python",
  "PyTorch",
  "TypeScript",
  "React",
  "FastAPI",
  "LLMs",
  "RAG",
  "Agent tooling",
  "Node.js",
  "SQL",
  "Git",
];

export default function About() {
  return (
    <section
      id="about"
      className="max-w-6xl mx-auto px-6 py-24 border-t"
      style={{ borderColor: "var(--border)" }}
      aria-labelledby="about-heading"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_6fr] gap-16 min-w-0">
        {/* Left */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-6 h-px"
              style={{ background: "var(--accent)" }}
              aria-hidden="true"
            />
            <span
              className="font-mono text-xs tracking-[0.2em] uppercase"
              style={{ color: "var(--accent)" }}
            >
              About
            </span>
          </div>

          <h2
            id="about-heading"
            className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Builder first,
            <br />
            researcher second.
          </h2>

          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "var(--text-soft)" }}
          >
            {profile.summary}
          </p>

          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "var(--text-muted)" }}
          >
            I&apos;m drawn to the gap between &quot;works in a notebook&quot;
            and &quot;ships to users.&quot; Whether it&apos;s wiring an LLM
            to a grocery API or training a CV model on medical imaging
            data, I care most about getting things across that gap cleanly
            and fast.
          </p>

          <div
            className="inline-flex items-center gap-3 px-4 py-3 rounded-xl border text-sm"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                background: "var(--accent)",
                boxShadow: "0 0 6px var(--accent)",
              }}
              aria-hidden="true"
            />
            <div>
              <div
                className="font-medium text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                USC · BS/MS Computer Science + AI
              </div>
              <div
                className="text-xs mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                Presidential Scholar · Los Angeles, CA
              </div>
            </div>
          </div>
        </div>

        {/* Right — skills */}
        <div className="flex flex-col justify-center">
          <p
            className="font-mono text-xs tracking-[0.2em] uppercase mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            Core stack
          </p>

          <div
            className="flex flex-wrap gap-2 mb-10"
            role="list"
            aria-label="Skills"
          >
            {SKILLS.map((skill) => (
              <span
                key={skill}
                role="listitem"
                className="font-mono text-sm px-3 py-1.5 rounded-lg border transition-all duration-200"
                style={{
                  color: "var(--text-soft)",
                  borderColor: "var(--border)",
                  background: "var(--bg-card)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "rgba(91,157,249,0.45)";
                  e.currentTarget.style.color = "var(--accent-soft)";
                  e.currentTarget.style.background = "var(--accent-dim)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-soft)";
                  e.currentTarget.style.background = "var(--bg-card)";
                }}
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Seeking line */}
          <div
            className="rounded-xl border px-5 py-4"
            style={{
              background: "rgba(91,157,249,0.04)",
              borderColor: "rgba(91,157,249,0.2)",
            }}
          >
            <p
              className="font-mono text-xs tracking-widest uppercase mb-1"
              style={{ color: "var(--accent)" }}
            >
              Open to opportunities
            </p>
            <p
              className="text-sm"
              style={{ color: "var(--text-soft)" }}
            >
              Seeking Summer 2027 software-engineering and ML
              internships. Based in Los Angeles; open to remote or
              relocation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
