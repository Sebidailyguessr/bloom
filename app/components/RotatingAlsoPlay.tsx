'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const GAMES = [
  {
    name: 'DailyGuessr',
    description: 'Guess the city from a Street View',
    url: 'https://dailyguessr.app',
    emoji: '🌍',
  },
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
]

export default function RotatingAlsoPlay() {
  const [current, setCurrent] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const [paused, setPaused] = useState(false)
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const advance = useCallback((next?: number) => {
    if (fadeTimer.current) clearTimeout(fadeTimer.current)
    setOpacity(0)
    fadeTimer.current = setTimeout(() => {
      setCurrent(i => next !== undefined ? next : (i + 1) % GAMES.length)
      setOpacity(1)
    }, 300)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => advance(), 3000)
    return () => clearInterval(id)
  }, [paused, advance])

  useEffect(() => {
    return () => { if (fadeTimer.current) clearTimeout(fadeTimer.current) }
  }, [])

  const game = GAMES[current]

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <a
        href={game.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3 rounded-lg bg-[#e5d5b3] border border-dashed border-[rgba(42,31,21,0.18)] hover:border-[#c45a3a] transition-colors"
        style={{ opacity, transition: 'opacity 300ms ease' }}
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ebdfc4] text-lg leading-none shrink-0">
          {game.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className="text-[#2a1f15] text-sm leading-tight"
            style={{ fontFamily: "'Caprasimo', serif" }}
          >
            {game.name}
          </p>
          <p
            className="text-[#5a4632] text-[11px] leading-tight mt-0.5"
            style={{ fontFamily: "'Newsreader', Georgia, serif", fontStyle: 'italic' }}
          >
            {game.description}
          </p>
        </div>
        <span className="text-[#c45a3a] font-mono text-[11px] font-semibold shrink-0">
          Play →
        </span>
      </a>

      <div className="flex justify-center gap-2 mt-2.5">
        {GAMES.map((g, i) => (
          <button
            key={g.name}
            onClick={() => i !== current && advance(i)}
            aria-label={`Show ${g.name}`}
            style={{ transition: 'all 200ms ease' }}
            className={
              i === current
                ? 'w-2 h-2 rounded-full bg-[#c45a3a]'
                : 'w-1.5 h-1.5 rounded-full border border-[#8a7355] bg-transparent'
            }
          />
        ))}
      </div>
    </div>
  )
}
