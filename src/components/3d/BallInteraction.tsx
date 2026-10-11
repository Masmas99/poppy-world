'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, BallCollider } from '@react-three/rapier';
import { useGameStore } from '@/store/useGameStore';
import { soundManager } from '@/utils/soundManager';

interface BallInteractionProps {
  dogPosition: THREE.Vector3;
}

const DOGHOUSE_POSITION = new THREE.Vector3(0, 0, -3.5);

export function BallInteraction({ dogPosition }: BallInteractionProps) {
  const ballRef = useRef<RapierRigidBody>(null);
  const setInteractionPrompt = useGameStore((s) => s.setInteractionPrompt);
  const updateQuestProgress = useGameStore((s) => s.updateQuestProgress);
  const isNear = useRef<boolean>(false);

  const kickBall = () => {
    if (!ballRef.current) return;
    soundManager.playBallBounce();

    const ballPos = ballRef.current.translation();
    const kickDir = new THREE.Vector3(
      ballPos.x - dogPosition.x,
      0.35,
      ballPos.z - dogPosition.z
    ).normalize();

    if (kickDir.lengthSq() < 0.01) {
      kickDir.set(0, 0.4, 1).normalize();
    }

    const impulseMagnitude = 20;
    ballRef.current.applyImpulse(
      {
        x: kickDir.x * impulseMagnitude,
        y: 8.5,
        z: kickDir.z * impulseMagnitude,
      },
      true
    );
  };

  useFrame(() => {
    if (!ballRef.current) return;

    const ballTranslation = ballRef.current.translation();
    const ballPos = new THREE.Vector3(ballTranslation.x, ballTranslation.y, ballTranslation.z);

    if (ballTranslation.y < -5 || Math.abs(ballTranslation.x) > 36 || Math.abs(ballTranslation.z) > 36) {
      ballRef.current.setTranslation({ x: 3, y: 1.5, z: 2 }, true);
      ballRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    const distToDog = dogPosition.distanceTo(ballPos);

    if (distToDog < 2.5) {
      if (!isNear.current) {
        isNear.current = true;
        setInteractionPrompt('Press [E] to Kick Play Ball', kickBall);
      }
    } else {
      if (isNear.current) {
        isNear.current = false;
        const curPrompt = useGameStore.getState().interactionPrompt;
        if (curPrompt?.includes('Kick Play Ball')) {
          setInteractionPrompt(null);
        }
      }
    }

    const distToDoghouse = ballPos.distanceTo(DOGHOUSE_POSITION);
    if (distToDoghouse < 4.5) {
      const quests = useGameStore.getState().quests;
      const fetchQuest = quests.find((q) => q.id === 'quest_fetch');
      if (fetchQuest && !fetchQuest.completed) {
        updateQuestProgress('quest_fetch', 1);
      }
    }
  });

  return (
    <RigidBody
      ref={ballRef}
      colliders={false}
      position={[3.2, 1.0, 2.5]}
      type="dynamic"
      mass={1.6}
      restitution={0.85}
      friction={0.45}
      linearDamping={0.25}
      angularDamping={0.35}
    >
      <BallCollider args={[0.4]} />

      {/* Stylized 3D Red & Gold Sports Ball */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshStandardMaterial color="#e63946" roughness={0.25} metalness={0.15} />
      </mesh>

      {/* Decorative 3D Panels */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.04, 12, 28]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.4, 0.04, 12, 28]} />
        <meshStandardMaterial color="#ffd166" roughness={0.3} />
      </mesh>
    </RigidBody>
  );
}
