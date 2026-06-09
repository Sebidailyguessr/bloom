'use client'

import { useState } from 'react'

type State = 'idle' | 'loading' | 'success' | 'exists' | 'error'

const mono: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
}

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json() as { success?: boolean; alreadySubscribed?: boolean; error?: string }

      if (data.alreadySubscribed) {
        setState('exists')
      } else if (data.success) {
        setState('success')
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  return (
    <div style={{
      borderBottom: '1px dashed rgba(42,31,21,0.18)',
      paddingBottom: 12,
      marginBottom: 10,
    }}>
      <p style={{
        ...mono,
        fontSize: 9,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: '#8a7355',
        margin: '0 0 4px',
      }}>
        Daily digest
      </p>
      <p style={{
        fontFamily: "'Newsreader', Georgia, serif",
        fontSize: 13,
        color: '#2a1f15',
        margin: '0 0 8px',
        lineHeight: 1.4,
      }}>
        One email a day — today&apos;s puzzles, one tap.
      </p>

      {state === 'success' && (
        <p style={{ ...mono, fontSize: 10, color: '#7a8a5e', margin: 0 }}>
          Check your inbox to confirm 👋
        </p>
      )}
      {state === 'exists' && (
        <p style={{ ...mono, fontSize: 10, color: '#7a8a5e', margin: 0 }}>
          You&apos;re already on the list 🎉
        </p>
      )}
      {state === 'error' && (
        <p style={{ ...mono, fontSize: 10, color: '#c45a3a', margin: 0 }}>
          Something went wrong, try again
        </p>
      )}

      {state !== 'success' && state !== 'exists' && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 6 }}>
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={state === 'loading'}
            style={{
              ...mono,
              flex: 1,
              fontSize: 10,
              padding: '5px 8px',
              background: '#f3e9d6',
              border: '1px solid rgba(42,31,21,0.25)',
              color: '#2a1f15',
              outline: 'none',
              minWidth: 0,
            }}
          />
          <button
            type="submit"
            disabled={state === 'loading'}
            style={{
              ...mono,
              fontSize: 9,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '5px 10px',
              background: '#c45a3a',
              color: '#f3e9d6',
              border: 'none',
              cursor: state === 'loading' ? 'default' : 'pointer',
              flexShrink: 0,
            }}
          >
            {state === 'loading' ? '...' : 'Subscribe'}
          </button>
        </form>
      )}
    </div>
  )
}
