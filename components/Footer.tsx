"use client";

import { profile } from "@/data/profile";

const stripProtocol = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, "");

const LINKS = [
  {
    href: `mailto:${profile.email}`,
    label: "Email",
    display: profile.email,
    external: false,
  },
  {
    href: profile.linkedin,
    label: "LinkedIn",
    display: stripProtocol(profile.linkedin),
    external: true,
  },
  {
    href: profile.github,
    label: "GitHub",
    display: stripProtocol(profile.github),
    external: true,
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="border-t"
      style={{
        background: "var(--bg-mid)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Resume CTA */}
        <section
          id="resume"
          className="mb-14 rounded-2xl border px-7 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{
            background: "rgba(91,157,249,0.04)",
            borderColor: "rgba(91,157,249,0.2)",
          }}
          aria-label="Resume download"
        >
          <div>
            <p
              className="font-mono text-xs tracking-[0.2em] uppercase mb-1"
              style={{ color: "var(--accent)" }}
            >
              Resume
            </p>
          </div>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-sm font-medium px-5 py-2.5 rounded-lg transition-all"
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
            aria-label="Download resume PDF (opens in new tab)"
          >
            View PDF ↗
          </a>
        </section>

        {/* Contact links */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8"
        >
          <div>
            <p
              className="font-mono text-xs tracking-[0.2em] uppercase mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              Get in touch
            </p>
            <nav
              aria-label="Contact links"
              className="flex flex-col gap-2.5"
            >
              {LINKS.map(({ href, label, display, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="text-sm group flex items-center gap-2 transition-colors"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--accent-soft)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-muted)")
                  }
                  aria-label={`${label}: ${display}`}
                >
                  <span
                    className="font-mono text-xs w-16 shrink-0"
                    style={{ color: "var(--text-muted)", opacity: 0.5 }}
                  >
                    {label}
                  </span>
                  <span>{display}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Brand mark */}
          <div className="text-right">
            <p
              className="font-mono text-2xl font-bold mb-1"
              style={{ color: "var(--accent)" }}
            >
              {profile.shortName}
            </p>
            <p
              className="font-mono text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {stripProtocol(profile.siteUrl)}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
          style={{ borderColor: "var(--border)" }}
        >
          <p
            className="font-mono text-xs"
            style={{ color: "var(--text-muted)", opacity: 0.4 }}
          >
            © {year} {profile.name}
          </p>
          <p
            className="font-mono text-xs"
            style={{ color: "var(--text-muted)", opacity: 0.4 }}
          >
            Built with Next.js + Tailwind · Deployed on Render
          </p>
        </div>
      </div>
    </footer>
  );
}
