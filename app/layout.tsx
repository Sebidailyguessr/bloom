import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import StoopNav from "./components/StoopNav";
import StoopFooter from "./components/StoopFooter";

export const metadata: Metadata = {
  title: "Bloom — Daily flood-fill colour game",
  description: "Flood-fill a 14×14 grid in as few moves as possible. A new puzzle every day.",
  openGraph: {
    title: "Bloom — Daily flood-fill colour game",
    description: "Flood-fill a 14×14 grid in as few moves as possible. A new puzzle every day.",
    siteName: "bloom.stoop.games",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caprasimo&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <StoopNav currentGame="bloom" />
        <main className="flex-1 flex flex-col">{children}</main>
        <StoopFooter />
        <Script
          src="https://analytics.stoop.games/script.js"
          data-website-id="BLOOM_UMAMI_ID"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
