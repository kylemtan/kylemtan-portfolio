"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { profile } from "@/data/profile";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b"
          : ""
      }`}
      style={{
        background: scrolled ? "rgba(10, 19, 38, 0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderColor: "var(--border)",
      }}
    >
      <nav
        className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between"
        aria-label="Primary navigation"
      >
        {/* Logo / name mark */}
        <Link
          href="#hero"
          className="font-mono text-xs tracking-[0.2em] uppercase transition-colors"
          style={{ color: "var(--accent)" }}
          aria-label="Kyle Macasilli-Tan — back to top"
        >
          KMT
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8" role="list">
          {[
            { href: "#projects", label: "Work" },
            { href: "#about", label: "About" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm transition-colors"
              role="listitem"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-muted)")
              }
            >
              {label}
            </a>
          ))}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm px-4 py-1.5 rounded border transition-all"
            style={{
              color: "var(--accent)",
              borderColor: "rgba(91,157,249,0.4)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--accent-dim)";
              e.currentTarget.style.borderColor = "rgba(91,157,249,0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(91,157,249,0.4)";
            }}
          >
            Resume ↗
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span
            className="block h-px w-5 transition-all"
            style={{ background: "var(--text-muted)" }}
          />
          <span
            className="block h-px w-5 transition-all"
            style={{ background: "var(--text-muted)" }}
          />
          <span
            className="block h-px w-5 transition-all"
            style={{ background: "var(--text-muted)" }}
          />
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-6 py-4 flex flex-col gap-4"
          style={{
            background: "rgba(10, 19, 38, 0.97)",
            borderColor: "var(--border)",
          }}
        >
          {[
            { href: "#projects", label: "Work" },
            { href: "#about", label: "About" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm"
            style={{ color: "var(--accent)" }}
            onClick={() => setMenuOpen(false)}
          >
            Resume ↗
          </a>
        </div>
      )}
    </header>
  );
}
