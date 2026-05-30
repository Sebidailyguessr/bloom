import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href="/"
        style={{ fontFamily: 'var(--mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--terracotta)', textDecoration: 'none' }}
        className="inline-block mb-8"
      >
        ← Back to game
      </Link>

      <h1 style={{ fontFamily: 'var(--display)', fontSize: 32, color: 'var(--ink)', marginBottom: 8 }}>
        Privacy Policy
      </h1>
      <p style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', color: 'var(--ink-faded)', marginBottom: 32 }}>
        Last updated: May 2026
      </p>

      <p style={{ fontFamily: 'var(--serif)', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 16 }}>
        Bloom is operated by <strong>Sebastian Racławski</strong>.
      </p>

      <h2 className="seo-h2" style={{ marginTop: 32 }}>Analytics</h2>
      <p style={{ fontFamily: 'var(--serif)', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 16 }}>
        This site uses{' '}
        <a href="https://umami.is" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--terracotta)', textDecoration: 'none' }}>
          Umami
        </a>
        {' '}for privacy-friendly analytics. Umami does not use cookies and collects no personally
        identifiable information. All analytics data is anonymous.
      </p>

      <h2 className="seo-h2" style={{ marginTop: 32 }}>Local Storage</h2>
      <p style={{ fontFamily: 'var(--serif)', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 16 }}>
        Game progress and history are stored locally in your browser using localStorage. No data
        is sent to our servers.
      </p>

      <h2 className="seo-h2" style={{ marginTop: 32 }}>Contact</h2>
      <p style={{ fontFamily: 'var(--serif)', color: 'var(--ink-soft)', lineHeight: 1.7 }}>
        Questions about this policy?{' '}
        <a href="mailto:hello@stoop.games" style={{ color: 'var(--terracotta)', textDecoration: 'none' }}>
          hello@stoop.games
        </a>
      </p>
    </div>
  )
}
