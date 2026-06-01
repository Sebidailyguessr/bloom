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
    description: 'Fill the 14×14 grid in as few moves as possible. One daily puzzle for everyone. Free, no account needed.',
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
  verification: {
    google: 'qzS28dEX-PI3uCBvR4d0aLWy_dh9VHbqx2r8TGR_PU8',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

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
        <nav aria-label="More Stoop games" style={{ borderTop: '1px dashed rgba(42,31,21,0.18)', background: '#f3e9d6', padding: '24px 16px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--mono, "JetBrains Mono", monospace)', fontSize: 11, color: '#8a7355', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>More Stoop games</p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 24px' }}>
            <li><a href="https://dailyguessr.app" style={{ fontFamily: 'var(--serif, Georgia, serif)', fontSize: 14, color: '#5a4632', textDecoration: 'none' }}>DailyGuessr</a></li>
            <li><a href="https://flagguessr.app" style={{ fontFamily: 'var(--serif, Georgia, serif)', fontSize: 14, color: '#5a4632', textDecoration: 'none' }}>FlagGuessr</a></li>
            <li><a href="https://cocktailguessr.app" style={{ fontFamily: 'var(--serif, Georgia, serif)', fontSize: 14, color: '#5a4632', textDecoration: 'none' }}>CocktailGuessr</a></li>
            <li><a href="https://palette.stoop.games" style={{ fontFamily: 'var(--serif, Georgia, serif)', fontSize: 14, color: '#5a4632', textDecoration: 'none' }}>Palette</a></li>
            <li><a href="https://sortl.stoop.games" style={{ fontFamily: 'var(--serif, Georgia, serif)', fontSize: 14, color: '#5a4632', textDecoration: 'none' }}>Sortl</a></li>
          </ul>
        </nav>
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
