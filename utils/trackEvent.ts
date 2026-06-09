export type GameId = 'dg' | 'fg' | 'cg' | 'pl' | 'bl' | 'sl'

export type TrackEventName =
  | 'puzzle_started'
  | 'puzzle_completed'
  | 'share_clicked'
  | 'kofi_clicked'
  | 'also_play_clicked'
  | 'past_puzzle_opened'
  | 'returning_player'
  | 'first_visit'
  | 'onboarding_dismissed'
  | 'streak_milestone'

export function trackEvent(name: TrackEventName, data?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && (window as any).umami) {
    (window as any).umami.track(name, data)
  }
}
