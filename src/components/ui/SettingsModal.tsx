'use client';

import React from 'react';
import { useGameStore } from '@/store/useGameStore';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const settings = useGameStore((s) => s.settings);
  const updateSettings = useGameStore((s) => s.updateSettings);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>SETTINGS</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Master Volume */}
          <div className="setting-row">
            <label>Master Volume: {Math.round(settings.masterVolume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.masterVolume}
              onChange={(e) => updateSettings({ masterVolume: parseFloat(e.target.value) })}
            />
          </div>

          {/* BGM Volume */}
          <div className="setting-row">
            <label>Music Volume: {Math.round(settings.bgmVolume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.bgmVolume}
              onChange={(e) => updateSettings({ bgmVolume: parseFloat(e.target.value) })}
            />
          </div>

          {/* SFX Volume */}
          <div className="setting-row">
            <label>Sound Effects Volume: {Math.round(settings.sfxVolume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={(e) => updateSettings({ sfxVolume: parseFloat(e.target.value) })}
            />
          </div>

          {/* Camera Sensitivity */}
          <div className="setting-row">
            <label>Camera Sensitivity: {settings.cameraSensitivity.toFixed(1)}x</label>
            <input
              type="range"
              min="0.4"
              max="2.5"
              step="0.1"
              value={settings.cameraSensitivity}
              onChange={(e) => updateSettings({ cameraSensitivity: parseFloat(e.target.value) })}
            />
          </div>

          {/* Graphics Quality */}
          <div className="setting-row">
            <label>Graphics Quality</label>
            <div className="quality-btn-group">
              {(['low', 'medium', 'high'] as const).map((q) => (
                <button
                  key={q}
                  className={`quality-btn ${settings.graphicsQuality === q ? 'active' : ''}`}
                  onClick={() => updateSettings({ graphicsQuality: q })}
                >
                  {q.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="primary-btn" onClick={onClose}>
            SAVE AND CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
