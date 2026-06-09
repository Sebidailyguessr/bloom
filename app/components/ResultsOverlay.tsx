'use client'

import { useState, useEffect, useRef } from 'react'
import RotatingAlsoPlay from './RotatingAlsoPlay'
import { trackEvent } from '@/utils/trackEvent'
import { useNextPuzzleCountdown } from '@/hooks/useNextPuzzleCountdown'

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

const STREAK_MILESTONES = [3, 7, 14, 30]

function getEmojiRow(score: number): string {
  if (score === 10000) return '🟩🟩🟩🟩🟩'
  if (score >= 9500)   return '🟩🟩🟩🟩⬛'
  if (score >= 8500)   return '🟩🟩🟩⬛⬛'
  if (score >= 7000)   return '🟩🟩⬛⬛⬛'
  return '🟩⬛⬛⬛⬛'
}

export default function ResultsOverlay({ moves, par, puzzleNumber, mode, onClose, onNextLevel, onPlayAgain }: Props) {
  const [countdown, setCountdown] = useState(getCountdown)
  const [copied, setCopied] = useState(false)
  const milestoneFired = useRef(false)

  const score = getScore(moves, par)
  const label = getLabel(score)
  const numStr = String(puzzleNumber).padStart(3, '0')

  const streakNextCountdown = useNextPuzzleCountdown()

  const streakCount = (() => {
    if (typeof window === 'undefined') return 0
    try {
      return parseInt(localStorage.getItem('bl-streak') ?? '0', 10)
    } catch {
      return 0
    }
  })()

  const streakState: 'active' | 'none' = streakCount > 0 ? 'active' : 'none'

  useEffect(() => {
    if (mode !== 'daily') return
    if (streakState === 'active' && STREAK_MILESTONES.includes(streakCount) && !milestoneFired.current) {
      milestoneFired.current = true
      trackEvent('streak_milestone', { game: 'bloom', milestone: streakCount })
    }
  }, [mode, streakState, streakCount])

  useEffect(() => {
    if (mode !== 'daily') return
    const id = setInterval(() => setCountdown(getCountdown()), 1000)
    return () => clearInterval(id)
  }, [mode])

  const buildResultsCanvas = (): Promise<Blob | null> =>
    new Promise((resolve) => {
      try {
        const W = 1200, H = 630
        const canvas = document.createElement('canvas')
        canvas.width = W; canvas.height = H
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(null); return }

        const num = numStr
        const labelColor = score >= 9000 ? '#c45a3a' : score >= 7000 ? '#8a7355' : '#6b5c4a'

        ctx.fillStyle = '#f3e9d6'; ctx.fillRect(0, 0, W, H)
        ctx.fillStyle = '#2a1f15'; ctx.fillRect(0, 0, W, 160)
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 26px monospace'
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(`BLOOM #${num}`, W / 2, 80)
        ctx.fillStyle = labelColor; ctx.font = 'bold 44px monospace'
        ctx.fillText(label, W / 2, 295)
        ctx.fillStyle = '#2a1f15'; ctx.font = 'bold 30px monospace'
        ctx.fillText(`${score.toLocaleString()} pts`, W / 2, 375)
        ctx.font = '48px sans-serif'
        ctx.fillText(getEmojiRow(score), W / 2, 455)
        ctx.fillStyle = '#8a7355'; ctx.font = '16px monospace'
        ctx.fillText('bloom.stoop.games', W / 2, 596)

        canvas.toBlob((blob) => resolve(blob), 'image/png')
      } catch { resolve(null) }
    })

  const handleShare = async () => {
    if (mode === 'daily') trackEvent('share_clicked', { game: 'bl', puzzleNo: puzzleNumber })

    const num = numStr
    const detail = `${score.toLocaleString()} pts`
    const shareUrl = `${window.location.origin}/share?n=${puzzleNumber}&label=${encodeURIComponent(label.replace(/_/g, ' '))}&detail=${encodeURIComponent(detail)}`
    const emojiRow = getEmojiRow(score)
    const text = `🌸 Bloom #${num}\n${label}\n${emojiRow}\n${shareUrl}`

    if (typeof navigator.canShare === 'function') {
      const blob = await buildResultsCanvas()
      if (blob) {
        const file = new File([blob], 'bloom.png', { type: 'image/png' })
        if (navigator.canShare({ files: [file] })) {
          try { await navigator.share({ files: [file], text, url: shareUrl }); return } catch { /* cancelled */ }
        }
      }
      if (navigator.canShare({ url: shareUrl })) {
        try { await navigator.share({ title: `Bloom #${num}`, text, url: shareUrl }); return } catch { /* cancelled */ }
      }
    }

    try { await navigator.clipboard.writeText(text) } catch { /* clipboard unavailable */ }
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

          <a href='https://ko-fi.com/stoopgames' target='_blank' rel='noopener noreferrer' onClick={() => trackEvent('kofi_clicked', { game: 'bl' })} style={{display:'block',textAlign:'center',fontFamily:'monospace',fontSize:'11px',color:'#8a7355',letterSpacing:'0.05em',textDecoration:'none',marginTop:'12px'}}>☕ enjoyed it? buy me a coffee</a>

          {/* Streak milestone badge */}
          {mode === 'daily' && streakState === 'active' && STREAK_MILESTONES.includes(streakCount) && (
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <span style={{
                display: 'inline-block',
                background: 'rgba(196, 90, 58, 0.08)',
                border: '1px solid rgba(196, 90, 58, 0.25)',
                borderRadius: '6px',
                padding: '6px 12px',
                fontFamily: mono,
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#c45a3a',
              }}>
                🔥 {streakCount}-day streak! You&apos;re a regular.
              </span>
            </div>
          )}

          {/* Streak reminder */}
          {mode === 'daily' && (
            <div style={{ fontFamily: mono, fontSize: '11px', color: '#8a7355', textAlign: 'center', padding: '12px 0' }}>
              {streakState === 'active' ? (
                <>
                  <div>🔥 {streakCount}-day streak — next puzzle in {streakNextCountdown}</div>
                  <div>Come back tomorrow to keep it.</div>
                </>
              ) : (
                <>
                  <div>🧩 New puzzle every day at midnight.</div>
                  <div>See you tomorrow 👋</div>
                </>
              )}
            </div>
          )}
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
