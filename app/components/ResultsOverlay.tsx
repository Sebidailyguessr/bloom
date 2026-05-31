'use client'

import { useState, useEffect } from 'react'
import RotatingAlsoPlay from './RotatingAlsoPlay'

function getCountdown(): string {
  const now = new Date()
  const midnight = new Date(Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1,
    0, 0, 0
  ))
  const diff = Math.max(0, midnight.getTime() - now.getTime())
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  const s = Math.floor((diff % 60_000) / 1_000)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function getLabel(score: number): string {
  if (score === 10000) return "PERFECT BLOOM"
  if (score >= 9500)  return "MASTER GARDENER"
  if (score >= 8500)  return "KEEN GARDENER"
  if (score >= 7000)  return "GREEN THUMB"
  return "LEARNING TO GROW"
}

function getScore(moves: number, par: number): number {
  return Math.max(0, 10000 - (moves - par) * 500)
}

interface Props {
  moves: number
  par: number
  puzzleNumber: number
  mode: "daily" | "levels"
  onClose?: () => void
  onNextLevel?: () => void
  onPlayAgain?: () => void
}

const mono = "'JetBrains Mono', ui-monospace, monospace"

export default function ResultsOverlay({ moves, par, puzzleNumber, mode, onClose, onNextLevel, onPlayAgain }: Props) {
  const [countdown, setCountdown] = useState(getCountdown)
  const [copied, setCopied] = useState(false)

  const score = getScore(moves, par)
  const label = getLabel(score)
  const numStr = String(puzzleNumber).padStart(3, '0')

  useEffect(() => {
    if (mode !== 'daily') return
    const id = setInterval(() => setCountdown(getCountdown()), 1000)
    return () => clearInterval(id)
  }, [mode])

  const handleShare = async () => {
    const text = mode === 'daily'
      ? `🌊 Bloom #${numStr}\n${label}\n${moves} moves · par ${par}\nbloom.stoop.games`
      : `🌊 Bloom — Level ${puzzleNumber}\n${label}\n${moves} moves · par ${par}\nbloom.stoop.games`

    try { await navigator.clipboard.writeText(text) } catch { /* ignore */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(42,31,21,0.55)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--paper, #f3e9d6)',
          borderRadius: 16,
          width: '100%',
          maxWidth: 400,
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          border: '1px dashed rgba(42,31,21,0.22)',
          boxShadow: '0 8px 40px rgba(42,31,21,0.18)',
        }}
      >
        {/* X button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: 10, right: 12,
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: mono, fontSize: 18, color: 'var(--ink-faded, #8a7355)',
            lineHeight: 1, padding: '4px 6px',
          }}
        >×</button>

        <div style={{ padding: '24px 24px 20px' }}>
          {/* Header */}
          <p style={{
            fontFamily: mono, fontSize: 10, color: 'var(--ink-faded, #8a7355)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            margin: '0 0 14px',
          }}>
            BLOOM #{numStr} · {mode === 'daily' ? 'DAILY' : `LEVEL ${puzzleNumber}`}
          </p>

          {/* Emotion label */}
          <p style={{
            fontFamily: "'Caprasimo', serif",
            fontSize: 28, color: 'var(--terracotta, #c45a3a)',
            margin: '0 0 4px', lineHeight: 1.15,
          }}>{label}</p>

          {/* Score */}
          <p style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: 40, fontWeight: 700, color: 'var(--ink, #2a1f15)',
            margin: '8px 0 2px', lineHeight: 1,
          }}>
            {score.toLocaleString()}
            <span style={{ fontSize: 20, fontWeight: 400, color: 'var(--ink-faded, #8a7355)', marginLeft: 6 }}>
              / 10,000
            </span>
          </p>

          {/* Move count + par */}
          <p style={{
            fontFamily: mono, fontSize: 11, color: 'var(--ink-faded, #8a7355)',
            margin: '2px 0 18px',
          }}>{moves} moves · par {par}</p>

          {/* Mode-specific content */}
          {mode === 'daily' ? (
            <div style={{ marginBottom: 16 }}>
              <p style={{
                fontFamily: mono, fontSize: 11, color: 'var(--ink-soft, #5a4632)',
                margin: '0 0 8px',
              }}>🔥 Come back tomorrow to keep your streak!</p>
              <p style={{
                fontFamily: mono, fontSize: 20, fontWeight: 600,
                color: 'var(--ink, #2a1f15)', letterSpacing: '0.06em',
                margin: 0,
              }}>{countdown}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
              {onNextLevel && (
                <button
                  onClick={onNextLevel}
                  style={{
                    width: '100%', padding: '12px',
                    background: 'var(--terracotta, #c45a3a)', color: 'white',
                    border: 'none', borderRadius: 8,
                    fontFamily: mono, fontSize: 11,
                    textTransform: 'uppercase', letterSpacing: '0.18em',
                    cursor: 'pointer',
                  }}
                >Next Level →</button>
              )}
              {onPlayAgain && (
                <button
                  onClick={onPlayAgain}
                  style={{
                    width: '100%', padding: '12px',
                    background: 'transparent',
                    color: 'var(--ink-soft, #5a4632)',
                    border: '1px dashed rgba(42,31,21,0.3)',
                    borderRadius: 8,
                    fontFamily: mono, fontSize: 11,
                    textTransform: 'uppercase', letterSpacing: '0.18em',
                    cursor: 'pointer',
                  }}
                >↺ Play again</button>
              )}
            </div>
          )}

          {/* Share button */}
          <button
            onClick={handleShare}
            style={{
              width: '100%', padding: '12px',
              background: copied ? '#5a4632' : 'var(--terracotta, #c45a3a)',
              color: 'white',
              border: 'none', borderRadius: 8,
              fontFamily: mono, fontSize: 11,
              textTransform: 'uppercase', letterSpacing: '0.18em',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >{copied ? '✓ Copied!' : 'Share'}</button>
        </div>

        {/* Also Play */}
        <div style={{
          borderTop: '1px dashed rgba(42,31,21,0.18)',
          padding: '16px 24px 20px',
        }}>
          <p style={{
            fontFamily: mono, fontSize: 9, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: 'var(--ink-faded, #8a7355)',
            margin: '0 0 10px',
          }}>Also Play</p>
          <RotatingAlsoPlay />
        </div>
      </div>
    </div>
  )
}
