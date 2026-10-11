'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { SettingsModal } from './SettingsModal';

const COLLAR_COLORS = [
  { label: 'Ruby Red', color: '#e63946' },
  { label: 'Ocean Blue', color: '#457b9d' },
  { label: 'Golden Sun', color: '#ffd166' },
  { label: 'Berry Pink', color: '#f72585' },
];

const FUR_TONES = [
  { label: 'Golden Corgi', value: 'corgi_golden' as const },
  { label: 'Chocolate', value: 'chocolate' as const },
  { label: 'Husky Gray', value: 'husky_gray' as const },
];

export function MainMenu() {
  const [showSettings, setShowSettings] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const startGame = useGameStore((s) => s.startGame);
  const hasSaveFile = useGameStore((s) => s.hasSaveFile);
  const initSaveState = useGameStore((s) => s.initSaveState);
  const customization = useGameStore((s) => s.customization);
  const setCustomization = useGameStore((s) => s.setCustomization);

  useEffect(() => {
    initSaveState();
  }, [initSaveState]);

  return (
    <>
      <div className="main-menu-overlay">
        <div className="main-menu-card">
          <div className="logo-container">
            <div className="game-badge">3D PET ADVENTURE</div>
            <h1 className="game-title">PUPPY WORLD</h1>
            <p className="game-subtitle">Open World Canine Simulation</p>
          </div>

          {/* Quick Customization Preview */}
          <div className="customization-box">
            <span className="custom-label">Collar Color:</span>
            <div className="color-swatches">
              {COLLAR_COLORS.map((c) => (
                <button
                  key={c.color}
                  className={`swatch-btn ${customization.collarColor === c.color ? 'active' : ''}`}
                  style={{ backgroundColor: c.color }}
                  onClick={() => setCustomization({ collarColor: c.color })}
                  title={c.label}
                />
              ))}
            </div>

            <span className="custom-label" style={{ marginTop: '10px' }}>Fur Coat Tone:</span>
            <div className="fur-toggle-group">
              {FUR_TONES.map((f) => (
                <button
                  key={f.value}
                  className={`fur-btn ${customization.furTone === f.value ? 'active' : ''}`}
                  onClick={() => setCustomization({ furTone: f.value })}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="menu-button-stack">
            {hasSaveFile && (
              <button className="menu-btn primary glow" onClick={() => startGame(true)}>
                CONTINUE ADVENTURE
              </button>
            )}

            <button className="menu-btn primary" onClick={() => startGame(false)}>
              {hasSaveFile ? 'NEW ADVENTURE' : 'PLAY GAME'}
            </button>

            <button className="menu-btn secondary" onClick={() => setShowHowToPlay(true)}>
              HOW TO PLAY
            </button>

            <button className="menu-btn neutral" onClick={() => setShowSettings(true)}>
              SETTINGS
            </button>
          </div>

          <div className="menu-credits">
            <span>Built with Next.js, Three.js, React Three Fiber & Rapier Physics</span>
          </div>
        </div>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {showHowToPlay && (
        <div className="modal-backdrop" onClick={() => setShowHowToPlay(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>How to Play Puppy World</h2>
              <button className="modal-close-btn" onClick={() => setShowHowToPlay(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body how-to-play-body">
              <div className="guide-row">
                <strong>Desktop Controls:</strong>
                <p>• <b>WASD / Arrow Keys</b>: Walk and run relative to camera view</p>
                <p>• <b>Shift</b>: Sprint at full speed</p>
                <p>• <b>Space</b>: Jump over terrain obstacles</p>
                <p>• <b>Q</b>: Bark to greet creatures and NPCs</p>
                <p>• <b>E</b>: Interact with objects / kick play ball</p>
                <p>• <b>Mouse Drag</b>: Rotate third-person camera</p>
                <p>• <b>Mouse Wheel</b>: Zoom in and out</p>
                <p>• <b>Esc</b>: Pause game and open menu</p>
              </div>
              <div className="guide-row" style={{ marginTop: '14px' }}>
                <strong>Mobile Controls:</strong>
                <p>• Virtual analog stick on bottom-left for smooth movement</p>
                <p>• Dedicated buttons on bottom-right: Jump, Sprint, Bark, Act</p>
                <p>• Touch and drag on the right screen half to rotate camera</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="primary-btn" onClick={() => setShowHowToPlay(false)}>
                START PLAYING
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
