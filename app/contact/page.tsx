import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href="/"
        style={{ fontFamily: 'var(--mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--terracotta)', textDecoration: 'none' }}
        className="inline-block mb-8"
      >
        ← Back to game
      </Link>

      <h1 style={{ fontFamily: 'var(--display)', fontSize: 32, color: 'var(--ink)', marginBottom: 24 }}>
        Contact
      </h1>

      <p style={{ fontFamily: 'var(--serif)', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 16 }}>
        Have a question, suggestion, or found a bug? Reach out at{' '}
        <a
          href="mailto:hello@stoop.games"
          style={{ color: 'var(--terracotta)', textDecoration: 'none' }}
        >
          hello@stoop.games
        </a>
      </p>
    </div>
  )
}
