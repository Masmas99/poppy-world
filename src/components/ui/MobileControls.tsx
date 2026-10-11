'use client';

import React, { useRef, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';

export function MobileControls() {
  const setMobileInput = useGameStore((s) => s.setMobileInput);
  const bark = useGameStore((s) => s.bark);
  const interact = useGameStore((s) => s.interact);

  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isSprinting, setIsSprinting] = useState(false);
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const activeTouchId = useRef<number | null>(null);

  const handleJoystickStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.changedTouches[0];
    activeTouchId.current = touch.identifier;
    updateJoystick(touch.clientX, touch.clientY);
  };

  const handleJoystickMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === activeTouchId.current) {
        updateJoystick(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleJoystickEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouchId.current) {
        activeTouchId.current = null;
        setKnobPos({ x: 0, y: 0 });
        setMobileInput({ moveX: 0, moveY: 0 });
        break;
      }
    }
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const maxRadius = rect.width / 2;
    let dx = clientX - centerX;
    let dy = clientY - centerY;

    const distance = Math.hypot(dx, dy);
    if (distance > maxRadius) {
      dx = (dx / distance) * maxRadius;
      dy = (dy / distance) * maxRadius;
    }

    setKnobPos({ x: dx, y: dy });
    setMobileInput({
      moveX: dx / maxRadius,
      moveY: dy / maxRadius,
    });
  };

  const toggleSprint = () => {
    setIsSprinting((prev) => {
      const next = !prev;
      setMobileInput({ sprint: next });
      return next;
    });
  };

  return (
    <div className="mobile-controls-layer">
      {/* VIRTUAL ANALOG JOYSTICK (Bottom-Left) */}
      <div
        ref={joystickBaseRef}
        className="joystick-base"
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onTouchCancel={handleJoystickEnd}
      >
        <div
          className="joystick-knob"
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          }}
        />
      </div>

      {/* MOBILE ACTION BUTTONS (Bottom-Right) */}
      <div className="mobile-actions-cluster">
        {/* Sprint Button */}
        <button
          className={`mobile-btn sprint-btn ${isSprinting ? 'active-sprint' : ''}`}
          onTouchStart={toggleSprint}
        >
          <span className="btn-maintext">{isSprinting ? 'RUN' : 'SPRINT'}</span>
        </button>

        {/* Jump Button */}
        <button
          className="mobile-btn jump-btn"
          onTouchStart={() => setMobileInput({ jump: true })}
          onTouchEnd={() => setMobileInput({ jump: false })}
        >
          <span className="btn-maintext">JUMP</span>
        </button>

        {/* Interact / Kick Button */}
        <button
          className="mobile-btn interact-btn"
          onTouchStart={() => interact()}
        >
          <span className="btn-maintext">ACT</span>
        </button>

        {/* Bark Button */}
        <button
          className="mobile-btn bark-btn"
          onTouchStart={() => bark()}
        >
          <span className="btn-maintext">BARK</span>
        </button>
      </div>
    </div>
  );
}
