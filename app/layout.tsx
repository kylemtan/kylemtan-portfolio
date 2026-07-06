import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { profile } from "@/data/profile";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const titleTag = `${profile.name} — ${profile.roleTitle}`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: titleTag,
    template: `%s | ${profile.name}`,
  },
  description: profile.summary,
  keywords: [
    profile.name,
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
  authors: [{ name: profile.name }],
  openGraph: {
    type: "website",
    url: profile.siteUrl,
    siteName: profile.name,
    title: titleTag,
    description: profile.shortSummary,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: titleTag,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: titleTag,
    description: profile.shortSummary,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "8D1ot9khglYhnuaKyCF2pFOJ2Clz6lMbCkxF49ncxRY",
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
