"use client";
import { useState, useEffect } from "react";
import GameClient from "./components/GameClient";
import Sidebar from "./components/Sidebar";
import { trackEvent } from "@/utils/trackEvent";

const TOTAL_LEVELS = 300;

export default function HomePage() {
  const [levelN, setLevelN] = useState(1);
  const [sidebarKey, setSidebarKey] = useState(0);
  const [mode, setMode] = useState<'daily' | 'levels'>('daily');

  useEffect(() => {
    const saved = parseInt(localStorage.getItem("bl-current-level") || "1");
    setLevelN(Math.min(Math.max(1, saved), TOTAL_LEVELS));
  }, []);

  useEffect(() => {
    try {
      const streak = parseInt(localStorage.getItem("bl-streak") || "0");
      if (streak > 0) {
        trackEvent('returning_player', { game: 'bl', daysSince: 0 });
      } else {
        trackEvent('first_visit', { game: 'bl' });
      }
    } catch { /* ignore */ }
  }, []);

  const handleLevelChange = (n: number) => {
    const clamped = Math.min(Math.max(1, n), TOTAL_LEVELS);
    localStorage.setItem("bl-current-level", String(clamped));
    setLevelN(clamped);
    setMode('levels');
    setSidebarKey(k => k + 1);
  };

  const handleLevelWin = () => {
    setSidebarKey(k => k + 1);
  };

  const mono = "'JetBrains Mono', ui-monospace, monospace";

  return (
    <>
      <div className="w-full px-4 flex gap-6 items-stretch flex-1">

        {/* Game area */}
        <div className="flex-1 flex flex-col items-center pt-6">
          <div className="w-full max-w-2xl">
            <GameClient
              levelN={levelN}
              onLevelChange={handleLevelChange}
              onLevelWin={handleLevelWin}
              onModeChange={setMode}
            />
          </div>
        </div>

        {/* Sidebar — key forces remount after win so stats refresh */}
        <div className="hidden lg:block w-72 shrink-0">
          <Sidebar key={sidebarKey} levelN={levelN} onLevelSelect={handleLevelChange} mode={mode} />
        </div>

      </div>

      {/* Separator */}
      <div style={{ borderTop: '1px dashed rgba(42,31,21,0.18)', width: '100%' }} />

      {/* Below-the-fold content */}
      <div className="w-full max-w-2xl mx-auto px-4 py-16">

        {(() => {
          const SectionHeader = ({ children }: { children: string }) => (
            <div className="flex items-center gap-3 mb-4">
              <div style={{ width: 32, height: 2, background: 'var(--terracotta, #c45a3a)', flexShrink: 0 }} />
              <span style={{ fontFamily: mono, fontSize: 10, color: 'var(--ink-faded, #8a7355)', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 600 }}>{children}</span>
            </div>
          );
          const Body = ({ children }: { children: React.ReactNode }) => (
            <div style={{ fontFamily: "'Newsreader', serif", fontSize: 16, color: 'var(--ink-soft, #5a4632)', lineHeight: 1.65, maxWidth: '65ch' }}>{children}</div>
          );
          const P = ({ children }: { children: string }) => (
            <p style={{ marginBottom: '1rem' }}>{children}</p>
          );
          return (
            <>
              <section className="mb-12">
                <SectionHeader>What is Bloom?</SectionHeader>
                <Body>
                  <P>Bloom is a free daily flood-fill puzzle. Every day at midnight a new 14×14 colour grid is published — the same one for every player around the world. Your territory starts in the top-left corner. Pick a colour and your territory expands to all touching cells of that colour. Fill the entire grid in as few moves as possible.</P>
                  <P>You get one attempt per day. The fewer moves you use, the higher your score — up to a maximum of 10,000 points.</P>
                </Body>
              </section>

              <section className="mb-12">
                <SectionHeader>How Scoring Works</SectionHeader>
                <Body>
                  <P>Bloom scores you against par — the optimal number of moves needed to solve the grid. Matching or beating par earns a perfect 10,000. Each move over par reduces your score. The scoring labels range from "Learning to Grow" to "Perfect Bloom".</P>
                  <P>Par is calculated using a greedy algorithm that approximates the optimal solution. On harder grids, beating par is genuinely difficult — even experienced players rarely achieve it.</P>
                </Body>
              </section>

              <section className="mb-12">
                <SectionHeader>How to Play</SectionHeader>
                <Body>
                  <P>Your territory starts at the top-left corner of the grid. Click any of the six colour buttons at the bottom — your territory instantly flood-fills to absorb all touching cells of that colour. Keep expanding until the entire grid is one colour.</P>
                  <P>The key is planning ahead: each move changes the boundary of your territory, opening up new paths. Think several moves ahead to minimise your total count.</P>
                </Body>
              </section>

              <section className="mb-12">
                <SectionHeader>Tips</SectionHeader>
                <Body>
                  {[
                    'Start by looking at which colour dominates the top-left region — that\'s often your best first move.',
                    'Try to expand in large sweeping moves rather than picking off small patches.',
                    'The par number shown is the target — if you\'re close to it, you\'re playing well.',
                    'Some grids have multiple optimal paths. Experiment in Levels mode to build your intuition.',
                    'Your streak resets if you miss a day — come back every day to keep it alive.',
                  ].map((tip, i) => (
                    <p key={i} style={{ marginBottom: '0.75rem' }}>→ {tip}</p>
                  ))}
                </Body>
              </section>

              <section className="mb-12">
                <SectionHeader>One Grid Per Day</SectionHeader>
                <Body>
                  <P>There's no "play again" for the daily puzzle. One grid, one attempt, same for everyone. Want more? Switch to Levels mode for 300 hand-picked grids at your own pace.</P>
                </Body>
              </section>

              <section>
                <SectionHeader>Free, Forever</SectionHeader>
                <Body>
                  <P>No account. No subscription. No ads. Bloom is completely free to play and always will be.</P>
                </Body>
              </section>
            </>
          );
        })()}
      </div>
    </>
  );
}
