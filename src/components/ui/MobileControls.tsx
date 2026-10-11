'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/useGameStore';

export function MobileControls() {
  const setMobileInput = useGameStore((s) => s.setMobileInput);
  const bark = useGameStore((s) => s.bark);
  const interact = useGameStore((s) => s.interact);

  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isSprinting, setIsSprinting] = useState(false);
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const activePointerId = useRef<number | null>(null);

  useEffect(() => () => {
    setMobileInput({ moveX: 0, moveY: 0, jump: false, sprint: false });
  }, [setMobileInput]);

  const handleJoystickStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    activePointerId.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateJoystick(e.clientX, e.clientY);
  };

  const handleJoystickMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== activePointerId.current) return;
    e.preventDefault();
    updateJoystick(e.clientX, e.clientY);
  };

  const handleJoystickEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== activePointerId.current) return;
    activePointerId.current = null;
    setKnobPos({ x: 0, y: 0 });
    setMobileInput({ moveX: 0, moveY: 0 });
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
        onPointerDown={handleJoystickStart}
        onPointerMove={handleJoystickMove}
        onPointerUp={handleJoystickEnd}
        onPointerCancel={handleJoystickEnd}
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
          onPointerDown={(e) => {
            e.preventDefault();
            toggleSprint();
          }}
        >
          <span className="btn-maintext">{isSprinting ? 'RUN' : 'SPRINT'}</span>
        </button>

        {/* Jump Button */}
        <button
          className="mobile-btn jump-btn"
          onPointerDown={(e) => {
            e.preventDefault();
            setMobileInput({ jump: true });
          }}
          onPointerUp={() => setMobileInput({ jump: false })}
          onPointerCancel={() => setMobileInput({ jump: false })}
          onLostPointerCapture={() => setMobileInput({ jump: false })}
        >
          <span className="btn-maintext">JUMP</span>
        </button>

        {/* Interact / Kick Button */}
        <button
          className="mobile-btn interact-btn"
          onPointerDown={(e) => {
            e.preventDefault();
            interact();
          }}
        >
          <span className="btn-maintext">ACT</span>
        </button>

        {/* Bark Button */}
        <button
          className="mobile-btn bark-btn"
          onPointerDown={(e) => {
            e.preventDefault();
            bark();
          }}
        >
          <span className="btn-maintext">BARK</span>
        </button>
      </div>
    </div>
  );
}
