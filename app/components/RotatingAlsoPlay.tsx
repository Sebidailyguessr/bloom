'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const GAMES = [
  {
    name: 'FlagGuessr',
    description: 'Guess the country from its flag',
    url: 'https://flagguessr.app',
    emoji: '🏳️',
  },
  {
    name: 'CocktailGuessr',
    description: "Guess today's cocktail",
    url: 'https://cocktailguessr.app',
    emoji: '🍹',
  },
  {
    name: 'Palette',
    description: "Match today's colour with sliders",
    url: 'https://palette.stoop.games',
    emoji: '🎨',
  },
  {
    name: 'Bloom',
    description: 'Fill the grid in as few moves as possible',
    url: 'https://bloom.stoop.games',
    emoji: '🌸',
  },
  {
    name: 'Sortl',
    description: 'Sort the tubes by colour',
    url: 'https://sortl.stoop.games',
    emoji: '🧪',
  },
]

const ARROW_CSS = `
  .rp-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 18px;
    color: #8a7355;
    opacity: 0.5;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    z-index: 1;
    transition: opacity 150ms ease, color 150ms ease;
  }
  .rp-arrow:hover { opacity: 1; color: #5a4632; }
  .rp-arrow-left  { left: 8px; }
  .rp-arrow-right { right: 8px; }
`

export default function RotatingAlsoPlay() {
  const [current, setCurrent] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const [paused, setPaused]   = useState(false)

  const fadeTimer         = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef       = useRef<ReturnType<typeof setInterval> | null>(null)
  const userHasInteracted = useRef(false)
  const touchStartX       = useRef<number | null>(null)

  const advance = useCallback((next?: number) => {
    if (fadeTimer.current) clearTimeout(fadeTimer.current)
    setOpacity(0)
    fadeTimer.current = setTimeout(() => {
      setCurrent(i => next !== undefined ? next : (i + 1) % GAMES.length)
      setOpacity(1)
    }, 300)
  }, [])

  const handleManualNav = useCallback((next: number) => {
    userHasInteracted.current = true
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    advance(next)
  }, [advance])

  useEffect(() => {
    if (paused || userHasInteracted.current) return
    intervalRef.current = setInterval(() => advance(), 3000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [paused, advance])

  useEffect(() => {
    return () => {
      if (fadeTimer.current)   clearTimeout(fadeTimer.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const touch = e.changedTouches[0]
    if (!touch) return
    const delta = touch.clientX - touchStartX.current
    touchStartX.current = null
    if (delta > 40) {
      handleManualNav((current - 1 + GAMES.length) % GAMES.length)
    } else if (delta < -40) {
      handleManualNav((current + 1) % GAMES.length)
    }
  }

  const game = GAMES[current]

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <style>{ARROW_CSS}</style>

      <div
        style={{ position: 'relative' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          className="rp-arrow rp-arrow-left"
          onClick={() => handleManualNav((current - 1 + GAMES.length) % GAMES.length)}
          aria-label="Previous game"
        >‹</button>

        <a
          href={game.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-lg bg-[#e5d5b3] border border-dashed border-[rgba(42,31,21,0.18)] hover:border-[#c45a3a] transition-colors"
          style={{ opacity, transition: 'opacity 300ms ease', paddingLeft: 28, paddingRight: 28 }}
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ebdfc4] text-lg leading-none shrink-0">
            {game.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[#2a1f15] text-sm leading-tight" style={{ fontFamily: "'Caprasimo', serif" }}>
              {game.name}
            </p>
            <p className="text-[#5a4632] text-[11px] leading-tight mt-0.5"
               style={{ fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic' }}>
              {game.description}
            </p>
          </div>
          <span className="text-[#c45a3a] font-mono text-[11px] font-semibold shrink-0">Play →</span>
        </a>

        <button
          className="rp-arrow rp-arrow-right"
          onClick={() => handleManualNav((current + 1) % GAMES.length)}
          aria-label="Next game"
        >›</button>
      </div>

      <div className="flex justify-center gap-2 mt-2.5">
        {GAMES.map((g, i) => (
          <button
            key={g.name}
            onClick={() => i !== current && handleManualNav(i)}
            aria-label={`Show ${g.name}`}
            style={{ transition: 'all 200ms ease' }}
            className={i === current
              ? 'w-2 h-2 rounded-full bg-[#c45a3a]'
              : 'w-1.5 h-1.5 rounded-full border border-[#8a7355] bg-transparent'}
          />
        ))}
      </div>
    </div>
  )
}
