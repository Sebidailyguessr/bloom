import Link from 'next/link'

export default function AboutPage() {
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
        About Bloom
      </h1>

      <p style={{ fontFamily: 'var(--serif)', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 16 }}>
        Bloom is a daily flood-fill colour puzzle. Starting from the top-left corner, pick colours
        to flood-fill the grid — each move spreads your colour as far as it connects. Fill the entire
        14×14 grid in as few moves as possible.
      </p>

      <p style={{ fontFamily: 'var(--serif)', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 16 }}>
        One puzzle per day, shared by everyone. Free, no account needed. Your progress is saved
        locally in your browser.
      </p>

      <h2 className="seo-h2" style={{ marginTop: 40 }}>More games on Stoop</h2>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { label: 'DailyGuessr', href: 'https://dailyguessr.app', desc: 'Guess the place from a street view photo' },
          { label: 'FlagGuessr', href: 'https://flagguessr.app', desc: 'Guess the country from its flag' },
          { label: 'CocktailGuessr', href: 'https://cocktailguessr.app', desc: 'Identify the cocktail from a zoomed image' },
          { label: 'Palette', href: 'https://palette.stoop.games', desc: 'Daily colour-matching puzzle' },
        ].map(g => (
          <li key={g.href} style={{ fontFamily: 'var(--serif)', color: 'var(--ink-soft)' }}>
            <a href={g.href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--terracotta)', textDecoration: 'none' }}>
              {g.label}
            </a>
            {' '}— {g.desc}
          </li>
        ))}
      </ul>
    </div>
  )
}
