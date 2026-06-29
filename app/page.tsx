import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProjectCards from "@/components/ProjectCards";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Skip-to-content for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-medium"
        style={{ background: "var(--accent)", color: "#0a1326" }}
      >
        Skip to main content
      </a>

      <Nav />

      <main id="main-content">
        <Hero />
        <ProjectCards />
        <About />
      </main>

      <Footer />
    </>
  );
}
