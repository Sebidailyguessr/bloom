import type { Metadata } from 'next'
import Link from 'next/link'

type Props = {
  searchParams: Promise<{ n?: string; label?: string; detail?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { n = '001', label = 'LEARNING TO GROW', detail = '' } = await searchParams
  const num = String(n).padStart(3, '0')
  const ogImageUrl = `/api/og?n=${encodeURIComponent(n)}&label=${encodeURIComponent(label)}&detail=${encodeURIComponent(detail)}`

  return {
    title: `Bloom #${num} — ${label}`,
    description: `${detail ? `${detail} - ` : ''}Can you beat it?`,
    openGraph: {
      title: `Bloom #${num} — ${label}`,
      description: `${detail ? `${detail} - ` : ''}Can you beat it?`,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Bloom #${num} — ${label}`,
      description: `${detail ? `${detail} - ` : ''}Can you beat it?`,
      images: [ogImageUrl],
    },
  }
}

export default async function SharePage({ searchParams }: Props) {
  const { n = '001', label = 'LEARNING TO GROW', detail = '' } = await searchParams
  const num = String(n).padStart(3, '0')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '64px 16px',
        textAlign: 'center',
        background: '#f3e9d6',
        fontFamily: 'var(--font-geist-mono, monospace)',
      }}
    >
      <p style={{ fontSize: 12, color: '#8a7355', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 32 }}>
        BLOOM
      </p>

      <div
        style={{
          background: '#fff',
          border: '1px solid rgba(42,31,21,0.12)',
          borderRadius: 16,
          padding: '32px 40px',
          maxWidth: 420,
          width: '100%',
          marginBottom: 32,
        }}
      >
        <p style={{ fontSize: 13, color: '#8a7355', letterSpacing: '0.1em', marginBottom: 16 }}>
          #{num}
        </p>
        <p
          style={{
            fontSize: 20,
            color: '#c45a3a',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: detail ? 12 : 0,
          }}
        >
          {label}
        </p>
        {detail && (
          <p style={{ fontSize: 16, color: '#2a1f15', letterSpacing: '0.04em' }}>
            {detail}
          </p>
        )}
      </div>

      <Link
        href="/"
        style={{
          display: 'inline-block',
          background: '#c45a3a',
          color: '#fff',
          padding: '14px 28px',
          borderRadius: '12px',
          fontSize: 15,
          fontWeight: 600,
          textDecoration: 'none',
          letterSpacing: '0.03em',
        }}
      >
        Play today&apos;s Bloom →
      </Link>
    </div>
  )
}
