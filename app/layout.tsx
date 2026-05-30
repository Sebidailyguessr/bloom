import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import StoopNav from "./components/StoopNav";
import StoopFooter from "./components/StoopFooter";

export const metadata: Metadata = {
  title: 'Bloom — Daily flood-fill puzzle',
  description: 'Fill the 14×14 grid in as few moves as possible. One daily puzzle for everyone. Free, no account needed.',
  metadataBase: new URL('https://bloom.stoop.games'),
  openGraph: {
    title: 'Bloom — Daily flood-fill puzzle',
    description: 'Fill the grid in as few moves as possible. New puzzle every day.',
    url: 'https://bloom.stoop.games',
    siteName: 'Bloom',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bloom — Daily flood-fill puzzle',
    description: 'Fill the grid in as few moves as possible. New puzzle every day.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
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
          data-website-id="b9413555-f18f-4a03-99b6-657e0a64afad"
          strategy="afterInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Bloom",
            "url": "https://bloom.stoop.games",
            "description": "Daily flood-fill colour puzzle. Fill the 14×14 grid in as few moves as possible.",
            "applicationCategory": "Game",
            "genre": "Puzzle",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
          })}}
        />
      </body>
    </html>
  );
}
