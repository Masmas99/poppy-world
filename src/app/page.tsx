'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useGameStore } from '@/store/useGameStore';
import { MainMenu } from '@/components/ui/MainMenu';
import { GameHUD } from '@/components/ui/GameHUD';
import { PauseMenu } from '@/components/ui/PauseMenu';
import { MobileControls } from '@/components/ui/MobileControls';
import { QuestCompletedCelebration } from '@/components/ui/QuestCompletedCelebration';

// Dynamically import 3D canvas with ssr: false to prevent WebGL SSR mismatch
const GameCanvas = dynamic(
  () => import('@/components/3d/GameCanvas').then((mod) => mod.GameCanvas),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#52b788',
          color: '#ffffff',
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            border: '5px solid rgba(255, 255, 255, 0.3)',
            borderTopColor: '#ffffff',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '18px',
          }}
        />
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '1px' }}>LOADING PUPPY WORLD</h2>
        <p style={{ marginTop: '6px', color: '#d8f3dc', fontWeight: 700, fontSize: '0.95rem' }}>
          Preparing 3D Meadow & Toys
        </p>
      </div>
    ),
  }
);

export default function Home() {
  const gameState = useGameStore((s) => s.gameState);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 768;
      setIsTouchDevice(hasTouch);

      const handleResize = () => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 768);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        const cur = useGameStore.getState().gameState;
        if (cur === 'playing') {
          pauseGame();
        } else if (cur === 'paused') {
          resumeGame();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pauseGame, resumeGame]);

  if (!mounted) {
    return (
      <main className="game-viewport">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#52b788',
            color: '#ffffff',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              border: '5px solid rgba(255, 255, 255, 0.3)',
              borderTopColor: '#ffffff',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              marginBottom: '18px',
            }}
          />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '1px' }}>LOADING PUPPY WORLD</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="game-viewport">
      {/* 3D Game Canvas */}
      <GameCanvas />

      {/* Main Menu State */}
      {gameState === 'menu' && <MainMenu />}

      {/* Playing HUD & Controls */}
      {gameState === 'playing' && (
        <>
          <GameHUD />
          {isTouchDevice && <MobileControls />}
        </>
      )}

      {/* Paused Menu */}
      {gameState === 'paused' && (
        <>
          <GameHUD />
          <PauseMenu />
        </>
      )}

      {/* Quest Celebration Banner / Modal */}
      <QuestCompletedCelebration />
    </main>
  );
}
