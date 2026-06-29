import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://kylemtan.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Kyle Macasilli-Tan — AI & Software Engineer",
    template: "%s | Kyle Macasilli-Tan",
  },
  description:
    "CS + AI student at USC (BS/MS, Presidential Scholar) building AI products that ship. Strongest in Python and PyTorch across LLMs, RAG, and agent tooling. Seeking Summer 2027 internships.",
  keywords: [
    "Kyle Macasilli-Tan",
    "software engineer",
    "machine learning",
    "AI",
    "USC",
    "Python",
    "PyTorch",
    "React",
    "LLM",
    "RAG",
  ],
  authors: [{ name: "Kyle Macasilli-Tan" }],
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Kyle Macasilli-Tan",
    title: "Kyle Macasilli-Tan — AI & Software Engineer",
    description:
      "CS + AI student at USC building AI products that ship. LLMs · RAG · agent tooling · full stack.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kyle Macasilli-Tan — AI & Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kyle Macasilli-Tan — AI & Software Engineer",
    description:
      "CS + AI student at USC building AI products that ship. LLMs · RAG · agent tooling · full stack.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
