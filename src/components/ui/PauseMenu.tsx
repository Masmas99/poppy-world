'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { SettingsModal } from './SettingsModal';

export function PauseMenu() {
  const [showSettings, setShowSettings] = useState(false);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const resetProgress = useGameStore((s) => s.resetProgress);
  const quitToMenu = useGameStore((s) => s.quitToMenu);

  return (
    <>
      <div className="pause-overlay">
        <div className="pause-card">
          <div className="pause-badge">GAME PAUSED</div>
          <h1 className="pause-title">Puppy World</h1>

          <div className="pause-button-list">
            <button className="menu-btn primary" onClick={resumeGame}>
              RESUME GAME
            </button>
            <button className="menu-btn secondary" onClick={() => setShowSettings(true)}>
              SETTINGS
            </button>
            <button
              className="menu-btn warning"
              onClick={() => {
                if (confirm('Restart game from the beginning?')) {
                  resetProgress();
                  resumeGame();
                }
              }}
            >
              RESTART GAME
            </button>
            <button className="menu-btn neutral" onClick={quitToMenu}>
              MAIN MENU
            </button>
          </div>
        </div>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}
