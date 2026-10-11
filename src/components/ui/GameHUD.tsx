'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';

export function GameHUD() {
  const bones = useGameStore((s) => s.bones);
  const coins = useGameStore((s) => s.coins);
  const quests = useGameStore((s) => s.quests);
  const activeQuestId = useGameStore((s) => s.activeQuestId);
  const interactionPrompt = useGameStore((s) => s.interactionPrompt);
  const feedbackMessage = useGameStore((s) => s.feedbackMessage);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const bark = useGameStore((s) => s.bark);

  // Compact by default so it never blocks the dog
  const [questExpanded, setQuestExpanded] = useState(false);

  const activeQuest = quests.find((q) => q.id === activeQuestId) || quests.find((q) => !q.completed);

  return (
    <div className="hud-container">
      {/* TOP HEADER: STATS & PAUSE */}
      <div className="hud-header">
        <div className="hud-stats">
          <div className="hud-pill bone-pill">
            <span className="hud-tag">BONES</span>
            <span className="hud-value">{bones}</span>
          </div>
          <div className="hud-pill coin-pill">
            <span className="hud-tag">COINS</span>
            <span className="hud-value">{coins}</span>
          </div>
        </div>

        <div className="hud-actions">
          <button className="hud-btn desktop-only bark-quick-btn" onClick={bark} title="Bark (Q)">
            BARK (Q)
          </button>
          <button className="hud-btn pause-quick-btn" onClick={pauseGame} title="Pause (ESC)">
            PAUSE
          </button>
        </div>
      </div>

      {/* NON-INTRUSIVE OBJECTIVE BADGE (Docked to the side so dog in center is 100% visible) */}
      {activeQuest && (
        <div className="hud-quest-dock">
          <div
            className={`hud-quest-pill ${questExpanded ? 'is-open' : 'is-compact'}`}
            onClick={() => setQuestExpanded(!questExpanded)}
          >
            <div className="quest-pill-header">
              <span className="quest-pill-badge">QUEST</span>
              <span className="quest-pill-title">{activeQuest.title}</span>
              <span className="quest-pill-progress">
                {activeQuest.completed ? 'DONE' : `${activeQuest.currentProgress}/${activeQuest.targetProgress}`}
              </span>
              <span className="quest-pill-chevron">{questExpanded ? '▲' : '▼'}</span>
            </div>

            {questExpanded && (
              <div className="quest-pill-expanded-body">
                <p className="quest-pill-desc">{activeQuest.description}</p>
                <div className="quest-progress-bar-bg">
                  <div
                    className="quest-progress-bar-fill"
                    style={{
                      width: `${Math.min(100, (activeQuest.currentProgress / activeQuest.targetProgress) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RECENT FEEDBACK TOAST */}
      {feedbackMessage && (
        <div className="hud-toast">
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* INTERACTION PROMPT */}
      {interactionPrompt && (
        <div className="hud-interaction-prompt">
          <div className="prompt-badge">ACTION</div>
          <span className="prompt-text">{interactionPrompt}</span>
        </div>
      )}

      {/* DESKTOP KEY HINTS HELPER */}
      <div className="hud-controls-helper">
        <span>WASD: Move</span>
        <span>•</span>
        <span>SHIFT: Sprint</span>
        <span>•</span>
        <span>SPACE: Jump</span>
        <span>•</span>
        <span>E: Interact / Kick</span>
        <span>•</span>
        <span>Q: Bark</span>
        <span>•</span>
        <span>DRAG: Camera</span>
      </div>
    </div>
  );
}
