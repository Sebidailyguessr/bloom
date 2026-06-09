import { useState, useEffect } from 'react'

function timeToMidnightUTC(): string {
  const now = new Date()
  const midnight = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
  ))
  const ms = midnight.getTime() - now.getTime()
  const totalMinutes = Math.floor(ms / 60000)
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${h}h ${m}m`
}

export function useNextPuzzleCountdown(): string {
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    setCountdown(timeToMidnightUTC())
    const id = setInterval(() => setCountdown(timeToMidnightUTC()), 60000)
    return () => clearInterval(id)
  }, [])

  return countdown
}
