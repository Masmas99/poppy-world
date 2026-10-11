'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/store/useGameStore';

export function QuestCompletedCelebration() {
  const quest = useGameStore((s) => s.completedQuestCelebration);
  const dismiss = useGameStore((s) => s.dismissCelebration);

  useEffect(() => {
    if (quest) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffd166', '#ef476f', '#06d6a0', '#118ab2', '#ffbe0b'],
        });
      } catch (e) {
        // Fallback
      }
    }
  }, [quest]);

  if (!quest) return null;

  return (
    <div className="celebration-overlay">
      <div className="celebration-card">
        <div className="celebration-badge">QUEST COMPLETED</div>
        <h2 className="celebration-title">{quest.title}</h2>
        <p className="celebration-desc">{quest.description}</p>
        <div className="celebration-rewards">
          <div className="reward-pill">BONES +{quest.rewardBones}</div>
          <div className="reward-pill">COINS +{quest.rewardCoins}</div>
        </div>
        <button className="celebration-btn" onClick={dismiss}>
          CONTINUE
        </button>
      </div>
    </div>
  );
}
